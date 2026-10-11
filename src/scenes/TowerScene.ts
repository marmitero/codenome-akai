// Tower floor: auto-battle hunting ground (master prompt §26/§27/§56-§58).
// The hero walks to the nearest enemy and attacks automatically; enemies see
// the hero and close in; multiple enemies may attack within 1 tile; defeated
// enemies respawn after 5s at their ORIGINAL spawn point.

import Phaser from 'phaser';
import { TILESET, FRAME, type Dir } from '../config/assets';
import { COMBAT, TOWER, ECONOMY } from '../config/balance';
import { floorDef } from '../config/floors';
import { heroDef } from '../config/heroes';
import { damageFormula } from '../core/battle';
import { astar, type Point } from '../core/pathfinding';
import { rollDrop, generateEquipment } from '../core/equipment';
import { mulberry32, pick, randomRng, type Rng } from '../core/rng';
import type { CombatStats, SkillDef } from '../core/types';
import { pixelFont } from '../ui/PixelText';
import { hpBar, kingBar, navButton } from '../ui/hud';
import { RARITY_COLOR, hashIndex } from '../ui/widgets';
import { state } from '../game/session';
import { UI } from '../config/assets';

const TILE = 32;
const MAP_W = 22;
const MAP_H = 16;

interface Mob {
  sprite: Phaser.GameObjects.Sprite;
  bar: ReturnType<typeof hpBar>;
  stats: CombatStats;
  hp: number;
  spawnTX: number;
  spawnTY: number;
  nextAttackAt: number;
  alive: boolean;
  setName: string;
  name: string;
  path: Point[];
  pathKey: string;
  pathAt: number;
}

export class TowerScene extends Phaser.Scene {
  private floor = 1;
  private grid: number[][] = [];
  private hero!: Phaser.GameObjects.Sprite;
  private heroBar!: ReturnType<typeof hpBar>;
  private heroStats!: CombatStats;
  private heroHp = 0;
  private heroSkill: SkillDef | null = null;
  private heroNextAttackAt = 0;
  private heroSkillReadyAt = 0;
  private mobs: Mob[] = [];
  private rng: Rng = randomRng();
  private kills = 0;
  private searching: Phaser.GameObjects.Image | null = null;
  private lastTargetAt = 0;
  private over = false;
  private hud: ReturnType<typeof kingBar> | null = null;
  private killLabel: Phaser.GameObjects.Image | null = null;

  constructor() {
    super('tower');
  }

  init(data: { floor?: number }) {
    this.floor = data?.floor ?? state.king?.highestFloor ?? 1;
  }

  create() {
    const king = state.king!;
    const hero = state.activeHero();
    if (!hero) {
      this.scene.start('lobby');
      return;
    }
    if (!king.tutorialDone) {
      king.tutorialDone = true;
      state.save();
    }
    const def = heroDef(hero.defId);
    this.heroStats = state.heroStats(hero);
    this.heroHp = this.heroStats.maxHp;
    this.heroSkill = def.skill;
    this.rng = mulberry32(0xc0ffee + this.floor * 101);

    this.buildMap();
    this.renderGround();

    // hero at bottom center
    const [hx, hy] = this.tileCenter(MAP_W >> 1, MAP_H - 3);
    this.hero = this.add.sprite(hx, hy, `${def.spriteSet}_idle_sheet`);
    this.hero.setScale(1.4);
    this.heroBar = hpBar(this, hx, hy - 44, 44);

    this.spawnMobs(def.spriteSet);

    this.cameras.main.setBounds(0, 0, MAP_W * TILE, MAP_H * TILE);
    this.cameras.main.startFollow(this.hero, true, 0.12, 0.12);

    this.hud = kingBar(this);
    this.drawTopInfo();

    const w = this.scale.width;
    const h = this.scale.height;
    navButton(this, w * 0.16, h - 46, 'ITENS', () => this.scene.launch('inventory'));
    navButton(this, w * 0.44, h - 46, 'EQUIPE', () => this.scene.launch('team'));
    navButton(this, w * 0.72, h - 46, 'REI', () => this.scene.launch('settings'));
    navButton(this, w * 0.92, h - 46, 'SAIR', () => this.leave());

    const unsub = state.on(() => this.hud?.refresh());
    this.events.once('shutdown', () => unsub());
  }

  // ---------------- map ----------------
  private buildMap() {
    const rng = mulberry32(777 + this.floor * 31);
    this.grid = [];
    for (let y = 0; y < MAP_H; y++) {
      const row: number[] = [];
      for (let x = 0; x < MAP_W; x++) {
        row.push(x === 0 || y === 0 || x === MAP_W - 1 || y === MAP_H - 1 ? 1 : 0);
      }
      this.grid.push(row);
    }
    // inner rock obstacles
    let placed = 0;
    let guard = 0;
    while (placed < 10 && guard < 200) {
      guard++;
      const x = 2 + Math.floor(rng() * (MAP_W - 4));
      const y = 2 + Math.floor(rng() * (MAP_H - 5));
      if (this.grid[y][x] === 0) {
        this.grid[y][x] = 2;
        placed++;
      }
    }
    // clear hero spawn area
    for (let y = MAP_H - 4; y < MAP_H - 1; y++)
      for (let x = (MAP_W >> 1) - 2; x <= (MAP_W >> 1) + 2; x++) this.grid[y][x] = 0;
  }

  private renderGround() {
    const src = this.textures.get('tile_ground').getSourceImage() as HTMLImageElement;
    const flats = TILESET.flatTiles;
    const canvas = document.createElement('canvas');
    canvas.width = TILE * 2;
    canvas.height = TILE * 2;
    const ctx = canvas.getContext('2d')!;
    flats.slice(0, 4).forEach((f, i) => {
      ctx.drawImage(src, f.x * 16, f.y * 16, 16, 16, (i % 2) * TILE, Math.floor(i / 2) * TILE, TILE, TILE);
    });
    if (!this.textures.exists('floor_pattern')) {
      this.textures.addCanvas('floor_pattern', canvas);
      this.textures.get('floor_pattern').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    this.add.tileSprite((MAP_W * TILE) / 2, (MAP_H * TILE) / 2, MAP_W * TILE, MAP_H * TILE, 'floor_pattern');

    // bake bush tile
    if (!this.textures.exists('tile_bush')) {
      const b = TILESET.bushTile;
      const bc = document.createElement('canvas');
      bc.width = 16;
      bc.height = 16;
      bc.getContext('2d')!.drawImage(src, b.x * 16, b.y * 16, 16, 16, 0, 0, 16, 16);
      this.textures.addCanvas('tile_bush', bc);
      this.textures.get('tile_bush').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const [px, py] = this.tileCenter(x, y);
        if (this.grid[y][x] === 1) {
          this.add.image(px, py, 'tile_bush').setScale(2);
        } else if (this.grid[y][x] === 2) {
          this.add.image(px, py, Math.random() > 0.5 ? 'decor_rock1' : 'decor_rock2').setScale(1);
        }
      }
    }
  }

  private tileCenter(tx: number, ty: number): [number, number] {
    return [tx * TILE + TILE / 2, ty * TILE + TILE / 2];
  }

  private walkable(px: number, py: number): boolean {
    const tx = Math.floor(px / TILE);
    const ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
    return this.grid[ty][tx] === 0;
  }

  // ---------------- mobs ----------------
  private spawnMobs(heroSet: string) {
    const fdef = floorDef(this.floor);
    const rng = this.rng;
    for (let i = 0; i < TOWER.enemyCountPerFloor; i++) {
      let tx = 2, ty = 2, guard = 0;
      do {
        tx = 2 + Math.floor(rng() * (MAP_W - 4));
        ty = 2 + Math.floor(rng() * (MAP_H - 6));
        guard++;
      } while (this.grid[ty][tx] !== 0 && guard < 100);
      this.grid[ty][tx] = 0;
      this.makeMob(fdef.mobs[i % fdef.mobs.length], tx, ty);
    }
  }

  private mobStats(setName: string): CombatStats {
    const fdef = floorDef(this.floor);
    const d = fdef.difficulty;
    const f = this.floor;
    const hp = Math.round((30 + TOWER.hpPerFloor * f) * d);
    return {
      attack: Math.round((6 + TOWER.atkPerFloor * f) * d),
      defense: Math.round((2 + TOWER.defPerFloor * f) * d),
      hp,
      maxHp: hp,
      crit: 0.04,
    };
  }

  private makeMob(setName: string, tx: number, ty: number) {
    const [px, py] = this.tileCenter(tx, ty);
    const sprite = this.add.sprite(px, py, `${setName}_idle_sheet`);
    sprite.setScale(1.3);
    sprite.play(`${setName}_idle_down`);
    const stats = this.mobStats(setName);
    this.mobs.push({
      sprite,
      bar: hpBar(this, px, py - 42, 40),
      stats,
      hp: stats.maxHp,
      spawnTX: tx,
      spawnTY: ty,
      nextAttackAt: 0,
      alive: true,
      setName,
      name: setName.replace('mob_', ''),
      path: [],
      pathKey: '',
      pathAt: 0,
    });
  }

  // ---------------- loop ----------------
  private heroPath: Point[] = [];
  private heroPathKey = '';
  private heroPathAt = 0;

  private tileOf(px: number, py: number): Point {
    return {
      x: Phaser.Math.Clamp(Math.floor(px / TILE), 0, MAP_W - 1),
      y: Phaser.Math.Clamp(Math.floor(py / TILE), 0, MAP_H - 1),
    };
  }

  /** Follow a tile path; returns heading + whether we were blocked. */
  private followPath(
    sprite: Phaser.GameObjects.Sprite,
    path: Point[],
    speed: number,
  ): { dx: number; dy: number; moved: boolean; blocked: boolean } {
    if (!path.length) return { dx: 0, dy: 0, moved: false, blocked: false };
    let wp = this.tileCenter(path[0].x, path[0].y);
    let dx = wp[0] - sprite.x;
    let dy = wp[1] - sprite.y;
    if (Math.hypot(dx, dy) < 6) {
      path.shift();
      if (!path.length) return { dx, dy, moved: false, blocked: false };
      wp = this.tileCenter(path[0].x, path[0].y);
      dx = wp[0] - sprite.x;
      dy = wp[1] - sprite.y;
    }
    const len = Math.hypot(dx, dy) || 1;
    const nx = sprite.x + (dx / len) * speed;
    const ny = sprite.y + (dy / len) * speed;
    let moved = false;
    if (this.walkable(nx, sprite.y)) {
      sprite.x = nx;
      moved = true;
    }
    if (this.walkable(sprite.x, ny)) {
      sprite.y = ny;
      moved = true;
    }
    return { dx, dy, moved, blocked: !moved };
  }

  update(time: number, delta: number) {
    if (this.over) return;
    const speed = 0.11 * delta; // hero px per ms-ish
    const espeed = 0.06 * delta;

    // nearest live mob
    let target: Mob | null = null;
    let best = Infinity;
    for (const m of this.mobs) {
      if (!m.alive) continue;
      const d = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, m.sprite.x, m.sprite.y);
      if (d < best) {
        best = d;
        target = m;
      }
    }

    if (!target) {
      if (!this.searching && time - this.lastTargetAt > 400) {
        this.showSearching(true);
      }
      this.heroPath = [];
      this.hero.play(this.animFor('idle', this.dirOf(0, 0)) as string, true);
      return;
    }
    if (this.searching) this.showSearching(false);
    this.lastTargetAt = time;

    const dx = target.sprite.x - this.hero.x;
    const dy = target.sprite.y - this.hero.y;
    const dist = Math.hypot(dx, dy);
    const dir = this.dirOf(dx, dy);

    if (dist > COMBAT.heroAttackRange) {
      const goal = this.tileOf(target.sprite.x, target.sprite.y);
      const gKey = `${goal.x},${goal.y}`;
      if (
        this.heroPathKey !== gKey ||
        this.heroPath.length === 0 ||
        time - this.heroPathAt > 700
      ) {
        this.heroPathKey = gKey;
        this.heroPathAt = time;
        this.heroPath = astar(this.grid, this.tileOf(this.hero.x, this.hero.y), goal);
      }
      const mv = this.followPath(this.hero, this.heroPath, speed);
      if (mv.blocked) this.heroPathAt = 0; // force repath next frame
      const wdir = mv.moved ? this.dirOf(mv.dx, mv.dy) : dir;
      this.hero.play(this.animFor('walk', wdir), true);
    } else {
      this.heroPath = [];
      this.hero.play(this.animFor('attack', dir), true);
      if (time >= this.heroNextAttackAt) {
        this.heroNextAttackAt = time + COMBAT.heroAttackCooldownMs;
        this.heroAttack(target, time);
      }
    }

    // mobs AI — path around obstacles toward the hero
    for (const m of this.mobs) {
      if (!m.alive) continue;
      const mdx = this.hero.x - m.sprite.x;
      const mdy = this.hero.y - m.sprite.y;
      const mdist = Math.hypot(mdx, mdy);
      const mdir = this.dirOf(mdx, mdy);
      if (mdist <= COMBAT.enemyAttackRange) {
        m.path = [];
        m.sprite.play(this.animForSet(m.setName, 'attack', mdir), true);
        if (time >= m.nextAttackAt) {
          m.nextAttackAt = time + COMBAT.enemyAttackCooldownMs;
          this.enemyAttack(m, time);
        }
      } else if (mdist < COMBAT.enemyAggroRange) {
        const goal = this.tileOf(this.hero.x, this.hero.y);
        const gKey = `${goal.x},${goal.y}`;
        if (m.pathKey !== gKey || m.path.length === 0 || time - m.pathAt > 800) {
          m.pathKey = gKey;
          m.pathAt = time;
          m.path = astar(this.grid, this.tileOf(m.sprite.x, m.sprite.y), goal);
        }
        const mv = this.followPath(m.sprite, m.path, espeed);
        if (mv.blocked) m.pathAt = 0;
        const wdir = mv.moved ? this.dirOf(mv.dx, mv.dy) : mdir;
        m.sprite.play(this.animForSet(m.setName, 'walk', wdir), true);
      } else {
        m.path = [];
        m.sprite.play(this.animForSet(m.setName, 'idle', mdir), true);
      }
      m.bar.setPosition(m.sprite.x, m.sprite.y - 42);
      m.bar.set(m.hp, m.stats.maxHp);
    }

    this.heroBar.setPosition(this.hero.x, this.hero.y - 46);
    this.heroBar.set(this.heroHp, this.heroStats.maxHp);
  }

  private dirOf(dx: number, dy: number): Dir {
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  private animFor(anim: string, dir: Dir) {
    const hero = state.activeHero()!;
    return `${heroDef(hero.defId).spriteSet}_${anim}_${dir}`;
  }
  private animForSet(set: string, anim: string, dir: Dir) {
    return `${set}_${anim}_${dir}`;
  }

  // ---------------- combat ----------------
  private heroAttack(m: Mob, time: number) {
    let mult = 1;
    let hits = 1;
    let lifesteal = 0;
    let heal = 0;
    if (this.heroSkill && time >= this.heroSkillReadyAt) {
      this.heroSkillReadyAt = time + this.heroSkill.cooldownMs;
      mult = this.heroSkill.damageMult;
      hits = this.heroSkill.hits;
      lifesteal = this.heroSkill.lifesteal;
      heal = this.heroSkill.healFraction;
      this.floatText(this.hero.x, this.hero.y - 60, this.heroSkill.name.toUpperCase(), 0x6ff2e8, 1);
    }
    for (let i = 0; i < hits && m.alive; i++) {
      const { amount, critical } = damageFormula(this.heroStats, m.stats, this.rng, mult);
      m.hp -= amount;
      this.floatText(m.sprite.x, m.sprite.y - 56, `${amount}`, critical ? 0xffa53d : 0xffffff, critical ? 2 : 1);
      m.sprite.play(this.animForSet(m.setName, 'hurt', this.dirOf(m.sprite.x - this.hero.x, m.sprite.y - this.hero.y)), true);
      if (lifesteal > 0) {
        this.heroHp = Math.min(this.heroStats.maxHp, this.heroHp + Math.round(amount * lifesteal));
      }
      if (m.hp <= 0) this.killMob(m, time);
    }
    if (heal > 0) this.heroHp = Math.min(this.heroStats.maxHp, this.heroHp + Math.round(this.heroStats.maxHp * heal));
  }

  private enemyAttack(m: Mob, time: number) {
    const { amount, critical } = damageFormula(m.stats, this.heroStats, this.rng);
    this.heroHp -= amount;
    this.floatText(this.hero.x, this.hero.y - 60, `${amount}`, 0xd0503c, 1);
    if (this.heroHp <= 0) this.defeat();
  }

  private killMob(m: Mob, time: number) {
    m.alive = false;
    m.sprite.play(this.animForSet(m.setName, 'death', 'down'), false);
    this.time.delayedCall(700, () => {
      m.sprite.setVisible(false);
      m.bar.destroy();
    });
    this.kills++;
    this.drawTopInfo();
    this.grantRewards();

    // respawn at ORIGINAL spawn point
    this.time.delayedCall(TOWER.enemyRespawnMs, () => {
      if (this.over || this.scene.isActive('tower') === false) return;
      m.sprite.setVisible(true);
      const [px, py] = this.tileCenter(m.spawnTX, m.spawnTY);
      m.sprite.setPosition(px, py);
      const stats = this.mobStats(m.setName);
      m.stats = stats;
      m.hp = stats.maxHp;
      m.alive = true;
      m.bar = hpBar(this, px, py - 42, 40);
      m.sprite.play(this.animForSet(m.setName, 'idle', 'down'));
    });

    if (this.kills >= TOWER.killsToClearFloor) this.floorCleared();
  }

  private grantRewards() {
    const f = this.floor;
    const coin = Math.round(
      (ECONOMY.killCoinBase + f * ECONOMY.killCoinPerFloor) *
        (1 + (this.rng() * 2 - 1) * ECONOMY.killCoinVariance),
    );
    state.addCoins(coin);
    const xpPool = 22 + f * 9;
    const { perMember } = state.grantTeamXp(xpPool);
    this.floatText(this.hero.x, this.hero.y - 74, `+${coin} COIN`, 0xffd75e, 1);
    this.floatText(this.hero.x, this.hero.y - 88, `+${perMember} XP`, 0x6fd06f, 1);

    if (rollDrop(this.rng)) {
      const item = generateEquipment(this.rng, f);
      state.addItem(item);
      const label = `${item.rarity.toUpperCase()} ${item.slot.toUpperCase()}`;
      this.floatText(this.hero.x, this.hero.y - 102, `LOOT! ${label}`, RARITY_COLOR[item.rarity], 2);
    }
    state.touch();
    state.save();
  }

  private showSearching(on: boolean) {
    if (on && !this.searching) {
      this.searching = pixelFont.text(this, 0, 0, 'PROCURANDO...', { scale: 1 }).setDepth(35);
    } else if (!on && this.searching) {
      this.searching.destroy();
      this.searching = null;
    }
    if (this.searching) this.searching.setPosition(this.hero.x, this.hero.y - 100);
  }

  private floatText(x: number, y: number, str: string, color: number, scale: number) {
    const t = pixelFont.text(this, x, y, str, { scale });
    t.setDepth(36);
    t.setTint(color);
    this.tweens.add({
      targets: t,
      y: y - 26,
      alpha: 0,
      duration: 900,
      onComplete: () => t.destroy(),
    });
  }

  private drawTopInfo() {
    const fdef = floorDef(this.floor);
    const w = this.scale.width;
    const old = this.children.getByName('floorinfo');
    if (old) old.destroy();
    const oldK = this.killLabel;
    if (oldK) oldK.destroy();
    pixelFont
      .text(this, w / 2, 64, `TORRE ${this.floor} - ${fdef.name.toUpperCase()}`, { scale: 1 })
      .setName('floorinfo')
      .setDepth(41)
      .setScrollFactor(0);
    this.killLabel = pixelFont
      .text(this, w / 2, 78, `ABATES ${this.kills}/${TOWER.killsToClearFloor}`, { scale: 1 })
      .setDepth(41)
      .setScrollFactor(0);
  }

  private floorCleared() {
    this.over = true;
    const king = state.king!;
    king.highestFloor = Math.min(10, Math.max(king.highestFloor, this.floor + 1));
    state.grantKingXp(60 + this.floor * 20);
    state.touch();
    state.save();
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setDepth(70);
    pixelFont.text(this, w / 2, h * 0.4, 'ANDAR LIMPO!', { scale: 3 }).setDepth(71);
    pixelFont.text(this, w / 2, h * 0.46, `TORRE ${this.floor} CONCLUIDA`, { scale: 1 }).setDepth(71);
    navButton(this, w * 0.3, h * 0.56, 'SAIR', () => this.leave()).setDepth(72);
    if (king.highestFloor > this.floor) {
      navButton(this, w * 0.7, h * 0.56, 'TORRE', () =>
        this.scene.restart({ floor: this.floor + 1 }),
      ).setDepth(72);
    }
  }

  private defeat() {
    if (this.over) return;
    this.over = true;
    const hero = state.activeHero()!;
    this.hero.play(this.animFor('death', 'down'), false);
    const w = this.scale.width;
    const h = this.scale.height;
    this.time.delayedCall(800, () => {
      this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.6).setDepth(70);
      pixelFont.text(this, w / 2, h * 0.42, 'DERROTADO', { scale: 3 }).setDepth(71);
      pixelFont.text(this, w / 2, h * 0.48, 'O REI RECUA PARA O SALAO', { scale: 1 }).setDepth(71);
      navButton(this, w * 0.5, h * 0.56, 'SAIR', () => this.leave()).setDepth(72);
    });
  }

  private leave() {
    state.touch();
    state.save();
    this.scene.stop('inventory');
    this.scene.stop('team');
    this.scene.stop('settings');
    this.scene.start('lobby');
  }
}

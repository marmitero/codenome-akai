// Game state manager — single source of truth for King/heroes/team/inventory.
// Pure data + rules; the renderer observes it. (master prompt §63 separation)

import { SAVE_VERSION, TEAM_SLOTS, MAX_TEAM_SIZE } from '../config/balance';
import { heroDef } from '../config/heroes';
import type {
  CombatStats, Equipment, EquipSlot, HeroInstance, KingState, SaveState, TeamState,
} from './types';
import { applyXp, heroXpNeeded, kingXpNeeded, splitXp } from './xp';
import { totalStats } from './equipment';
import type { PersistenceService } from './persistence';
import { uid } from './rng';

export type GameEventType =
  | 'king_created' | 'hero_chosen' | 'team_changed' | 'slot_unlocked'
  | 'xp_granted' | 'coins_changed' | 'inventory_changed' | 'floor_cleared'
  | 'saved' | 'loaded';

export class GameState {
  king: KingState | null = null;
  heroes: Record<string, HeroInstance> = {};
  chosenInitialHero: string | null = null;
  team: TeamState = { slots: [null, null, null], unlocked: [true, false, false], activeIndex: 0 };
  inventory: Equipment[] = [];

  private listeners = new Set<(ev: GameEventType) => void>();
  constructor(private persistence: PersistenceService) {}

  on(fn: (ev: GameEventType) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit(ev: GameEventType) {
    this.listeners.forEach((fn) => fn(ev));
  }

  // ---------- lifecycle ----------
  load(): SaveState | null {
    const s = this.persistence.load();
    if (s && s.version === SAVE_VERSION) {
      this.king = s.king;
      // migration: early builds stored 'male'/'female' skins
      if (this.king && (this.king.skin === 'male' || this.king.skin === 'female')) {
        this.king.skin = this.king.skin === 'male' ? 'm1' : 'f1';
      }
      this.heroes = s.heroes ?? {};
      this.chosenInitialHero = s.chosenInitialHero;
      this.team = s.team ?? this.team;
      this.inventory = s.inventory ?? [];
      this.emit('loaded');
      return s;
    }
    return null;
  }

  save() {
    const s: SaveState = {
      version: SAVE_VERSION,
      king: this.king,
      heroes: this.heroes,
      chosenInitialHero: this.chosenInitialHero,
      team: this.team,
      inventory: this.inventory,
    };
    this.persistence.save(s);
    this.emit('saved');
  }

  // ---------- king ----------
  createKing(name: string, skin: string) {
    const now = Date.now();
    this.king = {
      name,
      skin,
      level: 1,
      xp: 0,
      coins: 0,
      diamonds: 0,
      vip: false,
      highestFloor: 1,
      createdAt: now,
      lastActiveAt: now,
      tutorialDone: false,
    };
    this.emit('king_created');
    this.save();
  }

  grantKingXp(amount: number): number {
    if (!this.king) return 0;
    const r = applyXp(this.king.level, this.king.xp, amount, kingXpNeeded);
    this.king.level = r.level;
    this.king.xp = r.xp;
    this.emit('xp_granted');
    return r.levelsGained;
  }

  addCoins(n: number) {
    if (!this.king) return;
    this.king.coins = Math.max(0, this.king.coins + n);
    this.emit('coins_changed');
  }

  touch() {
    if (this.king) this.king.lastActiveAt = Date.now();
  }

  // ---------- heroes ----------
  chooseInitialHero(defId: string) {
    if (this.chosenInitialHero) return;
    const def = heroDef(defId);
    const hero: HeroInstance = {
      id: uid('hero'),
      defId,
      name: def.name,
      level: 1,
      xp: 0,
      stars: 1,
      equipment: { weapon: null, armor: null, accessory: null },
    };
    this.heroes[hero.id] = hero;
    this.chosenInitialHero = hero.id;
    this.team.slots[0] = hero.id;
    this.emit('hero_chosen');
    this.save();
  }

  heroStats(hero: HeroInstance): CombatStats {
    const def = heroDef(hero.defId);
    const lvl = hero.level - 1;
    const eq = totalStats([hero.equipment.weapon, hero.equipment.armor, hero.equipment.accessory]);
    const maxHp = Math.round(def.base.hp + def.growth.hp * lvl + eq.hp);
    return {
      attack: Math.round(def.base.attack + def.growth.attack * lvl + eq.attack),
      defense: Math.round(def.base.defense + def.growth.defense * lvl + eq.defense),
      hp: maxHp,
      maxHp,
      crit: Math.min(0.6, def.base.crit + def.growth.crit * lvl + eq.crit),
    };
  }

  /** Grant XP to every eligible team member (split, master prompt §20). */
  grantTeamXp(pool: number): { perMember: number; kingLevels: number } {
    const members = this.team.slots
      .map((id) => (id ? this.heroes[id] : null))
      .filter((h): h is HeroInstance => !!h);
    const perMember = splitXp(pool, members.length);
    for (const h of members) {
      const r = applyXp(h.level, h.xp, perMember, heroXpNeeded);
      h.level = r.level;
      h.xp = r.xp;
    }
    const kingLevels = this.king
      ? this.grantKingXp(Math.floor(pool * 0.25))
      : 0;
    this.emit('xp_granted');
    return { perMember, kingLevels };
  }

  // ---------- team ----------
  slotRequirements(index: number) {
    return index === 1 ? TEAM_SLOTS.slot2 : index === 2 ? TEAM_SLOTS.slot3 : TEAM_SLOTS.slot1;
  }

  canUnlockSlot(index: number): boolean {
    if (!this.king) return false;
    if (index < 0 || index >= MAX_TEAM_SIZE) return false;
    if (this.team.unlocked[index]) return false;
    if (index === 1 && !this.team.unlocked[0]) return false;
    if (index === 2 && !this.team.unlocked[1]) return false;
    const req = this.slotRequirements(index);
    return this.king.level >= req.minKingLevel && this.king.coins >= req.coinCost;
  }

  unlockSlot(index: number): boolean {
    if (!this.canUnlockSlot(index) || !this.king) return false;
    const req = this.slotRequirements(index);
    this.king.coins -= req.coinCost;
    this.team.unlocked[index] = true;
    this.emit('slot_unlocked');
    this.emit('coins_changed');
    this.save();
    return true;
  }

  assignHero(slot: number, heroId: string | null): boolean {
    if (!this.team.unlocked[slot]) return false;
    if (heroId && !this.heroes[heroId]) return false;
    // a hero can only occupy one slot
    this.team.slots = this.team.slots.map((id) => (id === heroId && heroId ? null : id));
    this.team.slots[slot] = heroId;
    if (!this.team.slots[this.team.activeIndex]) {
      const first = this.team.slots.findIndex((id) => id !== null);
      this.team.activeIndex = Math.max(0, first);
    }
    this.emit('team_changed');
    this.save();
    return true;
  }

  setActiveHero(slot: number) {
    if (!this.team.unlocked[slot] || !this.team.slots[slot]) return;
    this.team.activeIndex = slot;
    this.emit('team_changed');
    this.save();
  }

  activeHero(): HeroInstance | null {
    const id = this.team.slots[this.team.activeIndex];
    return id ? this.heroes[id] ?? null : null;
  }

  // ---------- inventory / equipment ----------
  addItem(item: Equipment) {
    this.inventory.push(item);
    this.emit('inventory_changed');
  }

  sellItem(itemId: string): number {
    const idx = this.inventory.findIndex((i) => i.id === itemId);
    if (idx < 0) return 0;
    const [item] = this.inventory.splice(idx, 1);
    this.addCoins(item.sellValue);
    this.emit('inventory_changed');
    this.save();
    return item.sellValue;
  }

  equipItem(itemId: string, heroId: string): boolean {
    const item = this.inventory.find((i) => i.id === itemId);
    const hero = this.heroes[heroId];
    if (!item || !hero) return false;
    const prev = hero.equipment[item.slot];
    hero.equipment[item.slot] = item;
    this.inventory = this.inventory.filter((i) => i.id !== itemId);
    if (prev) this.inventory.push(prev);
    this.emit('inventory_changed');
    this.save();
    return true;
  }

  unequipItem(heroId: string, slot: EquipSlot) {
    const hero = this.heroes[heroId];
    if (!hero) return;
    const prev = hero.equipment[slot];
    if (!prev) return;
    hero.equipment[slot] = null;
    this.inventory.push(prev);
    this.emit('inventory_changed');
    this.save();
  }
}

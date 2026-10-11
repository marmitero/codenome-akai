// Lobby — the King's hall. A full-screen in-game scene (not a web hub).
// From here the King deploys champions to the Tower and manages the realm.

import Phaser from 'phaser';
import { TILESET } from '../config/assets';
import { pixelFont } from '../ui/PixelText';
import { kingBar, navButton } from '../ui/hud';
import { button, panel } from '../ui/widgets';
import { state, offlineReport, consumeOfflineReport } from '../game/session';
import { heroDef } from '../config/heroes';

export class LobbyScene extends Phaser.Scene {
  private hud: ReturnType<typeof kingBar> | null = null;

  constructor() {
    super('lobby');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x171122);
    this.paintFloor(w, h);

    // hall decoration
    this.add.image(w * 0.15, h * 0.3, 'decor_rock1').setScale(1).setAlpha(0.9);
    this.add.image(w * 0.85, h * 0.32, 'decor_rock2').setScale(1).setAlpha(0.9);
    this.add.image(w * 0.8, h * 0.62, 'decor_bones').setScale(1).setAlpha(0.8);

    pixelFont.text(this, w / 2, h * 0.16, 'SALAO DO REI', { scale: 2 });

    // active hero standing in the hall
    const hero = state.activeHero();
    if (hero) {
      const def = heroDef(hero.defId);
      const spr = this.add.sprite(w / 2, h * 0.42, `${def.spriteSet}_idle_sheet`);
      spr.setScale(2.5);
      spr.play(`${def.spriteSet}_idle_down`);
      pixelFont.text(this, w / 2, h * 0.52, `${hero.name.toUpperCase()} NV ${hero.level}`, { scale: 1 });
    }

    this.hud = kingBar(this);

    // bottom nav
    const y = h - 46;
    const xs = [w * 0.14, w * 0.38, w * 0.62, w * 0.86];
    navButton(this, xs[0], y, 'TORRE', () => this.scene.launch('tower_select'));
    navButton(this, xs[1], y, 'ITENS', () => this.scene.launch('inventory'));
    navButton(this, xs[2], y, 'EQUIPE', () => this.scene.launch('team'));
    navButton(this, xs[3], y, 'REI', () => this.scene.launch('settings'));

    if (!state.king!.tutorialDone) {
      pixelFont.text(this, w / 2, h * 0.7, 'EQUIPE SEU CAMPEAO E ENTRE NA TORRE', { scale: 1 });
      pixelFont.text(this, w / 2, h * 0.73, 'TOQUE EM TORRE PARA COMECAR', { scale: 1 });
    }

    if (offlineReport) {
      this.showOfflinePopup(w, h);
      consumeOfflineReport();
    }

    const onVis = () => {
      if (document.hidden) {
        state.touch();
        state.save();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    const unsub = state.on(() => this.hud?.refresh());
    this.events.once('shutdown', () => {
      document.removeEventListener('visibilitychange', onVis);
      unsub();
    });
  }

  private paintFloor(w: number, h: number) {
    const tile = 32;
    const src = this.textures.get('tile_ground').getSourceImage() as HTMLImageElement;
    const flats = TILESET.flatTiles;
    const canvas = document.createElement('canvas');
    canvas.width = tile * 2;
    canvas.height = tile * 2;
    const ctx = canvas.getContext('2d')!;
    flats.slice(0, 4).forEach((f, i) => {
      ctx.drawImage(src, f.x * 16, f.y * 16, 16, 16, (i % 2) * tile, Math.floor(i / 2) * tile, tile, tile);
    });
    const key = 'floor_pattern';
    if (!this.textures.exists(key)) {
      this.textures.addCanvas(key, canvas);
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    this.add.tileSprite(w / 2, h / 2, w, h, key).setAlpha(0.55);
  }

  private showOfflinePopup(w: number, h: number) {
    const r = offlineReport!;
    const dim = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7).setDepth(60);
    const p = panel(this, w / 2, h * 0.4, 'titled', 3).setDepth(61);
    const mins = Math.floor(r.cappedSeconds / 60);
    const t1 = pixelFont.text(this, w / 2, h * 0.33, 'PROGRESSO OFFLINE', { scale: 2 }).setDepth(62);
    const t2 = pixelFont.text(this, w / 2, h * 0.4, `${mins} MIN LONGE`, { scale: 1 }).setDepth(62);
    const t3 = pixelFont.text(this, w / 2, h * 0.43, `+${r.coins} COIN  +${r.heroXp} XP`, { scale: 1 }).setDepth(62);
    const btn = button(this, w / 2, h * 0.48, 'next', () => {
      [dim, p, t1, t2, t3, btn].forEach((o) => o.destroy());
    }, 3).setDepth(62);
  }
}

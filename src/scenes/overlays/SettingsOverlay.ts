// King profile + dev-only Debug Mode (master prompt §77 — never for players).

import Phaser from 'phaser';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, panel } from '../../ui/widgets';
import { UI } from '../../config/assets';
import { state, debugEnabled } from '../../game/session';
import { generateEquipment } from '../../core/equipment';
import { randomRng } from '../../core/rng';
import type { Rarity } from '../../core/types';

const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'celestial'];

export class SettingsOverlay extends Phaser.Scene {
  private debugRarity = 0;

  constructor() {
    super('settings');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72).setDepth(80).setInteractive()
      .on('pointerdown', () => this.close());
    panel(this, w / 2, h * 0.42, 'titled', 3).setDepth(81);
    bakeCrop(this, 'btn:square', 'ui_buttons', UI.buttons.square);
    this.add.image(w / 2 + 132, h * 0.42 - 138, 'btn:square').setScale(1.2).setDepth(83)
      .setAlpha(0.01)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.close());

    const k = state.king!;
    let y = h * 0.42 - 100;
    const T = (s: string, sc = 1, color?: number) => {
      const t = pixelFont.text(this, w / 2, y, s, { scale: sc }).setDepth(85);
      if (color) t.setTint(color);
      y += sc * 14 + 6;
    };
    T(`REI ${k.name}`, 2);
    T(`NIVEL ${k.level}  XP ${k.xp}`, 1);
    T(`COINS ${k.coins}  DIAMONDS ${k.diamonds}`, 1);
    T(`VIP ${k.vip ? 'ATIVO' : 'INATIVO'}  TORRE ${k.highestFloor}`, 1);
    T('SALVE LOCAL ATIVO', 1, 0x8a7f6a);

    if (debugEnabled) {
      y += 8;
      T('DEBUG MODE (DEV)', 2, 0xff5555);
      const row = (label: string, fn: () => void) => {
        const b = this.add.image(w / 2, y, 'btn:square').setScale(1.6).setDepth(85)
          .setInteractive({ useHandCursor: true });
        pixelFont.text(this, w / 2, y, label, { scale: 1 }).setDepth(86).setTint(0x123018);
        b.on('pointerdown', () => {
          fn();
          this.scene.restart();
        });
        y += 30;
      };
      row('+100000 COIN', () => state.addCoins(100000));
      row('+500 XP REI', () => state.grantKingXp(500));
      row('+500 XP EQUIPE', () => state.grantTeamXp(500));
      row(`CRIAR ITEM ${RARITIES[this.debugRarity].toUpperCase()}`, () => {
        state.addItem(generateEquipment(randomRng(), state.king!.highestFloor, { rarity: RARITIES[this.debugRarity] }));
        this.debugRarity = (this.debugRarity + 1) % RARITIES.length;
      });
      row('RESETAR SAVE', () => {
        localStorage.clear();
        window.location.reload();
      });
    }
  }

  private close() {
    this.scene.stop('settings');
  }
}

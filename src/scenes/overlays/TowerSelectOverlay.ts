// Tower floor selection (master prompt §22/§26). Floors never contain bosses.

import Phaser from 'phaser';
import { FLOORS } from '../../config/floors';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, panel } from '../../ui/widgets';
import { UI } from '../../config/assets';
import { state } from '../../game/session';

export class TowerSelectOverlay extends Phaser.Scene {
  constructor() {
    super('tower_select');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72).setDepth(80).setInteractive()
      .on('pointerdown', () => this.close());
    panel(this, w / 2, h * 0.42, 'grid', 3).setDepth(81);
    bakeCrop(this, 'btn:square', 'ui_buttons', UI.buttons.square);
    this.add.image(w / 2 + 132, h * 0.42 - 138, 'btn:square').setScale(1.2).setDepth(83)
      .setAlpha(0.01)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.close());

    pixelFont.text(this, w / 2, h * 0.42 - 120, 'A TORRE', { scale: 2 }).setDepth(85);
    pixelFont.text(this, w / 2, h * 0.42 - 100, 'CAMPOS DE CACA - SEM BOSSES', { scale: 1 }).setDepth(85);

    FLOORS.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = w / 2 + (col === 0 ? -72 : 72);
      const y = h * 0.42 - 66 + row * 52;
      const unlocked = f.floor <= (state.king?.highestFloor ?? 1);
      const btn = this.add.image(x, y, 'btn:square').setScale(2).setDepth(85)
        .setTint(unlocked ? 0xffffff : 0x555555)
        .setInteractive({ useHandCursor: true });
      pixelFont.text(this, x, y - 6, `${f.floor}`, { scale: 2 }).setDepth(86)
        .setTint(unlocked ? 0x123018 : 0x333333);
      pixelFont.text(this, x, y + 10, f.name.split(' ')[0].toUpperCase(), { scale: 1 }).setDepth(86)
        .setTint(unlocked ? 0x123018 : 0x333333);
      if (unlocked) {
        btn.on('pointerdown', () => {
          this.scene.stop('tower_select');
          this.scene.stop('lobby');
          this.scene.start('tower', { floor: f.floor });
        });
      }
    });
  }

  private close() {
    this.scene.stop('tower_select');
  }
}

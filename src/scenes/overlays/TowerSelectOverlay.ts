// Tower floor selection — uses the LEVELS window art with its baked circles.

import Phaser from 'phaser';
import { FLOORS } from '../../config/floors';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, button, windowFrame } from '../../ui/widgets';
import { UI } from '../../config/assets';
import { state } from '../../game/session';

const SCALE = 3;

export class TowerSelectOverlay extends Phaser.Scene {
  constructor() {
    super('tower_select');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72).setDepth(80).setInteractive()
      .on('pointerdown', () => this.close());

    const winW = 114 * SCALE;
    const winH = 133 * SCALE;
    const cx = w / 2;
    const cy = Math.min(h * 0.42, h / 2 - 20);
    windowFrame(this, cx, cy, 'levelsCircles', SCALE).setDepth(81);

    // close hit-target over the baked X (top-right of the title bar)
    bakeCrop(this, 'btn:square', 'ui_buttons', UI.buttons.square);
    this.add.image(cx + winW / 2 - 15, cy - winH / 2 + 12, 'btn:square').setScale(1.1).setDepth(83)
      .setAlpha(0.01)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.close());

    const left = cx - winW / 2;
    const top = cy - winH / 2;
    const highest = state.king?.highestFloor ?? 1;

    UI.levelCircleCenters.forEach(([ox, oy], i) => {
      const f = FLOORS[i];
      if (!f) return;
      const x = left + ox * SCALE;
      const y = top + oy * SCALE;
      const unlocked = f.floor <= highest;

      if (!unlocked) {
        this.add.circle(x, y, 17 * SCALE * 0.55, 0x000000, 0.45).setDepth(82);
      }
      const num = pixelFont.text(this, x, y, `${f.floor}`, { scale: 2 }).setDepth(84);
      num.setTint(unlocked ? 0x4a3018 : 0x9a9a9a);
      const hit = this.add.circle(x, y, 17 * SCALE * 0.55, 0x000000, 0).setDepth(85)
        .setInteractive({ useHandCursor: true });
      if (unlocked) {
        hit.on('pointerdown', () => {
          this.scene.stop('tower_select');
          this.scene.stop('lobby');
          this.scene.start('tower', { floor: f.floor });
        });
      }
    });

    // floor 10 sits below the window
    const f10 = FLOORS[9];
    const unlocked10 = f10.floor <= highest;
    const b = button(this, cx, cy + winH / 2 + 26, 'blank', () => {
      this.scene.stop('tower_select');
      this.scene.stop('lobby');
      this.scene.start('tower', { floor: 10 });
    }, 2).setDepth(84).setTint(unlocked10 ? 0xffffff : 0x666666);
    pixelFont.text(this, cx, cy + winH / 2 + 26, '10', { scale: 2 }).setDepth(85)
      .setTint(unlocked10 ? 0x123018 : 0x333333);
    void b;

    pixelFont.text(this, cx, cy + winH / 2 + 52, 'CAMPOS DE CACA - SEM BOSSES', { scale: 1 }).setDepth(84);
  }

  private close() {
    this.scene.stop('tower_select');
  }
}

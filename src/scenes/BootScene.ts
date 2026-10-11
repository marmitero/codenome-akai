// Boot: asset loading, spritesheet/animation baking, pixel font build, routing.

import Phaser from 'phaser';
import { SPRITE_SETS, TILESET, DECOR, UI, FRAME, DIRS } from '../config/assets';
import { pixelFont } from '../ui/PixelText';
import { state, evaluateOfflineProgress } from '../game/session';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    const bar = this.add.rectangle(
      this.scale.width / 2, this.scale.height / 2, 220, 14, 0x2a2135,
    ).setStrokeStyle(2, 0x6d5a3a);
    const fill = this.add.rectangle(bar.x - 105, bar.y, 0, 8, 0x6fd06f).setOrigin(0, 0.5);
    this.load.on('progress', (p: number) => fill.setSize(210 * p, 8));
    this.add.text(this.scale.width / 2, bar.y - 34, 'CODENOME: AKAI', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffe9c4',
    }).setOrigin(0.5);

    for (const set of Object.values(SPRITE_SETS)) {
      for (const [anim, file] of Object.entries(set.files)) {
        this.load.image(`${set.key}_${anim}`, `${set.prefix}/${file}`);
      }
    }
    this.load.image('ui_buttons', UI.buttonsSheet);
    this.load.image('ui_inventory', UI.inventorySheet);
    this.load.image('ui_charpanel', UI.charPanel);
    this.load.image('__font_src', UI.fontSheet);
    this.load.image('tile_ground', TILESET.cursedGround);
    this.load.image('decor_rock1', DECOR.rock1);
    this.load.image('decor_rock2', DECOR.rock2);
    this.load.image('decor_bones', DECOR.bones);
  }

  create() {
    this.bakeAnimations();
    pixelFont.build(this, '__font_src', 4);
    state.load();
    evaluateOfflineProgress();

    if (!state.king) this.scene.start('king_creation');
    else if (!state.chosenInitialHero) this.scene.start('hero_choice');
    else this.scene.start('lobby');
  }

  private bakeAnimations() {
    for (const set of Object.values(SPRITE_SETS)) {
      for (const anim of Object.keys(set.files)) {
        const texKey = `${set.key}_${anim}`;
        const src = this.textures.get(texKey).getSourceImage() as HTMLImageElement;
        const cols = Math.floor(src.width / FRAME);
        const rows = Math.floor(src.height / FRAME);
        if (cols < 1 || rows < 1) continue;
        const sheetKey = `${texKey}_sheet`;
        if (!this.textures.exists(sheetKey)) {
          this.textures.addSpriteSheet(sheetKey, src, { frameWidth: FRAME, frameHeight: FRAME });
          this.textures.get(sheetKey).setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        DIRS.forEach((dir, r) => {
          if (r >= rows) return;
          const frames = Phaser.Utils.Array.NumberArray(r * cols, r * cols + cols - 1) as number[];
          const animKey = `${set.key}_${anim}_${dir}`;
          if (!this.anims.exists(animKey)) {
            this.anims.create({
              key: animKey,
              frames: this.anims.generateFrameNumbers(sheetKey, { frames }),
              frameRate: anim === 'attack' ? 10 : 8,
              repeat: anim === 'death' ? 0 : -1,
            });
          }
        });
      }
    }
  }
}

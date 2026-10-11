// Choose 1 of the 4 initial heroes (master prompt §10). The choice matters:
// each hero has a distinct role, stats and skill.

import Phaser from 'phaser';
import { INITIAL_HEROES } from '../config/heroes';
import { pixelFont } from '../ui/PixelText';
import { arrowButton, button, panel } from '../ui/widgets';
import { state } from '../game/session';

export class HeroChoiceScene extends Phaser.Scene {
  private index = 0;
  private portrait: Phaser.GameObjects.Sprite | null = null;
  private infoTexts: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('hero_choice');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x120d16);
    pixelFont.text(this, w / 2, h * 0.06, 'ESCOLHA SEU CAMPEAO', { scale: 2 });
    pixelFont.text(this, w / 2, h * 0.1, '1 DOS 4 - A ESCOLHA DEFINE SEU INICIO', { scale: 1 });

    panel(this, w / 2, h * 0.34, 'empty', 3).setDepth(1);
    arrowButton(this, w * 0.08, h * 0.34, 'left', () => this.cycle(-1)).setDepth(3);
    arrowButton(this, w * 0.92, h * 0.34, 'right', () => this.cycle(1)).setDepth(3);

    button(this, w / 2, h * 0.62, 'create', () => this.choose(), 3).setDepth(2);
    pixelFont.text(this, w / 2, h * 0.68, 'ESCOLHER', { scale: 2 });

    this.render();
    this.scale.once('resize', () => this.scene.restart());
  }

  private cycle(d: number) {
    this.index = (this.index + d + INITIAL_HEROES.length) % INITIAL_HEROES.length;
    this.render();
  }

  private render() {
    const { width: w, height: h } = this.scale;
    const def = INITIAL_HEROES[this.index];
    if (this.portrait) this.portrait.destroy();
    this.infoTexts.forEach((t) => t.destroy());
    this.infoTexts = [];

    this.portrait = this.add
      .sprite(w / 2, h * 0.3, `${def.spriteSet}_idle_sheet`)
      .setFrame(0)
      .setScale(3)
      .setDepth(2);

    const T = (x: number, y: number, s: string, sc = 2) =>
      this.infoTexts.push(pixelFont.text(this, x, y, s, { scale: sc }));

    T(w / 2, h * 0.44, `${def.name} - ${def.className.toUpperCase()}`);
    T(w / 2, h * 0.48, `ATK ${def.base.attack}  DEF ${def.base.defense}  HP ${def.base.hp}`, 1);
    T(w / 2, h * 0.51, `CRIT ${Math.round(def.base.crit * 100)}%  SKILL: ${def.skill.name.toUpperCase()}`, 1);
    // wrap description roughly
    const words = def.description.toUpperCase().split(' ');
    let line = '';
    let y = h * 0.55;
    for (const word of words) {
      if ((line + word).length > 38) {
        T(w / 2, y, line.trim(), 1);
        y += 12;
        line = '';
      }
      line += word + ' ';
    }
    if (line.trim()) T(w / 2, y, line.trim(), 1);

    T(w / 2, h * 0.86, `${this.index + 1} / ${INITIAL_HEROES.length}`, 1);
  }

  private choose() {
    const def = INITIAL_HEROES[this.index];
    state.chooseInitialHero(def.defId);
    this.scene.start('lobby');
  }
}

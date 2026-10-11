// Team overlay — slots, assignment, unlock rules (master prompt §13/§14/§19).

import Phaser from 'phaser';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, panel } from '../../ui/widgets';
import { UI } from '../../config/assets';
import { state } from '../../game/session';
import { heroDef } from '../../config/heroes';

export class TeamOverlay extends Phaser.Scene {
  private content: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('team');
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

    this.render();
    state.on((ev) => {
      if (ev === 'team_changed' || ev === 'slot_unlocked' || ev === 'coins_changed') this.render();
    });
  }

  private T(x: number, y: number, s: string, sc = 1, color?: number) {
    const t = pixelFont.text(this, x, y, s, { scale: sc }).setDepth(85);
    if (color !== undefined) t.setTint(color);
    this.content.push(t);
    return t;
  }

  private render() {
    this.content.forEach((o) => o.destroy());
    this.content = [];
    const { width: w, height: h } = this.scale;
    const top = h * 0.42 - 120;
    this.T(w / 2, top, 'EQUIPE DO REI', 2);

    const owned = Object.values(state.heroes);

    for (let slot = 0; slot < 3; slot++) {
      const y = top + 56 + slot * 74;
      const unlocked = state.team.unlocked[slot];
      const heroId = state.team.slots[slot];
      const hero = heroId ? state.heroes[heroId] : null;

      this.T(w / 2 - 120, y, `SLOT ${slot + 1}`, 1, unlocked ? 0x6fd06f : 0x8a7f6a);

      if (!unlocked) {
        const req = state.slotRequirements(slot);
        this.T(w / 2, y, `REQ NV ${req.minKingLevel} + ${req.coinCost} COIN`, 1);
        const can = state.canUnlockSlot(slot);
        const b = this.add.image(w / 2 + 110, y, 'btn:square').setScale(1.4).setDepth(85)
          .setTint(can ? 0xffffff : 0x777777)
          .setInteractive({ useHandCursor: true });
        this.content.push(b);
        this.T(w / 2 + 110, y, 'ABRIR', 1).setDepth(86);
        b.on('pointerdown', () => state.unlockSlot(slot));
        continue;
      }

      if (hero) {
        const def = heroDef(hero.defId);
        const active = state.team.activeIndex === slot;
        this.T(w / 2 - 20, y, `${hero.name.toUpperCase()} NV ${hero.level}`, 1);
        this.T(w / 2 - 20, y + 13, def.className.toUpperCase(), 1, 0x9fd0ff);
        const a = this.add.image(w / 2 + 110, y, 'btn:square').setScale(1.4).setDepth(85)
          .setTint(active ? 0x6fd06f : 0xffffff)
          .setInteractive({ useHandCursor: true });
        this.content.push(a);
        this.T(w / 2 + 110, y, 'ATIVO', 1).setDepth(86);
        a.on('pointerdown', () => state.setActiveHero(slot));

        // swap hero: tap name cycles through owned heroes
        const swap = this.add.rectangle(w / 2 - 20, y, 150, 30, 0x000000, 0.0).setDepth(87)
          .setInteractive({ useHandCursor: true });
        this.content.push(swap);
        swap.on('pointerdown', () => {
          const idx = owned.findIndex((o) => o.id === hero.id);
          const next = owned[(idx + 1) % owned.length];
          state.assignHero(slot, next.id === hero.id ? null : next.id);
        });
      } else {
        this.T(w / 2 - 20, y, 'VAZIO - TOQUE PARA POR HEROI', 1);
        const swap = this.add.rectangle(w / 2 - 20, y, 170, 30, 0x000000, 0.0).setDepth(87)
          .setInteractive({ useHandCursor: true });
        this.content.push(swap);
        swap.on('pointerdown', () => {
          if (owned.length) state.assignHero(slot, owned[0].id);
        });
      }
    }

    this.T(w / 2, top + 56 + 3 * 74 + 6, 'XP E DIVIDIDO ENTRE OS MEMBROS DA EQUIPE', 1, 0xb9a77c);
  }

  private close() {
    this.scene.stop('team');
  }
}

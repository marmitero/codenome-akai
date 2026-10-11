// Team overlay — slots as character-panel rows (art-faithful menu, no item grid).

import Phaser from 'phaser';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, windowFrame } from '../../ui/widgets';
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

    pixelFont.text(this, w / 2, h * 0.1, 'EQUIPE DO REI', { scale: 2 }).setDepth(82);
    pixelFont.text(this, w / 2, h * 0.13, 'XP E DIVIDIDO ENTRE OS MEMBROS', { scale: 1 }).setDepth(82);

    bakeCrop(this, 'btn:square', 'ui_buttons', UI.buttons.square);
    this.render();
    const unsub = state.on((ev) => {
      if (ev === 'team_changed' || ev === 'slot_unlocked' || ev === 'coins_changed') this.render();
    });
    this.events.once('shutdown', () => unsub());
  }

  private T(x: number, y: number, s: string, sc = 1, color?: number) {
    const t = pixelFont.text(this, x, y, s, { scale: sc }).setDepth(86);
    if (color !== undefined) t.setTint(color);
    this.content.push(t);
    return t;
  }

  private render() {
    this.content.forEach((o) => o.destroy());
    this.content = [];
    const { width: w, height: h } = this.scale;
    const owned = Object.values(state.heroes);

    for (let slot = 0; slot < 3; slot++) {
      const ry = h * 0.24 + slot * 108;
      const row = windowFrame(this, w / 2, ry, 'charRowEmpty', 3).setDepth(81);
      this.content.push(row);
      const unlocked = state.team.unlocked[slot];
      const heroId = state.team.slots[slot];
      const hero = heroId ? state.heroes[heroId] : null;

      this.T(w / 2 - 160, ry - 8, `S${slot + 1}`, 1, unlocked ? 0x6fd06f : 0x8a7f6a);

      if (!unlocked) {
        const req = state.slotRequirements(slot);
        this.T(w / 2 + 10, ry - 7, `REQ NV ${req.minKingLevel}`, 1, 0x3a2a1a);
        this.T(w / 2 + 10, ry + 7, `${req.coinCost} COIN`, 1, 0x3a2a1a);
        const can = state.canUnlockSlot(slot);
        const b = this.add.image(w / 2 + 105, ry, 'btn:square').setScale(1.5).setDepth(85)
          .setTint(can ? 0xffffff : 0x777777)
          .setInteractive({ useHandCursor: true });
        this.content.push(b);
        this.T(w / 2 + 105, ry, 'ABRIR', 1).setDepth(86);
        b.on('pointerdown', () => state.unlockSlot(slot));
        continue;
      }

      if (hero) {
        const def = heroDef(hero.defId);
        // hero head inside the row's portrait circle
        const head = this.add.sprite(w / 2 - 81, ry, `${def.spriteSet}_idle_sheet`)
          .setFrame(0).setScale(1.1).setDepth(84);
        this.content.push(head);
        this.T(w / 2 + 10, ry - 7, `${hero.name.toUpperCase()} NV ${hero.level}`, 1, 0x3a2a1a);
        this.T(w / 2 + 10, ry + 7, def.className.toUpperCase(), 1, 0x3a2a1a);

        const active = state.team.activeIndex === slot;
        const a = this.add.image(w / 2 + 105, ry, 'btn:square').setScale(1.5).setDepth(85)
          .setTint(active ? 0x6fd06f : 0xffffff)
          .setInteractive({ useHandCursor: true });
        this.content.push(a);
        this.T(w / 2 + 105, ry, 'ATIVO', 1).setDepth(86);
        a.on('pointerdown', () => state.setActiveHero(slot));

        // tap the row body to cycle owned heroes in this slot
        const swap = this.add.rectangle(w / 2 - 20, ry, 170, 60, 0x000000, 0.0).setDepth(87)
          .setInteractive({ useHandCursor: true });
        this.content.push(swap);
        swap.on('pointerdown', () => {
          const idx = owned.findIndex((o) => o.id === hero.id);
          const next = owned[(idx + 1) % owned.length];
          state.assignHero(slot, next.id === hero.id ? null : next.id);
        });
      } else {
        this.T(w / 2 + 10, ry, 'VAZIO - TOQUE P/ POR HEROI', 1, 0x3a2a1a);
        const swap = this.add.rectangle(w / 2 - 20, ry, 170, 60, 0x000000, 0.0).setDepth(87)
          .setInteractive({ useHandCursor: true });
        this.content.push(swap);
        swap.on('pointerdown', () => {
          if (owned.length) state.assignHero(slot, owned[0].id);
        });
      }
    }
  }

  private close() {
    this.scene.stop('team');
  }
}

// Inventory overlay — real structured items: equip / sell (master prompt §70/§71).

import Phaser from 'phaser';
import { pixelFont } from '../../ui/PixelText';
import { bakeCrop, itemIcon, panel, RARITY_COLOR, hashIndex } from '../../ui/widgets';
import { UI } from '../../config/assets';
import { state } from '../../game/session';
import type { Equipment } from '../../core/types';

export class InventoryOverlay extends Phaser.Scene {
  private selected: Equipment | null = null;
  private content: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('inventory');
  }

  create() {
    const { width: w, height: h } = this.scale;
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72).setDepth(80).setInteractive()
      .on('pointerdown', () => this.close());

    panel(this, w / 2, h * 0.42, 'titled', 3).setDepth(81);

    bakeCrop(this, 'btn:square', 'ui_buttons', UI.buttons.square);
    // the baked panel art already shows a small X box at its top-right corner;
    // we overlay an invisible-ish hit target there.
    const close = this.add.image(w / 2 + 132, h * 0.42 - 138, 'btn:square').setScale(1.2).setDepth(83)
      .setAlpha(0.01)
      .setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.close());

    this.render();
    state.on((ev) => {
      if (ev === 'inventory_changed') this.render();
    });
  }

  private clearContent() {
    this.content.forEach((o) => o.destroy());
    this.content = [];
  }

  private T(x: number, y: number, s: string, sc = 1, color?: number) {
    const t = pixelFont.text(this, x, y, s, { scale: sc }).setDepth(85);
    if (color !== undefined) t.setTint(color);
    this.content.push(t);
    return t;
  }

  private render() {
    this.clearContent();
    const { width: w, height: h } = this.scale;
    const hero = state.activeHero();
    const top = h * 0.42 - 108;

    this.T(w / 2, top, `MOCHILA (${state.inventory.length})  -  HEROI: ${hero?.name.toUpperCase() ?? '-'}`);

    const cols = 5;
    const cell = 52;
    const startX = w / 2 - ((cols - 1) * cell) / 2;
    const startY = top + 34;
    state.inventory.slice(0, 15).forEach((item, i) => {
      const cx = startX + (i % cols) * cell;
      const cy = startY + Math.floor(i / cols) * cell;
      const ic = itemIcon(this, cx, cy, hashIndex(item.id, 20), 2)
        .setDepth(85)
        .setTint(RARITY_COLOR[item.rarity])
        .setInteractive({ useHandCursor: true });
      ic.on('pointerdown', () => {
        this.selected = item;
        this.render();
      });
      this.content.push(ic);
    });

    // detail + actions
    const dy = startY + 3 * cell + 26;
    if (this.selected && state.inventory.some((i) => i.id === this.selected!.id)) {
      const it = this.selected;
      this.T(w / 2, dy, `${it.slot.toUpperCase()} ${it.rarity.toUpperCase()} NV ${it.level}`, 1, RARITY_COLOR[it.rarity]);
      this.T(
        w / 2, dy + 14,
        `ATK ${it.stats.attack} DEF ${it.stats.defense} HP ${it.stats.hp} CRIT ${Math.round(it.stats.crit * 100)}%`,
      );
      this.T(w / 2, dy + 27, `QUALIDADE ${Math.round(it.quality * 100)}%  VENDA ${it.sellValue}`);

      const eq = this.add.image(w / 2 - 70, dy + 48, 'btn:square').setScale(1.6).setDepth(85)
        .setInteractive({ useHandCursor: true });
      this.content.push(eq);
      this.T(w / 2 - 70, dy + 48, 'EQUIPAR', 1).setDepth(86);
      eq.on('pointerdown', () => {
        if (hero) {
          state.equipItem(it.id, hero.id);
          this.selected = null;
        }
      });

      const sell = this.add.image(w / 2 + 70, dy + 48, 'btn:square').setScale(1.6).setDepth(85)
        .setInteractive({ useHandCursor: true });
      this.content.push(sell);
      this.T(w / 2 + 70, dy + 48, 'VENDER', 1).setDepth(86);
      sell.on('pointerdown', () => {
        state.sellItem(it.id);
        this.selected = null;
      });
    } else {
      this.T(w / 2, dy + 20, 'TOQUE EM UM ITEM PARA VER DETALHES');
    }

    // equipped strip
    if (hero) {
      const ey = h * 0.42 + 132;
      const eqs = ['weapon', 'armor', 'accessory'] as const;
      eqs.forEach((slot, i) => {
        const e = hero.equipment[slot];
        const x = w / 2 + (i - 1) * 90;
        this.T(x, ey, slot.slice(0, 3).toUpperCase(), 1);
        if (e) {
          this.T(x, ey + 12, e.rarity.slice(0, 4).toUpperCase(), 1, RARITY_COLOR[e.rarity]);
        } else {
          this.T(x, ey + 12, '--', 1);
        }
      });
    }
  }

  private close() {
    this.scene.stop('inventory');
  }
}

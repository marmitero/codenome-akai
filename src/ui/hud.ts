// Shared HUD pieces composed from the pack's GUI art (master prompt §69).

import Phaser from 'phaser';
import { UI } from '../config/assets';
import { pixelFont } from './PixelText';
import { bakeCrop, icon } from './widgets';
import { state } from '../game/session';

export interface HudRefs {
  coins: Phaser.GameObjects.Image | null;
  level: Phaser.GameObjects.Image | null;
  destroy(): void;
  refresh(): void;
}

/** Compact top strip: king identity + account level + coins. */
export function kingBar(scene: Phaser.Scene): HudRefs {
  const w = scene.scale.width;
  const objs: Phaser.GameObjects.GameObject[] = [];
  const bg = scene.add.rectangle(w / 2, 26, w, 52, 0x1a1420, 0.92).setDepth(40).setScrollFactor(0);
  const underline = scene.add.rectangle(w / 2, 52, w, 2, 0x6d5a3a).setDepth(40).setScrollFactor(0);
  objs.push(bg, underline);

  const king = state.king!;
  const portrait = scene.add
    .sprite(30, 27, `${king.skin === 'male' ? 'hero_male' : 'hero_female'}_idle_sheet`)
    .setFrame(0)
    .setScale(0.9)
    .setDepth(41)
    .setScrollFactor(0);
  objs.push(portrait);

  const name = pixelFont.text(scene, 58, 16, king.name, { scale: 1, originX: 0 });
  name.setDepth(41).setScrollFactor(0);
  objs.push(name);

  let level: Phaser.GameObjects.Image | null = null;
  level = pixelFont.setText(scene, level, 58, 34, `REI NV ${king.level}`, { scale: 1, originX: 0 });
  level.setDepth(41).setScrollFactor(0);
  objs.push(level);

  const coinIcon = icon(scene, w - 96, 26, 'coin', 2).setDepth(41).setScrollFactor(0);
  objs.push(coinIcon);
  let coins: Phaser.GameObjects.Image | null = pixelFont.text(scene, w - 84, 26, `${king.coins}`, {
    scale: 1,
    originX: 0,
  });
  coins.setDepth(41).setScrollFactor(0);
  objs.push(coins);

  const refs: HudRefs = {
    coins,
    level,
    refresh() {
      const k = state.king!;
      const nl = pixelFont.setText(scene, refs.level, 58, 34, `REI NV ${k.level}`, { scale: 1, originX: 0 });
      nl.setDepth(41).setScrollFactor(0);
      refs.level = nl;
      if (!objs.includes(nl)) objs.push(nl);
      const nc = pixelFont.setText(scene, refs.coins, w - 84, 26, `${k.coins}`, { scale: 1, originX: 0 });
      nc.setDepth(41).setScrollFactor(0);
      refs.coins = nc;
      if (!objs.includes(nc)) objs.push(nc);
    },
    destroy() {
      objs.forEach((o) => o.destroy());
    },
  };
  return refs;
}

/** Bottom navigation: square art buttons + short pixel labels. */
export function navButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Container {
  bakeCrop(scene, 'btn:square', 'ui_buttons', UI.buttons.square);
  const btn = scene.add.image(0, 0, 'btn:square').setScale(2);
  btn.setInteractive({ useHandCursor: true });
  const lbl = pixelFont.text(scene, 0, 30, label, { scale: 1 });
  const c = scene.add.container(x, y, [btn, lbl]).setDepth(45).setScrollFactor(0);
  btn.on('pointerdown', () => {
    btn.setScale(1.8);
    scene.time.delayedCall(120, () => btn.setScale(2));
    onClick();
  });
  return c;
}

/** A themed HP bar drawn with game colors. */
export function hpBar(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
): {
  obj: Phaser.GameObjects.Container;
  set(cur: number, max: number): void;
  setPosition(x: number, y: number): void;
  destroy(): void;
} {
  const bgRect = scene.add.rectangle(0, 0, width, 6, 0x1c1420).setStrokeStyle(1, 0x000000);
  const fillRect = scene.add.rectangle(-width / 2 + 1, 0, width - 2, 4, 0x63d05c).setOrigin(0, 0.5);
  const container = scene.add.container(x, y, [bgRect, fillRect]).setDepth(30);
  return {
    obj: container,
    set(cur: number, max: number) {
      const ratio = Phaser.Math.Clamp(cur / Math.max(1, max), 0, 1);
      fillRect.setSize(Math.max(0, (width - 2) * ratio), 4);
      fillRect.setFillStyle(ratio > 0.5 ? 0x63d05c : ratio > 0.25 ? 0xd0b13c : 0xd0503c);
    },
    setPosition(nx: number, ny: number) {
      container.setPosition(nx, ny);
    },
    destroy() {
      container.destroy();
    },
  };
}

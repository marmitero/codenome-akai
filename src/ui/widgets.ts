// Art-based UI widgets (master prompt §59/§61: GUI is game art, not web CSS).

import Phaser from 'phaser';
import { UI } from '../config/assets';

/** Bake a crop of a loaded sheet into its own NEAREST texture. */
export function bakeCrop(
  scene: Phaser.Scene,
  key: string,
  sheetKey: string,
  crop: { x: number; y: number; w: number; h: number },
) {
  if (scene.textures.exists(key)) return;
  const src = scene.textures.get(sheetKey).getSourceImage() as HTMLImageElement;
  const canvas = document.createElement('canvas');
  canvas.width = crop.w;
  canvas.height = crop.h;
  canvas.getContext('2d')!.drawImage(src, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
  scene.textures.addCanvas(key, canvas);
  scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
}

export function button(
  scene: Phaser.Scene,
  x: number,
  y: number,
  labelKey: keyof typeof UI.buttons | string,
  onClick: () => void,
  scale = 3,
): Phaser.GameObjects.Image {
  const crop = (UI.buttons as Record<string, { x: number; y: number; w: number; h: number }>)[labelKey as string];
  const key = `btn:${labelKey}`;
  if (!scene.textures.exists(key)) {
    const src = scene.textures.get('ui_buttons').getSourceImage() as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext('2d')!.drawImage(src, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    scene.textures.addCanvas(key, canvas);
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  const btn = scene.add.image(x, y, key).setScale(scale).setInteractive({ useHandCursor: true });
  btn.on('pointerdown', () => {
    btn.setScale(scale * 0.92);
  });
  btn.on('pointerup', () => {
    btn.setScale(scale);
    onClick();
  });
  btn.on('pointerout', () => btn.setScale(scale));
  return btn;
}

export function panel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  kind: 'empty' | 'grid' | 'titled',
  scale = 3,
): Phaser.GameObjects.Image {
  const crop = UI.panels[kind];
  const key = `panel:${kind}`;
  if (!scene.textures.exists(key)) {
    const src = scene.textures.get('ui_inventory').getSourceImage() as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext('2d')!.drawImage(src, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    scene.textures.addCanvas(key, canvas);
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  return scene.add.image(x, y, kind === 'grid' ? key : key).setScale(scale);
}

export function icon(
  scene: Phaser.Scene,
  x: number,
  y: number,
  cropKey: 'coin' | 'diamond',
  scale = 2,
): Phaser.GameObjects.Image {
  const crop = UI.icons[cropKey];
  const key = `icon:${cropKey}`;
  if (!scene.textures.exists(key)) {
    const src = scene.textures.get('ui_inventory').getSourceImage() as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext('2d')!.drawImage(src, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    scene.textures.addCanvas(key, canvas);
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  return scene.add.image(x, y, key).setScale(scale);
}

/** Prominent green navigation arrow from the GUI pack (left = flipped right). */
export function arrowButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  dir: 'left' | 'right',
  onClick: () => void,
  scale = 4,
): Phaser.GameObjects.Image {
  const crop = UI.icons.arrowRight;
  const key = 'icon:arrowGreen';
  bakeCrop(scene, key, 'ui_buttons', crop);
  const btn = scene.add.image(x, y, key).setScale(scale).setInteractive({ useHandCursor: true });
  if (dir === 'left') btn.setFlipX(true);
  btn.on('pointerdown', () => btn.setScale(scale * 0.85));
  btn.on('pointerup', () => btn.setScale(scale));
  btn.on('pointerout', () => btn.setScale(scale));
  btn.on('pointerdown', onClick);
  return btn;
}

export function itemIcon(
  scene: Phaser.Scene,
  x: number,
  y: number,
  index: number,
  scale = 2,
): Phaser.GameObjects.Image {
  const crop = UI.icons.items[index % UI.icons.items.length];
  const key = `itemicon:${index % UI.icons.items.length}`;
  if (!scene.textures.exists(key)) {
    const src = scene.textures.get('ui_inventory').getSourceImage() as HTMLImageElement;
    const canvas = document.createElement('canvas');
    canvas.width = crop.w;
    canvas.height = crop.h;
    canvas.getContext('2d')!.drawImage(src, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    scene.textures.addCanvas(key, canvas);
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  return scene.add.image(x, y, key).setScale(scale);
}

/** Full window frame from the GUI pack (each overlay picks its proper frame). */
export function windowFrame(
  scene: Phaser.Scene,
  x: number,
  y: number,
  kind: string,
  scale = 3,
): Phaser.GameObjects.Image {
  const def = UI.windows[kind];
  const key = `win:${kind}`;
  bakeCrop(scene, key, def.sheet, def);
  return scene.add.image(x, y, key).setScale(scale);
}

/** Rarity → item icon index + tint for consistent visual language. */
export const RARITY_COLOR: Record<string, number> = {
  common: 0xb9a77c,
  uncommon: 0x6fd06f,
  rare: 0x5aa8ff,
  epic: 0xb46bff,
  legendary: 0xffa53d,
  celestial: 0x6ff2e8,
};

export function hashIndex(str: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

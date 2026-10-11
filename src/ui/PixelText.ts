// Bitmap font built from the pack's pixel alphabet (Text1.png).
//
// FASE 0 inspection (tools/components.py) showed the sheet is a FIXED grid:
// 7 color variants stacked vertically (46px each); inside a variant, 5 rows at
// y = 1/10/19/28/37 with a 7px column pitch starting at x = 1.
// Rows: ABCDEFGHIJ / KLMNOPQRST / UVWXYZ / 1234567890 / .,:?!()+-=
// We therefore slice glyphs deterministically — no runtime labeling needed.

import Phaser from 'phaser';

interface Rect { x: number; y: number; w: number; h: number }

const ROWS = ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ', '1234567890', '.,:?!()+-='];
const ROW_Y = [1, 10, 19, 28, 37];
const ROW_H = [7, 7, 7, 7, 8];
const PITCH = 7;
const GLYPH_W = 6;
const X0 = 1;
const VARIANT_H = 46;

export class PixelFont {
  private glyphs = new Map<string, Rect>();
  ready = false;

  /** variant 0..6 selects the color style of the alphabet */
  build(_scene: Phaser.Scene, _textureKey: string, variant = 4) {
    this.glyphs.clear();
    const off = variant * VARIANT_H;
    ROWS.forEach((chars, r) => {
      for (let i = 0; i < chars.length; i++) {
        this.glyphs.set(chars[i], { x: X0 + i * PITCH, y: off + ROW_Y[r], w: GLYPH_W, h: ROW_H[r] });
      }
    });
    this.ready = this.glyphs.size > 30;
  }

  measure(text: string, scale = 1): { w: number; h: number } {
    let w = 0;
    for (const ch of text.toUpperCase()) {
      w += ch === ' ' ? 5 : PITCH;
    }
    return { w: Math.max(1, w) * scale, h: 8 * scale };
  }

  /** Render a string into a cached texture and return a Phaser Image. */
  text(
    scene: Phaser.Scene,
    x: number,
    y: number,
    value: string,
    opts: { scale?: number; originX?: number; originY?: number } = {},
  ): Phaser.GameObjects.Image {
    const scale = opts.scale ?? 2;
    const key = `pxt:${scale}:${value}`;
    if (!scene.textures.exists(key)) {
      const upper = value.toUpperCase();
      const w = Math.max(1, upper.length * PITCH);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = 9;
      const ctx = canvas.getContext('2d')!;
      const src = scene.textures.get('__font_src').getSourceImage() as HTMLImageElement;
      let px = 0;
      for (const ch of upper) {
        const g = this.glyphs.get(ch);
        if (!g) {
          if (ch === ' ') px += 5;
          continue;
        }
        ctx.drawImage(src, g.x, g.y, g.w, g.h, px, 1, g.w, g.h);
        px += PITCH;
      }
      scene.textures.addCanvas(key, canvas);
      scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
    const img = scene.add.image(x, y, key);
    img.setOrigin(opts.originX ?? 0.5, opts.originY ?? 0.5);
    img.setScale(scale);
    return img;
  }

  /** Update-or-create a text image (for counters). Returns the image. */
  setText(
    scene: Phaser.Scene,
    existing: Phaser.GameObjects.Image | null,
    x: number,
    y: number,
    value: string,
    opts: { scale?: number; originX?: number; originY?: number } = {},
  ): Phaser.GameObjects.Image {
    const scale = opts.scale ?? 2;
    const key = `pxt:${scale}:${value}`;
    if (existing && existing.texture.key === key) {
      existing.setPosition(x, y);
      return existing;
    }
    if (existing) existing.destroy();
    return this.text(scene, x, y, value, opts);
  }
}

export const pixelFont = new PixelFont();

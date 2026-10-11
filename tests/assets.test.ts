// Asset audit — keeps the manifest honest: every referenced file must exist,
// every GUI crop must be inside its sheet, and the public/ pipeline list must
// cover everything the game loads.

import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPRITE_SETS, UI, TILESET, DECOR, KING_PORTRAITS, type Crop } from '../src/config/assets';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function pngSize(path: string): { w: number; h: number } {
  const b = readFileSync(path);
  expect(b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(true);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

describe('manifest → disco', () => {
  it('todos os spritesheets de personagens/mobs existem', () => {
    for (const set of Object.values(SPRITE_SETS)) {
      for (const [anim, file] of Object.entries(set.files)) {
        const p = join(ROOT, set.prefix, file);
        expect(existsSync(p), `${set.key}.${anim} → ${p}`).toBe(true);
        const { w, h } = pngSize(p);
        expect(w % 64, `${file} width multiple of 64`).toBe(0);
        expect(h, `${file} height (4 direction rows)`).toBe(256);
      }
    }
  });

  it('folhas de GUI/tileset/retratos existem', () => {
    const files = [
      UI.buttonsSheet, UI.inventorySheet, UI.charPanel, UI.iconsSheet, UI.fontSheet,
      UI.levelsSheet, UI.settingsSheet, UI.mainMenuSheet,
      TILESET.cursedGround, DECOR.rock1, DECOR.rock2, DECOR.bones,
      ...KING_PORTRAITS.map((p) => p.file),
    ];
    for (const f of files) expect(existsSync(join(ROOT, f)), f).toBe(true);
  });

  it('crops de botões/ícones/janelas dentro dos limites das folhas', () => {
    const inSheet = (sheet: string, c: Crop) => {
      const { w, h } = pngSize(join(ROOT, sheet));
      expect(c.x >= 0 && c.y >= 0 && c.x + c.w <= w && c.y + c.h <= h,
        `crop ${JSON.stringify(c)} in ${sheet} (${w}x${h})`).toBe(true);
    };
    for (const c of Object.values(UI.buttons)) inSheet(UI.buttonsSheet, c);
    for (const c of Object.values(UI.panels)) inSheet(UI.inventorySheet, c);
    inSheet(UI.inventorySheet, UI.icons.coin);
    inSheet(UI.inventorySheet, UI.icons.diamond);
    inSheet(UI.buttonsSheet, UI.icons.arrowUp);
    inSheet(UI.buttonsSheet, UI.icons.arrowRight);
    inSheet(UI.buttonsSheet, UI.icons.arrowDown);
    for (const c of UI.icons.items) inSheet(UI.inventorySheet, c);
    for (const c of Object.values(UI.windows)) inSheet(sheetOf(c), c);
  });

  it('tiles de chão dentro do tileset', () => {
    const { w, h } = pngSize(join(ROOT, TILESET.cursedGround));
    for (const t of [...TILESET.flatTiles, TILESET.bushTile, TILESET.bushTileAlt]) {
      expect((t.x + 1) * 16 <= w && (t.y + 1) * 16 <= h).toBe(true);
    }
  });
});

function sheetOf(c: Crop & { sheet: string }): string {
  const map: Record<string, string> = {
    ui_levels: UI.levelsSheet,
    ui_settings: UI.settingsSheet,
    ui_mainmenu: UI.mainMenuSheet,
    ui_charpanel: UI.charPanel,
  };
  return map[c.sheet];
}

describe('pipeline public/ cobre tudo que o jogo carrega', () => {
  const list = JSON.parse(readFileSync(join(ROOT, 'tools', 'asset_list.json'), 'utf8'));
  it('spriteDirs cobre todos os prefixes dos sets', () => {
    for (const set of Object.values(SPRITE_SETS)) {
      expect(list.spriteDirs, set.key).toContain(set.prefix);
    }
  });
  it('singleFiles cobre GUI/tileset/retratos', () => {
    const singles = [
      UI.buttonsSheet, UI.inventorySheet, UI.charPanel, UI.iconsSheet, UI.fontSheet,
      UI.levelsSheet, UI.settingsSheet, UI.mainMenuSheet,
      TILESET.cursedGround, DECOR.rock1, DECOR.rock2, DECOR.bones,
      ...KING_PORTRAITS.map((p) => p.file),
    ];
    for (const f of singles) expect(list.singleFiles, f).toContain(f);
  });
});

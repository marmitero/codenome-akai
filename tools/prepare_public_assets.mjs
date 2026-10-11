#!/usr/bin/env node
// Reproducible asset pipeline (master prompt §61) — Node version.
// Copies ONLY the files referenced by the game (tools/asset_list.json) into
// public/ so `vite build` ships a playable production bundle.
// (O modo dev NÃO precisa disso: o vite dev serve os assets da raiz.)

import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const list = JSON.parse(
  // @ts-ignore
  (await import('node:fs')).readFileSync(join(root, 'tools', 'asset_list.json'), 'utf8'),
);

const pub = join(root, 'public');
let count = 0;

for (const dir of list.spriteDirs) {
  const srcDir = join(root, dir);
  if (!existsSync(srcDir)) {
    console.error('MISSING DIR', dir);
    continue;
  }
  for (const f of readdirSync(srcDir).sort()) {
    if (!f.toLowerCase().endsWith('.png')) continue;
    const dst = join(pub, dir, f);
    mkdirSync(dirname(dst), { recursive: true });
    cpSync(join(srcDir, f), dst);
    count++;
  }
}

for (const f of list.singleFiles) {
  const src = join(root, f);
  if (!existsSync(src)) {
    console.error('MISSING FILE', f);
    continue;
  }
  const dst = join(pub, f);
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(src, dst);
  count++;
}

console.log(`copied ${count} assets into public/`);

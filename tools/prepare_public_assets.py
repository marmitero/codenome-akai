#!/usr/bin/env python3
"""Reproducible asset pipeline (master prompt §61) — Python mirror.
A fonte da verdade da lista é tools/asset_list.json (usada também pela
versão Node: tools/prepare_public_assets.mjs)."""
import os, shutil, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
LIST = json.load(open(os.path.join(ROOT, 'tools', 'asset_list.json')))

count = 0
for d in LIST['spriteDirs']:
    src_dir = os.path.join(ROOT, d)
    if not os.path.isdir(src_dir):
        print('MISSING DIR', d)
        continue
    for f in sorted(os.listdir(src_dir)):
        if f.lower().endswith('.png'):
            dst = os.path.join(PUB, d, f)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(src_dir, f), dst)
            count += 1

for f in LIST['singleFiles']:
    src = os.path.join(ROOT, f)
    if not os.path.exists(src):
        print('MISSING FILE', f)
        continue
    dst = os.path.join(PUB, f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    count += 1

print(f'copied {count} assets into public/')

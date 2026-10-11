#!/usr/bin/env python3
"""Reproducible asset pipeline (master prompt §61): originals stay untouched;
only the files referenced by src/config/assets.ts are copied into public/
so that `vite build` ships a playable production bundle."""
import os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')

SPRITE_DIRS = [
    'free-swordsman-1-3-level-pixel-top-down-sprite-character/PNG/Swordsman_lvl1/With_shadow',
    'free-base-4-direction-male-character-pixel-art/PNG/Sword/With_shadow',
    'free-base-4-direction-female-character-pixel-art/PNG/Sword/With_shadow',
    'free-vampire-4-direction-pixel-character-sprite-pack/PNG/Vampires1/With_shadow',
    'free-vampire-4-direction-pixel-character-sprite-pack/PNG/Vampires2/With_shadow',
    'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/With_shadow',
    'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime2/With_shadow',
    'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime3/With_shadow',
    'free-top-down-orc-game-character-pixel-art/PNG/Orc1/With_shadow',
    'free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/With_shadow',
]

SINGLE_FILES = [
    'free-basic-pixel-art-ui-for-rpg/PNG/Buttons.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Inventory.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/character_panel.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Icons.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Text1.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Levels.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Settings.png',
    'free-basic-pixel-art-ui-for-rpg/PNG/Main_menu.png',
    'generated/king_portraits/king_m1.png',
    'generated/king_portraits/king_m2.png',
    'generated/king_portraits/king_f1.png',
    'generated/king_portraits/king_f2.png',
    'free-cursed-land-top-down-pixel-art-tileset/PNG/Ground.png',
    'free-rocks-and-stones-top-down-pixel-art/PNG/Objects_separately/Rock1_3.png',
    'free-rocks-and-stones-top-down-pixel-art/PNG/Objects_separately/Rock1_4.png',
    'free-cursed-land-top-down-pixel-art-tileset/PNG/Objects_separetely/Bones_shadow1_1.png',
]

count = 0
for d in SPRITE_DIRS:
    src_dir = os.path.join(ROOT, d)
    if not os.path.isdir(src_dir):
        print('MISSING DIR', d); continue
    for f in sorted(os.listdir(src_dir)):
        if f.lower().endswith('.png'):
            dst = os.path.join(PUB, d, f)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(src_dir, f), dst)
            count += 1

for f in SINGLE_FILES:
    src = os.path.join(ROOT, f)
    if not os.path.exists(src):
        print('MISSING FILE', f); continue
    dst = os.path.join(PUB, f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    count += 1

print(f'copied {count} assets into public/')

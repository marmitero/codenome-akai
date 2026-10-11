// Codenome: AKAI — ASSET MANIFEST (stable paths, semantic names).
//
// Generated from the FASE 0 inspection of the repository packs (see
// docs/ART_ASSET_AUDIT.md). Originals are never renamed/moved; the game only
// references them. All spritesheet characters use 64x64 frames with row order
// [down, left, right, up] (verified visually with tools/frame_probe.py).

export const FRAME = 64;
export const DIRS = ['down', 'left', 'right', 'up'] as const;
export type Dir = (typeof DIRS)[number];

export interface SpriteSetDef {
  key: string;
  /** prefix directory (relative to repo root, served by vite) */
  prefix: string;
  /** anim -> file name */
  files: Record<string, string>;
}

const w = (p: string, n: string) => ({
  idle: `${n}_Idle_with_shadow.png`,
  run: `${n}_Run_with_shadow.png`,
  walk: `${n}_Walk_with_shadow.png`,
  attack: `${n}_Attack_with_shadow.png`,
  hurt: `${n}_Hurt_with_shadow.png`,
  death: `${n}_Death_with_shadow.png`,
  _prefix: p,
});

function set(key: string, prefix: string, files: Record<string, string>): SpriteSetDef {
  return { key, prefix, files };
}

// NOTE: some packs use lowercase/different file names; entries below were
// verified against the actual files on disk.
export const SPRITE_SETS: Record<string, SpriteSetDef> = {
  hero_swordsman: set(
    'hero_swordsman',
    'free-swordsman-1-3-level-pixel-top-down-sprite-character/PNG/Swordsman_lvl1/With_shadow',
    {
      idle: 'Swordsman_lvl1_Idle_with_shadow.png',
      run: 'Swordsman_lvl1_Run_with_shadow.png',
      walk: 'Swordsman_lvl1_Walk_with_shadow.png',
      attack: 'Swordsman_lvl1_attack_with_shadow.png',
      hurt: 'Swordsman_lvl1_Hurt_with_shadow.png',
      death: 'Swordsman_lvl1_Death_with_shadow.png',
    },
  ),
  hero_male: set('hero_male', 'free-base-4-direction-male-character-pixel-art/PNG/Sword/With_shadow', {
    idle: 'Sword_Idle_with_shadow.png',
    run: 'Sword_Run_with_shadow.png',
    walk: 'Sword_Walk_with_shadow.png',
    attack: 'Sword_attack_with_shadow.png',
    hurt: 'Sword_Hurt_with_shadow.png',
    death: 'Sword_Death_with_shadow.png',
  }),
  hero_female: set('hero_female', 'free-base-4-direction-female-character-pixel-art/PNG/Sword/With_shadow', {
    idle: 'Sword_Idle_with_shadow.png',
    run: 'Sword_Run_with_shadow.png',
    walk: 'Sword_Walk_with_shadow.png',
    attack: 'Sword_attack_with_shadow.png',
    hurt: 'Sword_Hurt_with_shadow.png',
    death: 'Sword_Death_with_shadow.png',
  }),
  hero_vampire: set('hero_vampire', 'free-vampire-4-direction-pixel-character-sprite-pack/PNG/Vampires1/With_shadow', {
    idle: 'Vampires1_Idle_with_shadow.png',
    run: 'Vampires1_Run_with_shadow.png',
    walk: 'Vampires1_Walk_with_shadow.png',
    attack: 'Vampires1_Attack_with_shadow.png',
    hurt: 'Vampires1_Hurt_with_shadow.png',
    death: 'Vampires1_Death_with_shadow.png',
  }),
  mob_slime1: set('mob_slime1', 'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime1/With_shadow', {
    idle: 'Slime1_Idle_with_shadow.png',
    run: 'Slime1_Run_with_shadow.png',
    walk: 'Slime1_Walk_with_shadow.png',
    attack: 'Slime1_Attack_with_shadow.png',
    hurt: 'Slime1_Hurt_with_shadow.png',
    death: 'Slime1_Death_with_shadow.png',
  }),
  mob_slime2: set('mob_slime2', 'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime2/With_shadow', {
    idle: 'Slime2_Idle_with_shadow.png',
    run: 'Slime2_Run_with_shadow.png',
    walk: 'Slime2_Walk_with_shadow.png',
    attack: 'Slime2_Attack_with_shadow.png',
    hurt: 'Slime2_Hurt_with_shadow.png',
    death: 'Slime2_Death_with_shadow.png',
  }),
  mob_slime3: set('mob_slime3', 'free-slime-mobs-pixel-art-top-down-sprite-pack/PNG/Slime3/With_shadow', {
    idle: 'Slime3_Idle_with_shadow.png',
    run: 'Slime3_Run_with_shadow.png',
    walk: 'Slime3_Walk_with_shadow.png',
    attack: 'Slime3_Attack_with_shadow.png',
    hurt: 'Slime3_Hurt_with_shadow.png',
    death: 'Slime3_Death_with_shadow.png',
  }),
  mob_orc1: set('mob_orc1', 'free-top-down-orc-game-character-pixel-art/PNG/Orc1/With_shadow', {
    idle: 'orc1_idle_with_shadow.png',
    run: 'orc1_run_with_shadow.png',
    walk: 'orc1_walk_with_shadow.png',
    attack: 'orc1_attack_with_shadow.png',
    hurt: 'orc1_hurt_with_shadow.png',
    death: 'orc1_death_with_shadow.png',
  }),
  mob_plant1: set('mob_plant1', 'free-predator-plant-mobs-pixel-art-pack/PNG/Plant1/With_shadow', {
    idle: 'Plant1_Idle_with_shadow.png',
    run: 'Plant1_Run_with_shadow.png',
    walk: 'Plant1_Walk_with_shadow.png',
    attack: 'Plant1_Attack_with_shadow.png',
    hurt: 'Plant1_Hurt_with_shadow.png',
    death: 'Plant1_Death_with_shadow.png',
  }),
  mob_vampire: set('mob_vampire', 'free-vampire-4-direction-pixel-character-sprite-pack/PNG/Vampires2/With_shadow', {
    idle: 'Vampires2_Idle_with_shadow.png',
    run: 'Vampires2_Run_with_shadow.png',
    walk: 'Vampires2_Walk_with_shadow.png',
    attack: 'Vampires2_Attack_with_shadow.png',
    hurt: 'Vampires2_Hurt_with_shadow.png',
    death: 'Vampires2_Death_with_shadow.png',
  }),
};

/** Rect crops (x, y, w, h) inside a sheet, in source pixels. */
export interface Crop { x: number; y: number; w: number; h: number }

export const UI = {
  buttonsSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Buttons.png',
  inventorySheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Inventory.png',
  charPanel: 'free-basic-pixel-art-ui-for-rpg/PNG/character_panel.png',
  iconsSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Icons.png',
  fontSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Text1.png',
  levelsSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Levels.png',
  settingsSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Settings.png',
  mainMenuSheet: 'free-basic-pixel-art-ui-for-rpg/PNG/Main_menu.png',

  buttons: {
    resume: { x: 13, y: 274, w: 56, h: 12 },
    restart: { x: 13, y: 290, w: 56, h: 12 },
    settings: { x: 13, y: 306, w: 56, h: 12 },
    levels: { x: 13, y: 322, w: 56, h: 12 },
    inventory: { x: 13, y: 338, w: 56, h: 12 },
    equipment: { x: 13, y: 354, w: 56, h: 12 },
    shop: { x: 13, y: 370, w: 56, h: 12 },
    craft: { x: 13, y: 386, w: 56, h: 12 },
    quit: { x: 13, y: 402, w: 56, h: 12 },
    decline: { x: 4, y: 258, w: 39, h: 13 },
    create: { x: 18, y: 468, w: 43, h: 14 },
    save: { x: 212, y: 258, w: 39, h: 13 },
    blankWide: { x: 16, y: 435, w: 128, h: 12 },
    blank: { x: 18, y: 500, w: 43, h: 14 },
    square: { x: 13, y: 12, w: 22, h: 23 },
    again: { x: 210, y: 12, w: 29, h: 13 },
    next: { x: 210, y: 44, w: 29, h: 13 },
    buy: { x: 211, y: 170, w: 26, h: 14 },
  } as Record<string, Crop>,

  panels: {
    empty: { x: 7, y: 0, w: 98, h: 101 },
    grid: { x: 119, y: 0, w: 98, h: 101 },
    titled: { x: 231, y: 0, w: 98, h: 101 },
    small: { x: 7, y: 112, w: 34, h: 37 },
    titleBar: { x: 48, y: 112, w: 89, h: 16 },
    titleBarX: { x: 144, y: 112, w: 25, h: 16 },
  } as Record<string, Crop>,

  icons: {
    coin: { x: 243, y: 115, w: 10, h: 10 },
    diamond: { x: 260, y: 115, w: 9, h: 11 },
    // bright green arrows from Buttons.png (right-side cluster)
    arrowUp: { x: 352, y: 290, w: 13, h: 13 },
    arrowRight: { x: 359, y: 306, w: 9, h: 13 },
    arrowDown: { x: 355, y: 365, w: 13, h: 13 },
    items: [
      { x: 50, y: 130, w: 12, h: 12 },
      { x: 68, y: 130, w: 9, h: 11 },
      { x: 82, y: 130, w: 11, h: 11 },
      { x: 114, y: 130, w: 12, h: 12 },
      { x: 131, y: 130, w: 10, h: 12 },
      { x: 147, y: 130, w: 9, h: 12 },
      { x: 50, y: 147, w: 12, h: 11 },
      { x: 66, y: 146, w: 12, h: 12 },
      { x: 82, y: 147, w: 12, h: 11 },
      { x: 97, y: 145, w: 13, h: 13 },
      { x: 114, y: 146, w: 11, h: 11 },
      { x: 130, y: 147, w: 12, h: 11 },
      { x: 146, y: 146, w: 12, h: 12 },
      { x: 162, y: 146, w: 12, h: 12 },
      { x: 178, y: 145, w: 12, h: 14 },
      { x: 194, y: 147, w: 12, h: 11 },
      { x: 210, y: 146, w: 12, h: 12 },
      { x: 226, y: 146, w: 12, h: 12 },
      { x: 243, y: 146, w: 11, h: 12 },
      { x: 320, y: 144, w: 16, h: 16 },
    ] as Crop[],
  },

  /** Whole window frames — each overlay uses the frame that fits its purpose. */
  windows: {
    /** Levels sheet: blank / with 9 baked circles / with circles+arrows+quit */
    levelsBlank: { sheet: 'ui_levels', x: 7, y: 0, w: 114, h: 133 },
    levelsCircles: { sheet: 'ui_levels', x: 135, y: 0, w: 114, h: 133 },
    /** Settings sheet: blank body window (title bar without label) */
    settingsBlank: { sheet: 'ui_settings', x: 7, y: 0, w: 98, h: 149 },
    /** Main menu: blank tall window */
    menuBlank: { sheet: 'ui_mainmenu', x: 96, y: 4, w: 80, h: 168 },
    /** character_panel row with EMPTY portrait circle + colored bars */
    charRowEmpty: { sheet: 'ui_charpanel', x: 98, y: 34, w: 84, h: 30 },
    charRowFull: { sheet: 'ui_charpanel', x: 98, y: 2, w: 84, h: 30 },
  } as Record<string, Crop & { sheet: string }>,

  /** Interactive circle centers inside levelsCircles window (source px). */
  levelCircleCenters: [
    [13, 38], [49, 38], [85, 38],
    [13, 75], [49, 75], [85, 75],
    [13, 112], [49, 112], [85, 112],
  ] as [number, number][],
};

/** Generated royal bust portraits (bust only, magenta-keyed at boot). */
export const KING_PORTRAITS = [
  { id: 'm1', label: 'REI ALDAR', file: 'generated/king_portraits/king_m1.png' },
  { id: 'm2', label: 'REI BRANDO', file: 'generated/king_portraits/king_m2.png' },
  { id: 'f1', label: 'RAINHA VYRA', file: 'generated/king_portraits/king_f1.png' },
  { id: 'f2', label: 'RAINHA ISOLDE', file: 'generated/king_portraits/king_f2.png' },
];

export const TILESET = {
  cursedGround: 'free-cursed-land-top-down-pixel-art-tileset/PNG/Ground.png',
  /** verified flat walkable tiles (col,row in 16px grid) */
  flatTiles: [
    { x: 17, y: 1 },
    { x: 34, y: 4 },
    { x: 3, y: 2 },
    { x: 12, y: 2 },
  ],
  /** thorny bush tile used as map border/obstacle */
  bushTile: { x: 0, y: 0 },
  bushTileAlt: { x: 2, y: 0 },
  tileSize: 16,
};

export const DECOR = {
  rock1: 'free-rocks-and-stones-top-down-pixel-art/PNG/Objects_separately/Rock1_3.png',
  rock2: 'free-rocks-and-stones-top-down-pixel-art/PNG/Objects_separately/Rock1_4.png',
  bones: 'free-cursed-land-top-down-pixel-art-tileset/PNG/Objects_separetely/Bones_shadow1_1.png',
};

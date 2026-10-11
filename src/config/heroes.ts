// Codenome: AKAI — the 4 INITIAL HEROES.
// Each has real differences in role, stats, growth, skill and combat style
// (master prompt §10: never four visually-different but mechanically-identical chars).

import type { HeroDef } from '../core/types';

export const INITIAL_HEROES: HeroDef[] = [
  {
    defId: 'ferro',
    name: 'Ferro',
    className: 'Guerreiro',
    role: 'Melee bruiser: high HP and steady damage.',
    spriteSet: 'hero_swordsman',
    base: { attack: 14, defense: 8, hp: 120, crit: 0.06 },
    growth: { attack: 3.0, defense: 1.6, hp: 14, crit: 0.002 },
    skill: {
      id: 'golpe_poderoso',
      name: 'Golpe Poderoso',
      cooldownMs: 6000,
      damageMult: 2.2,
      healFraction: 0,
      hits: 1,
      lifesteal: 0,
    },
    weapon: 'espada',
    description: 'Um espadachim endurecido pela Torre. Aguenta punição e revida pesado.',
  },
  {
    defId: 'aldric',
    name: 'Aldric',
    className: 'Guardião',
    role: 'Tank: highest defense, sustains with royal blessing.',
    spriteSet: 'hero_male',
    base: { attack: 10, defense: 14, hp: 140, crit: 0.04 },
    growth: { attack: 2.2, defense: 2.6, hp: 18, crit: 0.0015 },
    skill: {
      id: 'benedicao_real',
      name: 'Bênção do Rei',
      cooldownMs: 8000,
      damageMult: 1.0,
      healFraction: 0.22,
      hits: 1,
      lifesteal: 0,
    },
    weapon: 'maca',
    description: 'Escudo do reino. Lento, duro, impossível de ignorar.',
  },
  {
    defId: 'lyra',
    name: 'Lyra',
    className: 'Duelista',
    role: 'Skirmisher: fast twin strikes and high critical.',
    spriteSet: 'hero_female',
    base: { attack: 12, defense: 6, hp: 95, crit: 0.16 },
    growth: { attack: 2.8, defense: 1.2, hp: 10, crit: 0.004 },
    skill: {
      id: 'laminas_gemeas',
      name: 'Lâminas Gêmeas',
      cooldownMs: 5000,
      damageMult: 1.2,
      healFraction: 0,
      hits: 2,
      lifesteal: 0,
    },
    weapon: 'adaga',
    description: 'Rápida e letal. Cada abertura vira dois cortes.',
  },
  {
    defId: 'vesper',
    name: 'Vesper',
    className: 'Ceifador',
    role: 'Sustain damage: drains life from every wound.',
    spriteSet: 'hero_vampire',
    base: { attack: 13, defense: 5, hp: 100, crit: 0.08 },
    growth: { attack: 3.0, defense: 1.0, hp: 11, crit: 0.0025 },
    skill: {
      id: 'drenar_vida',
      name: 'Drenar Vida',
      cooldownMs: 7000,
      damageMult: 1.6,
      healFraction: 0,
      hits: 1,
      lifesteal: 0.6,
    },
    weapon: 'garras',
    description: 'A noite que devolve a mordida. Rouba vida a cada golpe.',
  },
];

export const heroDef = (defId: string): HeroDef => {
  const d = INITIAL_HEROES.find((h) => h.defId === defId);
  if (!d) throw new Error(`unknown hero def ${defId}`);
  return d;
};

/** King skins: portrait art comes from the base character packs. */
export const KING_SKINS = [
  { id: 'male', label: 'Rei Aldar', spriteSet: 'hero_male' },
  { id: 'female', label: 'Rainha Vyra', spriteSet: 'hero_female' },
] as const;

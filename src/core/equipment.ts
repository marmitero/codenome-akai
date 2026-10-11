// Equipment generation & stat formula (master prompt §30-§38).
// FINAL = BASE × RARITY × X, with an INDIVIDUAL X per stat (never shared).

import { LOOT, ECONOMY } from '../config/balance';
import type { Equipment, EquipSlot, Rarity, StatBlock, XValues, WeaponType } from './types';
import type { Rng } from './rng';
import { uid } from './rng';

const WEAPONS: WeaponType[] = [
  'espada', 'adaga', 'machado', 'maca', 'besta', 'cajado', 'livro_arcano', 'luvas', 'garras',
];

/** base stat profile per slot (the BASE of BASE × RARITY × X) */
const SLOT_BASE: Record<EquipSlot, Partial<StatBlock>> = {
  weapon: { attack: 6, crit: 0.02 },
  armor: { defense: 5, hp: 20 },
  accessory: { attack: 2, defense: 2, hp: 10, crit: 0.01 },
};

export function rollRarity(rng: Rng): Rarity {
  const total = LOOT.rarityWeights.reduce((s, r) => s + r.weight, 0);
  let roll = rng() * total;
  for (const entry of LOOT.rarityWeights) {
    roll -= entry.weight;
    if (roll <= 0) return entry.rarity;
  }
  return 'common';
}

export function rollDrop(rng: Rng): boolean {
  return rng() < LOOT.dropChance;
}

export function generateEquipment(
  rng: Rng,
  level: number,
  opts: { rarity?: Rarity; slot?: EquipSlot } = {},
): Equipment {
  const rarity = opts.rarity ?? rollRarity(rng);
  const slots: EquipSlot[] = ['weapon', 'armor', 'accessory'];
  const slot = opts.slot ?? slots[Math.floor(rng() * slots.length)];

  const base = SLOT_BASE[slot];
  const levelScale = 1 + level * 0.12;
  const mult = LOOT.rarityMult[rarity];

  const stats: StatBlock = { attack: 0, defense: 0, hp: 0, crit: 0 };
  const xValues: XValues = {};

  (Object.keys(base) as (keyof StatBlock)[]).forEach((statKey) => {
    // Individual X per stat — each rolls independently.
    const x = LOOT.xMin + rng() * (LOOT.xMax - LOOT.xMin);
    const b = (base[statKey] ?? 0) * levelScale;
    const final = statKey === 'crit'
      ? +(b * mult * x).toFixed(3)
      : Math.max(1, Math.round(b * mult * x));
    stats[statKey] = final;
    xValues[statKey] = +x.toFixed(2);
  });

  const itemType = slot === 'weapon'
    ? WEAPONS[Math.floor(rng() * WEAPONS.length)]
    : slot;

  const xs = Object.values(xValues) as number[];
  const quality = +( (xs.reduce((s, v) => s + v, 0) / Math.max(1, xs.length) - LOOT.xMin) / (LOOT.xMax - LOOT.xMin) ).toFixed(2);

  const sellValue = Math.round(
    (ECONOMY.sellBase + level * ECONOMY.sellPerLevel) * mult * (0.6 + quality),
  );

  return {
    id: uid('eq'),
    ownerId: null,
    characterId: null,
    slot,
    itemType,
    level,
    rarity,
    stats,
    xValues,
    quality,
    sellValue,
    createdAt: Date.now(),
  };
}

export function totalStats(equips: (Equipment | null)[]): StatBlock {
  const t: StatBlock = { attack: 0, defense: 0, hp: 0, crit: 0 };
  for (const e of equips) {
    if (!e) continue;
    t.attack += e.stats.attack;
    t.defense += e.stats.defense;
    t.hp += e.stats.hp;
    t.crit += e.stats.crit;
  }
  return t;
}

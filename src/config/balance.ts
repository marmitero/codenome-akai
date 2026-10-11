// Codenome: AKAI — CENTRALIZED BALANCE CONFIGURATION.
//
// MANDATE (master prompt): probabilities, costs, fees and formulas must NEVER be
// hardcoded across the codebase. Every tunable lives here (or in a sibling config
// file) and is referenced by name. Values marked PENDING are temporary baselines
// documented in docs/PENDING_RULES.md.

import type { Rarity } from '../core/types';

export const TEAM_SLOTS = {
  slot1: { minKingLevel: 1, coinCost: 0 },
  slot2: { minKingLevel: 10, coinCost: 150_000 },
  slot3: { minKingLevel: 25, coinCost: 1_000_000 },
} as const;

export const MAX_TEAM_SIZE = 3;

export const LOOT = {
  /** baseline chance that a kill drops an equipment (5%) */
  dropChance: 0.05,
  /** rarity distribution WITHIN a dropped equipment (sums to 100) */
  rarityWeights: [
    { rarity: 'common', weight: 50 },
    { rarity: 'uncommon', weight: 30 },
    { rarity: 'rare', weight: 15 },
    { rarity: 'epic', weight: 4 },
    { rarity: 'legendary', weight: 0.9 },
    { rarity: 'celestial', weight: 0.1 },
  ] as { rarity: Rarity; weight: number }[],
  /** per-stat X roll range (each stat rolls independently) */
  xMin: 0.5,
  xMax: 2.2,
  /** rarity multipliers used in BASE × RARITY × X */
  rarityMult: {
    common: 1,
    uncommon: 1.25,
    rare: 1.6,
    epic: 2.1,
    legendary: 2.8,
    celestial: 3.8,
  } as Record<Rarity, number>,
} as const;

export const ECONOMY = {
  /** market fee consumed by the server on player trades (15%) */
  marketFee: 0.15,
  /** coin per kill baseline: base + floor * perFloor (±variance) */
  killCoinBase: 8,
  killCoinPerFloor: 4,
  killCoinVariance: 0.3,
  /** sell value factor for equipment */
  sellBase: 6,
  sellPerLevel: 3,
} as const;

export const XP = {
  /** hero xp needed to go from level L to L+1 */
  heroLevelCurve: (level: number) => Math.round(40 * Math.pow(level, 1.35)),
  /** king (account) xp needed to go from level L to L+1 */
  kingLevelCurve: (level: number) => Math.round(100 * Math.pow(level, 1.5)),
  /**
   * Per-member share of the XP pool, indexed by (team size - 1).
   * 1 hero → 100%; 2 → 60% each; 3 → 45% each.
   * PENDING: exact split is a design decision; monotonic decrease is mandatory.
   */
  teamSplitShares: [1.0, 0.6, 0.45],
  /** fraction of earned hero XP mirrored into king XP */
  kingXpShare: 0.25,
  heroXpPerKillBase: 22,
  heroXpPerKillPerFloor: 9,
} as const;

export const OFFLINE = {
  freeMaxSeconds: 2 * 3600,
  vipMaxSeconds: 8 * 3600,
  /** simulated idle yield per second, scaled by floor */
  coinPerSecondPerFloor: 0.8,
  xpPerSecondPerFloor: 0.9,
} as const;

export const COMBAT = {
  heroAttackCooldownMs: 900,
  enemyAttackCooldownMs: 1200,
  /** enemies may attack when within this distance (px) — ~1 tile */
  enemyAttackRange: 26,
  heroAttackRange: 30,
  enemyAggroRange: 5 * 16 * 2, // 5 tiles at 2x scale
  criticalMultiplier: 1.5,
  /** defense mitigation: dmg * base/(base+def) */
  defenseBase: 60,
} as const;

export const TOWER = {
  /** ms the hero spends "searching" when no live target is available */
  searchMs: 3000,
  /** ms before a defeated enemy respawns at its ORIGINAL spawn point */
  enemyRespawnMs: 5000,
  killsToClearFloor: 10,
  floorCount: 10,
  enemyCountPerFloor: 5,
  /** enemy stat scaling per floor */
  hpPerFloor: 14,
  atkPerFloor: 2.2,
  defPerFloor: 1.1,
} as const;

export const SAVE_KEY = 'codenome-akai:save:v1';
export const SAVE_VERSION = 1;

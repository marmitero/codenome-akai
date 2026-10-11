// XP & leveling — centralized formulas (master prompt §20, §45, §46, §81).

import { XP } from '../config/balance';

export function heroXpNeeded(level: number): number {
  return XP.heroLevelCurve(level);
}

export function kingXpNeeded(level: number): number {
  return XP.kingLevelCurve(level);
}

/**
 * XP share per member given the team size (1..3).
 * Guaranteed monotonic: share(1) > share(2) > share(3).
 */
export function xpSharePerMember(teamSize: number): number {
  const clamped = Math.min(Math.max(teamSize, 1), XP.teamSplitShares.length);
  return XP.teamSplitShares[clamped - 1];
}

/**
 * Split a pool of XP across the active team.
 * Returns the amount EACH member receives.
 */
export function splitXp(pool: number, teamSize: number): number {
  if (teamSize <= 0) return 0;
  return Math.floor(pool * xpSharePerMember(teamSize));
}

export interface LevelUpResult {
  level: number;
  xp: number; // leftover xp within current level
  levelsGained: number;
}

export function applyXp(
  level: number,
  xp: number,
  gained: number,
  needed: (lvl: number) => number,
): LevelUpResult {
  let l = level;
  let x = xp + gained;
  let ups = 0;
  while (x >= needed(l)) {
    x -= needed(l);
    l += 1;
    ups += 1;
    if (ups > 500) break;
  }
  return { level: l, xp: x, levelsGained: ups };
}

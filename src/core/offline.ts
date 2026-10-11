// Offline progress (master prompt §47-§48).
// Records lastActiveAt; on return, computes capped duration and projected rewards.

import { OFFLINE } from '../config/balance';

export interface OfflineReport {
  elapsedSeconds: number;
  cappedSeconds: number;
  wasCapped: boolean;
  coins: number;
  heroXp: number;
}

export function maxOfflineSeconds(isVip: boolean): number {
  return isVip ? OFFLINE.vipMaxSeconds : OFFLINE.freeMaxSeconds;
}

export function computeOfflineRewards(args: {
  lastActiveAt: number;
  now: number;
  isVip: boolean;
  floor: number;
}): OfflineReport {
  const elapsed = Math.max(0, Math.floor((args.now - args.lastActiveAt) / 1000));
  const cap = maxOfflineSeconds(args.isVip);
  const capped = Math.min(elapsed, cap);
  const floor = Math.max(1, args.floor);
  return {
    elapsedSeconds: elapsed,
    cappedSeconds: capped,
    wasCapped: elapsed > cap,
    coins: Math.floor(capped * OFFLINE.coinPerSecondPerFloor * floor),
    heroXp: Math.floor(capped * OFFLINE.xpPerSecondPerFloor * floor),
  };
}

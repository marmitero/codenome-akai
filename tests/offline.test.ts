import { describe, expect, it } from 'vitest';
import { computeOfflineRewards, maxOfflineSeconds } from '../src/core/offline';

describe('offline limits (§48)', () => {
  const now = 10_000_000_000;
  it('free players cap at 2 hours', () => {
    expect(maxOfflineSeconds(false)).toBe(7200);
    const r = computeOfflineRewards({ lastActiveAt: now - 24 * 3600 * 1000, now, isVip: false, floor: 5 });
    expect(r.cappedSeconds).toBe(7200);
    expect(r.wasCapped).toBe(true);
  });
  it('VIP caps at 8 hours', () => {
    expect(maxOfflineSeconds(true)).toBe(28800);
    const r = computeOfflineRewards({ lastActiveAt: now - 24 * 3600 * 1000, now, isVip: true, floor: 5 });
    expect(r.cappedSeconds).toBe(28800);
  });
  it('short absences are not capped', () => {
    const r = computeOfflineRewards({ lastActiveAt: now - 600 * 1000, now, isVip: false, floor: 1 });
    expect(r.cappedSeconds).toBe(600);
    expect(r.wasCapped).toBe(false);
  });
  it('rewards scale with floor and never go negative', () => {
    const a = computeOfflineRewards({ lastActiveAt: now - 3600_000, now, isVip: false, floor: 1 });
    const b = computeOfflineRewards({ lastActiveAt: now - 3600_000, now, isVip: false, floor: 6 });
    expect(b.coins).toBeGreaterThan(a.coins);
    expect(a.coins).toBeGreaterThanOrEqual(0);
  });
});

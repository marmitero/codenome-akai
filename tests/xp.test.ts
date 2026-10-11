import { describe, expect, it } from 'vitest';
import { splitXp, xpSharePerMember, applyXp, heroXpNeeded, kingXpNeeded } from '../src/core/xp';

describe('team XP split (§20/§81)', () => {
  it('1 hero receives the maximum individual XP', () => {
    expect(splitXp(100, 1)).toBe(100);
  });
  it('2 heroes receive less each', () => {
    expect(splitXp(100, 2)).toBeLessThan(splitXp(100, 1));
  });
  it('3 heroes receive even less each', () => {
    expect(splitXp(100, 3)).toBeLessThan(splitXp(100, 2));
  });
  it('all eligible members receive XP (share is per member)', () => {
    expect(xpSharePerMember(3)).toBeGreaterThan(0);
  });
  it('monotonic shares', () => {
    expect(xpSharePerMember(1)).toBeGreaterThan(xpSharePerMember(2));
    expect(xpSharePerMember(2)).toBeGreaterThan(xpSharePerMember(3));
  });
});

describe('leveling', () => {
  it('hero levels up and carries leftover xp', () => {
    const need = heroXpNeeded(1);
    const r = applyXp(1, 0, need + 5, heroXpNeeded);
    expect(r.level).toBe(2);
    expect(r.xp).toBe(5);
    expect(r.levelsGained).toBe(1);
  });
  it('king curve grows', () => {
    expect(kingXpNeeded(2)).toBeGreaterThan(kingXpNeeded(1));
  });
});

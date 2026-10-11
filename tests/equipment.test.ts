import { describe, expect, it } from 'vitest';
import { generateEquipment, rollDrop, rollRarity } from '../src/core/equipment';
import { mulberry32 } from '../src/core/rng';
import { LOOT } from '../src/config/balance';

describe('loot probability (§32)', () => {
  it('drop rate approximates the configured 5%', () => {
    const rng = mulberry32(42);
    let drops = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) if (rollDrop(rng)) drops++;
    const rate = drops / N;
    expect(rate).toBeGreaterThan(0.04);
    expect(rate).toBeLessThan(0.06);
  });
});

describe('rarity distribution (§33)', () => {
  it('approximates configured weights', () => {
    const rng = mulberry32(7);
    const counts: Record<string, number> = {};
    const N = 40000;
    for (let i = 0; i < N; i++) {
      const r = rollRarity(rng);
      counts[r] = (counts[r] ?? 0) + 1;
    }
    expect(counts.common / N).toBeGreaterThan(0.48);
    expect(counts.common / N).toBeLessThan(0.52);
    expect((counts.legendary ?? 0) / N).toBeLessThan(0.02);
    expect((counts.celestial ?? 0) / N).toBeLessThan(0.005);
  });
});

describe('X individuality (§36)', () => {
  it('each stat rolls its own X', () => {
    const rng = mulberry32(99);
    let sawDifferent = false;
    for (let i = 0; i < 50; i++) {
      const eq = generateEquipment(rng, 5, { rarity: 'rare', slot: 'accessory' });
      const xs = Object.values(eq.xValues) as number[];
      if (new Set(xs).size > 1) sawDifferent = true;
      for (const x of xs) {
        expect(x).toBeGreaterThanOrEqual(LOOT.xMin - 0.01);
        expect(x).toBeLessThanOrEqual(LOOT.xMax + 0.01);
      }
    }
    expect(sawDifferent).toBe(true);
  });

  it('formula BASE × RARITY × X holds', () => {
    const rng = mulberry32(1234);
    const eq = generateEquipment(rng, 1, { rarity: 'common', slot: 'weapon' });
    // level 1 → levelScale = 1.12; base attack 6; rarity common mult 1
    const expected = Math.max(1, Math.round(6 * 1.12 * 1 * (eq.xValues.attack ?? 1)));
    expect(eq.stats.attack).toBe(expected);
  });

  it('higher rarity implies higher stats on average', () => {
    const rng = mulberry32(5);
    const avg = (rarity: 'common' | 'legendary') => {
      let s = 0;
      for (let i = 0; i < 200; i++) s += generateEquipment(rng, 5, { rarity, slot: 'weapon' }).stats.attack;
      return s / 200;
    };
    expect(avg('legendary')).toBeGreaterThan(avg('common'));
  });
});

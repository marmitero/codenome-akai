import { describe, expect, it } from 'vitest';
import { tickBattle, makeFighter, damageFormula } from '../src/core/battle';
import { mulberry32 } from '../src/core/rng';
import type { CombatStats } from '../src/core/types';

const stats = (atk: number, def: number, hp: number): CombatStats => ({
  attack: atk, defense: def, hp, maxHp: hp, crit: 0,
});

describe('combat 1×1 (§78)', () => {
  it('produces damage events and a winner', () => {
    const rng = mulberry32(1);
    const hero = makeFighter('h', 'hero', stats(30, 5, 200));
    const enemy = makeFighter('e', 'enemy', stats(10, 2, 60));
    let finished = null;
    const types = new Set<string>();
    for (let t = 0; t < 30000 && !finished; t += 100) {
      const r = tickBattle([hero, enemy], t, rng);
      r.events.forEach((e) => types.add(e.type));
      finished = r.finished;
    }
    expect(finished).toBe('hero_win');
    expect(types.has('attack_started')).toBe(true);
    expect(types.has('damage_dealt')).toBe(true);
    expect(types.has('enemy_damaged')).toBe(true);
    expect(types.has('enemy_defeated')).toBe(true);
    expect(types.has('battle_won')).toBe(true);
    expect(types.has('battle_finished')).toBe(true);
  });

  it('a weaker hero loses', () => {
    const rng = mulberry32(3);
    const hero = makeFighter('h', 'hero', stats(2, 0, 30));
    const enemy = makeFighter('e', 'enemy', stats(40, 5, 500));
    let finished = null;
    for (let t = 0; t < 60000 && !finished; t += 100) finished = tickBattle([hero, enemy], t, rng).finished;
    expect(finished).toBe('hero_lose');
  });
});

describe('boss battle 3×1 (§24)', () => {
  it('the WHOLE team participates simultaneously', () => {
    const rng = mulberry32(9);
    const a = makeFighter('a', 'hero', stats(20, 4, 150));
    const b = makeFighter('b', 'hero', stats(20, 4, 150));
    const c = makeFighter('c', 'hero', stats(20, 4, 150));
    const boss = makeFighter('boss', 'enemy', stats(25, 6, 600));
    const attackers = new Set<string>();
    let finished = null;
    for (let t = 0; t < 60000 && !finished; t += 100) {
      const r = tickBattle([a, b, c, boss], t, rng);
      r.events.forEach((e) => {
        if (e.type === 'attack_started' && e.attackerId) attackers.add(e.attackerId);
      });
      finished = r.finished;
    }
    expect(finished).toBe('hero_win');
    expect(attackers.has('a')).toBe(true);
    expect(attackers.has('b')).toBe(true);
    expect(attackers.has('c')).toBe(true);
  });
});

describe('damage formula', () => {
  it('defense mitigates and crits multiply', () => {
    const rng = mulberry32(11);
    const atk = stats(50, 0, 100);
    const paper = stats(0, 0, 10);
    const rock = stats(0, 200, 10);
    const d1 = damageFormula(atk, paper, rng).amount;
    const d2 = damageFormula(atk, rock, mulberry32(11)).amount;
    expect(d1).toBeGreaterThan(d2);
    const crit = damageFormula({ ...atk, crit: 1 }, paper, mulberry32(21)).amount;
    const noCrit = damageFormula({ ...atk, crit: 0 }, paper, mulberry32(21)).amount;
    expect(crit).toBeGreaterThan(noCrit * 1.2);
  });
});

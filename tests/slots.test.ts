import { describe, expect, it } from 'vitest';
import { GameState } from '../src/core/state';
import type { PersistenceService } from '../src/core/persistence';
import type { SaveState } from '../src/core/types';

class MemoryPersistence implements PersistenceService {
  store: SaveState | null = null;
  load() { return this.store; }
  save(s: SaveState) { this.store = s; }
  clear() { this.store = null; }
}

function fresh(): GameState {
  const g = new GameState(new MemoryPersistence());
  g.createKing('TESTE', 'male');
  g.chooseInitialHero('ferro');
  return g;
}

describe('team slots (§14/§46)', () => {
  it('slot 1 free, slots 2/3 locked initially', () => {
    const g = fresh();
    expect(g.team.unlocked).toEqual([true, false, false]);
  });
  it('slot 2 requires level 10 AND 150k coins', () => {
    const g = fresh();
    expect(g.canUnlockSlot(1)).toBe(false);
    g.king!.level = 10;
    expect(g.canUnlockSlot(1)).toBe(false);
    g.addCoins(150000);
    expect(g.canUnlockSlot(1)).toBe(true);
    g.unlockSlot(1);
    expect(g.team.unlocked[1]).toBe(true);
    expect(g.king!.coins).toBe(0);
  });
  it('slot 3 requires level 25 AND 1M coins and slot 2 first', () => {
    const g = fresh();
    g.king!.level = 25;
    g.addCoins(1000000);
    expect(g.canUnlockSlot(2)).toBe(false); // slot2 locked
    g.team.unlocked[1] = true;
    expect(g.canUnlockSlot(2)).toBe(true);
  });
  it('a hero occupies a single slot', () => {
    const g = fresh();
    g.team.unlocked[1] = true;
    const id = g.team.slots[0]!;
    g.assignHero(1, id);
    expect(g.team.slots[0]).toBeNull();
    expect(g.team.slots[1]).toBe(id);
  });
});

describe('economy via state', () => {
  it('selling equipment grants its sell value', () => {
    const g = fresh();
    const item = {
      id: 'x', ownerId: null, characterId: null, slot: 'weapon', itemType: 'espada',
      level: 1, rarity: 'common', stats: { attack: 1, defense: 0, hp: 0, crit: 0 },
      xValues: {}, quality: 0.5, sellValue: 42, createdAt: 0,
    } as import('../src/core/types').Equipment;
    g.addItem(item);
    const before = g.king!.coins;
    g.sellItem('x');
    expect(g.king!.coins).toBe(before + 42);
    expect(g.inventory.length).toBe(0);
  });
});

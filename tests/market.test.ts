import { describe, expect, it } from 'vitest';
import { quote, validateTrade } from '../src/core/market';

describe('market 15% fee (§41)', () => {
  it('splits a 100000 sale exactly as specified', () => {
    const q = quote(100000);
    expect(q.buyerPays).toBe(100000);
    expect(q.sellerReceives).toBe(85000);
    expect(q.feeConsumed).toBe(15000);
  });
  it('fee is consumed, never credited to players', () => {
    const q = quote(999);
    expect(q.sellerReceives + q.feeConsumed).toBe(q.price);
  });
  it('rejects invalid prices', () => {
    expect(() => quote(-5)).toThrow();
    expect(() => quote(1.5)).toThrow();
  });
});

describe('trade validation (§87)', () => {
  const good = {
    itemExists: true,
    itemBelongsToSeller: true,
    itemLocked: false,
    priceValid: true,
    buyerHasCoins: true,
    listingAvailable: true,
  };
  it('accepts a clean trade', () => expect(validateTrade(good).ok).toBe(true));
  it('blocks duplication-style abuses', () => {
    expect(validateTrade({ ...good, itemExists: false }).ok).toBe(false);
    expect(validateTrade({ ...good, itemBelongsToSeller: false }).ok).toBe(false);
    expect(validateTrade({ ...good, itemLocked: true }).ok).toBe(false);
    expect(validateTrade({ ...good, listingAvailable: false }).ok).toBe(false);
    expect(validateTrade({ ...good, buyerHasCoins: false }).ok).toBe(false);
  });
});

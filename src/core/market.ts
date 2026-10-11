// Community market economics (master prompt §40-§42, §87).
// The 15% fee is a sink: it never goes to another player and is consumed.
// Full atomic server-authoritative enforcement lands in the ONLINE phase;
// the pure math + validation rules live here and are unit-tested.

import { ECONOMY } from '../config/balance';

export interface MarketQuote {
  price: number;
  buyerPays: number;
  sellerReceives: number;
  feeConsumed: number;
}

export function quote(price: number): MarketQuote {
  if (!Number.isFinite(price) || price <= 0 || Math.floor(price) !== price) {
    throw new Error('invalid price');
  }
  const fee = Math.floor(price * ECONOMY.marketFee);
  return {
    price,
    buyerPays: price,
    sellerReceives: price - fee,
    feeConsumed: fee,
  };
}

export interface MarketValidation {
  ok: boolean;
  reason?: string;
}

/** Pre-transaction checks mirroring the future server-side rules. */
export function validateTrade(args: {
  itemExists: boolean;
  itemBelongsToSeller: boolean;
  itemLocked: boolean;
  priceValid: boolean;
  buyerHasCoins: boolean;
  listingAvailable: boolean;
}): MarketValidation {
  if (!args.itemExists) return { ok: false, reason: 'item does not exist' };
  if (!args.itemBelongsToSeller) return { ok: false, reason: 'seller does not own item' };
  if (args.itemLocked) return { ok: false, reason: 'item is locked' };
  if (!args.priceValid) return { ok: false, reason: 'invalid price' };
  if (!args.buyerHasCoins) return { ok: false, reason: 'buyer lacks coins' };
  if (!args.listingAvailable) return { ok: false, reason: 'listing no longer available' };
  return { ok: true };
}

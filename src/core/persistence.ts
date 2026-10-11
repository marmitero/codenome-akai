// Persistence abstraction (master prompt §83).
// MVP uses localStorage; the interface allows swapping to Supabase later
// without rewriting systems.

import { SAVE_KEY } from '../config/balance';
import type { SaveState } from './types';

export interface PersistenceService {
  load(): SaveState | null;
  save(state: SaveState): void;
  clear(): void;
}

export class LocalStoragePersistence implements PersistenceService {
  constructor(private key: string = SAVE_KEY) {}

  load(): SaveState | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      return JSON.parse(raw) as SaveState;
    } catch {
      return null;
    }
  }

  save(state: SaveState): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
    } catch {
      // storage full/unavailable — MVP tolerates silent failure, logged for dev
      console.warn('[persistence] save failed');
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      /* noop */
    }
  }
}

// Runtime session singletons shared across scenes.

import { GameState } from '../core/state';
import { LocalStoragePersistence } from '../core/persistence';
import { computeOfflineRewards, type OfflineReport } from '../core/offline';

export const state = new GameState(new LocalStoragePersistence());

/** Computed once per app boot (after load) — shown by the Lobby. */
export let offlineReport: OfflineReport | null = null;
export function evaluateOfflineProgress() {
  if (state.king) {
    offlineReport = computeOfflineRewards({
      lastActiveAt: state.king.lastActiveAt,
      now: Date.now(),
      isVip: state.king.vip,
      floor: state.king.highestFloor,
    });
    if (offlineReport.cappedSeconds > 59) {
      state.addCoins(offlineReport.coins);
      state.grantTeamXp(offlineReport.heroXp);
    } else {
      offlineReport = null;
    }
  }
  state.touch();
  state.save();
}
export function consumeOfflineReport() {
  offlineReport = null;
}

/** Debug mode is dev-only (master prompt §77): enabled via ?debug=1 */
export const debugEnabled =
  new URLSearchParams(window.location.search).get('debug') === '1';

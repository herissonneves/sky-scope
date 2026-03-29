/**
 * Browser geolocation with session-scoped caching. Uses the same 5-minute window as
 * `maximumAge` so repeated loads in the same tab reuse the last successful fix.
 */

import { readSessionStorageCache, writeSessionStorageCache } from './cache/sessionStorageTtlCache.js';

const GEO_CACHE_KEY = 'geolocation';

/** Aligns with `maximumAge` — cache TTL matches accepted stale positions from the browser. */
const GEO_CACHE_TTL_MS = 300_000;

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 300_000,
};

export interface CachedGeolocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * Returns a cached position if still valid, otherwise requests one and stores it.
 * Resolves with `null` if the API is missing, permission is denied, or positioning fails.
 */
export function getCachedGeolocation(): Promise<CachedGeolocation | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }

    const cached = readSessionStorageCache<CachedGeolocation>(GEO_CACHE_KEY);
    if (cached) {
      resolve(cached);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const payload: CachedGeolocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        writeSessionStorageCache(GEO_CACHE_KEY, payload, GEO_CACHE_TTL_MS);
        resolve(payload);
      },
      () => {
        resolve(null);
      },
      GEO_OPTIONS,
    );
  });
}

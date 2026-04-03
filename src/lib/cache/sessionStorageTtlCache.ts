/**
 * @fileoverview JSON cache backed by `sessionStorage` with a time-to-live (TTL).
 *
 * **Why `sessionStorage`:** data is cleared when the browser tab closes, which matches a single
 * browsing session and avoids stale entries living for days like `localStorage`.
 *
 * **Envelope:** each value is stored as `JSON.stringify({ expiresAt, payload })` where
 * `expiresAt` is a UTC millisecond timestamp. Expired entries are removed on read.
 *
 * **Failures:** `sessionStorage` can throw (quota exceeded, private mode) or be unavailable;
 * operations degrade to a cache miss (read) or no-op (write).
 */

/**
 * Default TTL for cached OpenWeatherMap JSON (10 minutes).
 *
 * Current conditions do not need second-level freshness; this reduces duplicate HTTP calls
 * when the user repeats a search or refreshes the UI, while keeping data newer than
 * typical hourly use.
 */
export const DEFAULT_WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;

/** Prefix for every key written by this module (versioned for future migrations). */
const STORAGE_KEY_PREFIX = 'sky-scope:cache:v1:';

/**
 * Wire format persisted in `sessionStorage` for a cached payload of type `T`.
 *
 * @typeParam T - JSON-serialisable payload shape (same as the API response type being cached).
 */
export interface SessionStorageCacheEnvelope<T> {
  /** UTC expiry instant; comparable with `Date.now()`. */
  expiresAt: number;
  payload: T;
}

/**
 * @param key - Logical cache key (without the internal prefix).
 * @returns Namespaced key safe for `sessionStorage`.
 */
function prefixedKey(key: string): string {
  return `${STORAGE_KEY_PREFIX}${key}`;
}

/**
 * Reads a non-expired cached value.
 *
 * @typeParam T - Expected payload type (caller’s responsibility; no runtime validation).
 * @param storageKey - Logical key produced by e.g. {@link ./openWeather/weatherCacheKeys.js} builders.
 * @returns The payload, or `null` if missing, expired, corrupt, or on any storage error.
 * Stale or invalid entries are removed when detected.
 */
export function readSessionStorageCache<T>(storageKey: string): T | null {
  try {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    const raw = sessionStorage.getItem(prefixedKey(storageKey));
    if (raw === null) {
      return null;
    }

    let parsed: SessionStorageCacheEnvelope<T>;
    try {
      parsed = JSON.parse(raw) as SessionStorageCacheEnvelope<T>;
    } catch {
      sessionStorage.removeItem(prefixedKey(storageKey));
      return null;
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof parsed.expiresAt !== 'number' ||
      Number.isNaN(parsed.expiresAt)
    ) {
      sessionStorage.removeItem(prefixedKey(storageKey));
      return null;
    }

    if (Date.now() >= parsed.expiresAt) {
      sessionStorage.removeItem(prefixedKey(storageKey));
      return null;
    }

    return parsed.payload;
  } catch {
    return null;
  }
}

/**
 * Stores a value with TTL measured from the current time.
 *
 * @typeParam T - Payload type; must be JSON-serialisable.
 * @param storageKey - Logical key (same namespace as {@link readSessionStorageCache}).
 * @param payload - Value to cache.
 * @param ttlMs - Time to live in milliseconds from now; non-positive values are ignored (no write).
 */
export function writeSessionStorageCache<T>(storageKey: string, payload: T, ttlMs: number): void {
  try {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    if (ttlMs <= 0) {
      return;
    }
    const envelope: SessionStorageCacheEnvelope<T> = {
      expiresAt: Date.now() + ttlMs,
      payload,
    };
    sessionStorage.setItem(prefixedKey(storageKey), JSON.stringify(envelope));
  } catch {
    // Quota, security policy, or disabled storage — ignore and rely on the network.
  }
}

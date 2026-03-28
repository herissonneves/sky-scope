/**
 * Small JSON cache backed by `sessionStorage` with a time-to-live (TTL).
 *
 * **Why sessionStorage:** data is cleared when the browser tab is closed, which matches
 * “this browsing session” and avoids stale entries living for days like `localStorage`.
 *
 * **Envelope format:** each value is stored as `JSON.stringify({ expiresAt, payload })`
 * where `expiresAt` is a UTC millisecond timestamp. Expired entries are removed on read.
 *
 * **Errors:** `sessionStorage` can throw (quota exceeded, private mode) or be unavailable;
 * all operations are wrapped so failures degrade to a cache miss / no-op write.
 */

/**
 * Default TTL for cached OpenWeatherMap JSON (10 minutes).
 *
 * Current conditions do not need second-level freshness; this reduces duplicate HTTP calls
 * when the user repeats a search or refreshes the UI, while keeping data newer than
 * typical “hourly” use cases.
 */
export const DEFAULT_WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;

const STORAGE_KEY_PREFIX = 'sky-scope:cache:v1:';

/** Internal wire format written to `sessionStorage`. */
export interface SessionStorageCacheEnvelope<T> {
  /** UTC expiry instant (`Date.now()` comparable). */
  expiresAt: number;
  payload: T;
}

function prefixedKey(key: string): string {
  return `${STORAGE_KEY_PREFIX}${key}`;
}

/**
 * Reads a non-expired cached value. Returns `null` if missing, expired, corrupt, or on error.
 * Stale entries are removed when detected.
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
 * Stores a value with the given TTL (milliseconds from now). Silently no-ops on failure.
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

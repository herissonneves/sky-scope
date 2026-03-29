/**
 * Stable `sessionStorage` key segments for {@link ../weatherApi.js} cache entries.
 * Keys are namespaced by type so geocoding and One Call payloads never collide.
 */

/**
 * Geocoding cache key: normalised query (trim + lower case) so case-only differences hit the same entry.
 */
export function buildGeocodingCacheKey(normalisedQuery: string): string {
  return `geo:${encodeURIComponent(normalisedQuery.toLowerCase())}`;
}

/**
 * One Call cache key: coordinates rounded to 4 decimals (~11 m) — enough to match the same place
 * without fragmenting the cache on floating noise.
 */
export function buildWeatherCacheKey(lat: number, lon: number): string {
  return `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

/**
 * Reverse geocoding cache key: same rounding as weather so one place → one label cache entry.
 */
export function buildReverseGeocodingCacheKey(lat: number, lon: number): string {
  return `reverse:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

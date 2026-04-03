/**
 * Stable `sessionStorage` key segments for {@link ../weatherApi.js} cache entries.
 * Keys are namespaced by type so geocoding and One Call payloads never collide.
 */

import type { TemperatureUnit } from '../temperatureUnitsStorage.js';

/**
 * Geocoding cache key: normalised query (trim + lower case) so case-only differences hit the same entry.
 */
export function buildGeocodingCacheKey(normalisedQuery: string): string {
  return `geo:${encodeURIComponent(normalisedQuery.toLowerCase())}`;
}

/**
 * One Call cache key: coordinates rounded to 4 decimals (~11 m), `units`, and `lang` so responses
 * stay consistent with {@link ../openWeather/urls.js buildOneCallUrl}.
 */
export function buildWeatherCacheKey(lat: number, lon: number, units: TemperatureUnit): string {
  return `weather:${units}:pt_br:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

/**
 * Reverse geocoding cache key: same rounding as weather so one place → one label cache entry.
 */
export function buildReverseGeocodingCacheKey(lat: number, lon: number): string {
  return `reverse:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

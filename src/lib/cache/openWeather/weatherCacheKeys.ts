/**
 * @fileoverview Stable string keys for {@link ../../weatherApi.js} entries stored via
 * {@link ../sessionStorageTtlCache.js}. Each key is a short, deterministic segment so geocoding,
 * reverse geocoding, and One Call responses never share the same `sessionStorage` slot.
 *
 * @see https://openweathermap.org/api/geocoding-api Geocoding API 1.0
 * @see https://openweathermap.org/api/one-call-3 One Call API 3.0
 */

import { OPEN_WEATHER_LANG } from '../../openWeather/lang.js';
import type { TemperatureUnit } from '../../temperatureUnitsStorage.js';

/**
 * Builds the cache key for **direct geocoding** (`GET /geo/1.0/direct`).
 *
 * The query is lowercased and passed through `encodeURIComponent` so case-only differences
 * (e.g. `São Paulo` vs `são paulo`) map to the same key after the caller normalises input.
 *
 * @param normalisedQuery - City name or search string (already trimmed by the caller).
 * @returns Key segment prefixed with `geo:`.
 */
export function buildGeocodingCacheKey(normalisedQuery: string): string {
  return `geo:${encodeURIComponent(normalisedQuery.toLowerCase())}`;
}

/**
 * Builds the cache key for **One Call 3.0** (`GET /data/3.0/onecall`).
 *
 * Coordinates are rounded to four decimal places (~11 m) to avoid fragmenting the cache on
 * floating-point noise from the browser. `units` and `lang` are included so switching metric /
 * imperial or locale does not reuse an incompatible payload. The `lang` segment matches
 * {@link ../../openWeather/urls.js buildOneCallUrl} and {@link ../../openWeather/lang.js OPEN_WEATHER_LANG}.
 *
 * @param lat - Latitude in decimal degrees.
 * @param lon - Longitude in decimal degrees.
 * @param units - `metric` or `imperial`; must match the request URL.
 * @returns Key segment of the form `weather:{units}:{lang}:{lat}:{lon}`.
 */
export function buildWeatherCacheKey(lat: number, lon: number, units: TemperatureUnit): string {
  return `weather:${units}:${OPEN_WEATHER_LANG}:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

/**
 * Builds the cache key for **reverse geocoding** (`GET /geo/1.0/reverse`).
 *
 * Uses the same coordinate rounding as {@link buildWeatherCacheKey} so one place tends to share
 * one label cache entry alongside weather data for the same point.
 *
 * @param lat - Latitude in decimal degrees.
 * @param lon - Longitude in decimal degrees.
 * @returns Key segment prefixed with `reverse:`.
 */
export function buildReverseGeocodingCacheKey(lat: number, lon: number): string {
  return `reverse:${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

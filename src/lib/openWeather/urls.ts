/**
 * @fileoverview Absolute URLs and query strings for OpenWeatherMap HTTP APIs used by this app.
 * All builders use {@link URLSearchParams} for correct encoding.
 */

import type { TemperatureUnit } from '../temperatureUnitsStorage.js';

import { OPEN_WEATHER_LANG } from './lang.js';

const GEO_DIRECT = 'https://api.openweathermap.org/geo/1.0/direct';
const GEO_REVERSE = 'https://api.openweathermap.org/geo/1.0/reverse';
const ONECALL_3 = 'https://api.openweathermap.org/data/3.0/onecall';

/**
 * Direct geocoding: place name → coordinate candidates.
 *
 * @param cityQuery - Free-text query (`q`).
 * @param limit - Max number of results (`limit`).
 * @param appid - API key (`appid`).
 * @returns Full URL for `GET /geo/1.0/direct`.
 */
export function buildGeocodingDirectUrl(cityQuery: string, limit: number, appid: string): string {
  return `${GEO_DIRECT}?${new URLSearchParams({
    q: cityQuery,
    limit: String(limit),
    appid,
  })}`;
}

/**
 * Reverse geocoding: coordinates → place metadata (used for the city label after GPS).
 *
 * @param lat - Latitude (`lat`).
 * @param lon - Longitude (`lon`).
 * @param limit - Max number of results (`limit`).
 * @param appid - API key (`appid`).
 * @returns Full URL for `GET /geo/1.0/reverse`.
 */
export function buildReverseGeocodingUrl(
  lat: number,
  lon: number,
  limit: number,
  appid: string,
): string {
  return `${GEO_REVERSE}?${new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    limit: String(limit),
    appid,
  })}`;
}

/**
 * One Call 3.0: current weather + daily forecast for a point.
 *
 * @param lat - Latitude (`lat`).
 * @param lon - Longitude (`lon`).
 * @param appid - API key (`appid`).
 * @param units - `metric` (°C, m/s) or `imperial` (°F, mph).
 * @returns Full URL for `GET /data/3.0/onecall` with `exclude`, `lang`, and `units`.
 */
export function buildOneCallUrl(
  lat: number,
  lon: number,
  appid: string,
  units: TemperatureUnit,
): string {
  return `${ONECALL_3}?${new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid,
    units,
    lang: OPEN_WEATHER_LANG,
    exclude: 'minutely,hourly,alerts',
  })}`;
}

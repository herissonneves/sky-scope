/**
 * URL builders for OpenWeatherMap HTTP endpoints (query params encoded via URLSearchParams).
 */

const GEO_DIRECT = 'https://api.openweathermap.org/geo/1.0/direct';
const GEO_REVERSE = 'https://api.openweathermap.org/geo/1.0/reverse';
const ONECALL_3 = 'https://api.openweathermap.org/data/3.0/onecall';

export function buildGeocodingDirectUrl(cityQuery: string, limit: number, appid: string): string {
  return `${GEO_DIRECT}?${new URLSearchParams({
    q: cityQuery,
    limit: String(limit),
    appid,
  })}`;
}

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

export function buildOneCallUrl(lat: number, lon: number, appid: string): string {
  return `${ONECALL_3}?${new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    appid,
    exclude: 'minutely,hourly,daily,alerts',
  })}`;
}

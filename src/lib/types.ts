/**
 * Type definitions for responses consumed from the OpenWeatherMap APIs:
 * - {@link https://openweathermap.org/api/geocoding-api Geocoding API 1.0} (`/geo/1.0/direct`)
 * - {@link https://openweathermap.org/api/one-call-3 One Call API 3.0} (`/data/3.0/onecall`)
 *
 * Field names and shapes follow the upstream JSON. Numeric units depend on the `units`
 * query parameter on the request; this project calls One Call without `units`, so the
 * API uses **standard** units (e.g. temperature in Kelvin, wind in m/s, visibility in metres).
 */

/**
 * Localised place names keyed by ISO 639-1 language codes (e.g. `pt`, `en`).
 * Values may be absent for some keys depending on what the API returned.
 */
export type GeoLocalNames = Record<string, string | undefined>;

/**
 * A single match from the geocoding “direct” endpoint (city name → coordinates).
 */
export interface GeoLocationResult {
  /** Canonical place name returned by the API. */
  name: string;
  /** Optional per-locale labels; prefer `pt` or `en` when present for display. */
  local_names?: GeoLocalNames;
  lat: number;
  lon: number;
  /** ISO 3166-1 alpha-2 country code. */
  country: string;
  /** First-level administrative division, when applicable. */
  state?: string;
}

/**
 * One weather condition slot in the `weather` array (icon + human-readable group).
 * @see https://openweathermap.org/weather-conditions
 */
export interface WeatherCondition {
  /** Condition ID for OpenWeather condition groups. */
  id: number;
  /** Short group name (e.g. `Clear`, `Rain`). */
  main: string;
  /** Longer description; language follows API `lang` if set. */
  description: string;
  /** Icon id for building image URLs (e.g. `01d`). */
  icon: string;
}

/**
 * The `current` object from One Call 3.0 (subset used by this app; extra API fields may exist at runtime).
 */
export interface WeatherCurrent {
  /** Unix time (seconds) at the observation. */
  dt: number;
  /** Unix time (seconds, UTC) of sunrise for the current day. */
  sunrise?: number;
  /** Unix time (seconds, UTC) of sunset for the current day. */
  sunset?: number;
  /** Air temperature (Kelvin with default `units`; convert with −273.15 for °C). */
  temp: number;
  /** Apparent temperature (same units as `temp`). */
  feels_like: number;
  /** Atmospheric pressure at sea level, hPa. */
  pressure: number;
  /** Relative humidity, percent. */
  humidity: number;
  /** Dew point (same units as `temp`). */
  dew_point: number;
  /** UV index. */
  uvi: number;
  /** Cloudiness, percent. */
  clouds: number;
  /** Average visibility, metres. */
  visibility: number;
  /** Wind speed (m/s with default `units`). */
  wind_speed: number;
  /** Wind direction, degrees (meteorological). */
  wind_deg: number;
  /** Wind gust (same units as `wind_speed`), when reported. */
  wind_gust?: number;
  weather: WeatherCondition[];
}

/**
 * Root payload from One Call 3.0 when excluding minutely, hourly, daily, and alerts.
 */
export interface WeatherData {
  lat: number;
  lon: number;
  /** IANA timezone name (e.g. `America/Sao_Paulo`). */
  timezone: string;
  /** Offset from UTC in seconds (not necessarily a multiple of 3600). */
  timezone_offset: number;
  current: WeatherCurrent;
}

/** Outcome of checking whether the app can call OpenWeatherMap (key present when not in mock mode). */
export type ApiKeyValidationResult =
  | { valid: true }
  | { valid: false; error: string };

/** Geocoding pick plus One Call payload returned by `fetchCityWeather`. */
export interface CityWeatherSnapshot {
  geo: GeoLocationResult;
  weather: WeatherData;
}

/**
 * Type definitions for responses consumed from the OpenWeatherMap APIs:
 * - {@link https://openweathermap.org/api/geocoding-api Geocoding API 1.0} (`/geo/1.0/direct`)
 * - {@link https://openweathermap.org/api/one-call-3 One Call API 3.0} (`/data/3.0/onecall`)
 *
 * Field names and shapes follow the upstream JSON. Numeric units depend on the `units`
 * query parameter on One Call (`metric` → °C + m/s, `imperial` → °F + mph).
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
  /** Air temperature (°C with `units=metric`, °F with `units=imperial`). */
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
  /** Wind speed (m/s with `metric`, mph with `imperial`). */
  wind_speed: number;
  /** Wind direction, degrees (meteorological). */
  wind_deg: number;
  /** Wind gust (same units as `wind_speed`), when reported. */
  wind_gust?: number;
  weather: WeatherCondition[];
}

/**
 * Daily `temp` object from One Call 3.0 (`daily[].temp`).
 * `min` / `max` match the request `units` (°C with `metric`, °F with `imperial`).
 */
export interface WeatherDailyTemp {
  min: number;
  max: number;
}

/**
 * One day in the `daily` array from One Call 3.0 (subset used by the app).
 */
export interface WeatherDaily {
  dt: number;
  temp: WeatherDailyTemp;
  /** First slot’s `main` is shown in the 5-day strip (e.g. `Clear`, `Rain`). */
  weather?: WeatherCondition[];
}

/**
 * Root payload from One Call 3.0 when excluding minutely, hourly, and alerts (`daily` included).
 */
export interface WeatherData {
  lat: number;
  lon: number;
  /** IANA timezone name (e.g. `America/Sao_Paulo`). */
  timezone: string;
  /** Offset from UTC in seconds (not necessarily a multiple of 3600). */
  timezone_offset: number;
  current: WeatherCurrent;
  /** Up to 8 days from One Call; we display the first 5. */
  daily?: WeatherDaily[];
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

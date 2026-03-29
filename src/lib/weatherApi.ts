/**
 * Public OpenWeatherMap integration: geocoding, One Call 3.0, and a combined city / coordinates lookup.
 *
 * Behaviour is driven by `VITE_USE_MOCK_API` and `VITE_OPEN_WEATHER_API_KEY` (see `.env.example`).
 * Live requests use HTTPS endpoints defined in `./openWeather/urls.js`.
 *
 * **Caching:** when not in mock mode, successful JSON responses are stored in `sessionStorage`
 * with TTL (see {@link ./cache/sessionStorageTtlCache.js}). Mock responses are not cached so
 * randomised demo data is not frozen across calls.
 */

import { mockGeoApi, mockWeatherApi } from '../mocks/weatherApiMocks.js';

import {
  DEFAULT_WEATHER_CACHE_TTL_MS,
  readSessionStorageCache,
  writeSessionStorageCache,
} from './cache/sessionStorageTtlCache.js';
import {
  buildGeocodingCacheKey,
  buildReverseGeocodingCacheKey,
  buildWeatherCacheKey,
} from './cache/weatherApiCacheKeys.js';
import {
  getOpenWeatherApiKey,
  isOpenWeatherMockMode,
  requireOpenWeatherApiKey,
} from './openWeather/config.js';
import { fetchOpenWeatherJson } from './openWeather/fetchJson.js';
import { buildGeocodingDirectUrl, buildOneCallUrl, buildReverseGeocodingUrl } from './openWeather/urls.js';
import type {
  ApiKeyValidationResult,
  CityWeatherSnapshot,
  GeoLocationResult,
  WeatherData,
} from './types.js';

const GEO_RESULTS_LIMIT = 5;

function hasFiniteCoordinates(geo: GeoLocationResult): boolean {
  return Number.isFinite(geo.lat) && Number.isFinite(geo.lon);
}

function fallbackGeoForCoordinates(lat: number, lon: number): GeoLocationResult {
  return {
    name: 'Localização atual',
    lat,
    lon,
    country: '',
  };
}

/**
 * Whether the app may call the real API: mock mode always passes; otherwise an API key must be set.
 */
export function validateApiKey(): ApiKeyValidationResult {
  if (isOpenWeatherMockMode()) {
    return { valid: true };
  }
  if (!getOpenWeatherApiKey()) {
    return {
      valid: false,
      error: 'Erro: API key não configurada. Verifique o arquivo .env',
    };
  }
  return { valid: true };
}

/**
 * Geocoding API 1.0 — resolves a place name to up to {@link GEO_RESULTS_LIMIT} candidates.
 * Empty or whitespace-only `cityName` yields `[]` without calling the network.
 */
export async function fetchCityCoordinates(cityName: string): Promise<GeoLocationResult[]> {
  const query = cityName.trim();
  if (!query) {
    return [];
  }

  if (isOpenWeatherMockMode()) {
    return mockGeoApi(query);
  }

  const geoCacheKey = buildGeocodingCacheKey(query);
  const cachedGeo = readSessionStorageCache<GeoLocationResult[]>(geoCacheKey);
  if (cachedGeo !== null) {
    return cachedGeo;
  }

  const appid = requireOpenWeatherApiKey();
  const url = buildGeocodingDirectUrl(query, GEO_RESULTS_LIMIT, appid);
  const geoResults = await fetchOpenWeatherJson<GeoLocationResult[]>(
    url,
    'Erro na requisição de geolocalização',
  );
  writeSessionStorageCache(geoCacheKey, geoResults, DEFAULT_WEATHER_CACHE_TTL_MS);
  return geoResults;
}

/**
 * One Call API 3.0 — current conditions only (minutely, hourly, daily, alerts excluded).
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (isOpenWeatherMockMode()) {
    return mockWeatherApi(lat, lon);
  }

  const weatherCacheKey = buildWeatherCacheKey(lat, lon);
  const cachedWeather = readSessionStorageCache<WeatherData>(weatherCacheKey);
  if (cachedWeather !== null) {
    return cachedWeather;
  }

  const appid = requireOpenWeatherApiKey();
  const url = buildOneCallUrl(lat, lon, appid);
  const weather = await fetchOpenWeatherJson<WeatherData>(url, 'Erro na requisição do clima');
  writeSessionStorageCache(weatherCacheKey, weather, DEFAULT_WEATHER_CACHE_TTL_MS);
  return weather;
}

const REVERSE_GEO_LIMIT = 1;

/**
 * Reverse geocoding — place name for map coordinates. In mock mode returns a synthetic label only.
 */
export async function fetchReverseGeocoding(lat: number, lon: number): Promise<GeoLocationResult | null> {
  if (isOpenWeatherMockMode()) {
    return fallbackGeoForCoordinates(lat, lon);
  }

  const reverseKey = buildReverseGeocodingCacheKey(lat, lon);
  const cached = readSessionStorageCache<GeoLocationResult>(reverseKey);
  if (cached !== null) {
    return cached;
  }

  const appid = requireOpenWeatherApiKey();
  const url = buildReverseGeocodingUrl(lat, lon, REVERSE_GEO_LIMIT, appid);
  const rows = await fetchOpenWeatherJson<GeoLocationResult[]>(
    url,
    'Erro na geocodificação reversa',
  );
  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (first && hasFiniteCoordinates(first)) {
    writeSessionStorageCache(reverseKey, first, DEFAULT_WEATHER_CACHE_TTL_MS);
    return first;
  }
  return null;
}

/**
 * Current weather for GPS coordinates: reverse geocode (for label) + One Call payload.
 */
export async function fetchWeatherForCoordinates(lat: number, lon: number): Promise<CityWeatherSnapshot> {
  const [weather, geoFromApi] = await Promise.all([
    fetchWeatherData(lat, lon),
    fetchReverseGeocoding(lat, lon),
  ]);
  const geo = geoFromApi ?? fallbackGeoForCoordinates(lat, lon);
  return { geo, weather };
}

/**
 * Resolves the first geocoding hit with finite coordinates, then loads weather for that point.
 */
export async function fetchCityWeather(cityName: string): Promise<CityWeatherSnapshot> {
  const geoResults = await fetchCityCoordinates(cityName);

  if (!Array.isArray(geoResults) || geoResults.length === 0) {
    throw new Error('Nenhuma cidade encontrada com esse nome.');
  }

  const geo = geoResults.find(hasFiniteCoordinates);
  if (!geo) {
    throw new Error('Coordenadas não encontradas na resposta da API');
  }

  const weather = await fetchWeatherData(geo.lat, geo.lon);
  return { geo, weather };
}

/**
 * Public OpenWeatherMap integration: geocoding, One Call 3.0, and a combined city lookup.
 *
 * Behaviour is driven by `VITE_USE_MOCK_API` and `VITE_OPEN_WEATHER_API_KEY` (see `.env.example`).
 * Live requests use HTTPS endpoints defined in `./openWeather/urls.js`.
 */

import { mockGeoApi, mockWeatherApi } from '../mocks/weatherApiMocks.js';

import {
  getOpenWeatherApiKey,
  isOpenWeatherMockMode,
  requireOpenWeatherApiKey,
} from './openWeather/config.js';
import { fetchOpenWeatherJson } from './openWeather/fetchJson.js';
import { buildGeocodingDirectUrl, buildOneCallUrl } from './openWeather/urls.js';
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

  const appid = requireOpenWeatherApiKey();
  const url = buildGeocodingDirectUrl(query, GEO_RESULTS_LIMIT, appid);
  return fetchOpenWeatherJson<GeoLocationResult[]>(url, 'Erro na requisição de geolocalização');
}

/**
 * One Call API 3.0 — current conditions only (minutely, hourly, daily, alerts excluded).
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (isOpenWeatherMockMode()) {
    return mockWeatherApi(lat, lon);
  }

  const appid = requireOpenWeatherApiKey();
  const url = buildOneCallUrl(lat, lon, appid);
  return fetchOpenWeatherJson<WeatherData>(url, 'Erro na requisição do clima');
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

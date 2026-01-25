/**
 * Weather API Client
 * Funções para interagir com a API OpenWeatherMap
 */

import { mockGeoApi, mockWeatherApi } from '../mocks/weatherApiMocks.js';

import type { GeoLocationResult, WeatherData } from './types.js';

/**
 * Verifica se deve usar mocks baseado na variável de ambiente
 */
function shouldUseMockApi(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
}

/**
 * Obtém a API key do ambiente
 */
function getApiKey(): string | undefined {
  return import.meta.env.VITE_OPEN_WEATHER_API_KEY;
}

/**
 * Valida se a API key está configurada (quando não usar mocks)
 */
export function validateApiKey(): { valid: boolean; error?: string } {
  if (shouldUseMockApi()) {
    return { valid: true };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      valid: false,
      error: 'Erro: API key não configurada. Verifique o arquivo .env',
    };
  }

  return { valid: true };
}

/**
 * Busca coordenadas de uma cidade
 * @param cityName - Nome da cidade a buscar
 * @returns Array de resultados de geolocalização
 */
export async function fetchCityCoordinates(
  cityName: string,
): Promise<GeoLocationResult[]> {
  if (shouldUseMockApi()) {
    return await mockGeoApi(cityName);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key não configurada');
  }

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Erro na requisição de geolocalização: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

/**
 * Busca dados do clima para uma localização
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Dados do clima
 */
export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  if (shouldUseMockApi()) {
    return await mockWeatherApi(lat, lon);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key não configurada');
  }

  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily,alerts`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Erro na requisição do clima: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

/**
 * Busca dados completos do clima para uma cidade
 * @param cityName - Nome da cidade
 * @returns Objeto com dados de geolocalização e clima
 */
export async function fetchCityWeather(cityName: string): Promise<{
  geo: GeoLocationResult;
  weather: WeatherData;
}> {
  // Buscar coordenadas
  const geoResults = await fetchCityCoordinates(cityName);

  if (!Array.isArray(geoResults) || geoResults.length === 0) {
    throw new Error('Nenhuma cidade encontrada com esse nome.');
  }

  const firstResult = geoResults[0];
  const { lat, lon } = firstResult;

  if (!lat || !lon) {
    throw new Error('Coordenadas não encontradas na resposta da API');
  }

  // Buscar dados do clima
  const weather = await fetchWeatherData(lat, lon);

  return {
    geo: firstResult,
    weather,
  };
}

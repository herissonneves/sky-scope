/**
 * Mock data para testes da API OpenWeatherMap
 * Use VITE_USE_MOCK_API=true no .env para ativar
 */

import type { GeoLocationResult, WeatherData } from '../lib/types.js';

/** Fixture list matching the Geocoding API 1.0 `direct` response shape (`GeoLocationResult[]`). */
export const mockGeoData = [
  {
    name: 'Brasília',
    local_names: {
      pt: 'Brasília',
      en: 'Brasília',
      es: 'Brasilia',
      fr: 'Brasilia',
    },
    lat: -15.7934036,
    lon: -47.8823172,
    country: 'BR',
    state: 'Federal District',
  },
  {
    name: 'São Paulo',
    local_names: {
      pt: 'São Paulo',
      en: 'São Paulo',
      es: 'São Paulo',
    },
    lat: -23.5505199,
    lon: -46.6333094,
    country: 'BR',
    state: 'São Paulo',
  },
  {
    name: 'Rio de Janeiro',
    local_names: {
      pt: 'Rio de Janeiro',
      en: 'Rio de Janeiro',
      es: 'Río de Janeiro',
    },
    lat: -22.9068467,
    lon: -43.1728965,
    country: 'BR',
    state: 'Rio de Janeiro',
  },
] as const satisfies readonly GeoLocationResult[];

/** Static One Call 3.0 payload template (`WeatherData`); `lat` / `lon` are overwritten in `mockWeatherApi`. */
export const mockWeatherData = {
  lat: -15.7934036,
  lon: -47.8823172,
  timezone: 'America/Sao_Paulo',
  timezone_offset: -10800,
  current: {
    dt: 1705680000,
    sunrise: 1705656000,
    sunset: 1705702800,
    temp: 298.15, // ~25°C in Kelvin
    feels_like: 299.15, // ~26°C in Kelvin
    pressure: 1013,
    humidity: 65,
    dew_point: 290.15,
    uvi: 7.5,
    clouds: 20,
    visibility: 10000,
    wind_speed: 3.5, // m/s (~12.6 km/h)
    wind_deg: 180,
    wind_gust: 5.2,
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'céu limpo',
        icon: '01d',
      },
    ],
  },
} as const satisfies WeatherData;

export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** Simulates `GET /geo/1.0/direct` — same return type as the real API client. */
export async function mockGeoApi(cityName: string): Promise<GeoLocationResult[]> {
  await simulateApiDelay(300);

  const normalizedCity = cityName.toLowerCase().trim();

  const matches = mockGeoData.filter(
    (city) =>
      city.name.toLowerCase().includes(normalizedCity) ||
      city.local_names?.pt?.toLowerCase().includes(normalizedCity) ||
      city.local_names?.en?.toLowerCase().includes(normalizedCity),
  );

  return matches.length === 0 ? [] : [...matches];
}

/** Simulates One Call 3.0 current-only response — same shape as `fetchWeatherData` when mocked. */
export async function mockWeatherApi(lat: number, lon: number): Promise<WeatherData> {
  await simulateApiDelay(400);

  const base = mockWeatherData;

  return {
    ...base,
    lat,
    lon,
    current: {
      ...base.current,
      temp: base.current.temp + (Math.random() * 10 - 5),
      feels_like: base.current.feels_like + (Math.random() * 10 - 5),
      humidity: Math.round(base.current.humidity + (Math.random() * 20 - 10)),
      wind_speed: base.current.wind_speed + (Math.random() * 2 - 1),
    },
  };
}

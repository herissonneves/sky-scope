/**
 * Mock data para testes da API OpenWeatherMap
 * Use VITE_USE_MOCK_API=true no .env para ativar
 */

import type { TemperatureUnit } from '../lib/temperatureUnitsStorage.js';
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

const MOCK_DAY_START = 1705680000;

const MOCK_DAILY_MAIN = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Clear'] as const;

function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

function kelvinToFahrenheit(k: number): number {
  return ((k - 273.15) * 9) / 5 + 32;
}

function msToMph(ms: number): number {
  return ms * 2.2369362920544;
}

/** Internal template in Kelvin / m/s to mirror default API units before `units` conversion. */
const mockKelvinTemplate = {
  timezone: 'America/Sao_Paulo',
  timezone_offset: -10800,
  current: {
    dt: 1705680000,
    sunrise: 1705656000,
    sunset: 1705702800,
    temp: 298.15,
    feels_like: 299.15,
    pressure: 1013,
    humidity: 65,
    dew_point: 290.15,
    uvi: 7.5,
    clouds: 20,
    visibility: 10000,
    wind_speed: 3.5,
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
  daily: Array.from({ length: 6 }, (_, i) => {
    const spread = i * 0.8;
    return {
      dt: MOCK_DAY_START + i * 86_400,
      temp: {
        min: 288.15 + spread,
        max: 301.15 + spread,
      },
      weather: [
        {
          id: 800 + i,
          main: MOCK_DAILY_MAIN[i],
          description: 'mock',
          icon: '02d',
        },
      ],
    };
  }),
};

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

/** Simulates One Call 3.0 — same shape as `fetchWeatherData` when mocked. */
export async function mockWeatherApi(
  lat: number,
  lon: number,
  units: TemperatureUnit,
): Promise<WeatherData> {
  await simulateApiDelay(400);

  const w = mockKelvinTemplate;
  const jitter = () => Math.random() * 2 - 1;

  const tempK = w.current.temp + (Math.random() * 10 - 5);
  const feelsK = w.current.feels_like + (Math.random() * 10 - 5);
  const windMs = w.current.wind_speed + (Math.random() * 2 - 1);
  const gustMs =
    w.current.wind_gust !== undefined ? w.current.wind_gust + (Math.random() * 2 - 1) : undefined;

  const temp =
    units === 'metric' ? kelvinToCelsius(tempK) : kelvinToFahrenheit(tempK);
  const feels_like =
    units === 'metric' ? kelvinToCelsius(feelsK) : kelvinToFahrenheit(feelsK);
  const dew_point =
    units === 'metric' ? kelvinToCelsius(w.current.dew_point) : kelvinToFahrenheit(w.current.dew_point);
  const wind_speed = units === 'metric' ? windMs : msToMph(windMs);
  const wind_gust = gustMs !== undefined ? (units === 'metric' ? gustMs : msToMph(gustMs)) : undefined;

  return {
    lat,
    lon,
    timezone: w.timezone,
    timezone_offset: w.timezone_offset,
    current: {
      ...w.current,
      temp,
      feels_like,
      dew_point,
      humidity: Math.round(w.current.humidity + (Math.random() * 20 - 10)),
      wind_speed,
      wind_gust,
    },
    daily: w.daily.map((day) => {
      const minK = day.temp.min + jitter();
      const maxK = day.temp.max + jitter();
      return {
        ...day,
        temp: {
          min: units === 'metric' ? kelvinToCelsius(minK) : kelvinToFahrenheit(minK),
          max: units === 'metric' ? kelvinToCelsius(maxK) : kelvinToFahrenheit(maxK),
        },
      };
    }),
  };
}

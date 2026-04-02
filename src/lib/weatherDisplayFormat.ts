/**
 * Format One Call payloads for UI. Interpretation matches the `units` query used for the request.
 */

import { formatForecastDayLabel } from './forecastFormat.js';
import type { TemperatureUnit } from './temperatureUnitsStorage.js';
import type { WeatherData } from './types.js';

export interface DailyForecastDay {
  label: string;
  main: string;
  min: string;
  max: string;
}

export interface FormattedWeatherDisplay {
  temp: string;
  feels: string;
  humidity: string;
  wind: string;
  dailyForecast: DailyForecastDay[];
}

function formatTemp(value: number, units: TemperatureUnit): string {
  return units === 'metric' ? `${Math.round(value)}°C` : `${Math.round(value)}°F`;
}

function formatWind(windSpeed: number, units: TemperatureUnit): string {
  if (units === 'metric') {
    return `${Math.round(windSpeed * 3.6)} km/h`;
  }
  return `${Math.round(windSpeed)} mph`;
}

/**
 * Maps `weather` JSON to display strings. Caller must use the same `units` as the One Call request.
 */
export function formatWeatherForDisplay(weather: WeatherData, units: TemperatureUnit): FormattedWeatherDisplay | null {
  const current = weather.current;
  if (!current || typeof current.temp !== 'number') {
    return null;
  }

  const feelsLike =
    typeof current.feels_like === 'number' ? formatTemp(current.feels_like, units) : 'N/A';
  const humidity =
    typeof current.humidity === 'number' ? `${current.humidity}%` : 'N/A';
  const wind =
    typeof current.wind_speed === 'number' ? formatWind(current.wind_speed, units) : 'N/A';

  const tz = weather.timezone || 'UTC';
  const dailyForecast: DailyForecastDay[] = [];
  if (Array.isArray(weather.daily)) {
    for (const d of weather.daily.slice(0, 5)) {
      if (typeof d.temp?.min !== 'number' || typeof d.temp?.max !== 'number') {
        continue;
      }
      const main =
        typeof d.weather?.[0]?.main === 'string' && d.weather[0].main.length > 0
          ? d.weather[0].main
          : '—';
      dailyForecast.push({
        label: formatForecastDayLabel(d.dt, tz),
        main,
        min: formatTemp(d.temp.min, units),
        max: formatTemp(d.temp.max, units),
      });
    }
  }

  return {
    temp: formatTemp(current.temp, units),
    feels: feelsLike,
    humidity,
    wind,
    dailyForecast,
  };
}

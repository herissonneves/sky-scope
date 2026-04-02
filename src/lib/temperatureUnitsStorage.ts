/**
 * Persisted user preference for OpenWeatherMap `units` (metric = °C, imperial = °F).
 */

export type TemperatureUnit = 'metric' | 'imperial';

const STORAGE_KEY = 'sky-scope-temperature-units';

const DEFAULT_UNIT: TemperatureUnit = 'metric';

function readStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStorage(value: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

function isTemperatureUnit(value: string | null): value is TemperatureUnit {
  return value === 'metric' || value === 'imperial';
}

export function getStoredTemperatureUnits(): TemperatureUnit {
  const raw = readStorage();
  return isTemperatureUnit(raw) ? raw : DEFAULT_UNIT;
}

export function setStoredTemperatureUnits(units: TemperatureUnit): void {
  writeStorage(units);
}

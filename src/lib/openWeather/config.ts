/**
 * OpenWeatherMap client configuration from Vite env.
 */

/** When true, network calls are replaced by mock implementations under `src/mocks/`. */
export function isOpenWeatherMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
}

/**
 * API key from `VITE_OPEN_WEATHER_API_KEY`, trimmed; empty or whitespace-only is treated as missing.
 */
export function getOpenWeatherApiKey(): string | undefined {
  const raw = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Throws if a key is required (live API) but not configured. */
export function requireOpenWeatherApiKey(): string {
  const key = getOpenWeatherApiKey();
  if (!key) {
    throw new Error('API key não configurada');
  }
  return key;
}

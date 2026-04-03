/**
 * @fileoverview OpenWeatherMap client configuration derived from Vite environment variables
 * (`import.meta.env`). See `.env.example` for variable names.
 */

/**
 * @returns `true` when `VITE_USE_MOCK_API` is the string `'true'` — network calls are replaced by
 * implementations under `src/mocks/`.
 */
export function isOpenWeatherMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
}

/**
 * Reads the API key from `VITE_OPEN_WEATHER_API_KEY`.
 *
 * @returns Trimmed key, or `undefined` if unset, non-string, or whitespace-only.
 */
export function getOpenWeatherApiKey(): string | undefined {
  const raw = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * @returns The configured API key.
 * @throws {Error} When the key is missing and the live API is required.
 */
export function requireOpenWeatherApiKey(): string {
  const key = getOpenWeatherApiKey();
  if (!key) {
    throw new Error('API key não configurada');
  }
  return key;
}

/**
 * @fileoverview Minimal `fetch` wrapper for OpenWeatherMap JSON endpoints (Geocoding, One Call).
 */

/**
 * Performs `GET` on `url`, parses JSON, and throws on non-OK HTTP status.
 *
 * @typeParam T - Expected JSON shape (caller’s contract with the API).
 * @param url - Fully built URL including query string.
 * @param errorLabel - Short Portuguese label prepended to thrown errors (e.g. geocoding vs weather).
 * @returns Parsed JSON body.
 * @throws {Error} When `!response.ok` or when `response.json()` fails (propagated).
 */
export async function fetchOpenWeatherJson<T>(url: string, errorLabel: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

/**
 * Shared fetch helper for OpenWeatherMap JSON responses.
 */

export async function fetchOpenWeatherJson<T>(url: string, errorLabel: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

/**
 * @fileoverview OpenWeatherMap `lang` query value used by One Call and aligned cache keys.
 *
 * @see https://openweathermap.org/api/one-call-3 Multi-language support
 */

/**
 * API language code for Portuguese (Brazil). Passed as `lang` on One Call requests so
 * `weather.description`, daily `summary`, etc. are returned in pt-BR when available.
 */
export const OPEN_WEATHER_LANG = 'pt_br' as const;

export type OpenWeatherLang = typeof OPEN_WEATHER_LANG;

/**
 * @fileoverview OpenWeatherMap-specific cache key helpers used with
 * {@link ../sessionStorageTtlCache.js}.
 */

export { OPEN_WEATHER_LANG } from '../../openWeather/lang.js';
export {
  buildGeocodingCacheKey,
  buildReverseGeocodingCacheKey,
  buildWeatherCacheKey,
} from './weatherCacheKeys.js';

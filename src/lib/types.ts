/**
 * Types for Weather API
 */

export interface GeoLocationResult {
  name: string;
  local_names?: {
    [key: string]: string | undefined;
    pt?: string;
    en?: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCurrent {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: WeatherCurrent;
}

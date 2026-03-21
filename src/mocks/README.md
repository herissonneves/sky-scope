# OpenWeatherMap mocks

This folder holds mock responses so you can run the app without calling the real OpenWeatherMap APIs. When mock mode is on, `fetchCityCoordinates`, `fetchWeatherData`, and `fetchCityWeather` (see `src/lib/weatherApi.ts`) delegate to the helpers in `weatherApiMocks.ts` instead of the network.

## Enabling mock mode

Set the following in your `.env` file (see `.env.example`):

```env
VITE_USE_MOCK_API=true
```

The flag is read at build time via Vite (`import.meta.env`). You do not need `VITE_OPEN_WEATHER_API_KEY` for local UI flows while mocks are enabled.

## Supported city searches

Mock geocoding matches against each city’s `name` and `local_names.pt` / `local_names.en` (case-insensitive substring). These entries are defined in `mockGeoData`:

| City           | Example queries                          |
| -------------- | ---------------------------------------- |
| Brasília       | `Brasília`, `brasilia`, `brasil`, …      |
| São Paulo      | `São Paulo`, `sao paulo`, `paulo`, …     |
| Rio de Janeiro | `Rio de Janeiro`, `rio`, `janeiro`, …    |

Unknown names return an empty list, same shape as the real geocoding API when there are no hits.

## What the mocks return

### Geocoding (`/geo/1.0/direct`)

Array of objects shaped like the live API, including:

- `name`, `local_names`, `lat`, `lon`, `country`, `state`

### One Call 3.0 (`/data/3.0/onecall`)

A `current` payload aligned with the types in `src/lib/types.ts`, e.g.:

- `temp`, `feels_like` — Kelvin (roughly 25–26 °C baseline before jitter)
- `humidity` — percent
- `wind_speed` — m/s (UI converts to km/h)

`mockWeatherApi` copies the static template, overrides `lat`/`lon` with the requested coordinates, and applies small random jitter to temperature, humidity, and wind so repeated searches do not look completely static.

### Simulated latency

`simulateApiDelay` is used to mimic network latency:

- Geocoding mock: ~300 ms  
- Weather mock: ~400 ms  

## File layout

| File                 | Role                                                |
| -------------------- | --------------------------------------------------- |
| `weatherApiMocks.ts` | Static fixtures, delay helper, `mockGeoApi` / `mockWeatherApi` |

## Quick start

1. Add `VITE_USE_MOCK_API=true` to `.env`.
2. Run `pnpm dev`.
3. Search for a supported city (e.g. **Brasília**).

## Why use mocks

- No API key required for local development  
- Predictable, repeatable data  
- No quota usage on OpenWeatherMap  
- Works offline  
- Useful for demos and automated/manual testing  

# Changelog

All notable changes to **Sky Scope** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-28

First stable release of the portfolio weather app.

### Added

- **City search** — OpenWeatherMap Geocoding API 1.0 (`direct`) plus One Call API 3.0 for current conditions (temperature, feels-like, humidity, wind).
- **GPS / local weather** — Browser Geolocation API on load (high accuracy, 10s timeout, 5-minute `maximumAge`); reverse geocoding for a human-readable place label; same UI as manual search.
- **Client-side caching** — `sessionStorage` TTL cache (default 10 minutes) for forward geocode, reverse geocode, and One Call JSON when not using mocks; separate short-lived cache for raw GPS coordinates.
- **Mock mode** — `VITE_USE_MOCK_API` for offline / keyless development; typed fixtures and simulated latency ([`src/mocks/README.md`](src/mocks/README.md)).
- **UI** — React 19, CSS Modules, Material-style theme tokens (light/dark and contrast variants under `src/styles/variables/`).
- **Tooling** — Vite 7, TypeScript 5.9, ESLint 9 (flat config) with React and React Hooks, Prettier, pnpm.

### Changed

- Migrated the UI from imperative DOM factories to React components while keeping existing CSS Module structure.
- Modular OpenWeather client: `config`, URL builders, shared JSON fetch helper, and documented API-aligned types.

### Fixed

- Search control: icon button stacked above the input so clicks are not swallowed by the text field.
- Weather panels: removed conflicting `display` rules between layout modifiers and component CSS so temperature and detail cards show after a successful fetch.

### Documentation

- Root [`README.md`](README.md) in English (stack, env vars, features, project layout).
- Mocks README in English; [`index.html`](index.html) uses `lang="pt-BR"` and `dir="ltr"` to match Portuguese UI copy.

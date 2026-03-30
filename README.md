# Sky Scope

A small weather web app built with **TypeScript**, **Vite**, and **React 19**. On load it can show **current conditions for your GPS location** (with permission); you can also **search by city**. The UI displays temperature, feels-like, humidity, and wind, with clear loading and error states.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)

---

## Overview

**Sky Scope** uses the [OpenWeatherMap](https://openweathermap.org/) **Geocoding API 1.0** (forward and reverse), **One Call API 3.0** (current conditions; other blocks excluded via query params), and the browser **Geolocation API** for optional GPS-based lookup.

The UI uses **CSS Modules** and global **design tokens** (light/dark and contrast variants) under `src/styles/variables/`.

### Highlights

- **Local weather on load** — after you allow location, the app resolves coordinates, reverse-geocodes a place label, and fetches current weather (same cards as search)
- **City search** — forward geocoding, then weather for the first valid hit
- **Session-scoped caching** — successful API JSON is stored in `sessionStorage` with a TTL to cut duplicate calls (not used for mock responses)
- **Optional mock mode** — no key or network required for local demos (see [`src/mocks/README.md`](src/mocks/README.md))

---

## Tech stack

| Area | Choice |
|------|--------|
| Runtime / bundler | Vite 7 |
| Language | TypeScript 5.9 |
| UI | React 19 + CSS Modules |
| Theming | CSS custom properties (Material-style tokens) |
| Weather & geocoding | OpenWeatherMap (Geocoding 1.0 + One Call 3.0) |
| Package manager | pnpm 10+ |
| Lint / format | ESLint 9 (flat config), TypeScript ESLint, React / React Hooks, Prettier |

---

## Prerequisites

- **Node.js** 18+
- **pnpm** 10+ (recommended; the repo pins a `packageManager` field in `package.json`)
- An OpenWeatherMap **API key** when not using mocks ([create an account](https://openweathermap.org/api))

---

## Setup

```bash
git clone https://github.com/herissonneves/sky-scope.git
cd sky-scope
pnpm install
```

### Environment variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|----------|-------------|
| `VITE_OPEN_WEATHER_API_KEY` | OpenWeatherMap API key (not required when mocks are enabled) |
| `VITE_USE_MOCK_API` | Set to `true` to use built-in mock responses instead of the network |

```env
VITE_OPEN_WEATHER_API_KEY=your_key_here
VITE_USE_MOCK_API=false
```

---

## Scripts

```bash
pnpm dev          # dev server (default: http://localhost:5173)
pnpm build        # production build → dist/
pnpm preview      # serve the production build locally
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with --fix
pnpm format       # Prettier (write)
pnpm test         # placeholder (no test runner wired yet)
```

---

## Features (current)

| Feature | Notes |
|---------|--------|
| **GPS weather** | `navigator.geolocation` with high accuracy, 10s timeout, 5-minute `maximumAge`; coordinates cached briefly in `sessionStorage` before calling the weather stack |
| **Reverse geocode** | Place name for map coordinates via OpenWeather reverse endpoint (cached like other API JSON) |
| **City search** | Forward geocode + One Call; prefers `local_names.pt` for the label when present |
| **Current conditions** | Kelvin from API → °C in the UI; wind m/s → km/h |
| **Client cache** | `sessionStorage` TTL (default 10 minutes) for geocode, reverse geocode, and One Call payloads when not in mock mode |
| **Mocks** | Fixtures + simulated latency; see [`src/mocks/README.md`](src/mocks/README.md) |

---

## Roadmap (ideas)

- Hourly or multi-day sections if the API surface expands
- Unit / integration tests (replace the `pnpm test` stub)
- Optional `units=metric` on API calls and a UI toggle (°C / °F)
- Persist cache preferences (e.g. TTL) via env or settings

---

## Project structure

```text
sky-scope/
├── index.html
├── vite.config.ts
├── eslint.config.js
├── tsconfig.json
├── public/
└── src/
    ├── main.tsx                # React bootstrap
    ├── App.tsx                 # Root component
    ├── vite-env.d.ts
    ├── components/             # React components + *.module.css
    ├── lib/
    │   ├── weatherApi.ts       # Geocode, reverse geocode, One Call, city/coords flows
    │   ├── geolocation.ts      # Browser Geolocation + short-lived session cache
    │   ├── types.ts            # API-aligned TypeScript types
    │   ├── cache/              # sessionStorage TTL helpers + cache key builders
    │   └── openWeather/        # Config, URL builders, fetch helper
    ├── mocks/                  # Mock API responses (optional)
    └── styles/
        ├── global.css
        └── variables/          # Theme token layers
```

---

## Contributing

1. Fork the repository  
2. Create a branch (`git checkout -b feature/your-feature`)  
3. Commit with clear messages (Conventional Commits are welcome)  
4. Push and open a Pull Request  

---

## License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE).

---

## Author

- GitHub: [@herissonneves](https://github.com/herissonneves)
- LinkedIn: [Herisson Neves](https://linkedin.com/in/herissonneves)

---

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for weather and geocoding APIs  
- [Vite](https://vitejs.dev/) for the dev and build toolchain  
- [React](https://react.dev/) for the UI layer  

Built by Herisson Neves.

# Sky Scope

A small weather web app built with **TypeScript** and **Vite**. Search for a city, show **current conditions** (temperature, feels-like, humidity, wind), and surface clear loading and error states.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)

---

## Overview

**Sky Scope** calls the [OpenWeatherMap](https://openweathermap.org/) **Geocoding API** and **One Call API 3.0** (current payload only). The UI is built with **React 19**, **CSS Modules**, and global **design tokens** (light/dark and contrast variants) under `src/styles/variables/`.

### Highlights

- City search with geocoding, then current weather for the first match
- Loading and error messaging (missing API key, empty results, network failures)
- Responsive layout and keyboard-friendly search control
- Optional **mock mode** for local development without a key or network (see [`src/mocks/README.md`](src/mocks/README.md))

---

## Tech stack

| Area | Choice |
|------|--------|
| Runtime / bundler | Vite 7 |
| Language | TypeScript 5.9 |
| UI | React 19 + CSS Modules |
| Theming | CSS custom properties (Material-style tokens) |
| Weather data | OpenWeatherMap (Geocoding 1.0 + One Call 3.0) |
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

- **Search** — trim input, disable controls while fetching, show status text
- **Location label** — city (prefer `local_names.pt`), state, country when available
- **Current weather** — temperature (Kelvin from API converted to °C in the UI), feels-like, humidity, wind (m/s → km/h)
- **Mocks** — deterministic fixtures + simulated latency; documented in [`src/mocks/README.md`](src/mocks/README.md)

---

## Roadmap (ideas)

- Response caching (e.g. `localStorage` with TTL)
- Browser geolocation as an alternative to text search
- Hourly or multi-day sections if the API surface expands
- Unit / integration tests (replace the `pnpm test` stub)
- Optional `units=metric` on API calls and UI toggle (°C / °F)

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
    │   ├── weatherApi.ts       # Public weather + geocode helpers
    │   ├── types.ts            # API-aligned TypeScript types
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

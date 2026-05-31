# ARIA — Frontend

React + Vite frontend for **ARIA (Adaptive Routine Intelligence Agent)**, an on-device behavioral intelligence system. The Python ML pipeline that powers it lives on the `main` branch of this repo.

## Stack

- React 19 + Vite
- `react-tabs` for tab-panel navigation
- `recharts` for the Insights visualizations
- Plain CSS modules (no Tailwind, no UI library)

## Pages

| Tab | Purpose |
|---|---|
| Home | Landing page with stats and feature cards |
| Dashboard | Live behavioral profile + context simulator |
| Insights | Charts visualizing the trained ML models |
| Try ARIA | Slider-driven recommender demo |
| About | Project description, ML stack, design principles |
| Settings | Provider routing config + interface preferences |

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Outputs to `dist/`. The build is configured with a relative base path, so `dist/index.html` opens correctly via `file://` or any static host.

## Project structure

```
src/
  components/      Reusable UI (Card, PillBadge)
  hooks/           useARIA — composes context + profile state
  pages/           One file per tab
  services/
    api/           Provider router + prompt builder (deferred Chat feature)
    behavioral/    Context inference + cluster label mapping
  config/
    images.js      Central image URL config (4 slots)
```

## Adding images

Drop files into `public/images/` and reference them in `src/config/images.js` as `'images/your-file.png'`. Or paste any web URL. Empty string hides the slot.

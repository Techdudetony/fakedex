# FakeDex

A custom Pokedex web application for original Fakemon crease with FakeDex.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- React Router v6
- Deployed on Vercel

## Gitflow
- `main` - production only, tagged releases
- `develop` - integration branch, all features merge here
- `feature/*` - one branch per feature
- `release/*` - staging before merging to main

## Local Setup
```bash
npm install
npm run dev
```

## Data
Pokemon data lives in `src/data/fakemon.json`, generated from the source CSV via:
```bash
node scripts/csv-to-json.js
```
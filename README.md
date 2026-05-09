# PokeSpire

A Pokémon-themed Slay the Spire roguelike built with Vite + React + TypeScript + Tailwind CSS.

## Tech Stack

- **Vite** — build tool
- **React 19** + **TypeScript**
- **Tailwind CSS v3** — utility-first styling
- **Zustand** — state management (persisted to localStorage)
- **React Router v6** — client-side routing

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/   # Reusable UI components
  screens/      # Full-page screen components (routed)
  store/        # Zustand stores
    runStore.ts # Active run state (persisted to localStorage)
  data/         # Static game data (Pokémon, moves, items)
  hooks/        # Custom React hooks
  utils/        # Pure utility functions
  types/        # TypeScript type definitions
```

## Screens

| Route | Screen | Purpose |
|---|---|---|
| `/` | HomeScreen | Title screen, new/continue run |
| `/character-select` | CharacterSelectScreen | Pick trainer |
| `/map` | MapScreen | Node map for current act |
| `/combat` | CombatScreen | Turn-based battle |
| `/game-over` | GameOverScreen | Run summary on defeat |
| `/victory` | VictoryScreen | Run summary on win |

## Run State

All active run data is managed in `runStore.ts` via Zustand with `persist` middleware (key: `pokespire-run`). The state includes trainer, party, map, gold, items, badges, and run statistics.

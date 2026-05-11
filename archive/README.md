# PokeSpire Data Archive

Snapshot taken: 2026-05-11

This archive preserves all hand-authored game data and sprite files before
they were replaced by live PokéAPI data.

## Contents

### `data/`
All TypeScript data modules as they existed before the PokéAPI migration:
- `pokemon.ts` — POKEMON_TEMPLATES (hand-tuned base stats, names, types)
- `moves.ts` — MOVES (hand-authored move pool with game-specific properties)
- `learnsets.ts` — LEARNSETS (hand-authored per-pokemon learnsets)
- `starterDecks.ts` — Starter move decks
- `gymLeaders.ts` — Gym leader definitions
- `items.ts` — Item definitions
- `achievements.ts` — Achievement definitions

### `sprites/`
PNG sprites for every pokemon ID used in the game (templates + catch pools),
sourced from:
  https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png

Included IDs: 1-10, 13, 16, 19, 25, 26, 35, 37, 39, 41, 43, 46, 54, 58,
60, 63, 66, 69, 74, 77, 79, 81, 92, 95, 100, 111, 115, 116, 120, 121, 123,
125, 126, 127, 131, 133, 147

## To restore
Copy files from `data/` back to `src/data/` and restore sprite references
in `usePokemon.ts` if the CDN endpoint changes.

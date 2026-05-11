# PokeSpire — Claude Guidelines

## Communication
- Short, direct, to the point. No fluff.

## Project Goal
- Web-based, mobile-friendly roguelike game
- Slay the Spire mechanics skinned with Pokémon

## Workflow

1. **Plan first** — write step-by-step plan, wait for user approval before starting
2. **Use agents** — offload research, review, and testing to subagents whenever possible; use cowork for parallel execution
3. **Announce each step** when complete + show updated checklist
4. **Code review** — run a review/test agent before committing
5. **Push to GitHub** after every completed step with a short, direct commit message
   - After every `git push`, tell the user the commit ID and commit name
6. **Oracle deploy** — after every `scp` deploy to Oracle, notify the user it's done

## Stack
- Vite + React + TypeScript
- Tailwind CSS v3
- Zustand (persisted to localStorage)
- React Router v7

## Repo
- GitHub: https://github.com/laynem/pokespire.git
- Local: D:/claude/PokeSpire
- Dev server: localhost:5173
- Worktrees: .claude/worktrees/ (Claude Code feature branches)

## Autonomous Access
Claude has full credentials for all environments — do NOT ask the user for keys, tokens, or passwords.
- **GitHub**: git remote configured, push directly
- **Oracle Cloud**: SSH key at `C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key`
- **Supabase**: `SUPABASE_SERVICE_ROLE_KEY` in `D:/claude/PokeSpire/.env.local` (user has provided this 3 times — always read from file, never ask again)

## Supabase
- Project ref: jydcurgjlwwkqwoilqib
- Env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (all in .env.local)
- MCP config: .claude/mcp.json
- Service role key: stored in .env.local as SUPABASE_SERVICE_ROLE_KEY (user has provided this 3 times — do NOT ask again, read it from .env.local)

## Oracle Cloud Deployment
- URL: http://pokespire.teckem.com
- IP: 163.192.32.60 (ubuntu user)
- SSH key: C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key
- Nginx root (what gets served): /var/www/pokespire
- Staging path: /home/ubuntu/pokespire/dist
- Static files only — no Docker, no git repo, no server process on Oracle

### Deploy steps
1. `git push origin`
2. `npm run build` — fix TS errors first (runs tsc -b && vite build)
3. `scp -i "C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key" -r D:/claude/PokeSpire/dist/* ubuntu@163.192.32.60:/home/ubuntu/pokespire/dist/`
4. `ssh ... "sudo cp -r /home/ubuntu/pokespire/dist/* /var/www/pokespire/ && sudo chown -R www-data:www-data /var/www/pokespire"`
5. Verify: `ssh ... "ls -lh /var/www/pokespire/"`
- rsync not available locally — always use scp

## PokéAPI

**What it is:** Free, public, no-auth REST API for canonical Pokémon game data.
**Base URL:** `https://pokeapi.co/api/v2/`
**Docs:** https://pokeapi.co/

### How to connect
No API key required. Plain `fetch()` or `curl`. Rate limit: 100 req/min per IP (generous for one-time scripts).

### What we pull
One-time data migration script (`scripts/fetch-pokemon-data.mjs`). Run manually when pokemon data needs refreshing — **not at runtime**.

| Endpoint | Data pulled | Used for |
|---|---|---|
| `/pokemon/{id}` | `name`, `types[].type.name`, `stats[]` (hp, attack, defense, special-attack, special-defense, speed) | `src/data/pokemon.ts` → `POKEMON_TEMPLATES` |

**Sprites** are fetched at runtime (not from the migration script) via the PokeAPI GitHub CDN:
`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png`
This is handled in `src/hooks/usePokemon.ts`.

### What we do NOT pull from the API
- Moves — hand-authored in `src/data/moves.ts` (game-specific tuning)
- Learnsets — hand-authored in `src/data/learnsets.ts`
- Items, gym leaders, achievements — fully custom

### Archive
All pre-migration data + 46 sprites are preserved in `archive/` (committed 2026-05-11).
Restore: copy `archive/data/*.ts` back to `src/data/`.

## Asset Safety
- **Never delete any files in `src/assets/` or `public/` without explicit user approval.** Ask first, always.

## Issues
- Issue files: D:/claude/PokeSpire/issues/ (13 total, all completed)

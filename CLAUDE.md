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

## Supabase
- Project ref: jydcurgjlwwkqwoilqib
- Env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (in .env.local)
- MCP config: .claude/mcp.json

## Oracle Cloud Deployment
- IP: 163.192.32.60 (ubuntu user)
- SSH key: C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key
- Deploy path: /home/ubuntu/pokespire/dist
- Static files only — no Docker, no git repo, no server process on Oracle

### Deploy steps
1. `git push origin`
2. `npm run build` — fix TS errors first (runs tsc -b && vite build)
3. `scp -i "C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key" -r D:/claude/PokeSpire/dist/* ubuntu@163.192.32.60:/home/ubuntu/pokespire/dist/`
4. Verify: `ssh -i "C:/Users/lmats/.ssh/ssh-key-2026-04-08 (1).key" ubuntu@163.192.32.60 "ls -lh /home/ubuntu/pokespire/dist/"`
- rsync not available locally — always use scp

## Issues
- Issue files: D:/claude/PokeSpire/issues/ (13 total, all completed)

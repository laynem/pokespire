## Problem Statement

Players experience a fragmented, inconsistent UI across screens — Pokémon are displayed differently depending on context (catch, center, victory, starter select), moves are sometimes shown as plain lists instead of proper cards, the map is a single linear blob with unclear routing options, and several battle interactions are broken or missing (deck/discard visibility, coin-flip debuff dodging, trainer sprites). The footer also covers interactive buttons on several screens, and map events are poorly distributed (too many PokeCenter events early, not enough catch events in the opening).

## Solution

Introduce a shared `PokemonStatCard` component used everywhere a Pokémon is displayed. Redesign the map generator to produce 3–4 parallel vertical lanes with lateral connections. Add normal vs. elite battle types (trainer sprites). Implement coin-flip debuff dodging and deck/discard modals in battle. Fix the reward screen, catch screen, and Pokémon Center to use the new card standard. Fix the global footer layout so it never covers content.

## User Stories

1. As a player, I want to see a Pokémon's level, HP, ATK, DEF, SpATK, SpDEF, and XP on every card so I can make informed decisions everywhere.
2. As a player, I want the starter select screen to show full current stats (not base stats) so I know what I'm actually choosing.
3. As a player, I want to see the Pokémon's type badges on every card so I can evaluate matchups at a glance.
4. As a player, I want the catch event to show Pokémon cards in the same layout as the starter select screen so the experience is consistent.
5. As a player, I want to see the MoveCards associated with a caught Pokémon after selecting it, just like the starter select screen shows starting cards.
6. As a player, I want the map to show 3–4 parallel vertical lanes so I can choose my own path through the run.
7. As a player, I want each lane to branch into sub-paths 2–3 times so there is meaningful routing choice within a lane.
8. As a player, I want adjacent lanes to be connected every 4–6 events (as path choices, not events) so I can switch lanes strategically.
9. As a player, I want lanes to only connect to directly adjacent lanes so the routing stays readable.
10. As a player, I want Home and Gym nodes to be visually twice as large as regular nodes so they stand out as major milestones.
11. As a player, I want the map background to be a grass texture image at low opacity so the map feels like a route.
12. As a player, I want PokeCenter events to appear more frequently near the end of the map and never in the first 3 events so healing feels earned.
13. As a player, I want catch events to appear more frequently in the first 5 events so I can build my team early.
14. As a player, I want normal battles to show a male or female trainer sprite (randomly chosen) so battles feel like trainer encounters.
15. As a player, I want elite battles to show a boss trainer sprite so I can tell them apart from regular fights.
16. As a player, I want elite trainers to have more Pokémon depending on the act (Act 1 = 2, Act 2 = 3, Act 3 = 4) so difficulty scales.
17. As a player, I want a coin flip modal to appear automatically whenever a debuff is about to land on my Pokémon, so I have a chance to dodge it.
18. As a player, I want heads on the coin flip to cancel the debuff and tails to apply it so the mechanic is fair and clear.
19. As a player, I want to click the deck pile in battle to see all remaining cards in a modal so I can plan my turns.
20. As a player, I want to click the discard pile in battle to see all already-played cards in a modal so I can track what has been used.
21. As a player, I want deck and discard modals to show actual MoveCards (not a list) so the visual language is consistent.
22. As a player, I want the enemy Pokémon sprite to stay fixed in position across page refreshes so the UI is not jarring.
23. As a player, I want the battle victory screen to remove the trophy icon so the layout is cleaner.
24. As a player, I want to see the earned Pokémon (with full stats card) below the gold earned section on the victory screen.
25. As a player, I want the move draft on the victory screen to show 3 horizontal MoveCards so it matches the hand layout.
26. As a player, I want to see the name of the Pokémon who can use each draft move below its card so I know who will learn it.
27. As a player, I want no background panel behind the draft MoveCards on the victory screen so they look like real cards.
28. As a player, I want the Pokémon Center to offer only Heal and Move Tutor (no other options) so the choice is simple.
29. As a player, I want the Pokémon Center to display my Pokémon as full stat cards (vertical layout) so I can see who needs healing.
30. As a player, I want move tutor options shown as real MoveCards (not a list) so I can evaluate moves visually.
31. As a player, I want only one move tutor session per Pokémon Center visit so the resource feels meaningful.
32. As a player, I want the icon above the Pokémon Center heading removed so the layout is cleaner.
33. As a player, I want the footer to never cover interactive buttons on any screen so I can always complete actions.
34. As a player, I want the legal/copyright message to be 60% page width and centered so it does not dominate the footer.
35. As a player, I want more padding below the copyright text so the footer breathes.
36. As a player, I want the correct favicon to appear in the browser tab so the app looks polished.
37. As a player, I want move cards to always render as visual cards (never plain text lists) everywhere in the app.
38. As a player, I want the map background color to be a vivid green (rgb(55 177 104)) replacing the dark green so the map pops.
39. As a player, I want the dashes between map event nodes to be thicker so the path is easy to follow.

## Implementation Decisions

### New Shared Component: PokemonStatCard
- Accepts a built Pokemon object (with current stats)
- Displays: large pixelated sprite, name, type badges, level, HP, ATK, DEF, SpATK, SpDEF, XP
- Selected state: yellow border, glow, slight scale
- Used on: StarterSelectScreen, CatchScreen, RewardScreen, PokemonCenterScreen
- StarterSelectScreen calls buildPokemon(id, 5) per option to get live stats for display

### Map Generator Redesign
- Replace row-based grid with lane-based generator
- Lane count: random 3 (common) or 4 (rare) per run, seeded from run seed
- Events per lane: 13-15, random per lane
- Sub-branching: within each lane, 2-3 branch points each splitting into 2 paths that rejoin
- Cross-lane connections: traversal edges only (no node), every 4-6 events, adjacent lanes only
- Node type distribution:
  - First 3 events: no PokeCenter
  - Events 1-5: elevated catch weight
  - Last 20% of events: elevated PokeCenter weight
- MapNode.type gains 'normal_battle' and 'elite_battle' replacing 'combat'/wild
- Routing: NODE_ROUTE in MapScreen maps new types to appropriate screens, passing battle variant via location.state

### Battle Type Split
- normal_battle node: randomly assigns enemy_male or enemy_female sprite on generation
- elite_battle node: uses enemy_boss sprite; enemy party size = act number + 1
- Node icons on map use corresponding small PNG assets
- Battle screen reads location.state.battleType to select large trainer sprite
- Wild Pokemon battle logic removed; all combats are trainer battles

### Coin Flip Mechanic
- combatEngine.ts: before applying any status effect to the player, resolve a coin flip (Math.random() < 0.5)
- If flip wins: status not applied, log shows dodged with a coin flip!
- If flip loses: status applied normally
- CombatScreen.tsx: shows a CoinFlipModal overlay briefly (heads/tails animation then result) before continuing combat
- No cost, automatic, applies to all status effects (sleep, poison, burn, paralysis, freeze, confusion)

### Deck and Discard Modals
- Two new local state booleans in CombatScreen: showDeckModal, showDiscardModal
- Deck pile button and discard pile button become clickable
- Modal renders a scrollable grid of MoveCard components from combatState.playerDeck / combatState.playerDiscard
- Modal closes on backdrop click or X button

### Pokemon Sprite Positioning Fix
- z-10 absolutely positioned sprite containers in CombatScreen get inline style top: -150px; right: -150px for enemy, mirrored for player
- Enemy Pokemon seeded from runState.seed + currentNodeId so it is stable across refreshes

### Victory Screen (RewardScreen)
- Remove trophy image element
- After gold earned display: render PokemonStatCard for the defeated Pokemon (passed via location.state)
- Move draft: 3 MoveCard components in a horizontal flex row; remove any surrounding panel background
- Below each MoveCard: small text showing the party Pokemon who learns it (resolved via learnset lookup)
- Remove text description shown next to cards

### Pokemon Center Screen
- Remove decorative icon above heading
- Replace current party list with PokemonStatCard grid
- Move Tutor flow unchanged (wizard), but step 3 renders MoveCard components instead of a text list
- Add tutorUsed local state boolean; hide Move Tutor button after one use per visit

### Catch Screen
- Replace PokemonCard with PokemonStatCard
- After selection, render selected Pokémons starting MoveCards in a horizontal flex row below the card grid, identical to StarterSelectScreen Starting Cards panel

### Global Footer Fix
- All full-screen layouts get padding-bottom so content scrolls above footer
- Footer container: position fixed, bottom 0, with explicit height
- Legal message: max-width 60%, margin 0 auto, text-align center
- Copyright section: add pb-4 or equivalent spacing below

### Favicon
- index.html: update href to point to correct favicon from src/assets/favicon.svg (copy to public or import via Vite)

### Map Visuals
- Map container background: rgb(55 177 104)
- Replace all bg-green-900 on map with arbitrary Tailwind or inline style
- Background image layer: background_grass.png at opacity-25, position absolute, inset 0, height 100%
- SVG path strokeWidth for edges: increase to 3 or 4
- Home/Gym node containers: 2x width and height of standard node size using PNG assets

## Testing Decisions

No test framework is present in this project. Manual browser verification is the standard.

Good verification targets:
- PokemonStatCard renders correctly with all 6 stat fields and sprite for a built Pokemon
- Map generator produces exactly 3 or 4 lanes with 13-15 nodes each and no cross-lane skip connections
- Coin flip modal appears on every status-inflicting move; combat proceeds correctly on both outcomes
- Deck/discard modals open and close correctly; cards match actual combat state
- Victory screen shows move draft as 3 horizontal cards with Pokemon name below each
- Pokemon Center move tutor button locks after one use per visit
- Footer does not overlap any interactive button on any screen

## Out of Scope

- New move effects or balance changes
- New acts or act progression changes
- Shop/Pokemart event redesign
- Multiplayer or leaderboard features
- Sound or music
- Animation overhaul beyond coin flip modal
- New Pokemon or move data

## Further Notes

- All new assets are already present in src/assets/ — no new files needed from the user.
- The NodeType union in types/index.ts will need 'normal_battle' and 'elite_battle' added.
- The map generator seed must be stable per run — use runState.seed already in Zustand.
- The coin flip modal should be brief (under 1.5s animation) so it does not interrupt combat flow.

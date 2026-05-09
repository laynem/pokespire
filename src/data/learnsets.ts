export interface LearnsetEntry {
  level: number;
  moveId: string; // matches id in MOVES record from src/data/moves.ts
}

// keyed by pokemon id (number)
export const LEARNSETS: Record<number, LearnsetEntry[]> = {
  // -------------------------------------------------------------------------
  // Caterpie (10)
  // -------------------------------------------------------------------------
  10: [
    { level: 1,  moveId: "tackle" },
  ],

  // -------------------------------------------------------------------------
  // Weedle (13) — no available moves in moves.ts
  // -------------------------------------------------------------------------
  13: [],

  // -------------------------------------------------------------------------
  // Pidgey (16)
  // -------------------------------------------------------------------------
  16: [
    { level: 1,  moveId: "tackle" },
    { level: 12, moveId: "quick_attack" },
    { level: 36, moveId: "agility" },
  ],

  // -------------------------------------------------------------------------
  // Rattata (19)
  // -------------------------------------------------------------------------
  19: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "tail_whip" },
    { level: 7,  moveId: "quick_attack" },
  ],

  // -------------------------------------------------------------------------
  // Clefairy (35)
  // -------------------------------------------------------------------------
  35: [
    { level: 1,  moveId: "growl" },
    { level: 48, moveId: "light_screen" },
  ],

  // -------------------------------------------------------------------------
  // Vulpix (37)
  // -------------------------------------------------------------------------
  37: [
    { level: 1,  moveId: "ember" },
    { level: 16, moveId: "tail_whip" },
    { level: 19, moveId: "quick_attack" },
    { level: 35, moveId: "flamethrower" },
    { level: 42, moveId: "fire_spin" },
  ],

  // -------------------------------------------------------------------------
  // Jigglypuff (39)
  // -------------------------------------------------------------------------
  39: [
    { level: 44, moveId: "double_edge" },
  ],

  // -------------------------------------------------------------------------
  // Zubat (41)
  // -------------------------------------------------------------------------
  41: [
    { level: 15, moveId: "bite" },
  ],

  // -------------------------------------------------------------------------
  // Oddish (43)
  // -------------------------------------------------------------------------
  43: [
    { level: 15, moveId: "poison_powder" },
    { level: 19, moveId: "sleep_powder" },
    { level: 39, moveId: "solar_beam" },
  ],

  // -------------------------------------------------------------------------
  // Paras (46)
  // -------------------------------------------------------------------------
  46: [
    { level: 1,  moveId: "scratch" },
    { level: 1,  moveId: "poison_powder" },
    { level: 27, moveId: "slash" },
    { level: 34, moveId: "growth" },
    { level: 41, moveId: "solar_beam" },
  ],

  // -------------------------------------------------------------------------
  // Psyduck (54)
  // -------------------------------------------------------------------------
  54: [
    { level: 1,  moveId: "scratch" },
    { level: 1,  moveId: "tail_whip" },
  ],

  // -------------------------------------------------------------------------
  // Growlithe (58)
  // -------------------------------------------------------------------------
  58: [
    { level: 1,  moveId: "bite" },
    { level: 18, moveId: "ember" },
    { level: 23, moveId: "leer" },
    { level: 30, moveId: "take_down" },
    { level: 39, moveId: "agility" },
    { level: 50, moveId: "flamethrower" },
  ],

  // -------------------------------------------------------------------------
  // Machop (66)
  // -------------------------------------------------------------------------
  66: [
    { level: 1,  moveId: "leer" },
  ],

  // -------------------------------------------------------------------------
  // Bellsprout (69)
  // -------------------------------------------------------------------------
  69: [
    { level: 1,  moveId: "vine_whip" },
    { level: 1,  moveId: "growth" },
    { level: 15, moveId: "poison_powder" },
    { level: 18, moveId: "sleep_powder" },
    { level: 33, moveId: "razor_leaf" },
    { level: 42, moveId: "slam" },
  ],

  // -------------------------------------------------------------------------
  // Geodude (74)
  // -------------------------------------------------------------------------
  74: [
    { level: 1,  moveId: "tackle" },
  ],

  // -------------------------------------------------------------------------
  // Slowpoke (79)
  // -------------------------------------------------------------------------
  79: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "growl" },
    { level: 6,  moveId: "water_gun" },
    { level: 50, moveId: "rain_dance" },
  ],

  // -------------------------------------------------------------------------
  // Magnemite (81)
  // -------------------------------------------------------------------------
  81: [
    { level: 1,  moveId: "thunder_shock" },
    { level: 16, moveId: "thunder_wave" },
    { level: 41, moveId: "discharge" },
  ],

  // -------------------------------------------------------------------------
  // Gastly (92) — no available moves in moves.ts
  // -------------------------------------------------------------------------
  92: [],

  // -------------------------------------------------------------------------
  // Onix (95)
  // -------------------------------------------------------------------------
  95: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "screech" },
    { level: 9,  moveId: "bind" },
    { level: 19, moveId: "harden" },
  ],

  // -------------------------------------------------------------------------
  // Voltorb (100)
  // -------------------------------------------------------------------------
  100: [
    { level: 1,  moveId: "tackle" },
    { level: 9,  moveId: "screech" },
    { level: 14, moveId: "sonic_boom" },
    { level: 21, moveId: "thunder_wave" },
    { level: 29, moveId: "thunder_shock" },
    { level: 40, moveId: "thunderbolt" },
  ],

  // -------------------------------------------------------------------------
  // Staryu (120)
  // -------------------------------------------------------------------------
  120: [
    { level: 1,  moveId: "tackle" },
    { level: 17, moveId: "water_gun" },
    { level: 22, moveId: "rapid_spin" },
    { level: 32, moveId: "harden" },
    { level: 37, moveId: "recover" },
  ],

  // -------------------------------------------------------------------------
  // Starmie (121)
  // -------------------------------------------------------------------------
  121: [
    { level: 1,  moveId: "water_gun" },
    { level: 1,  moveId: "recover" },
    { level: 18, moveId: "rapid_spin" },
  ],

  // -------------------------------------------------------------------------
  // Scyther (123)
  // -------------------------------------------------------------------------
  123: [
    { level: 1,  moveId: "quick_attack" },
    { level: 1,  moveId: "leer" },
    { level: 29, moveId: "agility" },
    { level: 38, moveId: "slash" },
  ],

  // -------------------------------------------------------------------------
  // Electabuzz (125)
  // -------------------------------------------------------------------------
  125: [
    { level: 1,  moveId: "quick_attack" },
    { level: 1,  moveId: "leer" },
    { level: 20, moveId: "thunder_wave" },
    { level: 29, moveId: "thunder_shock" },
    { level: 35, moveId: "light_screen" },
    { level: 54, moveId: "thunder" },
  ],

  // -------------------------------------------------------------------------
  // Magmar (126)
  // -------------------------------------------------------------------------
  126: [
    { level: 1,  moveId: "ember" },
    { level: 1,  moveId: "leer" },
    { level: 9,  moveId: "smokescreen" },
    { level: 54, moveId: "flamethrower" },
  ],

  // -------------------------------------------------------------------------
  // Pinsir (127) — no available moves in moves.ts
  // -------------------------------------------------------------------------
  127: [],

  // -------------------------------------------------------------------------
  // Lapras (131)
  // -------------------------------------------------------------------------
  131: [
    { level: 1,  moveId: "water_gun" },
    { level: 1,  moveId: "growl" },
    { level: 47, moveId: "rain_dance" },
  ],

  // -------------------------------------------------------------------------
  // Eevee (133)
  // -------------------------------------------------------------------------
  133: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "tail_whip" },
    { level: 1,  moveId: "growl" },
    { level: 16, moveId: "quick_attack" },
    { level: 23, moveId: "bite" },
    { level: 36, moveId: "take_down" },
  ],

  // -------------------------------------------------------------------------
  // Bulbasaur (1)
  // -------------------------------------------------------------------------
  1: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "growl" },
    { level: 7,  moveId: "leech_seed" },
    { level: 13, moveId: "vine_whip" },
    { level: 22, moveId: "poison_powder" },
    { level: 29, moveId: "razor_leaf" },
    { level: 38, moveId: "growth" },
    { level: 45, moveId: "sleep_powder" },
    { level: 52, moveId: "solar_beam" },
  ],

  // -------------------------------------------------------------------------
  // Ivysaur (2)
  // -------------------------------------------------------------------------
  2: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "growl" },
    { level: 1,  moveId: "leech_seed" },
    { level: 7,  moveId: "leech_seed" },
    { level: 13, moveId: "vine_whip" },
    { level: 22, moveId: "poison_powder" },
    { level: 30, moveId: "razor_leaf" },
    { level: 43, moveId: "growth" },
    { level: 50, moveId: "sleep_powder" },
    { level: 65, moveId: "solar_beam" },
  ],

  // -------------------------------------------------------------------------
  // Venusaur (3)
  // -------------------------------------------------------------------------
  3: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "growl" },
    { level: 1,  moveId: "leech_seed" },
    { level: 7,  moveId: "leech_seed" },
    { level: 13, moveId: "vine_whip" },
    { level: 22, moveId: "poison_powder" },
    { level: 30, moveId: "razor_leaf" },
    { level: 43, moveId: "growth" },
    { level: 55, moveId: "sleep_powder" },
    { level: 65, moveId: "solar_beam" },
  ],

  // -------------------------------------------------------------------------
  // Charmander (4)
  // -------------------------------------------------------------------------
  4: [
    { level: 1,  moveId: "scratch" },
    { level: 1,  moveId: "growl" },
    { level: 9,  moveId: "ember" },
    { level: 15, moveId: "leer" },
    { level: 22, moveId: "rage" },
    { level: 30, moveId: "slash" },
    { level: 38, moveId: "flamethrower" },
    { level: 46, moveId: "fire_spin" },
  ],

  // -------------------------------------------------------------------------
  // Charmeleon (5)
  // -------------------------------------------------------------------------
  5: [
    { level: 1,  moveId: "scratch" },
    { level: 1,  moveId: "growl" },
    { level: 1,  moveId: "ember" },
    { level: 9,  moveId: "ember" },
    { level: 15, moveId: "leer" },
    { level: 24, moveId: "rage" },
    { level: 33, moveId: "slash" },
    { level: 42, moveId: "flamethrower" },
    { level: 56, moveId: "fire_spin" },
  ],

  // -------------------------------------------------------------------------
  // Charizard (6)
  // -------------------------------------------------------------------------
  6: [
    { level: 1,  moveId: "scratch" },
    { level: 1,  moveId: "growl" },
    { level: 1,  moveId: "ember" },
    { level: 9,  moveId: "ember" },
    { level: 15, moveId: "leer" },
    { level: 24, moveId: "rage" },
    { level: 36, moveId: "slash" },
    { level: 46, moveId: "flamethrower" },
    { level: 55, moveId: "fire_spin" },
    { level: 64, moveId: "flare_blitz" },
  ],

  // -------------------------------------------------------------------------
  // Squirtle (7)
  // -------------------------------------------------------------------------
  7: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "tail_whip" },
    { level: 8,  moveId: "bubble" },
    { level: 15, moveId: "withdraw" },
    { level: 22, moveId: "water_gun" },
    { level: 28, moveId: "bite" },
    { level: 35, moveId: "rapid_spin" },
    { level: 42, moveId: "protect" },
    { level: 52, moveId: "rain_dance" },
    { level: 58, moveId: "skull_bash" },
    { level: 65, moveId: "hydro_pump" },
  ],

  // -------------------------------------------------------------------------
  // Wartortle (8)
  // -------------------------------------------------------------------------
  8: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "tail_whip" },
    { level: 1,  moveId: "bubble" },
    { level: 8,  moveId: "bubble" },
    { level: 15, moveId: "withdraw" },
    { level: 24, moveId: "water_gun" },
    { level: 31, moveId: "bite" },
    { level: 39, moveId: "rapid_spin" },
    { level: 47, moveId: "protect" },
    { level: 54, moveId: "rain_dance" },
    { level: 62, moveId: "skull_bash" },
    { level: 72, moveId: "hydro_pump" },
  ],

  // -------------------------------------------------------------------------
  // Blastoise (9)
  // -------------------------------------------------------------------------
  9: [
    { level: 1,  moveId: "tackle" },
    { level: 1,  moveId: "tail_whip" },
    { level: 1,  moveId: "bubble" },
    { level: 8,  moveId: "bubble" },
    { level: 15, moveId: "withdraw" },
    { level: 24, moveId: "water_gun" },
    { level: 31, moveId: "bite" },
    { level: 39, moveId: "rapid_spin" },
    { level: 47, moveId: "protect" },
    { level: 55, moveId: "rain_dance" },
    { level: 62, moveId: "skull_bash" },
    { level: 76, moveId: "hydro_pump" },
  ],

  // -------------------------------------------------------------------------
  // Pikachu (25)
  // -------------------------------------------------------------------------
  25: [
    { level: 1,  moveId: "thunder_shock" },
    { level: 1,  moveId: "growl" },
    { level: 9,  moveId: "tail_whip" },
    { level: 16, moveId: "thunder_wave" },
    { level: 26, moveId: "quick_attack" },
    { level: 33, moveId: "double_team" },
    { level: 41, moveId: "slam" },
    { level: 50, moveId: "thunderbolt" },
    { level: 58, moveId: "agility" },
    { level: 65, moveId: "thunder" },
    { level: 73, moveId: "light_screen" },
  ],

  // -------------------------------------------------------------------------
  // Raichu (26)
  // -------------------------------------------------------------------------
  26: [
    { level: 1,  moveId: "thunder_shock" },
    { level: 1,  moveId: "tail_whip" },
    { level: 1,  moveId: "quick_attack" },
    { level: 1,  moveId: "thunderbolt" },
  ],
};

export function getLearnset(pokemonId: number): LearnsetEntry[] {
  return LEARNSETS[pokemonId] ?? [];
}

export function getMovesAtLevel(pokemonId: number, level: number): string[] {
  return getLearnset(pokemonId)
    .filter((entry) => entry.level <= level)
    .map((entry) => entry.moveId);
}

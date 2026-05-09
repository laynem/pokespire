export interface LearnsetEntry {
  level: number;
  moveId: string; // matches id in MOVES record from src/data/moves.ts
}

// keyed by pokemon id (number)
export const LEARNSETS: Record<number, LearnsetEntry[]> = {
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

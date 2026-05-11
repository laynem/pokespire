export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'beat_brock',
    name: 'Rock Solid',
    description: 'Defeat Brock and earn the Boulder Badge.',
    icon: '🪨',
  },
  {
    id: 'beat_misty',
    name: 'Tidal Wave',
    description: 'Defeat Misty and earn the Cascade Badge.',
    icon: '💧',
  },
  {
    id: 'beat_lt_surge',
    name: 'Surge Protector',
    description: 'Defeat Lt. Surge and earn the Thunder Badge.',
    icon: '⚡',
  },
  {
    id: 'catch_em_all',
    name: "Catch 'Em All",
    description: 'Catch every Pokémon available in the game.',
    icon: '🏆',
  },
  {
    id: 'card_collector',
    name: 'Full Deck',
    description: 'Collect every move card available in the game.',
    icon: '🃏',
  },
  {
    id: 'item_hoarder',
    name: 'Bag Full',
    description: 'Find every item available in the game.',
    icon: '🎒',
  },
];

// All Pokémon IDs obtainable via catch screens or as starters
export const CATCHABLE_POKEMON_IDS: number[] = Array.from(new Set([
  // Starters
  1, 4, 7, 25,
  // Act 1 catch pool
  16, 19, 10, 13, 39, 35, 43, 69, 41, 46, 54, 63,
  // Act 2 catch pool
  74, 41, 46, 54, 79, 81, 92, 66, 58, 37, 77, 60,
  // Act 3 catch pool
  58, 37, 125, 126, 123, 127, 133, 131, 147, 116, 111, 115,
]));

export const GYM_BADGE_TO_ACHIEVEMENT: Record<string, string> = {
  'Boulder Badge': 'beat_brock',
  'Cascade Badge': 'beat_misty',
  'Thunder Badge': 'beat_lt_surge',
};

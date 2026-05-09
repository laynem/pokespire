export interface BossTeamMember {
  pokemonId: number;
  level: number;
  moveIds: string[];
}

export interface GymLeader {
  id: string;
  name: string;
  title: string;
  badge: string;
  badgeBonus: string;
  bgClass: string; // tailwind background
  spriteUrl: string;
  team: BossTeamMember[];
  rewardItemIds: [string, string];
  goldMin: number;
  goldMax: number;
}

export const GYM_LEADERS: Record<string, GymLeader> = {
  brock: {
    id: 'brock',
    name: 'Brock',
    title: 'Pewter City Gym Leader',
    badge: 'Boulder Badge',
    badgeBonus: 'All party Pokémon gain +10% Defense.',
    bgClass: 'bg-stone-950',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    team: [
      { pokemonId: 74,  level: 12, moveIds: ['tackle', 'defense_curl', 'rock_throw'] },
      { pokemonId: 95,  level: 14, moveIds: ['tackle', 'screech', 'rock_throw', 'bind'] },
    ],
    rewardItemIds: ['choice_band', 'kings_rock'],
    goldMin: 150,
    goldMax: 200,
  },
  misty: {
    id: 'misty',
    name: 'Misty',
    title: 'Cerulean City Gym Leader',
    badge: 'Cascade Badge',
    badgeBonus: 'All Water-type moves deal +15% damage.',
    bgClass: 'bg-blue-950',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    team: [
      { pokemonId: 120, level: 18, moveIds: ['water_gun', 'rapid_spin', 'harden'] },
      { pokemonId: 121, level: 21, moveIds: ['water_gun', 'psychic_move', 'swift', 'recover'] },
    ],
    rewardItemIds: ['shell_bell', 'lum_berry'],
    goldMin: 150,
    goldMax: 200,
  },
  lt_surge: {
    id: 'lt_surge',
    name: 'Lt. Surge',
    title: 'Vermilion City Gym Leader',
    badge: 'Thunder Badge',
    badgeBonus: 'Gain +1 Energy on the first turn of each combat.',
    bgClass: 'bg-yellow-950',
    spriteUrl: 'https://play.pokemonshowdown.com/sprites/trainers/lt-surge.png',
    team: [
      { pokemonId: 100, level: 21, moveIds: ['thunder_shock', 'screech', 'sonic_boom'] },
      { pokemonId: 25,  level: 18, moveIds: ['thunder_shock', 'quick_attack', 'thunder_wave'] },
      { pokemonId: 26,  level: 24, moveIds: ['thunderbolt', 'mega_punch', 'thunder_wave', 'slam'] },
    ],
    rewardItemIds: ['quick_claw', 'exp_share'],
    goldMin: 150,
    goldMax: 200,
  },
};

export const ACT_BOSS: Record<number, string> = { 1: 'brock', 2: 'misty', 3: 'lt_surge' };

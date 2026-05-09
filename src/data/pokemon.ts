import type { PokemonType } from '../types';

export interface PokemonTemplate {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    spAtk: number;
    spDef: number;
    speed: number;
  };
  sprite?: string;
  evolvesAt?: number;
  evolvesInto?: number;
}

export const POKEMON_TEMPLATES: Record<number, PokemonTemplate> = {
  // --- Bulbasaur line ---
  1: {
    id: 1,
    name: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    baseStats: { hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
    evolvesAt: 16,
    evolvesInto: 2,
  },
  2: {
    id: 2,
    name: 'Ivysaur',
    types: ['Grass', 'Poison'],
    baseStats: { hp: 60, attack: 62, defense: 63, spAtk: 80, spDef: 80, speed: 60 },
    evolvesAt: 32,
    evolvesInto: 3,
  },
  3: {
    id: 3,
    name: 'Venusaur',
    types: ['Grass', 'Poison'],
    baseStats: { hp: 80, attack: 82, defense: 83, spAtk: 100, spDef: 100, speed: 80 },
  },

  // --- Charmander line ---
  4: {
    id: 4,
    name: 'Charmander',
    types: ['Fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, spAtk: 60, spDef: 50, speed: 65 },
    evolvesAt: 16,
    evolvesInto: 5,
  },
  5: {
    id: 5,
    name: 'Charmeleon',
    types: ['Fire'],
    baseStats: { hp: 58, attack: 64, defense: 58, spAtk: 80, spDef: 65, speed: 80 },
    evolvesAt: 36,
    evolvesInto: 6,
  },
  6: {
    id: 6,
    name: 'Charizard',
    types: ['Fire', 'Flying'],
    baseStats: { hp: 78, attack: 84, defense: 78, spAtk: 109, spDef: 85, speed: 100 },
  },

  // --- Squirtle line ---
  7: {
    id: 7,
    name: 'Squirtle',
    types: ['Water'],
    baseStats: { hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
    evolvesAt: 16,
    evolvesInto: 8,
  },
  8: {
    id: 8,
    name: 'Wartortle',
    types: ['Water'],
    baseStats: { hp: 59, attack: 63, defense: 80, spAtk: 65, spDef: 80, speed: 58 },
    evolvesAt: 36,
    evolvesInto: 9,
  },
  9: {
    id: 9,
    name: 'Blastoise',
    types: ['Water'],
    baseStats: { hp: 79, attack: 83, defense: 100, spAtk: 85, spDef: 105, speed: 78 },
  },

  // --- Pikachu line ---
  25: {
    id: 25,
    name: 'Pikachu',
    types: ['Electric'],
    baseStats: { hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
    evolvesAt: 30,
    evolvesInto: 26,
  },
  26: {
    id: 26,
    name: 'Raichu',
    types: ['Electric'],
    baseStats: { hp: 60, attack: 90, defense: 55, spAtk: 90, spDef: 80, speed: 110 },
  },
};

export function getPokemonTemplate(id: number): PokemonTemplate | undefined {
  return POKEMON_TEMPLATES[id];
}

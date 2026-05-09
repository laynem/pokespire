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

  // --- Act 1 ---
  10: {
    id: 10,
    name: 'Caterpie',
    types: ['Bug'] as PokemonType[],
    baseStats: { hp: 45, attack: 30, defense: 35, spAtk: 20, spDef: 20, speed: 45 },
    sprite: undefined,
  },
  13: {
    id: 13,
    name: 'Weedle',
    types: ['Bug', 'Poison'] as PokemonType[],
    baseStats: { hp: 40, attack: 35, defense: 30, spAtk: 20, spDef: 20, speed: 50 },
    sprite: undefined,
  },
  16: {
    id: 16,
    name: 'Pidgey',
    types: ['Normal', 'Flying'] as PokemonType[],
    baseStats: { hp: 40, attack: 45, defense: 40, spAtk: 35, spDef: 35, speed: 56 },
    sprite: undefined,
  },
  19: {
    id: 19,
    name: 'Rattata',
    types: ['Normal'] as PokemonType[],
    baseStats: { hp: 30, attack: 56, defense: 35, spAtk: 25, spDef: 35, speed: 72 },
    sprite: undefined,
  },
  35: {
    id: 35,
    name: 'Clefairy',
    types: ['Normal'] as PokemonType[],
    baseStats: { hp: 70, attack: 45, defense: 48, spAtk: 60, spDef: 65, speed: 35 },
    sprite: undefined,
  },
  37: {
    id: 37,
    name: 'Vulpix',
    types: ['Fire'] as PokemonType[],
    baseStats: { hp: 38, attack: 41, defense: 40, spAtk: 50, spDef: 65, speed: 65 },
    sprite: undefined,
  },
  39: {
    id: 39,
    name: 'Jigglypuff',
    types: ['Normal', 'Fairy'] as PokemonType[],
    baseStats: { hp: 115, attack: 45, defense: 20, spAtk: 45, spDef: 25, speed: 20 },
    sprite: undefined,
  },
  43: {
    id: 43,
    name: 'Oddish',
    types: ['Grass', 'Poison'] as PokemonType[],
    baseStats: { hp: 45, attack: 50, defense: 55, spAtk: 75, spDef: 65, speed: 30 },
    sprite: undefined,
  },
  46: {
    id: 46,
    name: 'Paras',
    types: ['Bug', 'Grass'] as PokemonType[],
    baseStats: { hp: 35, attack: 70, defense: 55, spAtk: 45, spDef: 55, speed: 25 },
    sprite: undefined,
  },
  54: {
    id: 54,
    name: 'Psyduck',
    types: ['Water'] as PokemonType[],
    baseStats: { hp: 50, attack: 52, defense: 48, spAtk: 65, spDef: 50, speed: 55 },
    sprite: undefined,
  },
  58: {
    id: 58,
    name: 'Growlithe',
    types: ['Fire'] as PokemonType[],
    baseStats: { hp: 55, attack: 70, defense: 45, spAtk: 70, spDef: 50, speed: 60 },
    sprite: undefined,
  },
  66: {
    id: 66,
    name: 'Machop',
    types: ['Fighting'] as PokemonType[],
    baseStats: { hp: 70, attack: 80, defense: 50, spAtk: 35, spDef: 35, speed: 35 },
    sprite: undefined,
  },
  69: {
    id: 69,
    name: 'Bellsprout',
    types: ['Grass', 'Poison'] as PokemonType[],
    baseStats: { hp: 50, attack: 75, defense: 35, spAtk: 70, spDef: 30, speed: 40 },
    sprite: undefined,
  },

  // --- Act 2 ---
  41: {
    id: 41,
    name: 'Zubat',
    types: ['Poison', 'Flying'] as PokemonType[],
    baseStats: { hp: 40, attack: 45, defense: 35, spAtk: 30, spDef: 40, speed: 55 },
    sprite: undefined,
  },
  74: {
    id: 74,
    name: 'Geodude',
    types: ['Rock', 'Ground'] as PokemonType[],
    baseStats: { hp: 40, attack: 80, defense: 100, spAtk: 30, spDef: 30, speed: 20 },
    sprite: undefined,
  },
  79: {
    id: 79,
    name: 'Slowpoke',
    types: ['Water', 'Psychic'] as PokemonType[],
    baseStats: { hp: 90, attack: 65, defense: 65, spAtk: 40, spDef: 40, speed: 15 },
    sprite: undefined,
  },
  81: {
    id: 81,
    name: 'Magnemite',
    types: ['Electric', 'Steel'] as PokemonType[],
    baseStats: { hp: 25, attack: 35, defense: 70, spAtk: 95, spDef: 55, speed: 45 },
    sprite: undefined,
  },
  92: {
    id: 92,
    name: 'Gastly',
    types: ['Ghost', 'Poison'] as PokemonType[],
    baseStats: { hp: 30, attack: 35, defense: 30, spAtk: 100, spDef: 35, speed: 80 },
    sprite: undefined,
  },

  // --- Act 3 ---
  123: {
    id: 123,
    name: 'Scyther',
    types: ['Bug', 'Flying'] as PokemonType[],
    baseStats: { hp: 70, attack: 110, defense: 80, spAtk: 55, spDef: 80, speed: 105 },
    sprite: undefined,
  },
  125: {
    id: 125,
    name: 'Electabuzz',
    types: ['Electric'] as PokemonType[],
    baseStats: { hp: 65, attack: 83, defense: 57, spAtk: 95, spDef: 85, speed: 105 },
    sprite: undefined,
  },
  126: {
    id: 126,
    name: 'Magmar',
    types: ['Fire'] as PokemonType[],
    baseStats: { hp: 65, attack: 95, defense: 57, spAtk: 100, spDef: 85, speed: 93 },
    sprite: undefined,
  },
  127: {
    id: 127,
    name: 'Pinsir',
    types: ['Bug'] as PokemonType[],
    baseStats: { hp: 65, attack: 125, defense: 100, spAtk: 55, spDef: 70, speed: 85 },
    sprite: undefined,
  },
  131: {
    id: 131,
    name: 'Lapras',
    types: ['Water', 'Ice'] as PokemonType[],
    baseStats: { hp: 130, attack: 85, defense: 80, spAtk: 85, spDef: 95, speed: 60 },
    sprite: undefined,
  },
  133: {
    id: 133,
    name: 'Eevee',
    types: ['Normal'] as PokemonType[],
    baseStats: { hp: 55, attack: 55, defense: 50, spAtk: 45, spDef: 65, speed: 55 },
    sprite: undefined,
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

import type { Pokemon, Move } from '../types';
import { POKEMON_TEMPLATES } from '../data/pokemon';
import { MOVES } from '../data/moves';
import { getMovesAtLevel } from '../data/learnsets';
import { getStarterDeck, STARTER_DECK_IDS } from '../data/starterDecks';

function calcHp(base: number, level: number): number {
  return Math.floor((2 * base * level) / 100) + level + 10;
}

function calcStat(base: number, level: number): number {
  return Math.floor((2 * base * level) / 100) + 5;
}

// Returns up to 4 moves learnable at the given level (most recently learned)
function selectMoves(pokemonId: number, level: number): Move[] {
  const moveIds = getMovesAtLevel(pokemonId, level);
  const tail = moveIds.slice(-4);
  return tail
    .map((id) => MOVES[id])
    .filter((m): m is Move => m !== undefined);
}

export function buildPokemon(pokemonId: number, level: number, overrideMoveIds?: string[]): Pokemon {
  const template = POKEMON_TEMPLATES[pokemonId];
  if (!template) throw new Error(`Unknown Pokémon id: ${pokemonId}`);

  const maxHp = calcHp(template.baseStats.hp, level);
  const isStarter = pokemonId in STARTER_DECK_IDS && level === 5;
  let moves: Move[];
  if (overrideMoveIds) {
    moves = overrideMoveIds.map((id) => MOVES[id]).filter((m): m is Move => m !== undefined);
  } else {
    moves = isStarter ? getStarterDeck(pokemonId) : selectMoves(pokemonId, level);
  }

  return {
    id: template.id,
    name: template.name,
    types: template.types,
    baseStats: {
      hp: maxHp,
      attack: calcStat(template.baseStats.attack, level),
      defense: calcStat(template.baseStats.defense, level),
      spAtk: calcStat(template.baseStats.spAtk, level),
      spDef: calcStat(template.baseStats.spDef, level),
      speed: calcStat(template.baseStats.speed, level),
    },
    currentHp: maxHp,
    maxHp,
    level,
    moves,
    status: null,
    sprite: template.sprite,
    xp: 0,
  };
}

export function getStarterOptions(): Array<{ id: number; name: string }> {
  return [
    { id: 1, name: 'Bulbasaur' },
    { id: 4, name: 'Charmander' },
    { id: 7, name: 'Squirtle' },
    { id: 25, name: 'Pikachu' },
  ];
}

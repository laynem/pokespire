import type { Move } from '../types';
import { MOVES } from './moves';

export const STARTER_DECK_IDS: Record<number, string[]> = {
  1:  ['tackle', 'growl', 'vine_whip', 'leech_seed'],        // Bulbasaur
  4:  ['scratch', 'growl', 'ember', 'smokescreen'],           // Charmander
  7:  ['tackle', 'tail_whip', 'water_gun', 'withdraw'],       // Squirtle
  25: ['thunder_shock', 'growl', 'tail_whip', 'quick_attack'], // Pikachu
};

// Returns the 4 starting moves for a starter pokemon
export function getStarterDeck(pokemonId: number): Move[] {
  const ids = STARTER_DECK_IDS[pokemonId];
  if (!ids) return [];
  return ids.map(id => MOVES[id]).filter((m): m is Move => m !== undefined);
}

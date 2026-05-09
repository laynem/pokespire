import type { PokemonType } from '../types';

type Chart = Partial<Record<PokemonType, number>>;

const TYPE_CHART: Record<PokemonType, Chart> = {
  Normal: {
    Ghost: 0,
  },
  Fire: {
    Grass: 2, Ice: 2, Bug: 2, Steel: 2,
    Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5,
  },
  Water: {
    Fire: 2, Ground: 2, Rock: 2,
    Water: 0.5, Grass: 0.5, Dragon: 0.5,
  },
  Electric: {
    Water: 2, Flying: 2,
    Ground: 0,
    Electric: 0.5, Grass: 0.5, Dragon: 0.5,
  },
  Grass: {
    Water: 2, Ground: 2, Rock: 2,
    Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5,
  },
  Ice: {
    Grass: 2, Ground: 2, Flying: 2, Dragon: 2,
    Water: 0.5, Ice: 0.5,
  },
  Fighting: {
    Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2,
    Ghost: 0,
    Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5,
  },
  Poison: {
    Grass: 2, Fairy: 2,
    Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5,
  },
  Ground: {
    Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2,
    Flying: 0,
    Grass: 0.5, Bug: 0.5,
  },
  Flying: {
    Grass: 2, Fighting: 2, Bug: 2,
    Electric: 0.5, Rock: 0.5, Steel: 0.5,
  },
  Psychic: {
    Fighting: 2, Poison: 2,
    Dark: 0,
    Psychic: 0.5, Steel: 0.5,
  },
  Bug: {
    Grass: 2, Psychic: 2, Dark: 2,
    Fire: 0.5, Fighting: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5,
  },
  Rock: {
    Fire: 2, Ice: 2, Flying: 2, Bug: 2,
    Fighting: 0.5, Ground: 0.5, Steel: 0.5,
  },
  Ghost: {
    Ghost: 2, Psychic: 2,
    Normal: 0,
    Dark: 0.5,
  },
  Dragon: {
    Dragon: 2,
    Fairy: 0,
    Steel: 0.5,
  },
  Dark: {
    Psychic: 2, Ghost: 2,
    Fighting: 0.5, Dark: 0.5, Fairy: 0.5,
  },
  Steel: {
    Ice: 2, Rock: 2, Fairy: 2,
    Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5,
  },
  Fairy: {
    Fighting: 2, Dragon: 2, Dark: 2,
    Fire: 0.5, Poison: 0.5, Steel: 0.5,
  },
};

export function getMultiplier(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  const chart = TYPE_CHART[moveType];
  return defenderTypes.reduce((acc, defType) => {
    const m = chart[defType] ?? 1;
    return acc * m;
  }, 1);
}

export function getEffectivenessLabel(multiplier: number): string | null {
  if (multiplier >= 2) return 'Super effective!';
  if (multiplier <= 0.5 && multiplier > 0) return 'Not very effective...';
  if (multiplier === 0) return 'It had no effect...';
  return null;
}

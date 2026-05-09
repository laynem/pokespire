export type PokemonType =
  | 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug'
  | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  category: 'physical' | 'special' | 'status';
  description: string;
  effect?: string;
  effectChance?: number;
  priority?: boolean;
}

export interface Pokemon {
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
  currentHp: number;
  maxHp: number;
  level: number;
  moves: Move[];
  status: 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | null;
  sprite?: string;
}

export interface Trainer {
  id: string;
  name: string;
  sprite: string;
  starterPokemonId: number;
}

export type NodeType = 'combat' | 'elite' | 'boss' | 'rest' | 'shop' | 'event' | 'treasure';

export interface MapNode {
  id: string;
  type: NodeType;
  act: number;
  row: number;
  col: number;
  connections: string[];
  cleared: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'held' | 'consumable' | 'keyitem';
  effect?: Record<string, unknown>;
}

export interface RunState {
  trainer: Trainer | null;
  party: Pokemon[];
  currentMap: MapNode[];
  currentNodeId: string | null;
  act: number;
  gold: number;
  items: Item[];
  badges: string[];
  pokemonCaught: number;
  movesLearned: number;
  totalGoldEarned: number;
  inRun: boolean;
  seed: number;
}

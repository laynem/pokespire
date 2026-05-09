import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RunState, Trainer, Pokemon, MapNode, Item, Move } from '../types';

interface RunActions {
  startRun: (trainer: Trainer, starterPokemon: Pokemon) => void;
  endRun: () => void;
  setCurrentNode: (nodeId: string) => void;
  clearNode: (nodeId: string) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateParty: (party: Pokemon[]) => void;
  addMoveToParty: (pokemonIndex: number, move: Move) => void;
  addBadge: (badge: string) => void;
  incrementPokemonCaught: () => void;
  incrementMovesLearned: () => void;
  setMap: (nodes: MapNode[]) => void;
  advanceAct: () => void;
}

const initialState: RunState = {
  trainer: null,
  party: [],
  currentMap: [],
  currentNodeId: null,
  act: 1,
  gold: 0,
  items: [],
  badges: [],
  pokemonCaught: 0,
  movesLearned: 0,
  totalGoldEarned: 0,
  inRun: false,
  seed: 0,
};

export const useRunStore = create<RunState & RunActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      startRun: (trainer, starterPokemon) =>
        set({
          trainer,
          party: [starterPokemon],
          currentMap: [],
          currentNodeId: null,
          act: 1,
          gold: 100,
          items: [],
          badges: [],
          pokemonCaught: 0,
          movesLearned: 0,
          totalGoldEarned: 100,
          inRun: true,
          seed: Date.now(),
        }),

      endRun: () => set({ ...initialState }),

      setCurrentNode: (nodeId) => set({ currentNodeId: nodeId }),

      clearNode: (nodeId) =>
        set((state) => ({
          currentMap: state.currentMap.map((n) =>
            n.id === nodeId ? { ...n, cleared: true } : n
          ),
        })),

      addGold: (amount) =>
        set((state) => ({
          gold: state.gold + amount,
          totalGoldEarned: state.totalGoldEarned + amount,
        })),

      spendGold: (amount) => {
        const { gold } = get();
        if (gold < amount) return false;
        set((state) => ({ gold: state.gold - amount }));
        return true;
      },

      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      updateParty: (party) => set({ party }),

      addMoveToParty: (pokemonIndex, move) =>
        set((state) => {
          const party = [...state.party];
          const pokemon = party[pokemonIndex];
          if (!pokemon || pokemon.moves.some((m) => m.id === move.id)) return {};
          party[pokemonIndex] = { ...pokemon, moves: [...pokemon.moves, move] };
          return { party };
        }),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge)
            ? state.badges
            : [...state.badges, badge],
        })),

      incrementPokemonCaught: () =>
        set((state) => ({ pokemonCaught: state.pokemonCaught + 1 })),

      incrementMovesLearned: () =>
        set((state) => ({ movesLearned: state.movesLearned + 1 })),

      setMap: (nodes) => set({ currentMap: nodes }),

      advanceAct: () =>
        set((state) => ({
          act: state.act + 1,
          currentMap: [],
          currentNodeId: null,
        })),
    }),
    {
      name: 'pokespire-run',
    }
  )
);

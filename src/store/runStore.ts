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
  updateItems: (items: Item[]) => void;
  healParty: () => void;
  addMoveToParty: (pokemonIndex: number, move: Move) => void;
  addBadge: (badge: string) => void;
  incrementPokemonCaught: () => void;
  incrementMovesLearned: () => void;
  setMap: (nodes: MapNode[]) => void;
  advanceAct: () => void;
  addSeenPokemon: (id: number) => void;
  addCaughtPokemon: (id: number) => void;
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
  seenPokemon: [],
  caughtPokemon: [],
  collectedCards: [],
  foundItems: [],
  defeatedGyms: [],
};

export const useRunStore = create<RunState & RunActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      startRun: (trainer, starterPokemon) =>
        set((state) => {
          const seen = state.seenPokemon.includes(starterPokemon.id)
            ? state.seenPokemon
            : [...state.seenPokemon, starterPokemon.id];
          const caught = state.caughtPokemon.includes(starterPokemon.id)
            ? state.caughtPokemon
            : [...state.caughtPokemon, starterPokemon.id];
          const newMoveIds = starterPokemon.moves
            .map((m) => m.id)
            .filter((id) => !state.collectedCards.includes(id));
          return {
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
            seenPokemon: seen,
            caughtPokemon: caught,
            collectedCards: [...state.collectedCards, ...newMoveIds],
            foundItems: state.foundItems,
            defeatedGyms: state.defeatedGyms,
          };
        }),

      endRun: () =>
        set((state) => ({
          ...initialState,
          seenPokemon: state.seenPokemon,
          caughtPokemon: state.caughtPokemon,
          collectedCards: state.collectedCards,
          foundItems: state.foundItems,
          defeatedGyms: state.defeatedGyms,
        })),

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
        set((state) => ({
          items: [...state.items, item],
          foundItems: state.foundItems.includes(item.id)
            ? state.foundItems
            : [...state.foundItems, item.id],
        })),

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      updateParty: (party) => set({ party }),
      updateItems: (items) => set({ items }),
      healParty: () =>
        set((state) => ({
          party: state.party.map((p) => ({ ...p, currentHp: p.maxHp, status: null })),
        })),

      addMoveToParty: (pokemonIndex, move) =>
        set((state) => {
          const party = [...state.party];
          const pokemon = party[pokemonIndex];
          if (!pokemon || pokemon.moves.some((m) => m.id === move.id)) return {};
          party[pokemonIndex] = { ...pokemon, moves: [...pokemon.moves, move] };
          const collectedCards = state.collectedCards.includes(move.id)
            ? state.collectedCards
            : [...state.collectedCards, move.id];
          return { party, collectedCards };
        }),

      addBadge: (badge) =>
        set((state) => ({
          badges: state.badges.includes(badge)
            ? state.badges
            : [...state.badges, badge],
          defeatedGyms: state.defeatedGyms.includes(badge)
            ? state.defeatedGyms
            : [...state.defeatedGyms, badge],
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

      addSeenPokemon: (id) =>
        set((state) => ({
          seenPokemon: state.seenPokemon.includes(id)
            ? state.seenPokemon
            : [...state.seenPokemon, id],
        })),

      addCaughtPokemon: (id) =>
        set((state) => ({
          seenPokemon: state.seenPokemon.includes(id)
            ? state.seenPokemon
            : [...state.seenPokemon, id],
          caughtPokemon: state.caughtPokemon.includes(id)
            ? state.caughtPokemon
            : [...state.caughtPokemon, id],
        })),
    }),
    {
      name: 'pokespire-run',
    }
  )
);

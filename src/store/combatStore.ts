import { create } from 'zustand';
import type { Pokemon, Move } from '../types';
import {
  type CombatState,
  type CombatPokemon,
  initCombat,
  playMove,
  executeEnemyTurn,
  startPlayerTurn,
  restorePartyPp,
  toCombatPokemon,
  buildDeck,
  drawCards,
  getEnergyCost,
} from '../utils/combatEngine';

interface CombatActions {
  startCombat: (party: Pokemon[], enemy: Pokemon) => void;
  playCard: (move: Move) => void;
  endTurn: () => void;
  switchPokemon: (index: number) => void;
  clearCombat: () => void;
}

type CombatStore = CombatState & CombatActions;

const DEFAULT_STATE: CombatState = {
  playerParty: [],
  enemy: null as unknown as CombatPokemon,
  playerHand: [],
  playerDeck: [],
  playerDiscard: [],
  playerEnergy: 0,
  turn: 0,
  phase: 'player',
  enemyIntent: null,
  log: [],
};

export const useCombatStore = create<CombatStore>((set, get) => ({
  ...DEFAULT_STATE,

  startCombat: (party, enemy) => {
    const state = initCombat(party, enemy);
    set(state);
  },

  playCard: (move) => {
    const state = get();
    if (state.phase !== 'player') return;

    const cost = getEnergyCost(move);
    if (state.playerEnergy < cost) return;

    const pp = state.playerParty[0]?.currentPp[move.id] ?? 0;
    if (pp <= 0) return;

    let next = playMove(state, move, cost);

    // Check enemy faint
    if (next.enemy.currentHp <= 0) {
      next = { ...next, phase: 'victory', log: [...next.log, `${next.enemy.name} fainted!`] };
      set(next);
      return;
    }

    set(next);
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== 'player') return;

    // Discard remaining hand
    const discarded = { ...state, playerDiscard: [...state.playerDiscard, ...state.playerHand], playerHand: [] };

    // Enemy turn
    let next = executeEnemyTurn(discarded);

    // Check player faint
    const activePlayer = next.playerParty[0];
    if (activePlayer.currentHp <= 0) {
      const remaining = next.playerParty.slice(1);
      if (remaining.length === 0) {
        next = { ...next, phase: 'defeat', log: [...next.log, `${activePlayer.name} fainted! No more Pokémon!`] };
        set(next);
        return;
      }
      // Switch in next automatically
      next = { ...next, phase: 'switch', log: [...next.log, `${activePlayer.name} fainted!`] };
      set(next);
      return;
    }

    // Start next player turn
    next = startPlayerTurn(next);
    set(next);
  },

  switchPokemon: (index) => {
    const state = get();
    if (index === 0 || index >= state.playerParty.length) return;

    const party = [...state.playerParty];
    [party[0], party[index]] = [party[index], party[0]];

    // Rebuild deck for new active Pokemon
    const newActive = party[0];
    const deck = buildDeck(newActive);
    let next: CombatState = {
      ...state,
      playerParty: party,
      playerHand: [],
      playerDeck: deck,
      playerDiscard: [],
      log: [...state.log, `Go, ${newActive.name}!`],
    };

    if (state.phase === 'switch') {
      // Auto-faint switch: resume enemy turn then player turn
      next = executeEnemyTurn({ ...next, phase: 'enemy' });
      next = startPlayerTurn(next);
    } else {
      // Voluntary switch costs the turn
      next = executeEnemyTurn({ ...next, phase: 'enemy' });
      next = startPlayerTurn(next);
    }

    set(next);
  },

  clearCombat: () => set(DEFAULT_STATE),
}));

// Helper: get restored party after combat (PP reset, status cleared)
export function getRestoredParty(party: CombatPokemon[]): Pokemon[] {
  return restorePartyPp(party).map((p) => ({ ...p, status: null }));
}

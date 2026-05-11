import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { buildPokemon } from '../utils/pokemonFactory';
import { getStarterDeck } from '../data/starterDecks';
import { LEARNSETS } from '../data/learnsets';
import { MOVES } from '../data/moves';
import PokemonStatCard from '../components/PokemonStatCard';
import MoveCard from '../components/MoveCard';
import { getEnergyCost } from '../utils/combatEngine';
import type { Pokemon, Move } from '../types';

const ACT_POOLS: Record<number, number[]> = {
  1: [16, 19, 10, 13, 39, 35, 43, 69, 41, 46, 54, 63],
  2: [74, 41, 46, 54, 79, 81, 92, 66, 58, 37, 77, 60],
  3: [58, 37, 125, 126, 123, 127, 133, 131, 147, 116, 111, 115],
};

function medianLevel(party: Pokemon[]): number {
  if (party.length === 0) return 5;
  const sorted = [...party].map((p) => p.level).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function buildOfferings(act: number, level: number): Pokemon[] {
  const pool = [...(ACT_POOLS[act] ?? ACT_POOLS[1])];
  const chosen: number[] = [];
  while (chosen.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen.map((id) => buildPokemon(id, level));
}

function getMovesForPokemon(pokemon: Pokemon): Move[] {
  // Try starter deck first
  const starterMoves = getStarterDeck(pokemon.id);
  if (starterMoves.length > 0) return starterMoves;

  // Fall back to learnset — take first 3-4 unique move ids
  const entries = LEARNSETS[pokemon.id] ?? [];
  const seen = new Set<string>();
  const moveIds: string[] = [];
  for (const entry of entries) {
    if (!seen.has(entry.moveId)) {
      seen.add(entry.moveId);
      moveIds.push(entry.moveId);
    }
    if (moveIds.length >= 4) break;
  }

  return moveIds
    .map((id) => MOVES[id])
    .filter((m): m is Move => m !== undefined);
}

export default function CatchScreen() {
  const navigate = useNavigate();
  const { act, party, updateParty, clearNode, currentNodeId, addSeenPokemon, addCaughtPokemon } = useRunStore();

  const level = medianLevel(party);
  const offerings = useMemo(() => buildOfferings(act, level), []); // eslint-disable-line

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  // Mark all offerings as seen when the screen loads
  useEffect(() => {
    offerings.forEach((p) => addSeenPokemon(p.id));
  }, []); // eslint-disable-line

  const partyFull = party.length >= 6;
  const selectedPokemon = selectedIndex !== null ? offerings[selectedIndex] : null;
  const selectedMoves = selectedPokemon ? getMovesForPokemon(selectedPokemon) : [];

  function handleConfirm() {
    if (selectedIndex === null) return;
    const chosen = offerings[selectedIndex];

    if (!partyFull) {
      updateParty([...party, chosen]);
    } else {
      if (swapTarget === null) return;
      const newParty = [...party];
      newParty[swapTarget] = chosen;
      updateParty(newParty);
    }

    addCaughtPokemon(chosen.id);
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  }

  function handleSkip() {
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  }

  return (
    <div className="absolute inset-0 bg-gray-900 text-white flex flex-col overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-6 gap-5 max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-bold text-yellow-400">Wild Encounter!</h2>
        <p className="text-gray-400 text-sm text-center">Choose a Pokémon to add to your party.</p>

        {/* 3 offerings */}
        <div className="flex gap-3 w-full">
          {offerings.map((p, i) => (
            <PokemonStatCard
              key={p.id}
              pokemon={p}
              selected={selectedIndex === i}
              onClick={() => { setSelectedIndex(i); setSwapTarget(null); }}
            />
          ))}
        </div>

        {/* Move preview panel */}
        {selectedPokemon && selectedMoves.length > 0 && (
          <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
            <p className="font-bold text-yellow-400 text-sm uppercase tracking-widest">
              {selectedPokemon.name} — Starting Cards
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              {selectedMoves.map((move) => (
                <MoveCard
                  key={move.id}
                  move={move}
                  energyCost={getEnergyCost(move)}
                  currentPp={move.pp}
                  disabled={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Swap picker — shown when party is full and a pokemon is selected */}
        {partyFull && selectedIndex !== null && (
          <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-2 animate-fade-in">
            <p className="text-xs text-yellow-400 font-bold uppercase tracking-widest mb-1">
              Party full — choose who to release
            </p>
            {party.map((p, i) => (
              <button
                key={`${p.id}-${i}`}
                onClick={() => setSwapTarget(i)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition text-left
                  ${swapTarget === i ? 'bg-yellow-900/60 border border-yellow-500' : 'bg-gray-700 hover:bg-gray-600 border border-transparent'}`}
              >
                <span className="font-semibold text-sm">{p.name}</span>
                <span className="text-xs text-gray-400">Lv{p.level}</span>
                <div className="flex-1 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${(p.currentHp / p.maxHp) > 0.5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{p.currentHp}/{p.maxHp}</span>
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={selectedIndex === null || (partyFull && swapTarget === null)}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg transition text-lg"
          >
            {partyFull ? 'Swap Pokémon' : 'Add to Party'}
          </button>
          <button
            onClick={handleSkip}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-lg transition"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { usePokemonSprite } from '../hooks/usePokemon';
import { buildPokemon } from '../utils/pokemonFactory';
import type { Pokemon, PokemonType } from '../types';

const ACT_POOLS: Record<number, number[]> = {
  1: [16, 19, 10, 13, 39, 35, 43, 69, 41, 46, 54, 63],
  2: [74, 41, 46, 54, 79, 81, 92, 66, 58, 37, 77, 60],
  3: [58, 37, 125, 126, 123, 127, 133, 131, 147, 116, 111, 115],
};

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-600', Water: 'bg-blue-600',
  Electric: 'bg-yellow-500', Grass: 'bg-green-600', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700', Poison: 'bg-purple-600', Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700', Steel: 'bg-slate-500', Fairy: 'bg-pink-300',
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
  // pick 3 unique IDs
  const chosen: number[] = [];
  while (chosen.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen.map((id) => buildPokemon(id, level));
}

function PokemonCard({
  pokemon,
  selected,
  onClick,
}: {
  pokemon: Pokemon;
  selected: boolean;
  onClick: () => void;
}) {
  const { spriteUrl, loading } = usePokemonSprite(pokemon.id);

  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-150
        ${selected
          ? 'border-yellow-400 bg-yellow-950/60 shadow-[0_0_16px_rgba(250,204,21,0.5)] scale-105'
          : 'border-gray-600 bg-gray-800 hover:border-yellow-500/60 hover:scale-102'
        }`}
    >
      <div className="w-20 h-20 flex items-center justify-center">
        {loading || !spriteUrl
          ? <span className="text-4xl">🔴</span>
          : <img src={spriteUrl} alt={pokemon.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
        }
      </div>
      <p className="font-bold text-white text-sm">{pokemon.name}</p>
      <p className="text-xs text-gray-400">Lv. {pokemon.level}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((t: PokemonType) => (
          <span key={t} className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-xs px-2 py-0.5 rounded-full`}>{t}</span>
        ))}
      </div>
      <p className="text-xs text-gray-400">HP {pokemon.maxHp}</p>
    </button>
  );
}

export default function CatchScreen() {
  const navigate = useNavigate();
  const { act, party, updateParty, clearNode, currentNodeId } = useRunStore();

  const level = medianLevel(party);
  const offerings = useMemo(() => buildOfferings(act, level), []); // eslint-disable-line

  const [selected, setSelected] = useState<number | null>(null);
  // index of party member to swap out (-1 = add to party)
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  const partyFull = party.length >= 6;

  function handleConfirm() {
    if (selected === null) return;
    const chosen = offerings[selected];

    if (!partyFull) {
      updateParty([...party, chosen]);
    } else {
      if (swapTarget === null) return; // need a swap target
      const newParty = [...party];
      newParty[swapTarget] = chosen;
      updateParty(newParty);
    }

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
            <PokemonCard
              key={p.id}
              pokemon={p}
              selected={selected === i}
              onClick={() => { setSelected(i); setSwapTarget(null); }}
            />
          ))}
        </div>

        {/* Swap picker — shown when party is full and a pokemon is selected */}
        {partyFull && selected !== null && (
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
            disabled={selected === null || (partyFull && swapTarget === null)}
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

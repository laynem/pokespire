import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { usePokemonSprite } from '../hooks/usePokemon';
import { buildPokemon } from '../utils/pokemonFactory';
import { getEnergyCost } from '../utils/combatEngine';
import type { Pokemon, PokemonType } from '../types';

const ACT_POOLS: Record<number, number[]> = {
  1: [16, 19, 10, 13, 39, 35, 43, 69],
  2: [74, 41, 46, 54, 79, 81, 92, 66],
  3: [58, 37, 125, 126, 123, 127, 133, 131],
};

const ACT_LEVELS: Record<number, [number, number]> = {
  1: [5, 10],
  2: [15, 20],
  3: [25, 30],
};

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-600', Water: 'bg-blue-600',
  Electric: 'bg-yellow-500', Grass: 'bg-green-600', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700', Poison: 'bg-purple-600', Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700', Steel: 'bg-slate-500', Fairy: 'bg-pink-300',
};

function buildWildPokemon(act: number): Pokemon {
  const pool = ACT_POOLS[act] ?? ACT_POOLS[1];
  const [minLv, maxLv] = ACT_LEVELS[act] ?? ACT_LEVELS[1];
  const id = pool[Math.floor(Math.random() * pool.length)];
  const level = minLv + Math.floor(Math.random() * (maxLv - minLv + 1));
  return buildPokemon(id, level);
}

function PokemonSprite({ pokemonId }: { pokemonId: number }) {
  const { spriteUrl, loading } = usePokemonSprite(pokemonId);
  if (loading || !spriteUrl) return <div className="w-32 h-32 flex items-center justify-center text-5xl">🔴</div>;
  return (
    <img
      src={spriteUrl}
      alt=""
      className="w-32 h-32 object-contain animate-bounce-in"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

const REVEAL_DELAY_MS = 1100;

export default function CatchScreen() {
  const navigate = useNavigate();
  const { act, party, updateParty, clearNode, currentNodeId } = useRunStore();

  const wildPokemon = useMemo(() => buildWildPokemon(act), []); // eslint-disable-line
  const partyFull = party.length >= 6;

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleAdd = () => {
    if (partyFull) return;
    updateParty([...party, wildPokemon]);
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  };

  const handleRelease = () => {
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 gap-5 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-yellow-400">Wild Encounter!</h2>

      {/* Pokemon info card */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full flex flex-col items-center gap-3 min-h-48 justify-center">
        {!revealed ? (
          /* Poké Ball throw animation */
          <div className="flex flex-col items-center gap-3">
            <span className="text-6xl animate-pokeball-drop inline-block">⚪</span>
            <p className="text-gray-400 text-sm">A wild Pokémon appeared!</p>
          </div>
        ) : (
          <>
            <PokemonSprite pokemonId={wildPokemon.id} />

            <div className="text-center">
              <p className="text-2xl font-bold">{wildPokemon.name}</p>
              <p className="text-sm text-gray-400">Lv. {wildPokemon.level}</p>
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {wildPokemon.types.map((t: PokemonType) => (
                <span key={t} className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-xs font-semibold px-3 py-0.5 rounded-full`}>
                  {t}
                </span>
              ))}
            </div>

            <p className="text-sm text-gray-400">
              HP: <span className="text-white font-semibold">{wildPokemon.maxHp}</span>
            </p>
          </>
        )}
      </div>

      {/* Move list — only show after reveal */}
      {revealed && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl w-full p-4 flex flex-col gap-2 animate-fade-in">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Moves</p>
          {wildPokemon.moves.length === 0 ? (
            <p className="text-sm text-gray-500">No moves</p>
          ) : (
            wildPokemon.moves.map((move) => (
              <div key={move.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`${TYPE_COLORS[move.type] ?? 'bg-gray-600'} text-white text-xs px-2 py-0.5 rounded-full`}>
                    {move.type}
                  </span>
                  <span className="font-medium">{move.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <span>{move.power > 0 ? `${move.power} pw` : '—'}</span>
                  <span className="text-blue-400">{'🔵'.repeat(getEnergyCost(move))}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Action buttons — only show after reveal */}
      {revealed && (
        <div className="w-full flex flex-col gap-3 animate-fade-in">
          {partyFull ? (
            <div className="text-center text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg py-3">
              Party Full — release a Pokémon first
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition text-lg"
            >
              Add to Party
            </button>
          )}
          <button
            onClick={handleRelease}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-lg transition"
          >
            Release
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonSprite } from '../hooks/usePokemon';
import { buildPokemon, getStarterOptions } from '../utils/pokemonFactory';
import { POKEMON_TEMPLATES } from '../data/pokemon';
import { getStarterDeck } from '../data/starterDecks';
import { useRunStore } from '../store/runStore';
import type { PokemonType } from '../types';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500',
  Fire: 'bg-orange-600',
  Water: 'bg-blue-600',
  Electric: 'bg-yellow-500',
  Grass: 'bg-green-600',
  Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700',
  Poison: 'bg-purple-600',
  Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400',
  Psychic: 'bg-pink-500',
  Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800',
  Ghost: 'bg-purple-800',
  Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700',
  Steel: 'bg-slate-500',
  Fairy: 'bg-pink-300',
};

function TypeBadge({ type }: { type: PokemonType }) {
  return (
    <span className={`${TYPE_COLORS[type] ?? 'bg-gray-600'} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
      {type}
    </span>
  );
}

function StarterSprite({ pokemonId }: { pokemonId: number }) {
  const { spriteUrl, loading } = usePokemonSprite(pokemonId);
  if (loading || !spriteUrl) {
    return <div className="w-full aspect-square flex items-center justify-center text-6xl">🔴</div>;
  }
  return (
    <img
      src={spriteUrl}
      alt=""
      className="w-full aspect-square object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

interface StarterCardProps {
  pokemonId: number;
  selected: boolean;
  onSelect: () => void;
}

function StarterCard({ pokemonId, selected, onSelect }: StarterCardProps) {
  const template = POKEMON_TEMPLATES[pokemonId];
  if (!template) return null;

  const startingMoves = getStarterDeck(pokemonId);

  return (
    <button
      onClick={onSelect}
      className={`
        flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition text-left w-full
        ${selected
          ? 'border-yellow-400 bg-gray-700 shadow-lg shadow-yellow-400/20'
          : 'border-gray-600 bg-gray-800 hover:border-gray-400'}
      `}
    >
      <StarterSprite pokemonId={pokemonId} />
      <p className="font-bold text-lg">{template.name}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {template.types.map((t) => <TypeBadge key={t} type={t} />)}
      </div>
      <p className="text-sm text-gray-400">HP: <span className="text-white">{template.baseStats.hp}</span></p>
      <div className="w-full border-t border-gray-600 pt-2 mt-1 flex flex-col gap-1">
        {startingMoves.map((move) => (
          <div key={move.id} className="flex justify-between text-xs text-gray-300">
            <span>{move.name}</span>
            <span className="text-gray-500">{move.power > 0 ? `${move.power} pw` : '—'}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function StarterSelectScreen() {
  const navigate = useNavigate();
  const startRun = useRunStore((s) => s.startRun);
  const starters = getStarterOptions();
  const [selectedId, setSelectedId] = useState<number>(starters[0].id);

  const selectedTemplate = POKEMON_TEMPLATES[selectedId];
  const detailMoves = getStarterDeck(selectedId);

  const handleConfirm = () => {
    const pokemon = buildPokemon(selectedId, 5);
    startRun(
      { id: 'ash', name: 'Ash', sprite: '🧢', starterPokemonId: selectedId },
      pokemon,
    );
    navigate('/map');
  };

  return (
    <div className="absolute inset-0 bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-6 gap-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-yellow-400">Choose Your Starter</h2>

      {/* 4 starter cards — 2×2 on mobile, 4-wide on desktop */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {starters.map(({ id }) => (
          <StarterCard
            key={id}
            pokemonId={id}
            selected={selectedId === id}
            onSelect={() => setSelectedId(id)}
          />
        ))}
      </div>

      {/* Move detail panel */}
      {selectedTemplate && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 w-full max-w-md flex flex-col gap-3">
          <p className="font-bold text-yellow-400">{selectedTemplate.name} — Starting Moves</p>
          {detailMoves.map((move) => (
            <div key={move.id} className="flex flex-col gap-0.5 border-b border-gray-700 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{move.name}</span>
                <TypeBadge type={move.type} />
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>Power: {move.power > 0 ? move.power : '—'}</span>
                <span>Acc: {move.accuracy > 0 ? `${move.accuracy}%` : '—'}</span>
                <span>PP: {move.pp}</span>
              </div>
              <p className="text-xs text-gray-500">{move.description}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-10 rounded-lg transition text-lg"
      >
        Begin Run →
      </button>

      <button onClick={() => navigate('/character-select')} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back
      </button>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonSprite } from '../hooks/usePokemon';
import { buildPokemon, getStarterOptions } from '../utils/pokemonFactory';
import { POKEMON_TEMPLATES } from '../data/pokemon';
import { getStarterDeck } from '../data/starterDecks';
import { useRunStore } from '../store/runStore';
import MoveCard from '../components/MoveCard';
import { getEnergyCost } from '../utils/combatEngine';
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
      className="w-full aspect-square object-contain scale-[1.6]"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

interface StarterCardProps {
  pokemonId: number;
  selected: boolean;
  onSelect: () => void;
}

const STAT_BARS = [
  { key: 'hp',      label: 'HP',  color: 'bg-green-500' },
  { key: 'attack',  label: 'ATK', color: 'bg-red-500'   },
  { key: 'defense', label: 'DEF', color: 'bg-yellow-500' },
  { key: 'spAtk',   label: 'SpA', color: 'bg-blue-500'  },
  { key: 'spDef',   label: 'SpD', color: 'bg-teal-500'  },
] as const;

const STAT_MAX = 150;

function StarterCard({ pokemonId, selected, onSelect }: StarterCardProps) {
  const template = POKEMON_TEMPLATES[pokemonId];
  if (!template) return null;

  return (
    <button
      onClick={onSelect}
      className={`
        flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition text-left w-full overflow-hidden
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
      <div className="w-full flex flex-col gap-1 mt-1">
        {STAT_BARS.map(({ key, label, color }) => {
          const value = template.baseStats[key];
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span className="w-7 text-gray-400 shrink-0">{label}</span>
              <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`${color} h-full rounded-full`}
                  style={{ width: `${Math.min((value / STAT_MAX) * 100, 100)}%` }}
                />
              </div>
              <span className="w-6 text-right text-gray-300 shrink-0">{value}</span>
            </div>
          );
        })}
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

      <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
        {starters.map(({ id }) => (
          <StarterCard
            key={id}
            pokemonId={id}
            selected={selectedId === id}
            onSelect={() => setSelectedId(id)}
          />
        ))}
      </div>

      {/* Starting cards panel */}
      {selectedTemplate && (
        <div className="flex flex-col items-center gap-3 w-full max-w-4xl">
          <p className="font-bold text-yellow-400 text-sm uppercase tracking-widest">
            {selectedTemplate.name} — Starting Cards
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {detailMoves.map((move) => (
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

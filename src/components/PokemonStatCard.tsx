import { usePokemonSprite } from '../hooks/usePokemon';
import type { Pokemon, PokemonType } from '../types';
import StatBars from './StatBars';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-600', Water: 'bg-blue-600',
  Electric: 'bg-yellow-500', Grass: 'bg-green-600', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700', Poison: 'bg-purple-600', Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700', Steel: 'bg-slate-500', Fairy: 'bg-pink-300',
};

interface PokemonStatCardProps {
  pokemon: Pokemon;
  selected?: boolean;
  onClick?: () => void;
}

export default function PokemonStatCard({ pokemon, selected = false, onClick }: PokemonStatCardProps) {
  const { spriteUrl, loading } = usePokemonSprite(pokemon.id);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 transition-all duration-150 w-full
        ${selected
          ? 'border-yellow-400 bg-yellow-950/60 shadow-[0_0_16px_rgba(250,204,21,0.5)] scale-105'
          : 'border-gray-600 bg-gray-800 hover:border-yellow-500/60 hover:scale-102'
        }`}
    >
      {/* Sprite */}
      <div className="w-20 h-20 flex items-center justify-center">
        {loading || !spriteUrl
          ? <span className="text-4xl">🔴</span>
          : <img src={spriteUrl} alt={pokemon.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
        }
      </div>

      {/* Name + level */}
      <p className="font-bold text-white text-sm leading-tight">{pokemon.name}</p>
      <p className="text-xs text-gray-400">Lv. {pokemon.level}</p>

      {/* Types */}
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((t: PokemonType) => (
          <span key={t} className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-xs px-2 py-0.5 rounded-full`}>{t}</span>
        ))}
      </div>

      <StatBars stats={pokemon.baseStats} level={pokemon.level} />
    </button>
  );
}

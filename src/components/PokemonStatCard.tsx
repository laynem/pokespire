import { usePokemonSprite } from '../hooks/usePokemon';
import type { Pokemon, PokemonType } from '../types';

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

function PokemonSprite({ pokemonId }: { pokemonId: number }) {
  const { spriteUrl, loading } = usePokemonSprite(pokemonId);
  if (loading || !spriteUrl) {
    return <div className="w-32 h-32 flex items-center justify-center text-6xl">🔴</div>;
  }
  return (
    <img
      src={spriteUrl}
      alt=""
      className="w-32 h-32 object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

interface StatRowProps {
  label: string;
  value: number | string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <>
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-white text-xs font-semibold">{value}</span>
    </>
  );
}

export interface PokemonStatCardProps {
  pokemon: Pokemon;
  selected?: boolean;
  onClick?: () => void;
}

export default function PokemonStatCard({ pokemon, selected = false, onClick }: PokemonStatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition text-left w-full
        ${selected
          ? 'border-yellow-400 bg-gray-700 shadow-lg shadow-yellow-400/20 scale-105'
          : 'border-gray-600 bg-gray-800 hover:border-gray-400'}
      `}
    >
      <PokemonSprite pokemonId={pokemon.id} />
      <p className="font-bold text-base text-center">{pokemon.name}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 w-full mt-1">
        <StatRow label="Level" value={pokemon.level} />
        <StatRow label="HP" value={pokemon.maxHp} />
        <StatRow label="ATK" value={pokemon.baseStats.attack} />
        <StatRow label="DEF" value={pokemon.baseStats.defense} />
        <StatRow label="SpATK" value={pokemon.baseStats.spAtk} />
        <StatRow label="SpDEF" value={pokemon.baseStats.spDef} />
        <StatRow label="XP" value={pokemon.xp} />
      </div>
    </button>
  );
}

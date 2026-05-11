import { usePokemonSprite } from '../hooks/usePokemon';
import type { Pokemon, PokemonType } from '../types';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-600', Water: 'bg-blue-600',
  Electric: 'bg-yellow-500', Grass: 'bg-green-600', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700', Poison: 'bg-purple-600', Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700', Steel: 'bg-slate-500', Fairy: 'bg-pink-300',
};

function TypeBadge({ type }: { type: PokemonType }) {
  return (
    <span className={`${TYPE_COLORS[type] ?? 'bg-gray-600'} text-white text-xs font-semibold px-1.5 py-0.5 rounded-full`}>
      {type}
    </span>
  );
}

interface PokemonStatCardProps {
  pokemon: Pokemon;
  selected?: boolean;
  onClick?: () => void;
}

export default function PokemonStatCard({ pokemon, selected = false, onClick }: PokemonStatCardProps) {
  const { spriteUrl } = usePokemonSprite(pokemon.id);
  const hpPct = Math.round((pokemon.currentHp / pokemon.maxHp) * 100);
  const barColor = hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition text-center w-full
        ${selected
          ? 'border-yellow-400 bg-gray-700 shadow-lg shadow-yellow-400/20'
          : onClick
            ? 'border-gray-600 bg-gray-800 hover:border-gray-400'
            : 'border-gray-700 bg-gray-800 cursor-default'}
      `}
    >
      {spriteUrl
        ? <img src={spriteUrl} alt={pokemon.name} className="w-14 h-14 object-contain" style={{ imageRendering: 'pixelated' }} />
        : <div className="w-14 h-14 flex items-center justify-center text-3xl">🔴</div>
      }
      <p className="font-bold text-sm leading-tight">{pokemon.name}</p>
      <p className="text-xs text-gray-400">Lv.{pokemon.level}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
      </div>
      <div className="w-full flex items-center gap-1.5 mt-0.5">
        <div className="flex-1 bg-gray-600 rounded-full h-1.5">
          <div className={`${barColor} rounded-full h-full`} style={{ width: `${hpPct}%` }} />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{pokemon.currentHp}/{pokemon.maxHp}</span>
      </div>
      {pokemon.status && (
        <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">{pokemon.status.toUpperCase()}</span>
      )}
    </button>
  );
}

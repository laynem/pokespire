import type { Move, PokemonType } from '../types';

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


interface MoveCardProps {
  move: Move;
  energyCost: number;
  currentPp: number;
  maxCombatPp?: number;  // max PP in combat context (default 3)
  disabled: boolean;
  selected?: boolean;
  onClick: () => void;
}

export default function MoveCard({ move, energyCost, currentPp, maxCombatPp = 3, disabled, selected, onClick }: MoveCardProps) {
  const typeColor = TYPE_COLORS[move.type] ?? 'bg-gray-600';

  const baseClasses = [
    'relative flex flex-col items-center justify-between',
    'w-32 h-44 rounded-xl p-2 cursor-pointer select-none',
    'bg-gray-800 border-2 transition-all duration-150',
  ];

  if (disabled) {
    baseClasses.push('opacity-40 cursor-not-allowed border-gray-700');
  } else if (selected) {
    baseClasses.push('border-yellow-400 shadow-[0_0_10px_2px_rgba(250,204,21,0.5)] scale-105');
  } else {
    baseClasses.push('border-gray-600 hover:scale-105 hover:border-yellow-400 hover:shadow-[0_0_10px_2px_rgba(250,204,21,0.4)]');
  }

  function handleClick() {
    if (!disabled) onClick();
  }

  return (
    <div className={baseClasses.join(' ')} onClick={handleClick}>
      {/* Energy pips */}
      <div className="flex gap-0.5 self-start">
        {Array.from({ length: energyCost }).map((_, i) => (
          <span key={i} className="text-blue-400 text-sm leading-none">🔵</span>
        ))}
      </div>

      {/* Move name */}
      <div className="flex flex-col items-center gap-1 flex-1 justify-center">
        <span className="text-white text-xs font-bold text-center leading-tight px-1">
          {move.name}
        </span>

        {/* Type badge */}
        <span className={`${typeColor} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
          {move.type}
        </span>

        {/* Power */}
        <span className="text-gray-300 text-xs">
          {move.category === 'status' || move.power === 0
            ? <span className="text-gray-400">—</span>
            : <span><span className="text-gray-400 text-xs">PWR </span>{move.power}</span>
          }
        </span>
      </div>

      {/* PP dots — show combat PP (max 3), not original move PP */}
      <div className="flex gap-0.5 justify-center">
        {Array.from({ length: maxCombatPp }).map((_, i) => (
          <span
            key={i}
            className={i < currentPp ? 'text-green-400 text-sm' : 'text-gray-600 text-sm'}
          >
            {i < currentPp ? '●' : '○'}
          </span>
        ))}
      </div>
    </div>
  );
}

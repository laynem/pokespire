import type { Move } from '../types';

const TYPE_SYMBOL: Record<string, string> = {
  Normal: '⬜', Fire: '🔥', Water: '💧', Electric: '⚡', Grass: '🌿',
  Ice: '❄️', Fighting: '👊', Poison: '☠️', Ground: '🌋', Flying: '🌪️',
  Psychic: '🔮', Bug: '🐛', Rock: '🪨', Ghost: '👻', Dragon: '🐉',
  Dark: '🌑', Steel: '⚙️', Fairy: '✨',
};

const TYPE_GRADIENT: Record<string, { dark: string; mid: string }> = {
  Normal:   { dark: '#374151', mid: '#6b7280' },
  Fire:     { dark: '#7c2d12', mid: '#ea580c' },
  Water:    { dark: '#1e3a5f', mid: '#2563eb' },
  Electric: { dark: '#713f12', mid: '#ca8a04' },
  Grass:    { dark: '#14532d', mid: '#16a34a' },
  Ice:      { dark: '#164e63', mid: '#06b6d4' },
  Fighting: { dark: '#7f1d1d', mid: '#dc2626' },
  Poison:   { dark: '#4a1d96', mid: '#9333ea' },
  Ground:   { dark: '#78350f', mid: '#d97706' },
  Flying:   { dark: '#1e1b4b', mid: '#6366f1' },
  Psychic:  { dark: '#831843', mid: '#ec4899' },
  Bug:      { dark: '#365314', mid: '#65a30d' },
  Rock:     { dark: '#451a03', mid: '#92400e' },
  Ghost:    { dark: '#2e1065', mid: '#7c3aed' },
  Dragon:   { dark: '#1e1b4b', mid: '#4338ca' },
  Dark:     { dark: '#111827', mid: '#374151' },
  Steel:    { dark: '#1e293b', mid: '#475569' },
  Fairy:    { dark: '#500724', mid: '#ec4899' },
};

interface MoveCardProps {
  move: Move;
  energyCost: number;
  currentPp: number;
  maxCombatPp?: number;
  disabled: boolean;
  selected?: boolean;
  onClick: () => void;
}

export default function MoveCard({ move, energyCost, currentPp, maxCombatPp = 3, disabled, selected, onClick }: MoveCardProps) {
  const gradient = TYPE_GRADIENT[move.type] ?? { dark: '#374151', mid: '#6b7280' };
  const symbol = TYPE_SYMBOL[move.type] ?? '⬜';

  const bg = `linear-gradient(180deg, ${gradient.dark} 0%, ${gradient.mid} 50%, ${gradient.dark} 100%)`;

  function handleClick() {
    if (!disabled) onClick();
  }

  const borderClass = disabled
    ? 'border-gray-600'
    : selected
      ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]'
      : 'border-yellow-400/80 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.7)]';

  const scaleClass = disabled
    ? 'opacity-50 grayscale cursor-not-allowed'
    : selected
      ? 'scale-110 cursor-pointer'
      : 'cursor-pointer hover:scale-110';

  return (
    <div
      className={`relative flex flex-col w-28 h-40 rounded-xl border-2 select-none transition-all duration-150 overflow-hidden ${borderClass} ${scaleClass}`}
      style={{ background: bg }}
      onClick={handleClick}
    >
      {/* Top section: energy cost + name */}
      <div className="flex items-start gap-1 px-2 pt-2 pb-1">
        {/* Energy cost circle */}
        <div className="shrink-0 w-6 h-6 rounded-full bg-black/60 border border-blue-400/60 flex items-center justify-center">
          <span className="text-blue-300 text-xs font-bold leading-none">{energyCost}</span>
        </div>
        {/* Move name */}
        <span className="text-white text-xs font-bold leading-tight flex-1 text-center pr-1 mt-0.5 drop-shadow">
          {move.name}
        </span>
      </div>

      {/* Art section: type symbol */}
      <div className="flex-1 flex items-center justify-center">
        <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{symbol}</span>
      </div>

      {/* Bottom section: description */}
      <div className="px-2 pb-1">
        <p className="text-gray-200/80 text-center leading-tight" style={{ fontSize: '0.6rem' }}>
          {move.category === 'status' || move.power === 0
            ? move.name
            : `PWR ${move.power} · ${move.type}`}
        </p>
      </div>

      {/* PP dots */}
      <div className="flex gap-0.5 justify-center pb-1.5">
        {Array.from({ length: Math.min(maxCombatPp, 3) }).map((_, i) => (
          <span
            key={i}
            className={`text-xs ${i < currentPp ? 'text-green-400' : 'text-gray-600'}`}
          >
            {i < currentPp ? '●' : '○'}
          </span>
        ))}
      </div>
    </div>
  );
}

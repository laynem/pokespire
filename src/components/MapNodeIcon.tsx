import type { NodeType } from '../types';

export const NODE_META: Record<NodeType, { icon: string; label: string; color: string; glow: string }> = {
  combat:   { icon: '⚔️',  label: 'Wild Battle',    color: 'border-red-500 bg-red-950',      glow: 'shadow-[0_0_16px_rgba(239,68,68,0.6)]' },
  elite:    { icon: '🧑‍🏫', label: 'Trainer',        color: 'border-orange-400 bg-orange-950', glow: 'shadow-[0_0_16px_rgba(251,146,60,0.6)]' },
  boss:     { icon: '🏆',  label: 'Gym Leader',     color: 'border-yellow-300 bg-yellow-950', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.8)]' },
  treasure: { icon: '🎣',  label: 'Catch',          color: 'border-green-400 bg-green-950',   glow: 'shadow-[0_0_16px_rgba(74,222,128,0.6)]' },
  rest:     { icon: '🏥',  label: 'Pokémon Center', color: 'border-pink-400 bg-pink-950',     glow: 'shadow-[0_0_16px_rgba(244,114,182,0.6)]' },
  shop:     { icon: '🛒',  label: 'Poké Mart',      color: 'border-blue-400 bg-blue-950',     glow: 'shadow-[0_0_16px_rgba(96,165,250,0.6)]' },
  event:    { icon: '❓',  label: 'Event',          color: 'border-purple-400 bg-purple-950', glow: 'shadow-[0_0_16px_rgba(192,132,252,0.6)]' },
};

interface Props {
  type: NodeType;
  state: 'cleared' | 'available' | 'locked';
  isCurrent?: boolean;
  onClick?: () => void;
}

export default function MapNodeIcon({ type, state, isCurrent, onClick }: Props) {
  const meta = NODE_META[type];
  const isClickable = state === 'available';

  const containerClass = [
    'relative flex flex-col items-center gap-1.5',
  ].join(' ');

  const btnClass = [
    'relative flex items-center justify-center w-14 h-14 rounded-full border-2 text-2xl',
    'transition-all duration-150 select-none',
    state === 'cleared'
      ? 'border-gray-600 bg-gray-800/60 opacity-40 cursor-default grayscale'
      : state === 'locked'
      ? 'border-gray-800 bg-gray-950/80 opacity-15 cursor-default'
      : `${meta.color} ${meta.glow} cursor-pointer hover:scale-110 hover:brightness-125`,
    isCurrent ? 'opacity-100!' : '',
  ].join(' ');

  return (
    <div className={containerClass}>
      {/* Pulsing ring for current position */}
      {isCurrent && (
        <div className="absolute -inset-2 rounded-full animate-pulse-ring border-2 border-yellow-400/60 bg-yellow-400/10 pointer-events-none" />
      )}

      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={meta.label}
        className={btnClass}
      >
        {meta.icon}
        {state === 'cleared' && (
          <span className="absolute -top-1 -right-1 text-xs bg-green-600 rounded-full w-4 h-4 flex items-center justify-center leading-none">✓</span>
        )}
      </button>

      {/* Label below available nodes */}
      {state === 'available' && (
        <span className={`text-xs font-semibold whitespace-nowrap leading-none drop-shadow ${type === 'boss' ? 'text-yellow-300' : 'text-gray-200'}`}>
          {meta.label}
        </span>
      )}
    </div>
  );
}

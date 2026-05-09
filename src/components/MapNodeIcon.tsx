import type { NodeType } from '../types';

export const NODE_META: Record<NodeType, { icon: string; label: string; color: string }> = {
  combat:   { icon: '⚔️',  label: 'Wild Battle',    color: 'border-red-700 bg-red-950' },
  elite:    { icon: '🧑‍🏫', label: 'Trainer',        color: 'border-orange-600 bg-orange-950' },
  boss:     { icon: '🏆',  label: 'Gym Leader',     color: 'border-yellow-400 bg-yellow-950' },
  treasure: { icon: '🎣',  label: 'Catch',          color: 'border-green-600 bg-green-950' },
  rest:     { icon: '🏥',  label: 'Pokémon Center', color: 'border-pink-600 bg-pink-950' },
  shop:     { icon: '🛒',  label: 'Poké Mart',      color: 'border-blue-600 bg-blue-950' },
  event:    { icon: '❓',  label: 'Event',          color: 'border-purple-600 bg-purple-950' },
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

  return (
    <div className="relative">
      {/* Pulsing ring for current position */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-full animate-pulse-ring border-2 border-yellow-400/60 bg-yellow-400/10 pointer-events-none" />
      )}
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={meta.label}
        className={`
          relative flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 text-2xl transition
          ${state === 'cleared'   ? 'border-gray-600 bg-gray-800 opacity-50 cursor-default' : ''}
          ${state === 'locked'    ? 'border-gray-700 bg-gray-900 opacity-30 cursor-default' : ''}
          ${state === 'available' ? `${meta.color} hover:scale-110 cursor-pointer shadow-lg` : ''}
          ${isCurrent ? 'opacity-100!' : ''}
        `}
      >
        {meta.icon}
        {state === 'cleared' && (
          <span className="absolute -top-1 -right-1 text-xs bg-green-600 rounded-full w-4 h-4 flex items-center justify-center">✓</span>
        )}
        {type === 'boss' && state === 'available' && (
          <span className="absolute -bottom-5 text-xs text-yellow-400 whitespace-nowrap font-bold">GYM</span>
        )}
      </button>
    </div>
  );
}

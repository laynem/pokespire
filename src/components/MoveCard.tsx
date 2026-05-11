import type { Move } from '../types';

import fireIcon from '../assets/fire.png';
import waterIcon from '../assets/water.png';
import electricIcon from '../assets/electric.png';
import leafIcon from '../assets/leaf.png';
import iceIcon from '../assets/ice.png';
import fightingIcon from '../assets/fighting.png';
import poisonIcon from '../assets/poison.png';
import groundIcon from '../assets/ground.png';
import flyingIcon from '../assets/flying.png';
import psychicIcon from '../assets/psychic.png';
import dragonIcon from '../assets/dragon.png';
import darkIcon from '../assets/dark.png';
import steelIcon from '../assets/steel.png';
import fairyIcon from '../assets/fairy.png';

const TYPE_ICON: Record<string, string> = {
  Fire: fireIcon,
  Water: waterIcon,
  Electric: electricIcon,
  Grass: leafIcon,
  Ice: iceIcon,
  Fighting: fightingIcon,
  Poison: poisonIcon,
  Ground: groundIcon,
  Flying: flyingIcon,
  Psychic: psychicIcon,
  Dragon: dragonIcon,
  Dark: darkIcon,
  Steel: steelIcon,
  Fairy: fairyIcon,
};

const TYPE_EMOJI: Record<string, string> = {
  Normal: '🔘', Bug: '🐛', Rock: '🪨', Ghost: '👻',
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

function getCardInfo(move: Move): string {
  if (move.effect === 'block') return '8 Block';
  if (move.effect === 'recover') return '50% Heal';
  if (move.category === 'status' || move.power === 0) {
    if (move.effect) return move.effect.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return move.type;
  }
  return `${move.power} Damage`;
}

interface MoveCardProps {
  move: Move;
  energyCost: number;
  currentPp: number;
  maxCombatPp?: number;
  disabled: boolean;
  selected?: boolean;
  onClick: () => void;
}

// Bubble radius in px — half the bubble diameter (w-9 = 36px)
const BUBBLE_R = 15;

export default function MoveCard({ move, energyCost, disabled, selected, onClick }: MoveCardProps) {
  const gradient = TYPE_GRADIENT[move.type] ?? { dark: '#374151', mid: '#6b7280' };
  const bg = `linear-gradient(180deg, ${gradient.dark} 0%, ${gradient.mid} 50%, ${gradient.dark} 100%)`;

  const icon = TYPE_ICON[move.type];
  const emoji = TYPE_EMOJI[move.type];
  const cardInfo = getCardInfo(move);

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
    /* Outer wrapper: adds space for the bubble that hangs outside the card */
    <div
      className="relative select-none"
      style={{ paddingTop: BUBBLE_R, paddingLeft: BUBBLE_R }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Energy bubble — centered on the card's top-left corner */}
      <div
        className="absolute z-10 rounded-full bg-black/80 border-2 border-blue-400 flex items-center justify-center shadow-lg"
        style={{
          width: BUBBLE_R * 2,
          height: BUBBLE_R * 2,
          top: 0,
          left: 0,
        }}
      >
        <span className="text-blue-300 text-sm font-bold leading-none">{energyCost}</span>
      </div>

      {/* Card body */}
      <div
        className={`relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-150 ${borderClass} ${scaleClass}`}
        style={{ background: bg, width: '8.75rem', height: '12.5rem' }}
      >
        {/* Title — centered, no scroll */}
        <div className="pt-3 pb-1 px-2 text-center">
          <span
            className="text-white font-bold drop-shadow leading-tight"
            style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '0.875rem' }}
          >
            {move.name}
          </span>
        </div>

        {/* Type icon */}
        <div className="flex items-center justify-center mt-2">
          {icon
            ? <img src={icon} alt={move.type} className="w-14 h-14 object-contain drop-shadow" />
            : <span style={{ fontSize: '3rem', lineHeight: 1 }}>{emoji ?? '⬜'}</span>
          }
        </div>

        {/* Card info — vertically centered in space below icon */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-white text-sm font-bold drop-shadow text-center"
            style={{ fontFamily: "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif" }}
          >
            {cardInfo}
          </span>
        </div>
      </div>
    </div>
  );
}

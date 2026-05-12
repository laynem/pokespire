import { GYM_LEADERS } from '../data/gymLeaders';
import type { NodeType } from '../types';
import enemyMale from '../assets/enemy_male.png';
import enemyFemale from '../assets/enemy_female.png';
import pokeballImg from '../assets/pokeball.png';
import pokecenterImg from '../assets/pokecenter.png';
import pokemartImg from '../assets/pokemart.png';
import homeImg from '../assets/home.png';

export const NODE_META: Record<NodeType, { label: string }> = {
  home:          { label: 'Home' },
  normal_battle: { label: 'Wild Battle' },
  elite_battle:  { label: 'Trainer' },
  boss:          { label: 'Gym Leader' },
  gym:           { label: 'Gym Leader' },
  catch:         { label: 'Catch' },
  rest:          { label: 'Rest Site' },
  pokecenter:    { label: 'Pokémon Center' },
  shop:          { label: 'Poké Mart' },
};

interface Props {
  type: NodeType;
  state: 'cleared' | 'available' | 'locked';
  isCurrent?: boolean;
  bossLeaderId?: string;
  trainerVariant?: 'male' | 'female' | 'boss';
  onClick?: () => void;
}

export default function MapNodeIcon({ type, state, bossLeaderId, trainerVariant, onClick }: Props) {
  const meta = NODE_META[type];
  const isHome = type === 'home';
  const isBoss = type === 'boss' || type === 'gym';
  const isClickable = state === 'available';
  const gymLeader = isBoss && bossLeaderId ? GYM_LEADERS[bossLeaderId] : null;

  // Boss nodes keep the circle/portrait styling
  if (isBoss) {
    const bossBtnClass = [
      'relative flex items-center justify-center w-[100px] h-[100px] rounded-full border-2 border-yellow-300 bg-yellow-950',
      'transition-all duration-150 select-none',
      state === 'cleared'
        ? 'cursor-default grayscale brightness-50'
        : state === 'locked'
        ? 'cursor-default brightness-75'
        : 'shadow-[0_0_20px_rgba(250,204,21,0.8)] cursor-pointer hover:scale-110 hover:brightness-125',
    ].join(' ');

    return (
      <div className="relative flex flex-col items-center gap-1.5">
        <button
          onClick={isClickable ? onClick : undefined}
          disabled={!isClickable}
          title={gymLeader ? gymLeader.name : meta.label}
          className={bossBtnClass}
        >
          {gymLeader ? (
            <img
              src={gymLeader.spriteUrl}
              alt={gymLeader.name}
              className="w-full h-full object-cover object-top rounded-full"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-2xl">🏆</span>
          )}
          {state === 'cleared' && (
            <span className="absolute -top-1 -right-1 text-xs bg-green-600 rounded-full w-4 h-4 flex items-center justify-center leading-none">✓</span>
          )}
        </button>
        {(state === 'available' || isBoss) && (
          <span className="text-xs font-semibold whitespace-nowrap leading-none drop-shadow text-yellow-300">
            {gymLeader ? gymLeader.name : meta.label}
          </span>
        )}
      </div>
    );
  }

  // Determine which image to show
  let imgSrc: string | null = null;
  if (isHome) {
    imgSrc = homeImg;
  } else if (type === 'normal_battle' || type === 'elite_battle') {
    imgSrc = trainerVariant === 'female' ? enemyFemale : enemyMale;
  } else if (type === 'catch') {
    imgSrc = pokeballImg;
  } else if (type === 'pokecenter') {
    imgSrc = pokecenterImg;
  } else if (type === 'shop') {
    imgSrc = pokemartImg;
  }

  // home is 2x normal icon size; normal icons are 25% larger than old circle (56px → 70px)
  const iconSize = isHome ? 'w-[140px] h-[140px]' : 'w-[70px] h-[70px]';
  const interactClass = isClickable && !isHome ? 'cursor-pointer hover:scale-110' : 'cursor-default';

  return (
    <div className="relative flex flex-col items-center gap-1.5">

      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        title={meta.label}
        className={`relative flex items-center justify-center select-none transition-all duration-150 ${iconSize} ${interactClass}`}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={meta.label} className="w-full h-full object-contain drop-shadow-md" />
        ) : (
          <span className="text-[2.75rem]">🏕️</span>
        )}
        {state === 'cleared' && !isHome && (
          <span className="absolute -top-1 -right-1 text-xs bg-green-600 rounded-full w-4 h-4 flex items-center justify-center leading-none">✓</span>
        )}
      </button>

      {(state === 'available' || isHome) && (
        <span className={`text-xs font-semibold whitespace-nowrap leading-none drop-shadow ${isHome ? 'text-gray-400' : 'text-gray-200'}`}>
          {meta.label}
        </span>
      )}
    </div>
  );
}

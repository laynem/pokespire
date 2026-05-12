import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { MOVES } from '../data/moves';
import { ITEMS_DATA } from '../data/items';
import { getEnergyCost } from '../utils/combatEngine';
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
import normalIcon from '../assets/normal.png';

const TYPE_ICON: Record<string, string> = {
  Normal: normalIcon, Fire: fireIcon, Water: waterIcon, Electric: electricIcon,
  Grass: leafIcon, Ice: iceIcon, Fighting: fightingIcon, Poison: poisonIcon,
  Ground: groundIcon, Flying: flyingIcon, Psychic: psychicIcon, Dragon: dragonIcon,
  Dark: darkIcon, Steel: steelIcon, Fairy: fairyIcon,
};
const TYPE_EMOJI: Record<string, string> = { Bug: '🐛', Rock: '🪨', Ghost: '👻' };
const TYPE_GRADIENT: Record<string, { dark: string; mid: string }> = {
  Normal: { dark: '#374151', mid: '#6b7280' }, Fire: { dark: '#7c2d12', mid: '#ea580c' },
  Water: { dark: '#1e3a5f', mid: '#2563eb' }, Electric: { dark: '#713f12', mid: '#ca8a04' },
  Grass: { dark: '#14532d', mid: '#16a34a' }, Ice: { dark: '#164e63', mid: '#06b6d4' },
  Fighting: { dark: '#7f1d1d', mid: '#dc2626' }, Poison: { dark: '#4a1d96', mid: '#9333ea' },
  Ground: { dark: '#78350f', mid: '#d97706' }, Flying: { dark: '#1e1b4b', mid: '#6366f1' },
  Psychic: { dark: '#831843', mid: '#ec4899' }, Bug: { dark: '#365314', mid: '#65a30d' },
  Rock: { dark: '#451a03', mid: '#92400e' }, Ghost: { dark: '#2e1065', mid: '#7c3aed' },
  Dragon: { dark: '#1e1b4b', mid: '#4338ca' }, Dark: { dark: '#111827', mid: '#374151' },
  Steel: { dark: '#1e293b', mid: '#475569' }, Fairy: { dark: '#500724', mid: '#ec4899' },
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

type Tab = 'cards' | 'items';

export default function CollectionScreen() {
  const navigate = useNavigate();
  const collectedCards = useRunStore((s) => s.collectedCards);
  const foundItems = useRunStore((s) => s.foundItems);

  const [tab, setTab] = useState<Tab>('cards');

  const collectedSet = new Set(collectedCards);
  const foundSet = new Set(foundItems);

  const allMoves = Object.values(MOVES).sort((a, b) => a.name.localeCompare(b.name));
  const allItems = Object.values(ITEMS_DATA).sort((a, b) => a.name.localeCompare(b.name));

  const cardsCollected = allMoves.filter((m) => collectedSet.has(m.id)).length;
  const itemsFound = allItems.filter((i) => foundSet.has(i.id)).length;

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition text-lg leading-none"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-yellow-400 flex-1">Collection</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 max-w-lg mx-auto w-full">
        <button
          onClick={() => setTab('cards')}
          className={`flex-1 py-2.5 font-semibold transition ${
            tab === 'cards'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          style={{ fontSize: '17px' }}
        >
          Cards ({cardsCollected}/{allMoves.length})
        </button>
        <button
          onClick={() => setTab('items')}
          className={`flex-1 py-2.5 font-semibold transition ${
            tab === 'items'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          style={{ fontSize: '17px' }}
        >
          Items ({itemsFound}/{allItems.length})
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto subtle-scroll">

      {/* Cards tab */}
      {tab === 'cards' && (
        <div className="p-8 pt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(9.75rem, max-content))', gap: '1rem 0.5rem', justifyContent: 'center', maxWidth: 'calc(9 * 9.75rem + 8 * 0.5rem + 4rem)', margin: '0 auto' }}>
          {allMoves.map((move) => {
            const collected = collectedSet.has(move.id);

            if (collected) {
              const gradient = TYPE_GRADIENT[move.type] ?? { dark: '#374151', mid: '#6b7280' };
              const bg = `linear-gradient(180deg, ${gradient.dark} 0%, ${gradient.mid} 50%, ${gradient.dark} 100%)`;
              const icon = TYPE_ICON[move.type];
              const emoji = TYPE_EMOJI[move.type];
              return (
                <div key={move.id} className="relative select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
                  <div
                    className="absolute z-10 rounded-full bg-black/80 border-2 border-blue-400 flex items-center justify-center shadow-lg"
                    style={{ width: 30, height: 30, top: 0, left: 0 }}
                  >
                    <span className="text-blue-300 text-sm font-bold leading-none">
                      {getEnergyCost(move)}
                    </span>
                  </div>
                  <div
                    className="flex flex-col rounded-xl border-2 border-yellow-400/80 overflow-hidden"
                    style={{ background: bg, width: '8.75rem', height: '12.5rem' }}
                  >
                    <div className="pt-3 pb-1 px-2 text-center">
                      <span className="text-white font-bold drop-shadow leading-tight" style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '0.875rem' }}>
                        {move.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      {icon
                        ? <img src={icon} alt={move.type} className="w-14 h-14 object-contain drop-shadow" />
                        : <span style={{ fontSize: '3rem', lineHeight: 1 }}>{emoji ?? '⬜'}</span>
                      }
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-white text-sm font-bold drop-shadow text-center" style={{ fontFamily: "'Futura PT', 'Century Gothic', 'Trebuchet MS', sans-serif" }}>
                        {getCardInfo(move)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={move.id} className="relative select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
                <div
                  className="absolute z-10 rounded-full bg-black/80 border-2 border-gray-600 flex items-center justify-center"
                  style={{ width: 30, height: 30, top: 0, left: 0 }}
                >
                  <span className="text-gray-500 text-sm font-bold leading-none">?</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-700 bg-gray-800/50"
                  style={{ width: '8.75rem', height: '12.5rem' }}
                >
                  <span className="text-xl mb-1 opacity-30">❓</span>
                  <span className="text-gray-600 text-xs font-bold">???</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Items tab */}
      {tab === 'items' && (
        <div className="p-8 pt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(9.75rem, max-content))', gap: '1rem 0.5rem', justifyContent: 'center', maxWidth: 'calc(9 * 9.75rem + 8 * 0.5rem + 4rem)', margin: '0 auto' }}>
          {allItems.map((item) => {
            const found = foundSet.has(item.id);

            if (found) {
              return (
                <div key={item.id} className="select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
                  <div
                    className="flex flex-col rounded-xl border-2 border-yellow-400/80 bg-gray-800 overflow-hidden"
                    style={{ width: '8.75rem', height: '12.5rem' }}
                  >
                    <div className="pt-1 pb-0 px-1 text-center">
                      <span
                        className="text-white font-bold drop-shadow leading-tight"
                        style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '1.15rem', letterSpacing: '0.05rem' }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      {item.sprite
                        ? <img src={item.sprite} alt={item.name} className="w-14 h-14 object-contain drop-shadow" style={{ imageRendering: 'pixelated' }} />
                        : <span style={{ fontSize: '3rem', lineHeight: 1 }}>{item.icon}</span>
                      }
                    </div>
                    <div className="flex-1 flex items-center justify-center px-1">
                      <span
                        className="text-white text-sm font-bold drop-shadow text-center"
                        style={{ fontFamily: "'Futura PT', 'Century Gothic', 'Trebuchet MS', sans-serif" }}
                      >
                        {item.description}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="relative select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
                <div
                  className="absolute z-10 rounded-full bg-black/80 border-2 border-gray-600 flex items-center justify-center"
                  style={{ width: 30, height: 30, top: 0, left: 0 }}
                >
                  <span className="text-gray-500 text-sm font-bold leading-none">?</span>
                </div>
                <div
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-700 bg-gray-800/50"
                  style={{ width: '8.75rem', height: '12.5rem' }}
                >
                  <span className="text-xl mb-1 opacity-30">❓</span>
                  <span className="text-gray-600 text-xs font-bold">???</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      </div>{/* end scroll wrapper */}
    </div>
  );
}

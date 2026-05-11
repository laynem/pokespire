import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { MOVES } from '../data/moves';
import { ITEMS_DATA } from '../data/items';
import MoveCard from '../components/MoveCard';
import { getEnergyCost } from '../utils/combatEngine';

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
          className={`flex-1 py-2.5 text-sm font-semibold transition ${
            tab === 'cards'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Cards ({cardsCollected}/{allMoves.length})
        </button>
        <button
          onClick={() => setTab('items')}
          className={`flex-1 py-2.5 text-sm font-semibold transition ${
            tab === 'items'
              ? 'text-yellow-400 border-b-2 border-yellow-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Items ({itemsFound}/{allItems.length})
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto subtle-scroll">

      {/* Cards tab */}
      {tab === 'cards' && (
        <div className="p-4 pt-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(10.5rem, max-content))', gap: '0.5rem 0.25rem', justifyContent: 'center' }}>
          {allMoves.map((move) => {
            const collected = collectedSet.has(move.id);

            if (collected) {
              return (
                <MoveCard
                  key={move.id}
                  move={move}
                  energyCost={getEnergyCost(move)}
                  currentPp={move.maxPp}
                  disabled={false}
                  onClick={() => {}}
                />
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
                  <span className="text-3xl mb-2 opacity-30">❓</span>
                  <span className="text-gray-600 text-xs font-bold">???</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Items tab */}
      {tab === 'items' && (
        <div>
          {(['held', 'consumable'] as const).map((category) => {
            const categoryItems = allItems.filter((i) => i.category === category);
            return (
              <div key={category} className="px-4 pt-6 pb-2 max-w-3xl mx-auto w-full">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {category === 'held' ? 'Held Items' : 'Consumables'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(8.75rem, max-content))', gap: '0.5rem 0.25rem', justifyContent: 'center' }}>
                  {categoryItems.map((item) => {
                    const found = foundSet.has(item.id);

                    if (found) {
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col rounded-xl border-2 border-yellow-400/80 bg-gray-800 overflow-hidden select-none"
                          style={{ width: '8.75rem', height: '12.5rem' }}
                        >
                          <div className="pt-3 pb-1 px-2 text-center">
                            <span
                              className="text-white font-bold drop-shadow leading-tight"
                              style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '0.875rem' }}
                            >
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-center mt-2">
                            <span style={{ fontSize: '3rem', lineHeight: 1 }}>{item.icon}</span>
                          </div>
                          <div className="flex-1 flex items-center justify-center px-2">
                            <span
                              className="text-gray-300 text-center leading-tight"
                              style={{ fontFamily: "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif", fontSize: '0.6rem' }}
                            >
                              {item.description}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-700 bg-gray-800/50 select-none"
                        style={{ width: '8.75rem', height: '12.5rem' }}
                      >
                        <span className="text-3xl mb-2 opacity-30">❓</span>
                        <span className="text-gray-600 text-xs font-bold">???</span>
                      </div>
                    );
                  })}
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

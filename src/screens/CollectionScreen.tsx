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
        <div className="p-3 grid grid-cols-2 gap-2 max-w-lg mx-auto w-full">

          {allItems.map((item) => {
            const found = foundSet.has(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-lg border p-3 flex flex-col gap-1
                  ${found
                    ? 'bg-gray-800 border-gray-600'
                    : 'bg-gray-800/40 border-gray-800'
                  }`}
              >
                {found ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-sm text-white">{item.name}</span>
                    </div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider w-fit px-1.5 py-0.5 rounded
                      ${item.category === 'held' ? 'bg-blue-700/60 text-blue-300' : 'bg-green-700/60 text-green-300'}`}>
                      {item.category}
                    </span>
                    <p className="text-[10px] text-gray-400 leading-tight">{item.description}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 opacity-30">
                    <span className="text-2xl">❓</span>
                    <span className="text-gray-400 text-sm font-semibold">???</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      </div>{/* end scroll wrapper */}
    </div>
  );
}

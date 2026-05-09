import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { GYM_LEADERS } from '../data/gymLeaders';
import { ITEMS_DATA } from '../data/items';

interface BossRewardState {
  bossLeaderId: string;
  gold: number;
}

export default function BossRewardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bossLeaderId, gold } = (location.state as BossRewardState) ?? { bossLeaderId: 'brock', gold: 150 };
  const { addBadge, addItem, addGold, advanceAct, act } = useRunStore();

  const leader = GYM_LEADERS[bossLeaderId];
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  if (!leader) {
    navigate('/map');
    return null;
  }

  const rewardItems = leader.rewardItemIds
    .map((id) => ITEMS_DATA[id])
    .filter(Boolean);

  const totalGold = gold + Math.floor(Math.random() * (leader.goldMax - leader.goldMin + 1) + leader.goldMin);

  function handleClaim() {
    if (!selectedItemId || claimed) return;
    setClaimed(true);
    addBadge(leader.badge);
    addGold(totalGold);
    const item = ITEMS_DATA[selectedItemId];
    if (item) addItem(item);

    setTimeout(() => {
      if (act >= 3) {
        navigate('/victory');
      } else {
        advanceAct();
        navigate('/map');
      }
    }, 800);
  }

  return (
    <div className={`min-h-screen ${leader.bgClass} text-white flex flex-col items-center justify-center px-4 py-8 gap-6`}>
      {/* Badge award */}
      <div className="text-center">
        <p className="text-5xl mb-2">🏅</p>
        <h2 className="text-2xl font-bold text-yellow-400">{leader.badge}</h2>
        <p className="text-sm text-gray-300 mt-1">{leader.name} was defeated!</p>
      </div>

      {/* Badge bonus */}
      <div className="bg-black/30 border border-yellow-600 rounded-xl px-5 py-3 max-w-xs text-center">
        <p className="text-xs text-yellow-400 font-semibold mb-1">BADGE BONUS</p>
        <p className="text-sm text-gray-200">{leader.badgeBonus}</p>
      </div>

      {/* Gold */}
      <div className="flex items-center gap-2 text-yellow-300 font-bold text-lg">
        <span>💰</span>
        <span>+{totalGold} Gold</span>
      </div>

      {/* Item choice */}
      <div className="w-full max-w-xs">
        <p className="text-center text-sm text-gray-400 mb-3">Choose a reward item:</p>
        <div className="flex gap-3 justify-center">
          {rewardItems.map((item) => (
            <button
              key={item.id}
              onClick={() => !claimed && setSelectedItemId(item.id)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                selectedItemId === item.id
                  ? 'border-yellow-400 bg-yellow-900/30'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-400'
              } ${claimed ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="font-semibold text-sm">{item.name}</span>
              <span className="text-xs text-gray-400 text-center">{item.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Claim button */}
      <button
        onClick={handleClaim}
        disabled={!selectedItemId || claimed}
        className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-8 py-3 rounded-xl transition text-lg"
      >
        {claimed ? 'Onward!' : 'Claim Rewards'}
      </button>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { MOVES } from '../data/moves';
import { ITEMS_DATA } from '../data/items';
import { ACHIEVEMENTS, CATCHABLE_POKEMON_IDS } from '../data/achievements';

function checkAchievement(
  id: string,
  defeatedGyms: string[],
  caughtPokemon: number[],
  collectedCards: string[],
  foundItems: string[],
): { unlocked: boolean; progress?: string } {
  const caught = new Set(caughtPokemon);
  const cards = new Set(collectedCards);
  const items = new Set(foundItems);

  switch (id) {
    case 'beat_brock':
      return { unlocked: defeatedGyms.includes('Boulder Badge') };
    case 'beat_misty':
      return { unlocked: defeatedGyms.includes('Cascade Badge') };
    case 'beat_lt_surge':
      return { unlocked: defeatedGyms.includes('Thunder Badge') };
    case 'catch_em_all': {
      const catchableCount = CATCHABLE_POKEMON_IDS.length;
      const caughtCount = CATCHABLE_POKEMON_IDS.filter((id) => caught.has(id)).length;
      return {
        unlocked: caughtCount >= catchableCount,
        progress: `${caughtCount} / ${catchableCount} Pokémon`,
      };
    }
    case 'card_collector': {
      const total = Object.keys(MOVES).length;
      const count = Object.keys(MOVES).filter((id) => cards.has(id)).length;
      return {
        unlocked: count >= total,
        progress: `${count} / ${total} cards`,
      };
    }
    case 'item_hoarder': {
      const total = Object.keys(ITEMS_DATA).length;
      const count = Object.keys(ITEMS_DATA).filter((id) => items.has(id)).length;
      return {
        unlocked: count >= total,
        progress: `${count} / ${total} items`,
      };
    }
    default:
      return { unlocked: false };
  }
}

export default function AchievementsScreen() {
  const navigate = useNavigate();
  const defeatedGyms = useRunStore((s) => s.defeatedGyms);
  const caughtPokemon = useRunStore((s) => s.caughtPokemon);
  const collectedCards = useRunStore((s) => s.collectedCards);
  const foundItems = useRunStore((s) => s.foundItems);

  const results = ACHIEVEMENTS.map((a) => ({
    ...a,
    ...checkAchievement(a.id, defeatedGyms, caughtPokemon, collectedCards, foundItems),
  }));

  const unlockedCount = results.filter((r) => r.unlocked).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition text-lg leading-none"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-yellow-400">Achievements</h1>
          <p className="text-xs text-gray-400">{unlockedCount} / {ACHIEVEMENTS.length} unlocked</p>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 p-4 max-w-lg mx-auto w-full">
        {results.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl border px-4 py-3 flex items-start gap-3 transition
              ${a.unlocked
                ? 'bg-yellow-900/20 border-yellow-600/50'
                : 'bg-gray-800/50 border-gray-700'
              }`}
          >
            <span className={`text-2xl mt-0.5 ${a.unlocked ? '' : 'grayscale opacity-40'}`}>
              {a.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm ${a.unlocked ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {a.name}
                </span>
                {a.unlocked && (
                  <span className="text-green-400 text-xs font-bold">✓ Unlocked</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>
              {a.progress && (
                <p className={`text-xs mt-1 font-semibold ${a.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {a.progress}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

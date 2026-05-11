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
      return { unlocked: caughtCount >= catchableCount, progress: `${caughtCount} / ${catchableCount}` };
    }
    case 'card_collector': {
      const total = Object.keys(MOVES).length;
      const count = Object.keys(MOVES).filter((id) => cards.has(id)).length;
      return { unlocked: count >= total, progress: `${count} / ${total}` };
    }
    case 'item_hoarder': {
      const total = Object.keys(ITEMS_DATA).length;
      const count = Object.keys(ITEMS_DATA).filter((id) => items.has(id)).length;
      return { unlocked: count >= total, progress: `${count} / ${total}` };
    }
    default:
      return { unlocked: false };
  }
}

const CATEGORY_GRADIENT: Record<string, string> = {
  'Gym Badges':     'linear-gradient(180deg, #78350f 0%, #d97706 50%, #78350f 100%)',
  'Completionist':  'linear-gradient(180deg, #2e1065 0%, #7c3aed 50%, #2e1065 100%)',
};

const LOCKED_BG = 'linear-gradient(180deg, #1f2937 0%, #374151 50%, #1f2937 100%)';

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

  const categories = Array.from(new Set(ACHIEVEMENTS.map((a) => a.category)));

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto subtle-scroll">
        {categories.map((category) => {
          const catResults = results.filter((a) => a.category === category);
          return (
            <div key={category} className="px-4 pt-6 pb-2 max-w-3xl mx-auto w-full">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{category}</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(8.75rem, max-content))',
                  gap: '0.5rem 0.25rem',
                  justifyContent: 'center',
                }}
              >
                {catResults.map((a) => {
                  const bg = a.unlocked ? (CATEGORY_GRADIENT[a.category] ?? LOCKED_BG) : LOCKED_BG;
                  const borderClass = a.unlocked ? 'border-yellow-400/80' : 'border-gray-700';

                  return (
                    <div
                      key={a.id}
                      className={`flex flex-col rounded-xl border-2 overflow-hidden select-none ${borderClass}`}
                      style={{ background: bg, width: '8.75rem', height: '12.5rem' }}
                    >
                      {/* Name */}
                      <div className="pt-3 pb-1 px-2 text-center">
                        <span
                          className="text-white font-bold drop-shadow leading-tight"
                          style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '0.875rem' }}
                        >
                          {a.name}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`flex items-center justify-center mt-2 ${a.unlocked ? '' : 'grayscale opacity-30'}`}>
                        <span style={{ fontSize: '3rem', lineHeight: 1 }}>{a.icon}</span>
                      </div>

                      {/* Status / progress */}
                      <div className="flex-1 flex items-center justify-center px-2">
                        {a.unlocked ? (
                          <span
                            className="text-yellow-300 text-xs font-bold drop-shadow text-center"
                            style={{ fontFamily: "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif" }}
                          >
                            ✓ Unlocked
                          </span>
                        ) : a.progress ? (
                          <span
                            className="text-gray-400 text-xs font-bold text-center"
                            style={{ fontFamily: "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif" }}
                          >
                            {a.progress}
                          </span>
                        ) : (
                          <span
                            className="text-gray-600 text-xs font-bold"
                            style={{ fontFamily: "'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif" }}
                          >
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

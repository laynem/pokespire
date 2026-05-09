import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';

const NODE_ICONS: Record<string, string> = {
  combat: '⚔️',
  elite: '💀',
  boss: '👑',
  rest: '🏕️',
  shop: '🛒',
  event: '❓',
  treasure: '💎',
};

export default function MapScreen() {
  const navigate = useNavigate();
  const { currentMap, act } = useRunStore();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6 gap-6">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-yellow-400">Act {act} — Map</h2>
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-300 transition text-sm"
        >
          Abandon Run
        </button>
      </div>

      {currentMap.length === 0 ? (
        <div className="flex flex-col items-center gap-4 mt-16 text-gray-400">
          <span className="text-5xl">🗺️</span>
          <p>Map not yet generated.</p>
          <button
            onClick={() => navigate('/combat')}
            className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Test Combat →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 mt-4">
          {currentMap.map((node) => (
            <button
              key={node.id}
              disabled={node.cleared}
              onClick={() => navigate('/combat')}
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 rounded-lg p-4 transition"
            >
              <span className="text-2xl">{NODE_ICONS[node.type] ?? '❓'}</span>
              <span className="capitalize font-medium">{node.type}</span>
              {node.cleared && <span className="ml-auto text-green-500 text-sm">Cleared</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

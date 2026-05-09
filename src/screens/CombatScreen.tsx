import { useNavigate } from 'react-router-dom';

export default function CombatScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-900 text-white p-6">
      {/* Enemy area */}
      <div className="flex flex-col items-center gap-2 mt-8">
        <div className="bg-gray-800 rounded-xl p-8 w-64 text-center border border-gray-700">
          <div className="text-6xl mb-3">👾</div>
          <p className="font-bold text-lg">Wild Pokémon</p>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
            <div className="bg-red-500 h-3 rounded-full w-3/4" />
          </div>
          <p className="text-sm text-gray-400 mt-1">HP: 75 / 100</p>
        </div>
      </div>

      {/* Player area */}
      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Starter</p>
            <div className="w-48 bg-gray-700 rounded-full h-3 mt-1">
              <div className="bg-green-500 h-3 rounded-full w-full" />
            </div>
            <p className="text-sm text-gray-400 mt-1">HP: 100 / 100</p>
          </div>
          <div className="text-5xl">🐾</div>
        </div>

        {/* Move buttons */}
        <div className="grid grid-cols-2 gap-3">
          {['Move 1', 'Move 2', 'Move 3', 'Move 4'].map((move) => (
            <button
              key={move}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg py-4 font-semibold transition"
            >
              {move}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/map')}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition text-sm"
          >
            ← Flee (Map)
          </button>
          <button
            onClick={() => navigate('/victory')}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg transition text-sm font-semibold"
          >
            Win →
          </button>
          <button
            onClick={() => navigate('/game-over')}
            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition text-sm"
          >
            Lose →
          </button>
        </div>
      </div>
    </div>
  );
}

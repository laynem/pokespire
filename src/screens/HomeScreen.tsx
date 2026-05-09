import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';

export default function HomeScreen() {
  const navigate = useNavigate();
  const inRun = useRunStore((s) => s.inRun);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-6">
      <h1 className="text-6xl font-bold text-yellow-400 tracking-wider drop-shadow-lg">
        PokeSpire
      </h1>
      <p className="text-gray-400 text-lg">A Pokémon Roguelike</p>
      <div className="flex flex-col gap-3 w-48">
        {inRun && (
          <button
            onClick={() => navigate('/map')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Continue Run
          </button>
        )}
        <button
          onClick={() => navigate('/character-select')}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
        >
          New Run
        </button>
      </div>
    </div>
  );
}

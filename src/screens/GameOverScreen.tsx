import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';

export default function GameOverScreen() {
  const navigate = useNavigate();
  const { endRun, pokemonCaught, movesLearned, totalGoldEarned, act, badges } = useRunStore();

  const handleMainMenu = () => {
    endRun();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-8 pb-20">
      <div className="text-center">
        <div className="text-7xl mb-4">💀</div>
        <h2 className="text-5xl font-bold text-red-500">Blacked Out!</h2>
        <p className="text-gray-400 mt-2">Your journey ends here… for now.</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 w-72 border border-gray-700 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-yellow-400 text-center mb-1">Run Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Act reached</span>
          <span>{act}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Gold earned</span>
          <span>{totalGoldEarned}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Pokémon caught</span>
          <span>{pokemonCaught}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Moves learned</span>
          <span>{movesLearned}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Badges</span>
          <span>{badges.length}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-48">
        <button
          onClick={() => { endRun(); navigate('/character-select'); }}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
        >
          Try Again
        </button>
        <button
          onClick={handleMainMenu}
          className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}

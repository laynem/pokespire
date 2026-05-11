import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { useAuthStore } from '../store/authStore';
import logoFull from '../assets/logo_full.png';

export default function HomeScreen() {
  const navigate = useNavigate();
  const inRun = useRunStore((s) => s.inRun);
  const { isGuest, logout } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-start pt-[20vh] min-h-screen bg-gray-900 text-white gap-6">
      <img src={logoFull} alt="PokeSpire" className="w-[36rem] drop-shadow-lg" />
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
        <button
          onClick={() => !isGuest && navigate('/pokedex')}
          disabled={isGuest}
          className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-600"
          title={isGuest ? 'Sign in to access Pokédex' : undefined}
        >
          Pokédex
        </button>
        <button
          onClick={() => !isGuest && navigate('/collection')}
          disabled={isGuest}
          className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-600"
          title={isGuest ? 'Sign in to access Collection' : undefined}
        >
          Collection
        </button>
        <button
          onClick={() => !isGuest && navigate('/achievements')}
          disabled={isGuest}
          className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-600"
          title={isGuest ? 'Sign in to access Achievements' : undefined}
        >
          Achievements
        </button>
        <button
          onClick={logout}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-lg transition"
        >
          {isGuest ? 'Sign In' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}

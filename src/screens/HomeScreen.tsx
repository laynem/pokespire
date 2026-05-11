import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { supabase } from '../lib/supabase';
import logoFull from '../assets/logo_full.png';

export default function HomeScreen() {
  const navigate = useNavigate();
  const inRun = useRunStore((s) => s.inRun);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-6">
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
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-lg transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

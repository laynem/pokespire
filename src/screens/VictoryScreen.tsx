import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { usePokemonSprite } from '../hooks/usePokemon';
import type { Pokemon } from '../types';

function PartySprite({ pokemon }: { pokemon: Pokemon }) {
  const { spriteUrl } = usePokemonSprite(pokemon.id);
  return (
    <div className="flex flex-col items-center gap-1">
      {spriteUrl
        ? <img src={spriteUrl} alt={pokemon.name} className="w-14 h-14 object-contain" style={{ imageRendering: 'pixelated' }} />
        : <div className="w-14 h-14 flex items-center justify-center text-2xl">🔴</div>
      }
      <span className="text-xs text-gray-400">{pokemon.name}</span>
    </div>
  );
}

export default function VictoryScreen() {
  const navigate = useNavigate();
  const { endRun, party, pokemonCaught, movesLearned, totalGoldEarned, badges } = useRunStore();

  const handleMainMenu = () => {
    endRun();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-8 px-4 py-8 pb-20">
      <div className="text-center">
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-5xl font-bold text-yellow-400">Champion!</h2>
        <p className="text-gray-400 mt-2">You've conquered the Spire!</p>
      </div>

      {/* Party sprites */}
      {party.length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center">
          {party.map((p) => (
            <PartySprite key={p.id + p.name} pokemon={p} />
          ))}
        </div>
      )}

      {/* Badges earned */}
      {badges.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {badges.map((b) => (
            <span key={b} className="bg-yellow-900/40 border border-yellow-600 text-yellow-300 text-xs px-2 py-1 rounded-full">
              🏅 {b}
            </span>
          ))}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 w-72 border border-gray-700 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-yellow-400 text-center mb-1">Run Complete</h3>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total gold earned</span>
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
          <span className="text-gray-400">Badges earned</span>
          <span>{badges.length} / 3</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-48">
        <button
          onClick={() => { endRun(); navigate('/character-select'); }}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
        >
          Play Again
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

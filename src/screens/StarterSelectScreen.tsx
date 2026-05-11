import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildPokemon, getStarterOptions } from '../utils/pokemonFactory';
import { getStarterDeck } from '../data/starterDecks';
import { useRunStore } from '../store/runStore';
import MoveCard from '../components/MoveCard';
import PokemonStatCard from '../components/PokemonStatCard';
import { getEnergyCost } from '../utils/combatEngine';

export default function StarterSelectScreen() {
  const navigate = useNavigate();
  const startRun = useRunStore((s) => s.startRun);
  const starters = getStarterOptions();
  const [selectedId, setSelectedId] = useState<number>(starters[0].id);

  const starterPokemon = useMemo(
    () => starters.map(({ id }) => buildPokemon(id, 5)),
    [] // eslint-disable-line
  );

  const detailMoves = getStarterDeck(selectedId);
  const selectedPokemon = starterPokemon.find((p) => p.id === selectedId);

  const handleConfirm = () => {
    const pokemon = buildPokemon(selectedId, 5);
    startRun(
      { id: 'ash', name: 'Ash', sprite: '🧢', starterPokemonId: selectedId },
      pokemon,
    );
    navigate('/map');
  };

  return (
    <div className="absolute inset-0 bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-6 gap-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-yellow-400">Choose Your Starter</h2>

      <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
        {starterPokemon.map((pokemon) => (
          <PokemonStatCard
            key={pokemon.id}
            pokemon={pokemon}
            selected={selectedId === pokemon.id}
            onClick={() => setSelectedId(pokemon.id)}
          />
        ))}
      </div>

      {/* Starting cards panel */}
      {selectedPokemon && (
        <div className="flex flex-col items-center gap-3 w-full max-w-2xl">
          <p className="font-bold text-yellow-400 text-sm uppercase tracking-widest">
            {selectedPokemon.name} — Starting Cards
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {detailMoves.map((move) => (
              <MoveCard
                key={move.id}
                move={move}
                energyCost={getEnergyCost(move)}
                currentPp={move.pp}
                disabled={false}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-10 rounded-lg transition text-lg"
      >
        Begin Run →
      </button>

      <button onClick={() => navigate('/character-select')} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back
      </button>
    </div>
  );
}

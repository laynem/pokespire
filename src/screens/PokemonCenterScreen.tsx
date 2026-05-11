import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { LEARNSETS } from '../data/learnsets';
import { MOVES } from '../data/moves';
import { getEnergyCost } from '../utils/combatEngine';
import PokemonStatCard from '../components/PokemonStatCard';
import MoveCard from '../components/MoveCard';
import type { Move } from '../types';

type Tab = 'heal' | 'tutor';

export default function PokemonCenterScreen() {
  const navigate = useNavigate();
  const { party, healParty, updateParty, clearNode, currentNodeId } = useRunStore();
  const [tab, setTab] = useState<Tab>('heal');
  const [healed, setHealed] = useState(false);
  const [tutorUsed, setTutorUsed] = useState(false);

  // Move Tutor wizard state
  const [tutorPokemonIdx, setTutorPokemonIdx] = useState<number | null>(null);
  const [forgetting, setForgetting] = useState<string | null>(null);

  const tutorPokemon = tutorPokemonIdx !== null ? party[tutorPokemonIdx] : null;

  const tutorMoves = useMemo<Move[]>(() => {
    if (!tutorPokemon) return [];
    const learnset = LEARNSETS[tutorPokemon.id] ?? [];
    const knownIds = new Set(tutorPokemon.moves.map((m) => m.id));
    const seen = new Set<string>();
    return learnset
      .map((e) => MOVES[e.moveId])
      .filter((m): m is Move => !!m && !knownIds.has(m.id) && !seen.has(m.id) && !!seen.add(m.id));
  }, [tutorPokemon?.id, tutorPokemon?.moves.length]); // eslint-disable-line

  const handleHealAll = () => {
    healParty();
    setHealed(true);
  };

  const handleLearnMove = (newMove: Move) => {
    if (tutorPokemonIdx === null || !forgetting) return;
    const pokemon = party[tutorPokemonIdx];
    const newMoves = pokemon.moves.map((m) => (m.id === forgetting ? newMove : m));
    const newParty = party.map((p, i) =>
      i === tutorPokemonIdx ? { ...p, moves: newMoves } : p
    );
    updateParty(newParty);
    setForgetting(null);
    setTutorPokemonIdx(null);
    setTutorUsed(true);
  };

  const handleSkipTutor = () => {
    setForgetting(null);
    setTutorPokemonIdx(null);
    setTutorUsed(true);
  };

  const handleContinue = () => {
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 gap-5 max-w-lg mx-auto pb-20">
      <h2 className="text-2xl font-bold text-yellow-400">Pokémon Center</h2>

      {/* Tabs */}
      <div className="flex w-full rounded-xl overflow-hidden border border-gray-700">
        <button
          onClick={() => setTab('heal')}
          className={`flex-1 py-2.5 text-sm font-semibold transition ${
            tab === 'heal' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          ❤️ Heal All
        </button>
        <button
          onClick={() => !tutorUsed && setTab('tutor')}
          disabled={tutorUsed}
          className={`flex-1 py-2.5 text-sm font-semibold transition ${
            tab === 'tutor' && !tutorUsed
              ? 'bg-yellow-500 text-gray-900'
              : tutorUsed
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          📚 Move Tutor{tutorUsed ? ' (used)' : ''}
        </button>
      </div>

      {/* Heal Tab */}
      {tab === 'heal' && (
        <div className="w-full flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {party.map((p, i) => (
              <PokemonStatCard key={i} pokemon={p} />
            ))}
          </div>
          {healed ? (
            <p className="text-center text-green-400 font-semibold">All Pokémon fully healed!</p>
          ) : (
            <button
              onClick={handleHealAll}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition"
            >
              Heal All (Free)
            </button>
          )}
        </div>
      )}

      {/* Move Tutor Tab */}
      {tab === 'tutor' && !tutorUsed && (
        <div className="w-full flex flex-col gap-3">
          {tutorPokemonIdx === null ? (
            <>
              <p className="text-sm text-gray-400 text-center">Choose a Pokémon to teach a new move</p>
              <div className="grid grid-cols-2 gap-3">
                {party.map((p, i) => (
                  <PokemonStatCard
                    key={i}
                    pokemon={p}
                    onClick={() => setTutorPokemonIdx(i)}
                  />
                ))}
              </div>
              <button
                onClick={handleSkipTutor}
                className="text-gray-500 hover:text-gray-300 text-sm transition text-center"
              >
                Skip Move Tutor
              </button>
            </>
          ) : forgetting === null ? (
            <>
              <p className="text-sm text-gray-400 text-center">
                Which move should <span className="text-white font-semibold">{tutorPokemon?.name}</span> forget?
              </p>
              <div className="flex flex-col gap-2">
                {tutorPokemon?.moves.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setForgetting(m.id)}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition"
                  >
                    <span className="font-semibold text-sm">{m.name}</span>
                    <span className="text-xs text-gray-400">{m.power > 0 ? `${m.power} pw` : '—'}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setTutorPokemonIdx(null)}
                className="text-gray-500 hover:text-gray-300 text-sm transition text-center"
              >
                ← Back
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">Choose a move to learn</p>
              {tutorMoves.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">No new moves available</p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center max-h-96 overflow-y-auto py-2">
                  {tutorMoves.map((m) => (
                    <MoveCard
                      key={m.id}
                      move={m}
                      energyCost={getEnergyCost(m)}
                      currentPp={m.pp}
                      disabled={false}
                      onClick={() => handleLearnMove(m)}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setForgetting(null)}
                className="text-gray-500 hover:text-gray-300 text-sm transition text-center"
              >
                ← Back
              </button>
            </>
          )}
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition mt-auto"
      >
        Continue →
      </button>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { LEARNSETS } from '../data/learnsets';
import { MOVES } from '../data/moves';
import { usePokemonSprite } from '../hooks/usePokemon';
import type { Pokemon, Move } from '../types';

type Tab = 'heal' | 'tutor';

function PokemonRow({ pokemon, selected, onClick }: { pokemon: Pokemon; selected: boolean; onClick: () => void }) {
  const { spriteUrl } = usePokemonSprite(pokemon.id);
  const hpPct = Math.round((pokemon.currentHp / pokemon.maxHp) * 100);
  const barColor = hpPct > 50 ? 'bg-green-500' : hpPct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl p-3 w-full text-left transition border-2 ${
        selected ? 'border-yellow-400 bg-gray-700' : 'border-gray-700 bg-gray-800 hover:border-gray-500'
      }`}
    >
      {spriteUrl
        ? <img src={spriteUrl} alt={pokemon.name} className="w-10 h-10 object-contain" style={{ imageRendering: 'pixelated' }} />
        : <div className="w-10 h-10 flex items-center justify-center text-2xl">🔴</div>
      }
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{pokemon.name} <span className="text-gray-400 text-xs">Lv.{pokemon.level}</span></p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex-1 bg-gray-600 rounded-full h-1.5">
            <div className={`${barColor} rounded-full h-full`} style={{ width: `${hpPct}%` }} />
          </div>
          <span className="text-xs text-gray-400">{pokemon.currentHp}/{pokemon.maxHp}</span>
        </div>
      </div>
      {pokemon.status && <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded text-gray-300">{pokemon.status.toUpperCase()}</span>}
    </button>
  );
}

export default function PokemonCenterScreen() {
  const navigate = useNavigate();
  const { party, healParty, updateParty, clearNode, currentNodeId } = useRunStore();
  const [tab, setTab] = useState<Tab>('heal');
  const [healed, setHealed] = useState(false);

  // Move Tutor state
  const [tutorPokemonIdx, setTutorPokemonIdx] = useState<number | null>(null);
  const [forgetting, setForgetting] = useState<string | null>(null); // move id to forget

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
  };

  const handleContinue = () => {
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 gap-5 max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-4xl mb-1">🏥</p>
        <h2 className="text-2xl font-bold text-yellow-400">Pokémon Center</h2>
      </div>

      {/* Tabs */}
      <div className="flex w-full rounded-xl overflow-hidden border border-gray-700">
        {(['heal', 'tutor'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-semibold transition ${
              tab === t ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t === 'heal' ? '❤️ Heal All' : '📚 Move Tutor'}
          </button>
        ))}
      </div>

      {/* Heal Tab */}
      {tab === 'heal' && (
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {party.map((p, i) => <PokemonRow key={i} pokemon={p} selected={false} onClick={() => {}} />)}
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
      {tab === 'tutor' && (
        <div className="w-full flex flex-col gap-3">
          {tutorPokemonIdx === null ? (
            <>
              <p className="text-sm text-gray-400 text-center">Choose a Pokémon to teach a new move</p>
              {party.map((p, i) => (
                <PokemonRow key={i} pokemon={p} selected={false} onClick={() => setTutorPokemonIdx(i)} />
              ))}
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
              <button onClick={() => setTutorPokemonIdx(null)} className="text-gray-500 hover:text-gray-300 text-sm transition text-center">← Back</button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">Choose a move to learn</p>
              {tutorMoves.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">No new moves available</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                  {tutorMoves.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleLearnMove(m)}
                      className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 transition"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-sm">{m.name}</span>
                        <span className="text-xs text-gray-400">{m.type}</span>
                      </div>
                      <span className="text-xs text-gray-400">{m.power > 0 ? `${m.power} pw` : '—'}</span>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setForgetting(null)} className="text-gray-500 hover:text-gray-300 text-sm transition text-center">← Back</button>
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

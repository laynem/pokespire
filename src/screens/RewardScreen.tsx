import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { LEARNSETS } from '../data/learnsets';
import { MOVES } from '../data/moves';
import { getEnergyCost } from '../utils/combatEngine';
import MoveCard from '../components/MoveCard';
import type { Move, Pokemon } from '../types';

interface RewardState {
  gold: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDraftMoves(pokemon: Pokemon): Move[] {
  const learnset = LEARNSETS[pokemon.id] ?? [];
  const knownIds = new Set(pokemon.moves.map((m) => m.id));
  const pool = learnset
    .map((e) => MOVES[e.moveId])
    .filter((m): m is Move => !!m && !knownIds.has(m.id));
  const seen = new Set<string>();
  const unique = pool.filter((m) => (seen.has(m.id) ? false : seen.add(m.id) && true));
  return shuffle(unique).slice(0, 3);
}

export default function RewardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gold: goldEarned } = (location.state as RewardState) ?? { gold: 15 };

  const { party, items, addGold, addMoveToParty, incrementMovesLearned } = useRunStore();
  const hasExpShare = items.some((i) => i.id === 'exp_share');

  // With Exp Share, draft for each party member in sequence; otherwise just active
  const draftTargets = hasExpShare ? party : party.slice(0, 1);
  const [draftIndex, setDraftIndex] = useState(0);

  const currentTarget = draftTargets[draftIndex] ?? null;

  const draftMoves = useMemo<Move[]>(() => {
    if (!currentTarget) return [];
    return getDraftMoves(currentTarget);
  }, [currentTarget?.id, draftIndex]); // eslint-disable-line

  const isFirstDraft = draftIndex === 0;
  const bonusGold = isFirstDraft && draftMoves.length === 0 ? 10 : 0;
  const totalGold = goldEarned + bonusGold;

  const advanceOrFinish = () => {
    if (isFirstDraft) addGold(totalGold);
    const nextIndex = draftIndex + 1;
    if (nextIndex < draftTargets.length) {
      setDraftIndex(nextIndex);
    } else {
      navigate('/map');
    }
  };

  const handlePickMove = (move: Move) => {
    const partyIndex = party.findIndex((p) => p.id === currentTarget?.id && p.name === currentTarget?.name);
    if (partyIndex >= 0) addMoveToParty(partyIndex, move);
    incrementMovesLearned();
    advanceOrFinish();
  };

  const handleSkip = () => {
    advanceOrFinish();
  };

  if (!party[0]) {
    navigate('/map');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 gap-6 max-w-lg mx-auto">
      {isFirstDraft && (
        <>
          <div className="text-center">
            <p className="text-4xl mb-2">🏆</p>
            <h2 className="text-2xl font-bold text-yellow-400">Victory!</h2>
          </div>

          {/* Gold earned */}
          <div className="bg-gray-800 border border-yellow-600/40 rounded-xl px-6 py-4 flex items-center gap-4 w-full">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-sm text-gray-400">Gold earned</p>
              <p className="text-2xl font-bold text-yellow-400">+{totalGold}g</p>
              {bonusGold > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">+{bonusGold}g bonus — no new moves!</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Exp Share indicator */}
      {hasExpShare && draftTargets.length > 1 && (
        <p className="text-xs text-blue-400 text-center">
          🔗 Exp. Share — picking for {currentTarget?.name ?? '…'} ({draftIndex + 1}/{draftTargets.length})
        </p>
      )}

      {/* Move draft */}
      {currentTarget && draftMoves.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          <p className="text-center text-sm text-gray-400">
            Choose a move for <span className="text-white font-semibold">{currentTarget.name}</span>
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {draftMoves.map((move) => (
              <MoveCard
                key={move.id}
                move={move}
                energyCost={getEnergyCost(move)}
                currentPp={3}
                maxCombatPp={3}
                disabled={false}
                onClick={() => handlePickMove(move)}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-300 text-sm transition text-center"
          >
            Skip
          </button>
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={handleSkip}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

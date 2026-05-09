import { useEffect, useState } from 'react';
import type { LevelUpResult } from '../types';

interface LevelUpToastProps {
  levelUps: LevelUpResult[];
}

export default function LevelUpToast({ levelUps }: LevelUpToastProps) {
  const [queue, setQueue] = useState<LevelUpResult[]>([]);
  const [current, setCurrent] = useState<LevelUpResult | null>(null);
  const [visible, setVisible] = useState(false);

  // Initialize queue when levelUps prop changes
  useEffect(() => {
    if (levelUps.length > 0) {
      setQueue([...levelUps]);
    }
  }, [levelUps]);

  // Process queue: show next toast when queue changes and nothing is visible
  useEffect(() => {
    if (queue.length === 0 || visible) return;

    const next = queue[0];
    setCurrent(next);
    setVisible(true);
    setQueue((q) => q.slice(1));

    const timer = setTimeout(() => {
      setVisible(false);
      setCurrent(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [queue, visible]);

  if (!visible || !current) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-yellow-400 border-2 border-yellow-600 rounded-xl px-5 py-3 shadow-2xl text-center min-w-[260px]">
        <p className="font-extrabold text-gray-900 text-base leading-tight">
          {current.pokemonName} grew to Lv{current.newLevel}!
        </p>
        <p className="text-gray-800 text-xs mt-1 font-semibold">
          HP +{current.hpGain}&nbsp;&nbsp;ATK +{current.atkGain}&nbsp;&nbsp;DEF +{current.defGain}&nbsp;&nbsp;SpATK +{current.spAtkGain}&nbsp;&nbsp;SpDEF +{current.spDefGain}&nbsp;&nbsp;SPD +{current.spdGain}
        </p>
      </div>
    </div>
  );
}

interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
}

const STAT_BARS = [
  { key: 'hp'      as const, label: 'HP',  color: 'bg-green-500'  },
  { key: 'attack'  as const, label: 'ATK', color: 'bg-red-500'    },
  { key: 'defense' as const, label: 'DEF', color: 'bg-yellow-500' },
  { key: 'spAtk'  as const, label: 'SpA', color: 'bg-blue-500'   },
  { key: 'spDef'  as const, label: 'SpD', color: 'bg-teal-500'   },
];

const STAT_MAX = 150;

interface StatBarsProps {
  stats: BaseStats;
}

export default function StatBars({ stats }: StatBarsProps) {
  return (
    <div className="w-full flex flex-col gap-1">
      {STAT_BARS.map(({ key, label, color }) => {
        const value = stats[key];
        return (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className="w-7 text-gray-400 shrink-0">{label}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`${color} h-full rounded-full`}
                style={{ width: `${Math.min((value / STAT_MAX) * 100, 100)}%` }}
              />
            </div>
            <span className="w-6 text-right text-gray-300 shrink-0">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

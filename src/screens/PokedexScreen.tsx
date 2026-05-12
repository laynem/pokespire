import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { POKEMON_TEMPLATES } from '../data/pokemon';

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-500', Water: 'bg-blue-500',
  Electric: 'bg-yellow-400', Grass: 'bg-green-500', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-600', Poison: 'bg-purple-500', Ground: 'bg-yellow-600',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-500',
  Rock: 'bg-yellow-700', Ghost: 'bg-purple-700', Dragon: 'bg-indigo-600',
  Dark: 'bg-gray-700', Steel: 'bg-slate-400', Fairy: 'bg-pink-300',
};

export default function PokedexScreen() {
  const navigate = useNavigate();
  const seenPokemon = useRunStore((s) => s.seenPokemon);
  const caughtPokemon = useRunStore((s) => s.caughtPokemon);

  const allPokemon = Object.values(POKEMON_TEMPLATES).sort((a, b) => a.id - b.id);
  const seenSet = new Set(seenPokemon);
  const caughtSet = new Set(caughtPokemon);

  const totalSeen = seenSet.size;
  const totalCaught = caughtSet.size;
  const total = allPokemon.length;

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition text-lg leading-none"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-yellow-400">Pokédex</h1>
          <p className="text-xs text-gray-400">
            Seen: {totalSeen} · Caught: {totalCaught} / {total}
          </p>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto subtle-scroll">
      {/* Grid */}
      <div className="px-8 pt-8 pb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(9.75rem, max-content))', gap: '1rem 0.5rem', justifyContent: 'center', maxWidth: 'calc(9 * 9.75rem + 8 * 0.5rem + 4rem)', margin: '0 auto' }}>
        {allPokemon.map((template) => {
          const caught = caughtSet.has(template.id);
          const seen = seenSet.has(template.id);

          if (caught || seen) {
            return (
              <div key={template.id} className="select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
              <div
                className={`flex flex-col rounded-xl border-2 bg-gray-800 overflow-hidden
                  ${caught ? 'border-yellow-400/80' : 'border-gray-500/50'}`}
                style={{ width: '8.75rem', height: '12.5rem' }}
              >
                <div className="flex-1 min-h-0 flex items-center justify-center px-1 pt-2">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${template.id}.png`}
                    alt={template.name}
                    style={{
                      width: '80%',
                      aspectRatio: '1',
                      objectFit: 'contain',
                      filter: caught ? 'none' : 'grayscale(100%) brightness(40%)',
                    }}
                  />
                </div>
                <div className="text-center leading-none pb-0.5">
                  <span
                    className="text-gray-400"
                    style={{ fontFamily: "'Futura PT', sans-serif", fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.08em' }}
                  >
                    #{String(template.id).padStart(4, '0')}
                  </span>
                </div>
                <div className="text-center px-1 pb-1 leading-tight">
                  <span
                    className={`drop-shadow ${caught ? 'text-white' : 'text-gray-400'}`}
                    style={{ fontFamily: "'Futura PT', sans-serif", fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.02em' }}
                  >
                    {template.name}
                  </span>
                </div>
                <div className="pb-2 flex gap-0.5 flex-wrap justify-center px-1">
                  {caught && template.types.map((t) => (
                    <span
                      key={t}
                      className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full`}
                    >
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            );
          }

          return (
            <div key={template.id} className="relative select-none" style={{ paddingTop: 15, paddingLeft: 15 }}>
              <div
                className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-700 bg-gray-800/50"
                style={{ width: '8.75rem', height: '12.5rem' }}
              >
                <span className="text-xl mb-1 opacity-30">❓</span>
                <span className="text-gray-600 text-xs font-bold">???</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 py-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" /> Caught
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-500/50 border border-gray-500 inline-block" /> Seen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700 inline-block" /> Unknown
        </span>
      </div>
      </div>
    </div>
  );
}

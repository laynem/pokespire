import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { POKEMON_TEMPLATES } from '../data/pokemon';
import { getPokemonSpriteUrl } from '../hooks/usePokemon';

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
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

      {/* Grid */}
      <div className="p-6 grid grid-cols-5 gap-4 max-w-5xl mx-auto w-full">
        {allPokemon.map((template) => {
          const caught = caughtSet.has(template.id);
          const seen = seenSet.has(template.id);

          return (
            <div
              key={template.id}
              className={`rounded-xl border relative p-3 pt-6
                ${caught
                  ? 'bg-gray-800 border-yellow-600/40'
                  : seen
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-800/50 border-gray-800'
                }`}
            >
              <span className="text-gray-600 text-xs absolute top-1.5 left-2">#{template.id}</span>

              {caught || seen ? (
                <img
                  src={getPokemonSpriteUrl(template.id)}
                  alt={template.name}
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    filter: caught ? 'none' : 'grayscale(100%) brightness(40%)',
                  }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1' }} className="flex items-center justify-center">
                  <span className="text-gray-600 text-4xl font-bold">?</span>
                </div>
              )}

              <div className="mt-2 flex flex-col items-center gap-1">
                <span
                  className={`text-xs font-semibold text-center leading-tight truncate w-full text-center
                    ${caught ? 'text-gray-200' : seen ? 'text-gray-500' : 'text-gray-700'}`}
                >
                  {caught || seen ? template.name : '???'}
                </span>

                {caught && (
                  <div className="flex gap-0.5 flex-wrap justify-center">
                    {template.types.map((t) => (
                      <span
                        key={t}
                        className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-[9px] px-1.5 py-0.5 rounded`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 py-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-600/60 inline-block" /> Caught
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-600 inline-block" /> Seen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700 inline-block" /> Unknown
        </span>
      </div>
    </div>
  );
}

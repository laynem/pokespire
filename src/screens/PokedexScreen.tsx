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
      <div className="p-2 pt-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '0.5rem' }}>
        {allPokemon.map((template) => {
          const caught = caughtSet.has(template.id);
          const seen = seenSet.has(template.id);

          if (caught || seen) {
            return (
              <div
                key={template.id}
                className={`flex flex-col rounded-xl border-2 bg-gray-800 overflow-hidden select-none
                  ${caught ? 'border-yellow-400/80' : 'border-gray-500/50'}`}
                style={{ width: '100%', aspectRatio: '7/10' }}
              >
                <div className="pt-1 pb-0 px-1 text-center">
                  <span
                    className={`font-bold drop-shadow leading-tight ${caught ? 'text-white' : 'text-gray-400'}`}
                    style={{ fontFamily: "'Gill Sans MT', 'Gill Sans', 'Calibri', sans-serif", fontSize: '0.6rem' }}
                  >
                    {template.name}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center px-1">
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
                <div className="pb-1 flex gap-0.5 flex-wrap justify-center px-1">
                  {caught ? (
                    template.types.map((t) => (
                      <span
                        key={t}
                        className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-[8px] px-1 py-0.5 rounded`}
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 text-[8px]">#{template.id}</span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={template.id} className="relative select-none">
              <div
                className="absolute z-10 rounded-full bg-black/80 border-2 border-gray-600 flex items-center justify-center"
                style={{ width: 20, height: 20, top: 4, left: 4 }}
              >
                <span className="text-gray-500 text-xs font-bold leading-none">?</span>
              </div>
              <div
                className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-700 bg-gray-800/50"
                style={{ width: '100%', aspectRatio: '7/10' }}
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

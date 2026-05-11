import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TrainerCard {
  id: string;
  name: string;
  sprite: string;
  flavour: string;
  passive: string;
  passiveDesc: string;
  locked: boolean;
}

const TRAINERS: TrainerCard[] = [
  {
    id: 'ash',
    name: 'Ash',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/ash.png',
    flavour: 'A boy from Pallet Town with dreams of becoming a Pokémon Master.',
    passive: 'Never Give Up',
    passiveDesc: 'When a Pokémon faints, the next one sent in draws +1 extra card.',
    locked: false,
  },
  {
    id: 'misty',
    name: 'Misty',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png',
    flavour: 'Coming soon.',
    passive: '???',
    passiveDesc: 'Locked.',
    locked: true,
  },
  {
    id: 'brock',
    name: 'Brock',
    sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png',
    flavour: 'Coming soon.',
    passive: '???',
    passiveDesc: 'Locked.',
    locked: true,
  },
];

export default function CharacterSelectScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('ash');

  const selectedTrainer = TRAINERS.find((t) => t.id === selected)!;

  return (
    <div className="absolute inset-0 bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-6 gap-6 overflow-y-auto">
      <h2 className="text-3xl font-bold text-yellow-400">Choose Your Trainer</h2>

      {/* Trainer cards */}
      <div className="flex gap-4 flex-wrap justify-center">
        {TRAINERS.map((t) => (
          <button
            key={t.id}
            disabled={t.locked}
            onClick={() => setSelected(t.id)}
            className={`
              relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 w-52 transition overflow-hidden
              ${t.locked
                ? 'border-gray-700 bg-gray-800 opacity-40 cursor-not-allowed'
                : selected === t.id
                  ? 'border-yellow-400 bg-gray-800 shadow-lg shadow-yellow-400/20'
                  : 'border-gray-600 bg-gray-800 hover:border-gray-400'}
            `}
          >
            {t.locked && (
              <span className="absolute top-2 right-2 text-xs text-gray-500">🔒</span>
            )}
            <img
              src={t.sprite}
              alt={t.name}
              className="w-full aspect-square object-contain object-top scale-[1.6] mb-14"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-bold text-lg">{t.name}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-[656px] flex flex-col gap-3">
        <p className="text-gray-400 text-sm italic">{selectedTrainer.flavour}</p>
        <div className="border-t border-gray-700 pt-3">
          <p className="text-yellow-400 font-semibold text-sm">Passive — {selectedTrainer.passive}</p>
          <p className="text-gray-300 text-sm mt-1">{selectedTrainer.passiveDesc}</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/starter-select')}
        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-10 rounded-lg transition text-lg"
      >
        Next →
      </button>

      <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back
      </button>
    </div>
  );
}

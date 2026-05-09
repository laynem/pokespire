import { useNavigate } from 'react-router-dom';

const TRAINERS = [
  { id: 'red', name: 'Red', sprite: '🧢', starterPokemonId: 4 },
  { id: 'leaf', name: 'Leaf', sprite: '🌿', starterPokemonId: 1 },
  { id: 'chase', name: 'Chase', sprite: '⚡', starterPokemonId: 25 },
];

export default function CharacterSelectScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-8">
      <h2 className="text-4xl font-bold text-yellow-400">Choose Your Trainer</h2>
      <div className="flex gap-6">
        {TRAINERS.map((trainer) => (
          <button
            key={trainer.id}
            onClick={() => navigate('/map')}
            className="flex flex-col items-center gap-3 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-yellow-400 rounded-xl p-6 transition w-40"
          >
            <span className="text-6xl">{trainer.sprite}</span>
            <span className="font-semibold text-lg">{trainer.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => navigate('/')}
        className="text-gray-500 hover:text-gray-300 transition"
      >
        ← Back
      </button>
    </div>
  );
}

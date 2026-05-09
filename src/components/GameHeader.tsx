import { useState } from 'react';
import logo from '../assets/logo.png';

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-80 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xl font-bold text-yellow-400">Settings</p>
        <p className="text-gray-500 text-sm text-center">Settings coming soon.</p>
        <button
          onClick={onClose}
          className="mt-2 w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function GameHeader() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {/* h-10 = 40px — screens that use fixed inset-0 need to account for this */}
      <header className="shrink-0 h-10 bg-gray-950/90 border-b border-white/10 backdrop-blur-sm z-[100] relative flex items-center px-3">
        {/* Gear placeholder left — invisible, keeps logo centred on mobile */}
        <div className="w-7 sm:hidden" />

        {/* Logo: centred on mobile, left on sm+ */}
        <img
          src={logo}
          alt="PokeSpire"
          className="h-6 sm:mr-auto mx-auto sm:mx-0"
        />

        {/* Gear button always right */}
        <button
          onClick={() => setShowSettings(true)}
          className="ml-auto text-gray-400 hover:text-white transition text-lg leading-none"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

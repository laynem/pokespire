import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GameHeader from './components/GameHeader';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { useAuthStore } from './store/authStore';
import { useRunStore } from './store/runStore';
import { loadSave, upsertSave } from './lib/runSaveService';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import StarterSelectScreen from './screens/StarterSelectScreen';
import MapScreen from './screens/MapScreen';
import CombatScreen from './screens/CombatScreen';
import GameOverScreen from './screens/GameOverScreen';
import VictoryScreen from './screens/VictoryScreen';
import RewardScreen from './screens/RewardScreen';
import BossRewardScreen from './screens/BossRewardScreen';
import CatchScreen from './screens/CatchScreen';
import PokemonCenterScreen from './screens/PokemonCenterScreen';
import PokeMartScreen from './screens/PokeMartScreen';
import PokedexScreen from './screens/PokedexScreen';
import CollectionScreen from './screens/CollectionScreen';
import AchievementsScreen from './screens/AchievementsScreen';

const NO_HEADER_ROUTES = new Set(['/', '/login', '/pokedex', '/collection', '/achievements']);

function AnimatedRoutes() {
  const location = useLocation();
  const showHeader = !NO_HEADER_ROUTES.has(location.pathname);
  const { user, loading } = useAuthStore();
  const [saveLoaded, setSaveLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) {
      useRunStore.getState().endRun();
      setSaveLoaded(true);
      return;
    }

    setSaveLoaded(false);
    loadSave(user.id).then((saved) => {
      if (saved) useRunStore.getState().hydrate(saved);
      setSaveLoaded(true);
    });

    const unsub = useRunStore.subscribe((state) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        upsertSave(user.id, state);
      }, 1500);
    });

    return () => {
      unsub();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user]);

  const footer = (
    <footer className="shrink-0 py-2 text-center">
      <p className="text-gray-600 text-xs mx-auto w-3/5">
        © 2026 PokeSpire — Fan project not affiliated with Nintendo or The Pokémon Company. Pokémon and all related names are trademarks of Nintendo / Game Freak.
      </p>
    </footer>
  );

  if (loading || !saveLoaded) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        {footer}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-screen bg-gray-900">
        <div className="flex-1 overflow-hidden relative">
          <LoginScreen />
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {showHeader && <GameHeader />}
      <div key={location.pathname} className={`animate-fade-in flex-1 relative overflow-hidden`}>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/character-select" element={<CharacterSelectScreen />} />
          <Route path="/starter-select" element={<StarterSelectScreen />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/combat" element={<CombatScreen />} />
          <Route path="/game-over" element={<GameOverScreen />} />
          <Route path="/reward" element={<RewardScreen />} />
          <Route path="/catch" element={<CatchScreen />} />
          <Route path="/center" element={<PokemonCenterScreen />} />
          <Route path="/mart" element={<PokeMartScreen />} />
          <Route path="/boss-reward" element={<BossRewardScreen />} />
          <Route path="/victory" element={<VictoryScreen />} />
          <Route path="/pokedex" element={<PokedexScreen />} />
          <Route path="/collection" element={<CollectionScreen />} />
          <Route path="/achievements" element={<AchievementsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {footer}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

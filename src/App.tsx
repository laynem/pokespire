import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in">
      <Routes>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CharacterSelectScreen from './screens/CharacterSelectScreen';
import StarterSelectScreen from './screens/StarterSelectScreen';
import MapScreen from './screens/MapScreen';
import CombatScreen from './screens/CombatScreen';
import GameOverScreen from './screens/GameOverScreen';
import VictoryScreen from './screens/VictoryScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/character-select" element={<CharacterSelectScreen />} />
        <Route path="/starter-select" element={<StarterSelectScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/combat" element={<CombatScreen />} />
        <Route path="/game-over" element={<GameOverScreen />} />
        <Route path="/victory" element={<VictoryScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

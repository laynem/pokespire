import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombatStore, getRestoredParty } from '../store/combatStore';
import { useRunStore } from '../store/runStore';
import { usePokemonSprite } from '../hooks/usePokemon';
import MoveCard from '../components/MoveCard';
import { getEnergyCost } from '../utils/combatEngine';
import { buildPokemon } from '../utils/pokemonFactory';
import type { CombatPokemon } from '../utils/combatEngine';
import type { Move } from '../types';

function ItemTray({ items }: { items: { id: string; name: string; icon: string; description: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((item) => (
        <span key={item.id} title={`${item.name}: ${item.description}`} className="text-lg cursor-default">
          {item.icon}
        </span>
      ))}
    </div>
  );
}

const STATUS_BADGE: Record<string, string> = {
  burn: '🔥 BRN',
  poison: '☠️ PSN',
  paralysis: '⚡ PAR',
  sleep: '💤 SLP',
  freeze: '❄️ FRZ',
};

function HpBar({ current, max, small }: { current: number; max: number; small?: boolean }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className={`w-full bg-gray-700 rounded-full ${small ? 'h-2' : 'h-3'}`}>
      <div className={`${color} rounded-full h-full transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function PokemonPanel({ pokemon, isPlayer }: { pokemon: CombatPokemon; isPlayer: boolean }) {
  const { spriteUrl } = usePokemonSprite(pokemon.id);
  return (
    <div className={`flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl p-3 ${isPlayer ? 'flex-row-reverse' : ''}`}>
      {spriteUrl
        ? <img src={spriteUrl} alt={pokemon.name} className="w-16 h-16 object-contain" style={{ imageRendering: 'pixelated' }} />
        : <div className="w-16 h-16 flex items-center justify-center text-3xl">🔴</div>
      }
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold truncate">{pokemon.name}</span>
          <span className="text-xs text-gray-400">Lv.{pokemon.level}</span>
          {pokemon.status && <span className="text-xs bg-gray-700 px-1 rounded">{STATUS_BADGE[pokemon.status]}</span>}
        </div>
        <HpBar current={pokemon.currentHp} max={pokemon.maxHp} />
        <p className="text-xs text-gray-400 mt-0.5">{pokemon.currentHp} / {pokemon.maxHp} HP</p>
      </div>
    </div>
  );
}

function EnergyPips({ current, max = 3 }: { current: number; max?: number }) {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-xs text-gray-400 mr-1">Energy:</span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`w-4 h-4 rounded-full ${i < current ? 'bg-blue-500' : 'bg-gray-700'}`} />
      ))}
    </div>
  );
}

export default function CombatScreen() {
  const navigate = useNavigate();
  const { party, items: runItems, currentNodeId, clearNode, updateParty, updateItems } = useRunStore();
  const combat = useCombatStore();
  const [showSwitch, setShowSwitch] = useState(false);
  const [lastLog, setLastLog] = useState<string[]>([]);

  // Init combat on mount if not already started
  useEffect(() => {
    if (combat.playerParty.length === 0 && party.length > 0) {
      const wildId = [1, 4, 7, 25][Math.floor(Math.random() * 4)];
      const wildLevel = 3 + Math.floor(Math.random() * 5);
      const enemy = buildPokemon(wildId, wildLevel);
      combat.startCombat(party, enemy, runItems);
    }
  }, []); // eslint-disable-line

  // Track new log entries
  useEffect(() => {
    setLastLog(combat.log.slice(-5));
  }, [combat.log]);

  // Handle phase transitions
  useEffect(() => {
    if (combat.phase === 'victory') {
      const timer = setTimeout(() => {
        // Restore PP and update party in run store
        if (combat.playerParty.length > 0) {
          const restored = getRestoredParty(combat.playerParty);
          updateParty(restored);
        }
        if (currentNodeId) clearNode(currentNodeId);
        // Sync items back (Lum Berry may have been consumed)
        if (updateItems) updateItems(combat.items);
        let gold = 10 + Math.floor(Math.random() * 11);
        if (combat.items.some((i) => i.id === 'amulet_coin')) gold = Math.floor(gold * 1.5);
        combat.clearCombat();
        navigate('/reward', { state: { gold } });
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (combat.phase === 'defeat') {
      const timer = setTimeout(() => {
        combat.clearCombat();
        navigate('/game-over');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [combat.phase]); // eslint-disable-line

  if (combat.playerParty.length === 0) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  const activePlayer = combat.playerParty[0];
  const enemy = combat.enemy;
  const isPlayerTurn = combat.phase === 'player';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col max-w-lg mx-auto px-3 py-4 gap-3">

      {/* Enemy */}
      <PokemonPanel pokemon={enemy} isPlayer={false} />

      {/* Enemy intent */}
      {combat.enemyIntent && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
          <span className="text-gray-400">Intent:</span>
          <span className="font-semibold">{enemy.name}</span>
          <span className="text-gray-400">will use</span>
          <span className="text-yellow-300 font-bold">{combat.enemyIntent.name}</span>
          {combat.enemyIntent.power > 0 && (
            <span className="text-red-400 text-xs">({combat.enemyIntent.power} pw)</span>
          )}
        </div>
      )}

      {/* Combat log */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 h-20 overflow-y-auto flex flex-col-reverse gap-0.5">
        {[...lastLog].reverse().map((entry, i) => (
          <p key={i} className={`text-xs ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{entry}</p>
        ))}
      </div>

      {/* Player */}
      <PokemonPanel pokemon={activePlayer} isPlayer={true} />

      {/* Item tray */}
      {runItems.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Items:</span>
          <ItemTray items={runItems} />
        </div>
      )}

      {/* Energy + actions */}
      <div className="flex items-center justify-between">
        <EnergyPips current={combat.playerEnergy} />
        <div className="flex gap-2">
          {combat.playerParty.length > 1 && isPlayerTurn && (
            <button
              onClick={() => setShowSwitch(!showSwitch)}
              className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition"
            >
              Switch
            </button>
          )}
          <button
            onClick={() => combat.endTurn()}
            disabled={!isPlayerTurn}
            className="text-xs bg-blue-700 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1 rounded transition font-semibold"
          >
            End Turn
          </button>
        </div>
      </div>

      {/* Switch panel */}
      {showSwitch && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-sm font-semibold text-yellow-400">Switch Pokémon</p>
          {combat.playerParty.slice(1).map((p, i) => (
            <button
              key={p.id}
              onClick={() => { combat.switchPokemon(i + 1); setShowSwitch(false); }}
              className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-2 text-left transition"
            >
              <span className="font-semibold">{p.name}</span>
              <div className="flex-1">
                <HpBar current={p.currentHp} max={p.maxHp} small />
              </div>
              <span className="text-xs text-gray-400">{p.currentHp}/{p.maxHp}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hand of cards */}
      <div className="flex gap-2 overflow-x-auto pb-1 justify-center flex-wrap">
        {combat.playerHand.map((move, i) => {
          const cost = getEnergyCost(move);
          const pp = activePlayer.currentPp[move.id] ?? 0;
          return (
            <MoveCard
              key={`${move.id}-${i}`}
              move={move}
              energyCost={cost}
              currentPp={pp}
              disabled={!isPlayerTurn || combat.playerEnergy < cost || pp <= 0}
              onClick={() => isPlayerTurn && combat.playCard(move)}
            />
          );
        })}
        {combat.playerHand.length === 0 && isPlayerTurn && (
          <p className="text-gray-500 text-sm py-4">No cards in hand — End Turn to draw</p>
        )}
      </div>

      {/* Phase overlay */}
      {(combat.phase === 'victory' || combat.phase === 'defeat') && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="text-center">
            <p className="text-5xl mb-3">{combat.phase === 'victory' ? '🏆' : '💀'}</p>
            <p className="text-2xl font-bold text-yellow-400">
              {combat.phase === 'victory' ? 'Victory!' : 'Defeated...'}
            </p>
          </div>
        </div>
      )}

      {combat.phase === 'switch' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-72 flex flex-col gap-3">
            <p className="font-bold text-yellow-400 text-center">Choose next Pokémon</p>
            {combat.playerParty.slice(1).map((p, i) => (
              <button
                key={p.id}
                onClick={() => combat.switchPokemon(i + 1)}
                className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition"
              >
                <span className="font-semibold">{p.name}</span>
                <div className="flex-1">
                  <HpBar current={p.currentHp} max={p.maxHp} small />
                </div>
                <span className="text-xs text-gray-400">{p.currentHp}/{p.maxHp}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

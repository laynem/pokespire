import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCombatStore, getRestoredParty } from '../store/combatStore';
import { useRunStore } from '../store/runStore';
import { usePokemonSprite } from '../hooks/usePokemon';
import MoveCard from '../components/MoveCard';
import { getEnergyCost, awardXp } from '../utils/combatEngine';
import { buildPokemon } from '../utils/pokemonFactory';
import { GYM_LEADERS } from '../data/gymLeaders';
import type { CombatPokemon, CoinFlipResult } from '../utils/combatEngine';

// ── HP Box (Pokemon game style) ──────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  burn: 'BRN', poison: 'PSN', paralysis: 'PAR', sleep: 'SLP', freeze: 'FRZ',
};

const STATUS_COLOR: Record<string, string> = {
  burn: 'bg-red-500', poison: 'bg-purple-500', paralysis: 'bg-yellow-500',
  sleep: 'bg-blue-400', freeze: 'bg-cyan-400',
};

function PokemonHpBox({ pokemon, showHpNumbers = false }: { pokemon: CombatPokemon; showHpNumbers?: boolean }) {
  const pct = Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100));
  const barColor = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-gray-100 border-2 border-gray-400 rounded-xl px-3 py-2 min-w-[160px] shadow-lg">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-bold text-gray-900 text-sm uppercase tracking-wide leading-none truncate max-w-[110px]">
          {pokemon.name}
        </span>
        <span className="text-xs text-gray-600 font-bold ml-2 shrink-0">Lv{pokemon.level}</span>
      </div>
      {pokemon.status && (
        <span className={`${STATUS_COLOR[pokemon.status] ?? 'bg-gray-500'} text-white text-xs px-1.5 rounded font-bold mb-1 inline-block`}>
          {STATUS_BADGE[pokemon.status]}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-extrabold text-gray-600 leading-none shrink-0">HP</span>
        <div className="flex-1 h-2.5 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {showHpNumbers && (
        <p className="text-right text-xs text-gray-600 mt-0.5 font-semibold tabular-nums">
          {pokemon.currentHp}/{pokemon.maxHp}
        </p>
      )}
    </div>
  );
}

// ── Damage floats ────────────────────────────────────────────────

interface FloatNum { id: number; value: number }

function DamageFloat({ nums }: { nums: FloatNum[] }) {
  return (
    <>
      {nums.map((n) => (
        <div
          key={n.id}
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 animate-float-up font-bold text-red-400 text-xl drop-shadow-lg select-none"
        >
          -{n.value}
        </div>
      ))}
    </>
  );
}

// ── Energy pips ──────────────────────────────────────────────────

function EnergyPips({ current, max = 3 }: { current: number; max?: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
            i < current ? 'bg-blue-400 border-blue-300' : 'bg-stone-700 border-stone-600'
          }`}
        />
      ))}
      <span className="text-xs text-stone-400 ml-1">{current}/{max}</span>
    </div>
  );
}

// ── Coin Flip Modal ───────────────────────────────────────────────

function CoinFlipModal({ flip }: { flip: CoinFlipResult }) {
  const isHeads = flip.result === 'heads';
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gray-900/90 border-2 border-yellow-400/60 rounded-2xl px-8 py-5 flex flex-col items-center gap-2 animate-bounce-in shadow-2xl">
        <span className="text-4xl animate-spin-once">🪙</span>
        <span className={`text-2xl font-extrabold tracking-wider ${isHeads ? 'text-green-400' : 'text-red-400'}`}>
          {isHeads ? 'HEADS!' : 'TAILS!'}
        </span>
        <span className="text-sm text-gray-300 text-center">
          {isHeads
            ? `${flip.pokemonName} dodged ${flip.status}!`
            : `${flip.status} hits ${flip.pokemonName}!`}
        </span>
      </div>
    </div>
  );
}

// ── Card Pile Modal ───────────────────────────────────────────────

function CardPileModal({
  title,
  moves,
  onClose,
}: {
  title: string;
  moves: import('../types').Move[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-5 w-[90vw] max-w-lg max-h-[80vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="font-bold text-yellow-400 text-lg">{title}</p>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">✕</button>
        </div>
        {moves.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Empty</p>
        ) : (
          <div className="overflow-y-auto">
            <div className="grid grid-cols-3 gap-3 pb-1">
              {moves.map((move, i) => (
                <MoveCard
                  key={`${move.id}-${i}`}
                  move={move}
                  energyCost={getEnergyCost(move)}
                  currentPp={3}
                  disabled={true}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-500 text-right">{moves.length} card{moves.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}

// ── Seeded PRNG (Mulberry32) ──────────────────────────────────────

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seededEnemy(seed: number, nodeId: string): { id: number; level: number } {
  // Hash nodeId into a number and combine with seed
  let h = seed;
  for (let i = 0; i < nodeId.length; i++) {
    h = Math.imul(31, h) + nodeId.charCodeAt(i) | 0;
  }
  const rand = mulberry32(h);
  const wildIds = [1, 4, 7, 25];
  const id = wildIds[Math.floor(rand() * wildIds.length)];
  const level = 3 + Math.floor(rand() * 5);
  return { id, level };
}

// ── Main screen ──────────────────────────────────────────────────

let dmgIdCounter = 0;

export default function CombatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { party, items: runItems, badges, seed, currentNodeId, clearNode, updateParty, updateItems, endRun } = useRunStore();
  const combat = useCombatStore();
  const [showSwitch, setShowSwitch] = useState(false);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [lastLog, setLastLog] = useState<string[]>([]);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [coinFlipModal, setCoinFlipModal] = useState<CoinFlipResult | null>(null);

  const [enemyHitKey, setEnemyHitKey] = useState(0);
  const [playerHitKey, setPlayerHitKey] = useState(0);
  const [enemyDmgNums, setEnemyDmgNums] = useState<FloatNum[]>([]);
  const [playerDmgNums, setPlayerDmgNums] = useState<FloatNum[]>([]);
  const [superEffective, setSuperEffective] = useState(false);
  const [playerFainting, setPlayerFainting] = useState(false);
  const [enemyFainting, setEnemyFainting] = useState(false);

  const prevEnemyHpRef = useRef<number | null>(null);
  const prevPlayerHpRef = useRef<number | null>(null);
  const prevEnemyIdRef = useRef<number | null>(null);

  const bossLeaderId = (location.state as { bossLeaderId?: string } | null)?.bossLeaderId ?? null;
  const isBoss = bossLeaderId !== null;

  // Sprites
  const activePlayer = combat.playerParty[0];
  const enemy = combat.enemy;
  const { spriteUrl: enemySpriteUrl } = usePokemonSprite(enemy?.id ?? null, false);
  const { spriteUrl: playerSpriteUrl } = usePokemonSprite(activePlayer?.id ?? null, true);

  // Init
  useEffect(() => {
    if (combat.playerParty.length === 0 && party.length > 0) {
      if (isBoss && bossLeaderId) {
        const leader = GYM_LEADERS[bossLeaderId];
        const first = leader.team[0];
        const leadPokemon = buildPokemon(first.pokemonId, first.level, first.moveIds);
        const remainingTeam = leader.team.slice(1).map((m) => buildPokemon(m.pokemonId, m.level, m.moveIds));
        combat.startCombat(party, leadPokemon, runItems, { leaderId: bossLeaderId, remainingTeam, bossName: leader.name, badges });
      } else {
        // Seeded enemy selection — same node always produces same enemy
        const { id: wildId, level: wildLevel } = seededEnemy(seed, currentNodeId ?? 'wild');
        const wildEnemy = buildPokemon(wildId, wildLevel);
        combat.startCombat(party, wildEnemy, runItems);
      }
    }
  }, []); // eslint-disable-line

  // Detect enemy HP drop
  useEffect(() => {
    if (!combat.enemy) return;
    const cur = combat.enemy.currentHp;
    const prev = prevEnemyHpRef.current;
    const enemyId = combat.enemy.id;
    if (prev !== null && prevEnemyIdRef.current === enemyId && cur < prev) {
      const dmg = prev - cur;
      setEnemyHitKey((k) => k + 1);
      const id = ++dmgIdCounter;
      setEnemyDmgNums((ns) => [...ns, { id, value: dmg }]);
      setTimeout(() => setEnemyDmgNums((ns) => ns.filter((n) => n.id !== id)), 1100);
    }
    prevEnemyHpRef.current = cur;
    prevEnemyIdRef.current = enemyId;
  }, [combat.enemy?.currentHp, combat.enemy?.id]); // eslint-disable-line

  // Detect player HP drop
  useEffect(() => {
    if (!combat.playerParty[0]) return;
    const cur = combat.playerParty[0].currentHp;
    const prev = prevPlayerHpRef.current;
    if (prev !== null && cur < prev) {
      const dmg = prev - cur;
      setPlayerHitKey((k) => k + 1);
      const id = ++dmgIdCounter;
      setPlayerDmgNums((ns) => [...ns, { id, value: dmg }]);
      setTimeout(() => setPlayerDmgNums((ns) => ns.filter((n) => n.id !== id)), 1100);
    }
    prevPlayerHpRef.current = cur;
  }, [combat.playerParty[0]?.currentHp]); // eslint-disable-line

  // Super effective
  useEffect(() => {
    const latest = combat.log[combat.log.length - 1] ?? '';
    if (latest === 'Super effective!') {
      setSuperEffective(true);
      setTimeout(() => setSuperEffective(false), 1200);
    }
  }, [combat.log]);

  useEffect(() => { setLastLog(combat.log.slice(-4)); }, [combat.log]);

  useEffect(() => {
    if (combat.phase === 'switch') { setPlayerFainting(true); setTimeout(() => setPlayerFainting(false), 600); }
  }, [combat.phase]);

  useEffect(() => {
    if (combat.enemy?.currentHp === 0) { setEnemyFainting(true); setTimeout(() => setEnemyFainting(false), 600); }
  }, [combat.enemy?.currentHp]); // eslint-disable-line

  // Coin flip modal
  useEffect(() => {
    if (combat.lastCoinFlip) {
      setCoinFlipModal(combat.lastCoinFlip);
      const t = setTimeout(() => setCoinFlipModal(null), 1200);
      return () => clearTimeout(t);
    }
  }, [combat.lastCoinFlip]); // eslint-disable-line

  // Phase transitions
  useEffect(() => {
    if (combat.phase === 'victory') {
      const t = setTimeout(() => {
        // Award XP before restoring party
        const { updatedParty, levelUps } = awardXp(
          combat.playerParty,
          combat.participantIds,
          combat.enemy.level,
        );
        const restored = getRestoredParty(updatedParty);
        if (combat.playerParty.length > 0) updateParty(restored);
        if (currentNodeId) clearNode(currentNodeId);
        if (updateItems) updateItems(combat.items);
        let gold = 10 + Math.floor(Math.random() * 11);
        if (combat.items.some((i) => i.id === 'amulet_coin')) gold = Math.floor(gold * 1.5);
        const winBossLeaderId = combat.bossLeaderId;
        combat.clearCombat();
        if (winBossLeaderId) navigate('/boss-reward', { state: { bossLeaderId: winBossLeaderId, gold, levelUps } });
        else navigate('/reward', { state: { gold, levelUps } });
      }, 1500);
      return () => clearTimeout(t);
    }
    if (combat.phase === 'defeat') {
      const t = setTimeout(() => { combat.clearCombat(); navigate('/game-over'); }, 1500);
      return () => clearTimeout(t);
    }
  }, [combat.phase]); // eslint-disable-line

  if (combat.playerParty.length === 0 || !enemy) {
    return <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center text-lg">Loading...</div>;
  }

  const isPlayerTurn = combat.phase === 'player';

  const bossData = isBoss && bossLeaderId ? GYM_LEADERS[bossLeaderId] : null;
  const bgClass = bossData?.bgClass ?? 'bg-sky-900';

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden text-white">

      {/* ══ BATTLEFIELD (fills all height, hand floats over it) ═══ */}
      <div className={`flex-1 relative overflow-hidden ${isBoss ? bgClass : ''}`}>

        {/* Background */}
        {isBoss ? (
          // Boss: dark gym bg with overlay
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        ) : (
          // Wild: sky + grass
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-emerald-500 to-emerald-700" />
            <div className="absolute bottom-16 left-0 right-0 h-10 bg-emerald-400/40" />
          </>
        )}

        {/* Boss banner */}
        {bossData && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center z-10">
            <p className="text-yellow-300 font-bold text-base drop-shadow-lg">{bossData.name}</p>
            <p className="text-gray-300 text-xs">{bossData.title}</p>
            {combat.enemyParty.length > 0 && (
              <p className="text-gray-400 text-xs mt-0.5">
                Up next: {combat.enemyParty.map((p) => p.name).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Enemy: HP box top-left, sprite top-right */}
        <div className="absolute top-4 left-4 z-10">
          <PokemonHpBox pokemon={enemy} />
          {combat.enemyIntent && (
            <div className="mt-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs flex items-center gap-1">
              <span className="text-gray-400">Next:</span>
              <span className="text-yellow-300 font-semibold">{combat.enemyIntent.name}</span>
            </div>
          )}
        </div>

        <div className="absolute z-10" style={{ top: '-150px', right: '-150px' }}>
          <div className="relative">
            <DamageFloat nums={enemyDmgNums} />
            {enemySpriteUrl ? (
              <img
                key={enemyHitKey}
                src={enemySpriteUrl}
                alt={enemy.name}
                className={`w-36 h-36 object-contain drop-shadow-xl ${enemyHitKey > 0 ? 'animate-flash-white' : ''} ${enemyFainting ? 'animate-faint-fall' : ''}`}
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center text-5xl">🔴</div>
            )}
          </div>
        </div>

        {/* Player: sprite bottom-left, HP box bottom-right */}
        <div className="absolute z-10" style={{ top: '-150px', left: '-150px' }}>
          <div className="relative">
            <DamageFloat nums={playerDmgNums} />
            {playerSpriteUrl ? (
              <img
                key={playerHitKey}
                src={playerSpriteUrl}
                alt={activePlayer.name}
                className={`w-44 h-44 object-contain drop-shadow-xl ${playerHitKey > 0 ? 'animate-flash-white' : ''} ${playerFainting ? 'animate-faint-fall' : ''}`}
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-6xl">🔵</div>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-10">
          <PokemonHpBox pokemon={activePlayer} showHpNumbers />
        </div>

        {/* Combat log: bottom-center overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none w-64">
          {[...lastLog].reverse().slice(0, 2).map((entry, i) => (
            <p
              key={i}
              className={`text-xs leading-tight drop-shadow-lg ${
                i === 0 ? 'text-white font-semibold' : 'text-gray-300/70'
              }`}
            >
              {entry}
            </p>
          ))}
        </div>

        {/* Super effective */}
        {superEffective && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <span className="animate-super-effective text-yellow-300 font-extrabold text-3xl drop-shadow-lg tracking-wide">
              Super effective!
            </span>
          </div>
        )}

        {/* ══ FLOATING HAND PANEL (transparent, overlays battlefield) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">

          {/* Controls row */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1 pointer-events-auto">
            <div className="flex items-center gap-3">
              <EnergyPips current={combat.playerEnergy} />
              {/* Deck pile button */}
              <button
                onClick={() => setShowDeckModal(true)}
                className="text-xs bg-stone-800/80 hover:bg-stone-600/80 text-gray-300 px-2 py-1.5 rounded transition backdrop-blur-sm flex items-center gap-1"
              >
                <span>🃏</span>
                <span>{combat.playerDeck.length}</span>
              </button>
              {/* Discard pile button */}
              <button
                onClick={() => setShowDiscardModal(true)}
                className="text-xs bg-stone-800/80 hover:bg-stone-600/80 text-gray-400 px-2 py-1.5 rounded transition backdrop-blur-sm flex items-center gap-1"
              >
                <span>🗑</span>
                <span>{combat.playerDiscard.length}</span>
              </button>
            </div>

            {!isPlayerTurn && (
              <span className="text-xs text-stone-300/80 animate-pulse drop-shadow">Enemy is attacking…</span>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowGiveUp(true)}
                className="text-xs bg-stone-800/80 hover:bg-red-900/80 text-gray-300 hover:text-red-300 px-2.5 py-1.5 rounded transition backdrop-blur-sm"
              >
                Give Up
              </button>
              {combat.playerParty.length > 1 && isPlayerTurn && (
                <button
                  onClick={() => setShowSwitch(!showSwitch)}
                  className="text-xs bg-stone-800/80 hover:bg-stone-600/80 text-gray-200 px-2.5 py-1.5 rounded transition backdrop-blur-sm"
                >
                  Switch
                </button>
              )}
              <button
                onClick={() => combat.endTurn()}
                disabled={!isPlayerTurn}
                className="text-xs bg-blue-700/90 hover:bg-blue-600/90 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded transition font-bold text-white backdrop-blur-sm"
              >
                End Turn
              </button>
            </div>
          </div>

          {/* Card fan */}
          <div className="flex justify-center items-end overflow-visible pb-2 pt-1" style={{ minHeight: '170px' }}>
            {combat.playerHand.length === 0 && isPlayerTurn ? (
              <p className="text-stone-300/60 text-sm pointer-events-auto mb-6 drop-shadow">No cards — End Turn to draw</p>
            ) : (
              combat.playerHand.map((move, i) => {
                const cost = getEnergyCost(move);
                const pp = activePlayer.currentPp[move.id] ?? 0;
                const count = combat.playerHand.length;
                const center = (count - 1) / 2;
                const offset = i - center;
                const rotateDeg = offset * 8;
                const translateY = Math.abs(offset) * 12;
                const isHovered = hoveredCardIndex === i;

                const cardStyle: CSSProperties = {
                  transformOrigin: 'bottom center',
                  transform: isHovered
                    ? 'rotate(0deg) translateY(-60px) scale(1.4)'
                    : `rotate(${rotateDeg}deg) translateY(${translateY}px)`,
                  zIndex: isHovered ? 50 : count - Math.abs(Math.round(offset)),
                  marginLeft: i === 0 ? 0 : '-20px',
                  transition: 'transform 150ms ease, z-index 0ms',
                };

                return (
                  <div
                    key={`${move.id}-${i}`}
                    className="pointer-events-auto"
                    style={cardStyle}
                    onMouseEnter={() => setHoveredCardIndex(i)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                  >
                    <MoveCard
                      move={move}
                      energyCost={cost}
                      currentPp={pp}
                      disabled={!isPlayerTurn || combat.playerEnergy < cost}
                      onClick={() => isPlayerTurn && combat.playCard(move)}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ══ OVERLAYS ═══════════════════════════════════════════════ */}

      {/* Coin flip modal */}
      {coinFlipModal && <CoinFlipModal flip={coinFlipModal} />}

      {/* Deck modal */}
      {showDeckModal && (
        <CardPileModal
          title="Draw Pile"
          moves={combat.playerDeck}
          onClose={() => setShowDeckModal(false)}
        />
      )}

      {/* Discard modal */}
      {showDiscardModal && (
        <CardPileModal
          title="Discard Pile"
          moves={combat.playerDiscard}
          onClose={() => setShowDiscardModal(false)}
        />
      )}

      {/* Victory / defeat */}
      {(combat.phase === 'victory' || combat.phase === 'defeat') && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center animate-bounce-in">
            <p className="text-6xl mb-4">{combat.phase === 'victory' ? '🏆' : '💀'}</p>
            <p className="text-3xl font-bold text-yellow-400">
              {combat.phase === 'victory' ? 'Victory!' : 'Defeated…'}
            </p>
          </div>
        </div>
      )}

      {/* Force switch */}
      {combat.phase === 'switch' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-72 flex flex-col gap-3">
            <p className="font-bold text-yellow-400 text-center">Choose next Pokémon</p>
            {combat.playerParty.slice(1).map((p, i) => (
              <button
                key={p.id}
                onClick={() => combat.switchPokemon(i + 1)}
                className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition"
              >
                <span className="font-semibold">{p.name}</span>
                <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${(p.currentHp / p.maxHp) > 0.5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{p.currentHp}/{p.maxHp}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Give up confirm */}
      {showGiveUp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-900 border border-red-800/60 rounded-2xl p-6 w-72 flex flex-col gap-4 text-center">
            <p className="text-2xl">🏳️</p>
            <p className="font-bold text-white text-lg">Give Up?</p>
            <p className="text-gray-400 text-sm">This will end your run. All progress will be lost.</p>
            <button
              onClick={() => { combat.clearCombat(); endRun(); navigate('/'); }}
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition"
            >
              End Run
            </button>
            <button
              onClick={() => setShowGiveUp(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-2.5 rounded-lg transition"
            >
              Keep Fighting
            </button>
          </div>
        </div>
      )}

      {/* Voluntary switch panel */}
      {showSwitch && combat.phase === 'player' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-72 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <p className="font-bold text-yellow-400">Switch Pokémon</p>
              <button onClick={() => setShowSwitch(false)} className="text-gray-500 hover:text-gray-300 text-sm">✕</button>
            </div>
            {combat.playerParty.slice(1).map((p, i) => (
              <button
                key={p.id}
                onClick={() => { combat.switchPokemon(i + 1); setShowSwitch(false); }}
                className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition"
              >
                <span className="font-semibold">{p.name}</span>
                <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${(p.currentHp / p.maxHp) > 0.5 ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }}
                  />
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

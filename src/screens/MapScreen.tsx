import { useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { generateMap, getAvailableNodes } from '../utils/mapGenerator';
import MapNodeIcon, { NODE_META } from '../components/MapNodeIcon';
import { ACT_BOSS } from '../data/gymLeaders';
import type { MapNode, NodeType, PokemonType } from '../types';
import logo from '../assets/logo.png';

const ACT_THEMES = {
  1: { bg: 'bg-green-900',  title: 'Route 1',       subtitle: 'Pallet Town → Pewter City' },
  2: { bg: 'bg-slate-900',  title: 'Mt. Moon',      subtitle: 'Cave passage to Cerulean' },
  3: { bg: 'bg-zinc-900',   title: 'Viridian City', subtitle: 'Final approach to the Gym' },
};

// ── Pixel grass texture ──────────────────────────────────────────

// 8 hand-picked greens matching the reference image
const GRASS_PALETTE = [
  '#4ea800', '#5aba00', '#68cc00', '#78d810',
  '#60b800', '#72ca08', '#4a9c00', '#82d420',
];

function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d);
    s ^= s + Math.imul(s ^ (s >>> 7), 0xb5402911);
    return ((s ^ (s >>> 14)) >>> 0) / 0xffffffff;
  };
}

function GrassTexture({ seed }: { seed: number }) {
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const rand = seededRand(seed);
    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        ctx.fillStyle = GRASS_PALETTE[Math.floor(rand() * GRASS_PALETTE.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
    setBgUrl(canvas.toDataURL());
  }, [seed]);

  if (!bgUrl) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-80"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: '128px 128px',
        imageRendering: 'pixelated',
      }}
    />
  );
}

const TYPE_COLORS: Record<string, string> = {
  Normal: 'bg-gray-500', Fire: 'bg-orange-600', Water: 'bg-blue-600',
  Electric: 'bg-yellow-500', Grass: 'bg-green-600', Ice: 'bg-cyan-400',
  Fighting: 'bg-red-700', Poison: 'bg-purple-600', Ground: 'bg-yellow-700',
  Flying: 'bg-indigo-400', Psychic: 'bg-pink-500', Bug: 'bg-lime-600',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-700',
  Dark: 'bg-gray-700', Steel: 'bg-slate-500', Fairy: 'bg-pink-300',
};

const NODE_ROUTE: Record<NodeType, string> = {
  home:     '/',
  combat:   '/combat',
  elite:    '/combat',
  boss:     '/combat',
  treasure: '/catch',
  rest:     '/center',
  shop:     '/mart',
  event:    '/combat',
};

const ROW_HEIGHT = 110;

// Base column fractions for 1-4 columns
function getColFractions(numCols: number): number[] {
  if (numCols === 1) return [0.5];
  if (numCols === 2) return [0.2, 0.8];
  if (numCols === 3) return [0.15, 0.5, 0.85];
  return [0.12, 0.37, 0.63, 0.88];
}

// Deterministic per-node jitter derived from id hash
function nodeJitter(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (Math.imul(h, 0x01000193)) >>> 0;
  }
  return ((h & 0xffff) / 0x10000 - 0.5) * 0.09; // ±4.5% of container width
}

interface NodePos { id: string; x: number; y: number }

function useNodePositions(nodes: MapNode[], containerWidth: number): Map<string, NodePos> {
  return useMemo(() => {
    const map = new Map<string, NodePos>();
    const rows = Array.from(new Set(nodes.map((n) => n.row))).sort((a, b) => a - b);
    const totalRows = rows.length;
    nodes.forEach((node) => {
      const rowIndex = rows.indexOf(node.row);
      const y = (totalRows - 1 - rowIndex) * ROW_HEIGHT + 56;
      const colsInRow = nodes.filter((n) => n.row === node.row).length;
      const fracs = getColFractions(colsInRow);
      const baseFrac = fracs[node.col] ?? 0.5;
      const jitter = node.type === 'home' ? 0 : nodeJitter(node.id);
      const x = Math.max(0.06, Math.min(0.94, baseFrac + jitter)) * containerWidth;
      map.set(node.id, { id: node.id, x, y });
    });
    return map;
  }, [nodes, containerWidth]);
}

function MapEdgesSvg({ nodes, positions, available, height, width }: {
  nodes: MapNode[];
  positions: Map<string, NodePos>;
  available: string[];
  height: number;
  width: number;
}) {
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; active: boolean }> = [];
  nodes.forEach((node) => {
    const from = positions.get(node.id);
    if (!from) return;
    node.connections.forEach((toId) => {
      const to = positions.get(toId);
      if (!to) return;
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, active: available.includes(toId) });
    });
  });

  return (
    <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.active ? '#facc15' : 'rgba(255,255,255,0.35)'}
          strokeWidth={l.active ? 2.5 : 1.5}
          strokeDasharray="6 5"
          opacity={l.active ? 1 : 1}
        />
      ))}
    </svg>
  );
}

export default function MapScreen() {
  const navigate = useNavigate();
  const { currentMap, currentNodeId, act, seed, items, party, setMap, setCurrentNode, clearNode, endRun } = useRunStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const theme = ACT_THEMES[act as 1 | 2 | 3] ?? ACT_THEMES[1];

  useEffect(() => {
    if (currentMap.length === 0) {
      const nodes = generateMap(seed, act);
      setMap(nodes);
    }
  }, [act, seed]); // eslint-disable-line

  // Scroll to bottom (entry row) on map load
  useEffect(() => {
    if (currentMap.length > 0 && mapScrollRef.current) {
      mapScrollRef.current.scrollTop = mapScrollRef.current.scrollHeight;
    }
  }, [currentMap.length]);

  const available = useMemo(
    () => getAvailableNodes(currentMap, currentNodeId),
    [currentMap, currentNodeId],
  );

  const positions = useNodePositions(currentMap, containerWidth || 320);

  const rows = Array.from(new Set(currentMap.map((n) => n.row))).sort((a, b) => a - b);
  const totalRows = rows.length;
  const svgHeight = totalRows * ROW_HEIGHT + 56;

  // Home node = visual "you are here" when no node has been chosen yet
  const homeNode = currentMap.find((n) => n.type === 'home');
  const visualCurrentId = currentNodeId ?? homeNode?.id ?? null;

  function nodeState(node: MapNode): 'cleared' | 'available' | 'locked' {
    if (node.cleared) return 'cleared';
    if (available.includes(node.id)) return 'available';
    return 'locked';
  }

  function handleNodeClick(node: MapNode) {
    setCurrentNode(node.id);
    const route = NODE_ROUTE[node.type];
    if (node.type === 'boss') {
      const bossLeaderId = ACT_BOSS[act];
      navigate(route, { state: { bossLeaderId } });
    } else {
      navigate(route);
    }
  }

  return (
    <div className={`fixed inset-0 ${theme.bg} text-white flex overflow-hidden`}>

      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <div className="w-44 shrink-0 flex flex-col bg-black/40 border-r border-white/10 backdrop-blur-sm overflow-y-auto">

        {/* Logo + act info */}
        <div className="p-3 border-b border-white/10">
          <img src={logo} alt="PokeSpire" className="h-7 mb-1" />
          <p className="text-xs text-yellow-400 font-bold">Act {act} — {theme.title}</p>
          <p className="text-xs text-gray-400">{theme.subtitle}</p>
        </div>

        {/* Party */}
        <div className="px-3 py-3 flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Party</p>
          {party.length === 0 ? (
            <p className="text-xs text-gray-600">No Pokémon</p>
          ) : (
            party.map((p) => (
              <div key={`${p.id}-${p.name}`} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold truncate text-gray-100">{p.name}</span>
                  <span className="text-xs text-gray-500 ml-1 shrink-0">Lv{p.level}</span>
                </div>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {p.types.map((t: PokemonType) => (
                    <span key={t} className={`${TYPE_COLORS[t] ?? 'bg-gray-600'} text-white text-xs px-1.5 py-0 rounded leading-5`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="px-3 py-2 border-t border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Items</p>
            <div className="flex flex-wrap gap-1">
              {items.map((item) => (
                <span key={item.id} title={`${item.name}: ${item.description}`} className="text-lg cursor-default">
                  {item.icon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="px-3 py-2 border-t border-white/10">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5">Legend</p>
          <div className="flex flex-col gap-1">
            {(['combat', 'elite', 'boss', 'treasure', 'rest', 'shop', 'event'] as NodeType[]).map((t) => {
              const { icon, label } = NODE_META[t];
              return (
                <span key={t} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>{icon}</span><span>{label}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Abandon */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { endRun(); navigate('/'); }}
            className="w-full text-gray-600 hover:text-red-400 text-xs transition py-1 text-center"
          >
            Abandon Run
          </button>
        </div>
      </div>

      {/* ── Map Canvas ───────────────────────────────────────────── */}
      <div ref={mapScrollRef} className="flex-1 overflow-y-auto relative">
        {/* Pixel grass texture (Act 1 only; other acts use plain bg) */}
        {act === 1 && <GrassTexture seed={seed} />}

        {/* Inner canvas sized to fit all nodes */}
        <div ref={containerRef} className="relative" style={{ height: Math.max(svgHeight, 600) }}>
          {currentMap.length > 0 && (
            <>
              <MapEdgesSvg
                nodes={currentMap}
                positions={positions}
                available={available}
                height={Math.max(svgHeight, 600)}
                width={containerWidth || 320}
              />
              {currentMap.map((node) => {
                const pos = positions.get(node.id);
                if (!pos) return null;
                const state = nodeState(node);
                return (
                  <div
                    key={node.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <MapNodeIcon
                      type={node.type}
                      state={state}
                      isCurrent={node.id === visualCurrentId}
                      onClick={() => handleNodeClick(node)}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

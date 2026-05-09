import { useEffect, useRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { generateMap, getAvailableNodes } from '../utils/mapGenerator';
import MapNodeIcon, { NODE_META } from '../components/MapNodeIcon';
import { ACT_BOSS } from '../data/gymLeaders';
import type { MapNode, NodeType } from '../types';

const ACT_THEMES = {
  1: { bg: 'bg-green-950',   title: 'Route 1',       subtitle: 'Pallet Town → Pewter City' },
  2: { bg: 'bg-slate-950',   title: 'Mt. Moon',      subtitle: 'Cave passage to Cerulean' },
  3: { bg: 'bg-zinc-950',    title: 'Viridian City',  subtitle: 'Final approach to the Gym' },
};

const NODE_ROUTE: Record<NodeType, string> = {
  combat:   '/combat',
  elite:    '/combat',
  boss:     '/combat',
  treasure: '/catch',
  rest:     '/center',
  shop:     '/mart',
  event:    '/combat',
};

// Layout: column positions as fractions of container width
const COL_X = [0.2, 0.5, 0.8];
const ROW_HEIGHT = 80; // px per row, rendered bottom→top

interface NodePos { id: string; x: number; y: number }

function useNodePositions(nodes: MapNode[], containerWidth: number): Map<string, NodePos> {
  return useMemo(() => {
    const map = new Map<string, NodePos>();
    const rows = Array.from(new Set(nodes.map((n) => n.row))).sort((a, b) => a - b);
    const totalRows = rows.length;
    nodes.forEach((node) => {
      const rowIndex = rows.indexOf(node.row);
      // Render rows bottom→top so row 0 is at bottom
      const y = (totalRows - 1 - rowIndex) * ROW_HEIGHT + 40;
      const colsInRow = nodes.filter((n) => n.row === node.row).length;
      const colPositions = colsInRow === 1
        ? [0.5]
        : COL_X.slice(0, colsInRow);
      const x = (colPositions[node.col] ?? 0.5) * containerWidth;
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
      lines.push({
        x1: from.x, y1: from.y,
        x2: to.x,   y2: to.y,
        active: available.includes(toId),
      });
    });
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke={l.active ? '#facc15' : '#374151'}
          strokeWidth={l.active ? 2 : 1.5}
          strokeDasharray={l.active ? undefined : '4 4'}
          opacity={l.active ? 0.8 : 0.4}
        />
      ))}
    </svg>
  );
}

export default function MapScreen() {
  const navigate = useNavigate();
  const { currentMap, currentNodeId, act, seed, items, setMap, setCurrentNode, clearNode, endRun } = useRunStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const theme = ACT_THEMES[act as 1 | 2 | 3] ?? ACT_THEMES[1];

  // Generate map on first visit per act
  useEffect(() => {
    if (currentMap.length === 0) {
      const nodes = generateMap(seed, act);
      setMap(nodes);
    }
  }, [act, seed]); // eslint-disable-line

  const available = useMemo(
    () => getAvailableNodes(currentMap, currentNodeId),
    [currentMap, currentNodeId]
  );

  const positions = useNodePositions(currentMap, containerWidth || 320);

  const rows = Array.from(new Set(currentMap.map((n) => n.row))).sort((a, b) => a - b);
  const totalRows = rows.length;
  const svgHeight = totalRows * ROW_HEIGHT + 40;

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
    <div className={`min-h-screen ${theme.bg} text-white flex flex-col items-center px-4 py-6 gap-4`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm">
        <div>
          <h2 className="text-xl font-bold text-yellow-400">Act {act} — {theme.title}</h2>
          <p className="text-xs text-gray-400">{theme.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <div className="flex gap-0.5">
              {items.map((item) => (
                <span key={item.id} title={`${item.name}: ${item.description}`} className="text-base cursor-default">
                  {item.icon}
                </span>
              ))}
            </div>
          )}
          <button
            onClick={() => { endRun(); navigate('/'); }}
            className="text-gray-600 hover:text-red-400 text-xs transition"
          >
            Abandon
          </button>
        </div>
      </div>

      {/* Map canvas */}
      <div
        ref={containerRef}
        className="relative w-full max-w-sm"
        style={{ height: svgHeight }}
      >
        {currentMap.length > 0 && (
          <>
            <MapEdgesSvg
              nodes={currentMap}
              positions={positions}
              available={available}
              height={svgHeight}
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
                    onClick={() => handleNodeClick(node)}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-500 max-w-sm">
        {(['combat','elite','boss','treasure','rest','shop'] as NodeType[]).map((t) => {
          const { icon, label } = NODE_META[t];
          return (
            <span key={t} className="flex items-center gap-1">
              <span>{icon}</span><span>{label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

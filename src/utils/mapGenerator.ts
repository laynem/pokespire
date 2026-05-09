import type { MapNode, NodeType } from '../types';

// Seeded PRNG (mulberry32)
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 65% wild battle, 10% rest, 10% shop, 15% event
const NODE_WEIGHTS: Array<[NodeType, number]> = [
  ['combat', 65],
  ['rest',   10],
  ['shop',   10],
  ['event',  15],
];

function weightedPick(rng: () => number): NodeType {
  const total = NODE_WEIGHTS.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [type, weight] of NODE_WEIGHTS) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return 'combat';
}

// Variable cols per row — weighted toward 2-3 for organic density
function pickColCount(rng: () => number): number {
  const r = rng();
  if (r < 0.10) return 1;
  if (r < 0.38) return 2;
  if (r < 0.80) return 3;
  return 4;
}

const ROWS_PER_ACT = 15; // 15 regular rows + 1 boss = ~40 encounters, map scrolls

export function generateMap(seed: number, act: number): MapNode[] {
  const rng = makeRng(seed ^ (act * 0xdeadbeef));
  const nodes: MapNode[] = [];
  const grid: string[][] = [];

  for (let row = 0; row < ROWS_PER_ACT + 1; row++) {
    const rowIds: string[] = [];
    const isBossRow = row === ROWS_PER_ACT;
    const colCount = isBossRow ? 1 : pickColCount(rng);

    for (let col = 0; col < colCount; col++) {
      const id = `a${act}r${row}c${col}`;
      rowIds.push(id);
      nodes.push({
        id,
        type: isBossRow ? 'boss' : weightedPick(rng),
        act,
        row,
        col,
        connections: [],
        cleared: false,
      });
    }
    grid.push(rowIds);
  }

  // Wire connections: more organic routing with crossing paths
  for (let row = 0; row < ROWS_PER_ACT; row++) {
    const fromIds = grid[row];
    const toIds = grid[row + 1];
    const incoming = new Set<string>();

    for (const fromId of fromIds) {
      const fromNode = nodes.find((n) => n.id === fromId)!;
      const fromIdx = fromIds.indexOf(fromId);
      const fromFrac = fromIds.length > 1 ? fromIdx / (fromIds.length - 1) : 0.5;

      // Primary: proportional with large random shift → creates natural crossings
      const primaryShift = (rng() - 0.5) * 0.8;
      const primaryFrac = Math.max(0, Math.min(1, fromFrac + primaryShift));
      const primaryIdx = Math.round(primaryFrac * (toIds.length - 1));
      const primaryId = toIds[primaryIdx];
      if (!fromNode.connections.includes(primaryId)) {
        fromNode.connections.push(primaryId);
        incoming.add(primaryId);
      }

      // Secondary: 50% chance — picks a different col to create branching / crossing
      if (rng() < 0.5 && toIds.length > 1) {
        const secondaryFrac = rng() < 0.6
          ? Math.max(0, Math.min(1, fromFrac + (rng() - 0.5) * 0.8))
          : rng(); // 40% fully random for dramatic crossings
        const secondaryIdx = Math.round(secondaryFrac * (toIds.length - 1));
        const secondaryId = toIds[secondaryIdx];
        if (!fromNode.connections.includes(secondaryId)) {
          fromNode.connections.push(secondaryId);
          incoming.add(secondaryId);
        }
      }
    }

    // Guarantee every next-row node is reachable
    for (const toId of toIds) {
      if (!incoming.has(toId)) {
        const randomFromId = fromIds[Math.floor(rng() * fromIds.length)];
        const fromNode = nodes.find((n) => n.id === randomFromId)!;
        if (!fromNode.connections.includes(toId)) fromNode.connections.push(toId);
      }
    }
  }

  // Home node at row -1: pre-cleared start marker, connects to all row-0 nodes
  nodes.unshift({
    id: `a${act}r-1c0`,
    type: 'home',
    act,
    row: -1,
    col: 0,
    connections: [...grid[0]],
    cleared: true,
  });

  return nodes;
}

export function getAvailableNodes(nodes: MapNode[], currentNodeId: string | null): string[] {
  if (!currentNodeId) {
    const rows = Array.from(new Set(nodes.map((n) => n.row))).sort((a, b) => a - b);
    for (const row of rows) {
      const uncleared = nodes.filter((n) => n.row === row && !n.cleared);
      if (uncleared.length > 0) return uncleared.map((n) => n.id);
    }
    return [];
  }
  const current = nodes.find((n) => n.id === currentNodeId);
  if (!current) return [];
  return current.connections.filter((id) => {
    const target = nodes.find((n) => n.id === id);
    return target && !target.cleared;
  });
}

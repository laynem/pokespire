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

const NODE_WEIGHTS: Array<[NodeType, number]> = [
  ['combat',   35],
  ['elite',    25],  // trainer battle
  ['treasure', 15],  // catch node
  ['rest',     10],  // pokemon center
  ['shop',     10],  // poke mart
  ['event',     5],  // special event
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

const ROWS_PER_ACT = 7;       // rows of nodes (excl. boss)
const COLS = 3;               // branches per row

export function generateMap(seed: number, act: number): MapNode[] {
  const rng = makeRng(seed ^ (act * 0xdeadbeef));
  const nodes: MapNode[] = [];

  // Build grid: ROWS_PER_ACT regular rows + 1 boss row
  const totalRows = ROWS_PER_ACT + 1;
  const grid: string[][] = [];

  for (let row = 0; row < totalRows; row++) {
    const rowIds: string[] = [];
    const isBossRow = row === totalRows - 1;
    const colCount = isBossRow ? 1 : COLS;

    for (let col = 0; col < colCount; col++) {
      const id = `a${act}r${row}c${col}`;
      rowIds.push(id);
      const type: NodeType = isBossRow ? 'boss' : weightedPick(rng);

      nodes.push({
        id,
        type,
        act,
        row,
        col,
        connections: [],
        cleared: false,
      });
    }
    grid.push(rowIds);
  }

  // Wire connections: each node in row R connects to 1-2 nodes in row R+1
  for (let row = 0; row < totalRows - 1; row++) {
    const fromIds = grid[row];
    const toIds = grid[row + 1];

    // Each "from" node picks 1-2 targets
    for (const fromId of fromIds) {
      const node = nodes.find((n) => n.id === fromId)!;
      // Primary: map col proportionally
      const fromIndex = fromIds.indexOf(fromId);
      const primaryCol = Math.round((fromIndex / Math.max(fromIds.length - 1, 1)) * (toIds.length - 1));
      const primary = toIds[primaryCol];
      if (!node.connections.includes(primary)) node.connections.push(primary);

      // Secondary: 40% chance to connect to an adjacent col
      if (toIds.length > 1 && rng() < 0.4) {
        const altCol = primaryCol === 0 ? 1 : primaryCol === toIds.length - 1 ? toIds.length - 2 : (rng() < 0.5 ? primaryCol - 1 : primaryCol + 1);
        const alt = toIds[altCol];
        if (!node.connections.includes(alt)) node.connections.push(alt);
      }
    }

    // Ensure every "to" node has at least one incoming connection
    for (const toId of toIds) {
      const hasIncoming = nodes.some((n) => n.connections.includes(toId));
      if (!hasIncoming) {
        const randomFrom = fromIds[Math.floor(rng() * fromIds.length)];
        const fromNode = nodes.find((n) => n.id === randomFrom)!;
        if (!fromNode.connections.includes(toId)) fromNode.connections.push(toId);
      }
    }
  }

  // Prepend a home node at row -1 (pre-cleared start marker)
  const homeId = `a${act}r-1c0`;
  nodes.unshift({
    id: homeId,
    type: 'home',
    act,
    row: -1,
    col: 0,
    connections: [...grid[0]],
    cleared: true,
  });

  return nodes;
}

// Returns IDs of nodes the player can currently click
export function getAvailableNodes(nodes: MapNode[], currentNodeId: string | null): string[] {
  if (!currentNodeId) {
    // Start: find the lowest row that still has uncleared nodes
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

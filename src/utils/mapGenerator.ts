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

function weightedPick(rng: () => number, weights: Array<[NodeType, number]>): NodeType {
  const total = weights.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [type, weight] of weights) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return weights[0][0];
}

function getNodeType(rng: () => number, eventIdx: number, laneLength: number): { type: NodeType; trainerVariant?: 'male' | 'female' | 'boss' } {
  const lastTwentyPct = Math.floor(laneLength * 0.8);
  let weights: Array<[NodeType, number]>;

  if (eventIdx < 3) {
    // First 3 events: no pokecenter
    weights = [
      ['normal_battle', 65],
      ['catch',         35],
    ];
  } else if (eventIdx <= 4) {
    // Events 3-4: elevated catch
    weights = [
      ['normal_battle', 60],
      ['catch',         35],
      ['pokecenter',     5],
    ];
  } else if (eventIdx < lastTwentyPct) {
    // Normal distribution
    weights = [
      ['normal_battle', 70],
      ['catch',         15],
      ['pokecenter',    10],
      ['shop',           5],
    ];
  } else {
    // Last 20%: elevated pokecenter
    weights = [
      ['normal_battle', 65],
      ['pokecenter',    30],
      ['shop',           5],
    ];
  }

  const type = weightedPick(rng, weights);
  let trainerVariant: 'male' | 'female' | undefined;
  if (type === 'normal_battle') {
    trainerVariant = rng() < 0.5 ? 'male' : 'female';
  }

  return { type, trainerVariant };
}

export function generateMap(seed: number, act: number): MapNode[] {
  const rng = makeRng(seed ^ (act * 0xdeadbeef));
  const nodes: MapNode[] = [];

  // Determine lane count: 75% → 3 lanes, 25% → 4 lanes
  const laneCount = rng() < 0.75 ? 3 : 4;

  // Lanes: each has 13-15 events
  const lanes: MapNode[][] = [];

  for (let lane = 0; lane < laneCount; lane++) {
    const laneLength = 13 + Math.floor(rng() * 3); // 13, 14, or 15
    const laneNodes: MapNode[] = [];

    for (let event = 0; event < laneLength; event++) {
      const { type, trainerVariant } = getNodeType(rng, event, laneLength);
      const node: MapNode = {
        id: `lane${lane}-event${event}`,
        type,
        act,
        row: event,
        col: lane,
        connections: [],
        cleared: false,
        ...(trainerVariant ? { trainerVariant } : {}),
      };
      laneNodes.push(node);
      nodes.push(node);
    }

    lanes.push(laneNodes);
  }

  // Wire sequential connections within each lane
  for (const laneNodes of lanes) {
    for (let i = 0; i < laneNodes.length - 1; i++) {
      laneNodes[i].connections.push(laneNodes[i + 1].id);
    }
  }

  // Cross-lane connections between adjacent lanes every 4-6 events
  for (let lane = 0; lane < laneCount - 1; lane++) {
    const laneA = lanes[lane];
    const laneB = lanes[lane + 1];
    const maxLen = Math.min(laneA.length, laneB.length);

    let nextCross = 4 + Math.floor(rng() * 3); // first cross at event 4-6
    while (nextCross < maxLen - 1) {
      // Add bidirectional cross connections at this event index
      const nodeA = laneA[nextCross];
      const nodeB = laneB[nextCross];
      if (!nodeA.connections.includes(nodeB.id)) nodeA.connections.push(nodeB.id);
      if (!nodeB.connections.includes(nodeA.id)) nodeB.connections.push(nodeA.id);
      nextCross += 4 + Math.floor(rng() * 3); // next cross 4-6 events later
    }
  }

  // Home node: single start connecting to event 0 of each lane
  const homeConnections = lanes.map((l) => l[0].id);
  const homeNode: MapNode = {
    id: 'home',
    type: 'home',
    act,
    row: -1,
    col: 0,
    connections: homeConnections,
    cleared: true,
  };
  nodes.unshift(homeNode);

  // Gym (boss) node: all lanes connect their last event to it
  const gymNode: MapNode = {
    id: 'gym',
    type: 'boss',
    act,
    row: Math.max(...lanes.map((l) => l.length)),
    col: 0,
    connections: [],
    cleared: false,
  };

  for (const laneNodes of lanes) {
    const lastNode = laneNodes[laneNodes.length - 1];
    if (!lastNode.connections.includes('gym')) {
      lastNode.connections.push('gym');
    }
  }

  nodes.push(gymNode);

  return nodes;
}

export function getAvailableNodes(nodes: MapNode[], currentNodeId: string | null): string[] {
  if (!currentNodeId) {
    // Return connections from home node
    const home = nodes.find((n) => n.type === 'home');
    if (home) return home.connections.filter((id) => {
      const t = nodes.find((n) => n.id === id);
      return t && !t.cleared;
    });
    return [];
  }
  const current = nodes.find((n) => n.id === currentNodeId);
  if (!current) return [];
  return current.connections.filter((id) => {
    const target = nodes.find((n) => n.id === id);
    return target && !target.cleared;
  });
}

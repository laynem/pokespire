import type { Pokemon, Move } from '../types';
import { getMultiplier } from './typeChart';

export function getEnergyCost(move: Move): number {
  if (move.power === 0) return 1;
  if (move.power <= 40) return 1;
  if (move.power <= 80) return 2;
  return 3;
}

export interface CombatPokemon extends Pokemon {
  currentPp: Record<string, number>; // moveId → remaining PP this combat
  statStages: { attack: number; defense: number }; // -2 to +2
  block: number; // temporary HP absorption, resets each turn
}

export interface CombatState {
  playerParty: CombatPokemon[];     // full party, index 0 = active
  enemy: CombatPokemon;
  playerHand: Move[];               // current hand (up to 4)
  playerDeck: Move[];               // remaining draw pile
  playerDiscard: Move[];            // used cards
  playerEnergy: number;             // 0-3
  turn: number;
  phase: 'player' | 'enemy' | 'switch' | 'victory' | 'defeat';
  enemyIntent: Move | null;
  log: string[];
}

// Build a shuffled deck: each move repeated min(pp,3) times
export function buildDeck(pokemon: CombatPokemon): Move[] {
  const deck: Move[] = [];
  for (const move of pokemon.moves) {
    const copies = Math.min(pokemon.currentPp[move.id] ?? 3, 3);
    for (let i = 0; i < copies; i++) deck.push(move);
  }
  return shuffle(deck);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stageMultiplier(stage: number): number {
  const clamp = Math.max(-2, Math.min(2, stage));
  const table: Record<number, number> = { '-2': 0.5, '-1': 0.67, 0: 1, 1: 1.5, 2: 2 };
  return table[clamp] ?? 1;
}

export function toCombatPokemon(p: Pokemon): CombatPokemon {
  const currentPp: Record<string, number> = {};
  for (const m of p.moves) currentPp[m.id] = 3; // 3 PP per move per combat
  return { ...p, currentPp, statStages: { attack: 0, defense: 0 }, block: 0 };
}

export function drawCards(state: CombatState, count: number): CombatState {
  let deck = [...state.playerDeck];
  let discard = [...state.playerDiscard];
  const hand: Move[] = [...state.playerHand];

  for (let i = 0; i < count; i++) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      deck = shuffle(discard);
      discard = [];
    }
    hand.push(deck.pop()!);
  }

  return { ...state, playerHand: hand, playerDeck: deck, playerDiscard: discard };
}

// --- Damage calc ---
export function calcDamage(
  move: Move,
  attacker: CombatPokemon,
  defender: CombatPokemon,
  multiplier: number,
): number {
  if (move.power === 0) return 0;
  const atkBase = move.category === 'special' ? attacker.baseStats.spAtk : attacker.baseStats.attack;
  const defBase = move.category === 'special' ? defender.baseStats.spDef : defender.baseStats.defense;
  const atk = atkBase * stageMultiplier(attacker.statStages.attack);
  const def = defBase * stageMultiplier(defender.statStages.defense);
  const roll = 0.85 + Math.random() * 0.15;
  const raw = Math.floor((move.power * atk) / Math.max(def, 1) * roll * multiplier);
  return Math.max(1, raw);
}

// --- Status tick (applied at start of the afflicted Pokemon's turn) ---
export function tickStatus(
  pokemon: CombatPokemon,
  log: string[],
): { pokemon: CombatPokemon; skip: boolean } {
  if (!pokemon.status) return { pokemon, skip: false };

  let skip = false;
  let newHp = pokemon.currentHp;

  if (pokemon.status === 'burn') {
    const dmg = Math.max(1, Math.floor(pokemon.maxHp / 16));
    newHp = Math.max(0, newHp - dmg);
    log.push(`${pokemon.name} is hurt by its burn! (${dmg})`);
  }
  if (pokemon.status === 'poison') {
    const dmg = Math.max(1, Math.floor(pokemon.maxHp / 8));
    newHp = Math.max(0, newHp - dmg);
    log.push(`${pokemon.name} is hurt by poison! (${dmg})`);
  }
  if (pokemon.status === 'paralysis' && Math.random() < 0.5) {
    log.push(`${pokemon.name} is paralyzed and can't move!`);
    skip = true;
  }
  if (pokemon.status === 'sleep') {
    log.push(`${pokemon.name} is fast asleep!`);
    skip = true;
    // 33% chance to wake up each turn
    if (Math.random() < 0.33) {
      log.push(`${pokemon.name} woke up!`);
      return { pokemon: { ...pokemon, currentHp: newHp, status: null }, skip: false };
    }
  }
  if (pokemon.status === 'freeze') {
    log.push(`${pokemon.name} is frozen solid!`);
    skip = true;
    if (Math.random() < 0.2) {
      log.push(`${pokemon.name} thawed out!`);
      return { pokemon: { ...pokemon, currentHp: newHp, status: null }, skip: false };
    }
  }

  return { pokemon: { ...pokemon, currentHp: newHp }, skip };
}

// --- Apply move effect ---
type StatusEffect = 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | null;

export function applyMoveEffect(
  move: Move,
  attacker: CombatPokemon,
  defender: CombatPokemon,
  log: string[],
): { attacker: CombatPokemon; defender: CombatPokemon } {
  if (!move.effect || move.category !== 'status' && !move.effectChance) {
    return { attacker, defender };
  }

  const chance = move.effectChance ?? 100;
  if (Math.random() * 100 > chance) return { attacker, defender };

  const statusMap: Record<string, StatusEffect> = {
    burn: 'burn', paralyze: 'paralysis', sleep: 'sleep', poison: 'poison',
  };

  if (statusMap[move.effect] && !defender.status) {
    const status = statusMap[move.effect]!;
    log.push(`${defender.name} was ${status === 'paralysis' ? 'paralyzed' : status + 'ed'}!`);
    return { attacker, defender: { ...defender, status } };
  }

  if (move.effect === 'lower_attack') {
    const newStage = Math.max(-2, defender.statStages.attack - 1);
    log.push(`${defender.name}'s Attack fell!`);
    return { attacker, defender: { ...defender, statStages: { ...defender.statStages, attack: newStage } } };
  }

  if (move.effect === 'lower_defense') {
    const newStage = Math.max(-2, defender.statStages.defense - 1);
    log.push(`${defender.name}'s Defense fell!`);
    return { attacker, defender: { ...defender, statStages: { ...defender.statStages, defense: newStage } } };
  }

  if (move.effect === 'raise_defense') {
    const newStage = Math.min(2, attacker.statStages.defense + 1);
    log.push(`${attacker.name}'s Defense rose!`);
    return { attacker: { ...attacker, statStages: { ...attacker.statStages, defense: newStage } }, defender };
  }

  if (move.effect === 'block') {
    const blockGain = 8;
    log.push(`${attacker.name} braced itself! (+${blockGain} Block)`);
    return { attacker: { ...attacker, block: attacker.block + blockGain }, defender };
  }

  if (move.effect === 'priority') {
    log.push(`${attacker.name} struck first!`);
    return { attacker, defender };
  }

  return { attacker, defender };
}

// --- Player plays a move card ---
export function playMove(
  state: CombatState,
  move: Move,
  energyCost: number,
): CombatState {
  const log = [...state.log];
  let player = state.playerParty[0];
  let enemy = state.enemy;

  // Spend PP
  const newPp = { ...player.currentPp, [move.id]: Math.max(0, (player.currentPp[move.id] ?? 0) - 1) };
  player = { ...player, currentPp: newPp };

  // Remove card from hand
  const handIdx = state.playerHand.findIndex((m) => m.id === move.id);
  const newHand = state.playerHand.filter((_, i) => i !== handIdx);

  // Type effectiveness
  const multiplier = getMultiplier(move.type, enemy.types);
  if (multiplier >= 2) log.push('Super effective!');
  else if (multiplier <= 0.5 && multiplier > 0) log.push('Not very effective...');
  else if (multiplier === 0) { log.push(`Doesn't affect ${enemy.name}!`); }

  let attacker = player;
  let defender = enemy;

  // Damage
  if (move.power > 0 && multiplier > 0) {
    let dmg = calcDamage(move, player, enemy, multiplier);
    if (defender.block > 0) {
      const absorbed = Math.min(defender.block, dmg);
      dmg -= absorbed;
      defender = { ...defender, block: defender.block - absorbed };
      if (absorbed > 0) log.push(`${defender.name} blocked ${absorbed} damage!`);
    }
    defender = { ...defender, currentHp: Math.max(0, defender.currentHp - dmg) };
    log.push(`${player.name} used ${move.name}! (${dmg} dmg)`);
  } else if (move.power === 0) {
    log.push(`${player.name} used ${move.name}!`);
  }

  // Effects
  const result = applyMoveEffect(move, attacker, defender, log);
  attacker = result.attacker as CombatPokemon;
  defender = result.defender as CombatPokemon;

  const newParty = [attacker, ...state.playerParty.slice(1)];

  return {
    ...state,
    playerParty: newParty,
    enemy: defender,
    playerHand: newHand,
    playerDiscard: [...state.playerDiscard, move],
    playerEnergy: state.playerEnergy - energyCost,
    log,
  };
}

// --- Enemy picks a move ---
export function pickEnemyMove(enemy: CombatPokemon): Move {
  const available = enemy.moves.filter((m) => (enemy.currentPp[m.id] ?? 0) > 0);
  if (available.length === 0) return enemy.moves[0]; // struggle fallback
  return available[Math.floor(Math.random() * available.length)];
}

// --- Enemy executes its intent ---
export function executeEnemyTurn(state: CombatState): CombatState {
  const log = [...state.log];
  let enemy = state.enemy;
  let player = state.playerParty[0];

  // Tick enemy status
  const enemyTick = tickStatus(enemy, log);
  enemy = enemyTick.pokemon;

  if (!enemyTick.skip && state.enemyIntent) {
    const move = state.enemyIntent;
    const newPp = { ...enemy.currentPp, [move.id]: Math.max(0, (enemy.currentPp[move.id] ?? 0) - 1) };
    enemy = { ...enemy, currentPp: newPp };

    const multiplier = getMultiplier(move.type, player.types);
    if (multiplier >= 2) log.push('Super effective!');
    else if (multiplier > 0 && multiplier <= 0.5) log.push('Not very effective...');

    if (move.power > 0 && multiplier > 0) {
      let dmg = calcDamage(move, enemy, player, multiplier);
      if (player.block > 0) {
        const absorbed = Math.min(player.block, dmg);
        dmg -= absorbed;
        player = { ...player, block: player.block - absorbed };
        if (absorbed > 0) log.push(`${player.name} blocked ${absorbed} damage!`);
      }
      player = { ...player, currentHp: Math.max(0, player.currentHp - dmg) };
      log.push(`${enemy.name} used ${move.name}! (${dmg} dmg)`);
    } else {
      log.push(`${enemy.name} used ${move.name}!`);
    }

    // Apply effect to player
    const res = applyMoveEffect(move, enemy, player, log);
    enemy = res.attacker as CombatPokemon;
    player = res.defender as CombatPokemon;
  }

  // Pick next intent
  const nextIntent = pickEnemyMove(enemy);

  const newParty = [player, ...state.playerParty.slice(1)];

  return { ...state, playerParty: newParty, enemy, enemyIntent: nextIntent, log };
}

// --- Start of player turn: draw + energy regen ---
export function startPlayerTurn(state: CombatState): CombatState {
  const log = [...state.log, `--- Turn ${state.turn + 1} ---`];
  const player = state.playerParty[0];

  // Tick player status + reset block
  const playerTick = tickStatus(player, log);
  const resetPlayer = { ...playerTick.pokemon, block: 0 };
  const newPartyReset = [resetPlayer, ...state.playerParty.slice(1)];

  let next: CombatState = {
    ...state,
    playerParty: newPartyReset,
    playerEnergy: 3,
    turn: state.turn + 1,
    phase: playerTick.skip ? 'enemy' : 'player',
    log,
  };

  // Draw up to 4 cards
  next = drawCards(next, 4);
  return next;
}

// --- Restore PP after combat ---
export function restorePartyPp(party: CombatPokemon[]): CombatPokemon[] {
  return party.map((p) => {
    const currentPp: Record<string, number> = {};
    for (const m of p.moves) currentPp[m.id] = 3;
    return { ...p, currentPp };
  });
}

// --- Init combat ---
export function initCombat(party: Pokemon[], enemy: Pokemon): CombatState {
  const combatParty = party.map(toCombatPokemon);
  const combatEnemy = toCombatPokemon(enemy);
  const deck = buildDeck(combatParty[0]);

  const base: CombatState = {
    playerParty: combatParty,
    enemy: combatEnemy,
    playerHand: [],
    playerDeck: deck,
    playerDiscard: [],
    playerEnergy: 3,
    turn: 0,
    phase: 'player',
    enemyIntent: pickEnemyMove(combatEnemy),
    log: ['Battle start!'],
  };

  return drawCards(base, 4);
}

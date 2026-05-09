import type { Pokemon, Move, Item, LevelUpResult } from '../types';
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
  items: Item[];                    // run items (Lum Berry removed when consumed)
  combatUsedItems: string[];        // IDs used once-per-combat (Oran Berry)
  movesPlayedThisTurn: number;      // for Choice Band first-move bonus
  enemyFlinched: boolean;           // Kings Rock flinch
  // Boss fields
  enemyParty: CombatPokemon[];      // remaining boss team after active enemy
  bossLeaderId: string | null;
  bossName: string | null;
  badges: string[];                 // earned badges for bonus effects
  participantIds: number[];         // indices into playerParty that participated
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

function hasItem(items: Item[], id: string): boolean {
  return items.some((i) => i.id === id);
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
  choiceBandBonus = false,
): number {
  if (move.power === 0) return 0;
  const atkBase = move.category === 'special' ? attacker.baseStats.spAtk : attacker.baseStats.attack;
  const defBase = move.category === 'special' ? defender.baseStats.spDef : defender.baseStats.defense;
  const atk = atkBase * stageMultiplier(attacker.statStages.attack);
  const def = defBase * stageMultiplier(defender.statStages.defense);
  const roll = 0.85 + Math.random() * 0.15;
  const bandMult = choiceBandBonus ? 1.25 : 1;
  // Level-scaled formula (Gen I inspired): keeps damage proportional to HP at all levels
  const levelFactor = Math.floor(2 * attacker.level / 5) + 2;
  const raw = Math.floor(Math.floor(levelFactor * move.power * atk / Math.max(def, 1)) / 50) + 2;
  return Math.max(1, Math.floor(raw * roll * multiplier * bandMult));
}

// --- Status tick ---
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

  if (move.effect === 'recover') {
    const heal = Math.floor(attacker.maxHp * 0.5);
    const newHp = Math.min(attacker.maxHp, attacker.currentHp + heal);
    const actual = newHp - attacker.currentHp;
    if (actual > 0) log.push(`${attacker.name} recovered ${actual} HP!`);
    return { attacker: { ...attacker, currentHp: newHp }, defender };
  }

  return { attacker, defender };
}

// --- Oran Berry: trigger when pokemon drops below 50% HP ---
function applyOranBerry(
  pokemon: CombatPokemon,
  items: Item[],
  combatUsedItems: string[],
  log: string[],
): { pokemon: CombatPokemon; combatUsedItems: string[] } {
  if (
    hasItem(items, 'oran_berry') &&
    !combatUsedItems.includes('oran_berry') &&
    pokemon.currentHp > 0 &&
    pokemon.currentHp < pokemon.maxHp * 0.5
  ) {
    const heal = Math.min(20, pokemon.maxHp - pokemon.currentHp);
    log.push(`Oran Berry restored ${heal} HP to ${pokemon.name}!`);
    return {
      pokemon: { ...pokemon, currentHp: pokemon.currentHp + heal },
      combatUsedItems: [...combatUsedItems, 'oran_berry'],
    };
  }
  return { pokemon, combatUsedItems };
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
  let { items, combatUsedItems, movesPlayedThisTurn, enemyFlinched } = state;

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
    const choiceBand = hasItem(items, 'choice_band') && movesPlayedThisTurn === 0;
    if (choiceBand) log.push('Choice Band: +25% damage!');

    let dmg = calcDamage(move, player, enemy, multiplier, choiceBand);

    // Cascade Badge: Water moves deal +15% damage
    if (state.badges.includes('Cascade Badge') && move.type === 'Water') {
      dmg = Math.floor(dmg * 1.15);
    }

    // Quick Claw log (no speed system, just flavour)
    if (hasItem(items, 'quick_claw') && movesPlayedThisTurn === 0 && Math.random() < 0.2) {
      log.push(`${player.name} moved first! (Quick Claw)`);
    }

    if (defender.block > 0) {
      const absorbed = Math.min(defender.block, dmg);
      dmg -= absorbed;
      defender = { ...defender, block: defender.block - absorbed };
      if (absorbed > 0) log.push(`${defender.name} blocked ${absorbed} damage!`);
    }
    defender = { ...defender, currentHp: Math.max(0, defender.currentHp - dmg) };
    log.push(`${player.name} used ${move.name}! (${dmg} dmg)`);

    // Shell Bell: heal 5 if 40+ damage
    if (hasItem(items, 'shell_bell') && dmg >= 40) {
      const heal = Math.min(5, attacker.maxHp - attacker.currentHp);
      if (heal > 0) {
        attacker = { ...attacker, currentHp: attacker.currentHp + heal };
        log.push(`Shell Bell healed ${attacker.name} ${heal} HP!`);
      }
    }

    // Kings Rock: 10% flinch
    if (hasItem(items, 'kings_rock') && Math.random() < 0.1) {
      enemyFlinched = true;
      log.push(`${defender.name} flinched!`);
    }
  } else if (move.power === 0) {
    log.push(`${player.name} used ${move.name}!`);
  }

  movesPlayedThisTurn += 1;

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
    items,
    combatUsedItems,
    movesPlayedThisTurn,
    enemyFlinched,
    log,
  };
}

// --- Enemy picks a move ---
export function pickEnemyMove(enemy: CombatPokemon): Move {
  const available = enemy.moves.filter((m) => (enemy.currentPp[m.id] ?? 0) > 0);
  if (available.length === 0) return enemy.moves[0]; // struggle fallback
  return available[Math.floor(Math.random() * available.length)];
}

// --- Boss picks a move using leader-specific AI ---
export function pickBossMove(bossLeaderId: string, enemy: CombatPokemon, player: CombatPokemon): Move {
  const available = enemy.moves.filter((m) => (enemy.currentPp[m.id] ?? 0) > 0);
  if (available.length === 0) return enemy.moves[0];

  if (bossLeaderId === 'brock') {
    const screech = available.find((m) => m.id === 'screech');
    if (screech && player.statStages.defense > -2) return screech;
    const rockThrow = available.find((m) => m.id === 'rock_throw');
    if (rockThrow) return rockThrow;
  }

  if (bossLeaderId === 'misty') {
    if (enemy.currentHp < enemy.maxHp * 0.4) {
      const recover = available.find((m) => m.id === 'recover');
      if (recover) return recover;
    }
  }

  if (bossLeaderId === 'lt_surge') {
    if (!player.status) {
      const thunderWave = available.find((m) => m.id === 'thunder_wave');
      if (thunderWave) return thunderWave;
    }
    const thunderbolt = available.find((m) => m.id === 'thunderbolt');
    if (thunderbolt) return thunderbolt;
  }

  const damaging = available.filter((m) => m.power > 0);
  const pool = damaging.length > 0 ? damaging : available;
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Enemy executes its intent ---
export function executeEnemyTurn(state: CombatState): CombatState {
  const log = [...state.log];
  let enemy = state.enemy;
  let player = state.playerParty[0];
  let { items, combatUsedItems, enemyFlinched } = state;

  // Tick enemy status
  const enemyTick = tickStatus(enemy, log);
  enemy = enemyTick.pokemon;

  const shouldAct = !enemyTick.skip && !enemyFlinched && state.enemyIntent;

  if (enemyFlinched) {
    log.push(`${enemy.name} flinched and couldn't move!`);
    enemyFlinched = false;
  }

  if (shouldAct && state.enemyIntent) {
    const move = state.enemyIntent;
    const newPp = { ...enemy.currentPp, [move.id]: Math.max(0, (enemy.currentPp[move.id] ?? 0) - 1) };
    enemy = { ...enemy, currentPp: newPp };

    const multiplier = getMultiplier(move.type, player.types);
    if (multiplier >= 2) log.push('Super effective!');
    else if (multiplier > 0 && multiplier <= 0.5) log.push('Not very effective...');

    if (move.power > 0 && multiplier > 0) {
      let dmg = calcDamage(move, enemy, player, multiplier);
      // Boulder Badge: reduce all incoming damage by 10%
      if (state.badges.includes('Boulder Badge')) {
        dmg = Math.floor(dmg * 0.9);
      }
      if (player.block > 0) {
        const absorbed = Math.min(player.block, dmg);
        dmg -= absorbed;
        player = { ...player, block: player.block - absorbed };
        if (absorbed > 0) log.push(`${player.name} blocked ${absorbed} damage!`);
      }
      player = { ...player, currentHp: Math.max(0, player.currentHp - dmg) };
      log.push(`${enemy.name} used ${move.name}! (${dmg} dmg)`);

      // Oran Berry: trigger if player drops below 50%
      const oranResult = applyOranBerry(player, items, combatUsedItems, log);
      player = oranResult.pokemon;
      combatUsedItems = oranResult.combatUsedItems;
    } else {
      log.push(`${enemy.name} used ${move.name}!`);
    }

    // Apply effect to player
    const res = applyMoveEffect(move, enemy, player, log);
    enemy = res.attacker as CombatPokemon;
    player = res.defender as CombatPokemon;
  }

  // Pick next intent using boss AI if applicable
  const nextIntent = state.bossLeaderId
    ? pickBossMove(state.bossLeaderId, enemy, player)
    : pickEnemyMove(enemy);

  const newParty = [player, ...state.playerParty.slice(1)];

  return { ...state, playerParty: newParty, enemy, enemyIntent: nextIntent, items, combatUsedItems, enemyFlinched, log };
}

// --- Start of player turn: draw + energy regen ---
export function startPlayerTurn(state: CombatState): CombatState {
  const log = [...state.log, `--- Turn ${state.turn + 1} ---`];
  let player = state.playerParty[0];
  let { items, combatUsedItems } = state;

  // Poke Flute: cure sleep before status tick
  if (hasItem(items, 'poke_flute') && player.status === 'sleep') {
    player = { ...player, status: null };
    log.push(`Poké Flute woke up ${player.name}!`);
  }

  // Tick player status + reset block
  const playerTick = tickStatus(player, log);
  const resetPlayer = { ...playerTick.pokemon, block: 0 };
  const newPartyReset = [resetPlayer, ...state.playerParty.slice(1)];

  // Leftovers: heal 5 HP at turn start
  let finalParty = newPartyReset;
  if (hasItem(items, 'leftovers')) {
    const active = finalParty[0];
    const heal = Math.min(5, active.maxHp - active.currentHp);
    if (heal > 0) {
      finalParty = [{ ...active, currentHp: active.currentHp + heal }, ...finalParty.slice(1)];
      log.push(`Leftovers restored ${heal} HP to ${active.name}!`);
    }
  }

  // Thunder Badge: +1 energy on the first turn of combat
  let baseEnergy = 3;
  if (state.badges.includes('Thunder Badge') && state.turn === 0) {
    baseEnergy = 4;
    log.push('Thunder Badge: +1 Energy!');
  }

  let next: CombatState = {
    ...state,
    playerParty: finalParty,
    playerEnergy: baseEnergy,
    turn: state.turn + 1,
    phase: playerTick.skip ? 'enemy' : 'player',
    items,
    combatUsedItems,
    movesPlayedThisTurn: 0,
    enemyFlinched: false,
    log,
  };

  // Draw up to 4 cards
  next = drawCards(next, 4);
  return next;
}

// --- XP and leveling ---

const XP_PER_LEVEL_STAT_GAINS = {
  hp: 5, attack: 2, defense: 2, spAtk: 2, spDef: 2, speed: 2,
};

function xpToNextLevel(level: number): number {
  return level * 100;
}

export function awardXp(
  party: CombatPokemon[],
  participantIndices: number[],
  enemyLevel: number,
): { updatedParty: CombatPokemon[]; levelUps: LevelUpResult[] } {
  const totalXp = enemyLevel * 10;
  // Only living participants share XP
  const livingParticipants = participantIndices.filter((i) => party[i] && party[i].currentHp > 0);
  if (livingParticipants.length === 0) return { updatedParty: party, levelUps: [] };

  const xpEach = Math.floor(totalXp / livingParticipants.length);
  const levelUps: LevelUpResult[] = [];
  const updatedParty = [...party];

  for (const idx of livingParticipants) {
    let pokemon = { ...updatedParty[idx] };
    pokemon = { ...pokemon, xp: (pokemon.xp ?? 0) + xpEach };

    // Apply level-ups (may be multiple if xp is large)
    let leveled = false;
    const gains = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };

    while (pokemon.xp >= xpToNextLevel(pokemon.level)) {
      pokemon = { ...pokemon, xp: pokemon.xp - xpToNextLevel(pokemon.level) };
      pokemon = { ...pokemon, level: pokemon.level + 1 };

      // Stat gains
      pokemon = {
        ...pokemon,
        baseStats: {
          hp: pokemon.baseStats.hp + XP_PER_LEVEL_STAT_GAINS.hp,
          attack: pokemon.baseStats.attack + XP_PER_LEVEL_STAT_GAINS.attack,
          defense: pokemon.baseStats.defense + XP_PER_LEVEL_STAT_GAINS.defense,
          spAtk: pokemon.baseStats.spAtk + XP_PER_LEVEL_STAT_GAINS.spAtk,
          spDef: pokemon.baseStats.spDef + XP_PER_LEVEL_STAT_GAINS.spDef,
          speed: pokemon.baseStats.speed + XP_PER_LEVEL_STAT_GAINS.speed,
        },
        maxHp: pokemon.maxHp + XP_PER_LEVEL_STAT_GAINS.hp,
        currentHp: pokemon.currentHp + XP_PER_LEVEL_STAT_GAINS.hp,
      };

      gains.hp += XP_PER_LEVEL_STAT_GAINS.hp;
      gains.attack += XP_PER_LEVEL_STAT_GAINS.attack;
      gains.defense += XP_PER_LEVEL_STAT_GAINS.defense;
      gains.spAtk += XP_PER_LEVEL_STAT_GAINS.spAtk;
      gains.spDef += XP_PER_LEVEL_STAT_GAINS.spDef;
      gains.speed += XP_PER_LEVEL_STAT_GAINS.speed;
      leveled = true;
    }

    if (leveled) {
      levelUps.push({
        pokemonName: pokemon.name,
        newLevel: pokemon.level,
        hpGain: gains.hp,
        atkGain: gains.attack,
        defGain: gains.defense,
        spAtkGain: gains.spAtk,
        spDefGain: gains.spDef,
        spdGain: gains.speed,
      });
    }

    updatedParty[idx] = pokemon;
  }

  return { updatedParty, levelUps };
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
export function initCombat(
  party: Pokemon[],
  enemy: Pokemon,
  items: Item[] = [],
  bossConfig?: { leaderId: string; remainingTeam: Pokemon[]; bossName: string; badges: string[] },
): CombatState {
  let combatParty = party.map(toCombatPokemon);
  const combatEnemy = toCombatPokemon(enemy);
  const deck = buildDeck(combatParty[0]);
  let updatedItems = [...items];
  const log: string[] = bossConfig
    ? [`Battle start! ${bossConfig.bossName} sends out ${combatEnemy.name}!`]
    : ['Battle start!'];

  // Lum Berry: cure all status at start of combat, consume it
  if (hasItem(updatedItems, 'lum_berry') && combatParty[0].status) {
    combatParty = [{ ...combatParty[0], status: null }, ...combatParty.slice(1)];
    updatedItems = updatedItems.filter((i) => i.id !== 'lum_berry');
    log.push(`Lum Berry cured ${combatParty[0].name}'s status!`);
  }

  const initialIntent = bossConfig
    ? pickBossMove(bossConfig.leaderId, combatEnemy, combatParty[0])
    : pickEnemyMove(combatEnemy);

  const base: CombatState = {
    playerParty: combatParty,
    enemy: combatEnemy,
    playerHand: [],
    playerDeck: deck,
    playerDiscard: [],
    playerEnergy: 3,
    turn: 0,
    phase: 'player',
    enemyIntent: initialIntent,
    log,
    items: updatedItems,
    combatUsedItems: [],
    movesPlayedThisTurn: 0,
    enemyFlinched: false,
    enemyParty: bossConfig ? bossConfig.remainingTeam.map(toCombatPokemon) : [],
    bossLeaderId: bossConfig?.leaderId ?? null,
    bossName: bossConfig?.bossName ?? null,
    badges: bossConfig?.badges ?? [],
    participantIds: [0],
  };

  return drawCards(base, 4);
}

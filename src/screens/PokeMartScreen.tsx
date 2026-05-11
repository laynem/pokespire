import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRunStore } from '../store/runStore';
import { ITEMS_DATA } from '../data/items';
import { LEARNSETS } from '../data/learnsets';
import { MOVES } from '../data/moves';
import type { Item, Move, Pokemon } from '../types';

// ── Shop entry types ────────────────────────────────────────────────────────

type ShopEntryKind = 'item' | 'move_scroll' | 'potion' | 'full_restore' | 'poke_ball';

interface ShopEntry {
  id: string;
  kind: ShopEntryKind;
  label: string;
  description: string;
  icon: string;
  price: number;
  data?: Item | Move; // underlying object
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildInventory(party: Pokemon[], ownedItemIds: Set<string>): ShopEntry[] {
  const entries: ShopEntry[] = [];

  // Passive items (exclude already owned)
  const availableItems = Object.values(ITEMS_DATA).filter(
    (item) => !ownedItemIds.has(item.id)
  );
  const itemPrice = (item: Item) => 75 + Math.floor(Math.random() * 76); // 75-150
  for (const item of shuffle(availableItems).slice(0, 3)) {
    entries.push({
      id: `item_${item.id}`,
      kind: 'item',
      label: item.name,
      description: item.description,
      icon: item.icon,
      price: itemPrice(item),
      data: item,
    });
  }

  // Move scrolls: pick a learnable move for a random party member
  const allLearnableMoves: { move: Move; pokemon: Pokemon }[] = [];
  for (const pokemon of party) {
    const learnset = LEARNSETS[pokemon.id] ?? [];
    const knownIds = new Set(pokemon.moves.map((m) => m.id));
    const seen = new Set<string>();
    for (const entry of learnset) {
      const move = MOVES[entry.moveId];
      if (move && !knownIds.has(move.id) && !seen.has(move.id)) {
        seen.add(move.id);
        allLearnableMoves.push({ move, pokemon });
      }
    }
  }
  for (const { move, pokemon } of shuffle(allLearnableMoves).slice(0, 2)) {
    const price = 50 + Math.floor(Math.random() * 51); // 50-100
    entries.push({
      id: `scroll_${move.id}_${pokemon.id}`,
      kind: 'move_scroll',
      label: `${move.name} Scroll`,
      description: `Teach ${move.name} to ${pokemon.name}. ${move.power > 0 ? `${move.power} pw · ` : ''}${move.type}`,
      icon: '📜',
      price,
      data: move,
    });
  }

  // Consumables
  entries.push({
    id: 'potion',
    kind: 'potion',
    label: 'Potion',
    description: 'Restore 40 HP to one Pokémon.',
    icon: '🧪',
    price: 40,
  });
  entries.push({
    id: 'full_restore',
    kind: 'full_restore',
    label: 'Full Restore',
    description: 'Fully restore HP and cure status of one Pokémon.',
    icon: '💊',
    price: 120,
  });
  entries.push({
    id: 'poke_ball',
    kind: 'poke_ball',
    label: 'Poké Ball',
    description: 'Improves the Pokémon offered on the next Catch node.',
    icon: '🔴',
    price: 60,
  });

  return shuffle(entries).slice(0, 6);
}

// ── Party picker modal ───────────────────────────────────────────────────────

function PartyPicker({ party, onPick }: { party: Pokemon[]; onPick: (idx: number) => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 w-full max-w-sm flex flex-col gap-3">
        <p className="font-bold text-yellow-400 text-center">Choose a Pokémon</p>
        {party.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 rounded-lg p-3 text-left transition"
          >
            <span className="font-semibold">{p.name}</span>
            <span className="text-xs text-gray-400">Lv.{p.level}</span>
            <span className="text-xs text-gray-400 ml-auto">{p.currentHp}/{p.maxHp} HP</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function PokeMartScreen() {
  const navigate = useNavigate();
  const { gold, party, items, spendGold, addItem, addMoveToParty, updateParty, clearNode, currentNodeId } = useRunStore();

  const ownedItemIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const inventory = useMemo(() => buildInventory(party, ownedItemIds), []); // eslint-disable-line

  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [pendingEntry, setPendingEntry] = useState<ShopEntry | null>(null);

  const handleBuy = (entry: ShopEntry) => {
    if (entry.kind === 'potion' || entry.kind === 'full_restore') {
      // Need to pick a party member
      setPendingEntry(entry);
      return;
    }
    if (entry.kind === 'move_scroll') {
      setPendingEntry(entry);
      return;
    }
    // item / poke_ball — no picker needed
    if (!spendGold(entry.price)) return;
    if (entry.kind === 'item' && entry.data) {
      addItem(entry.data as Item);
    }
    // poke_ball: stored as a special item
    if (entry.kind === 'poke_ball') {
      addItem({ id: 'poke_ball', name: 'Poké Ball', icon: '🔴', description: 'Better Pokémon on next Catch node.', category: 'consumable' });
    }
    setPurchased((prev) => new Set([...prev, entry.id]));
  };

  const handlePartyPick = (partyIdx: number) => {
    if (!pendingEntry) return;
    const { kind, price, data } = pendingEntry;
    if (!spendGold(price)) { setPendingEntry(null); return; }

    if (kind === 'potion') {
      const updated = party.map((p, i) =>
        i === partyIdx ? { ...p, currentHp: Math.min(p.maxHp, p.currentHp + 40) } : p
      );
      updateParty(updated);
    } else if (kind === 'full_restore') {
      const updated = party.map((p, i) =>
        i === partyIdx ? { ...p, currentHp: p.maxHp, status: null } : p
      );
      updateParty(updated);
    } else if (kind === 'move_scroll' && data) {
      addMoveToParty(partyIdx, data as Move);
    }

    setPurchased((prev) => new Set([...prev, pendingEntry.id]));
    setPendingEntry(null);
  };

  const handleContinue = () => {
    if (currentNodeId) clearNode(currentNodeId);
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 gap-5 max-w-lg mx-auto pb-20">
      <div className="text-center">
        <p className="text-4xl mb-1">🛒</p>
        <h2 className="text-2xl font-bold text-yellow-400">Poké Mart</h2>
      </div>

      {/* Gold display */}
      <div className="flex items-center gap-2 self-end bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
        <span className="text-yellow-400 font-bold text-lg">💰 {gold}g</span>
      </div>

      {/* Inventory */}
      <div className="w-full flex flex-col gap-3">
        {inventory.map((entry) => {
          const bought = purchased.has(entry.id);
          const canAfford = gold >= entry.price;
          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 bg-gray-800 border rounded-xl px-4 py-3 transition ${
                bought ? 'border-green-700/50 opacity-60' : 'border-gray-700'
              }`}
            >
              <span className="text-2xl">{entry.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{entry.label}</p>
                <p className="text-xs text-gray-400 truncate">{entry.description}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-yellow-400 text-sm font-bold">{entry.price}g</span>
                <button
                  onClick={() => handleBuy(entry)}
                  disabled={bought || !canAfford}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                    bought
                      ? 'bg-green-800 text-green-400 cursor-default'
                      : canAfford
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-gray-900'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {bought ? 'Bought' : canAfford ? 'Buy' : 'No gold'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition mt-auto"
      >
        Continue →
      </button>

      {pendingEntry && (
        <PartyPicker
          party={party}
          onPick={handlePartyPick}
        />
      )}
    </div>
  );
}

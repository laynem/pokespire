import type { Item } from '../types';

export const ITEMS_DATA: Record<string, Item> = {
  leftovers: {
    id: 'leftovers', name: 'Leftovers', icon: '🍖', category: 'held',
    description: 'Active Pokémon restores 5 HP at end of each turn.',
  },
  lum_berry: {
    id: 'lum_berry', name: 'Lum Berry', icon: '🫐', category: 'consumable',
    description: 'Cures all status at the start of combat. Consumed once per run.',
  },
  choice_band: {
    id: 'choice_band', name: 'Choice Band', icon: '🎀', category: 'held',
    description: 'First move played each turn deals +25% damage.',
  },
  oran_berry: {
    id: 'oran_berry', name: 'Oran Berry', icon: '🫒', category: 'consumable',
    description: 'When a Pokémon drops below 50% HP, restore 20 HP. Once per combat.',
  },
  amulet_coin: {
    id: 'amulet_coin', name: 'Amulet Coin', icon: '🪙', category: 'held',
    description: 'Earn +50% gold from all battles.',
  },
  exp_share: {
    id: 'exp_share', name: 'Exp. Share', icon: '🔗', category: 'held',
    description: 'All party Pokémon benefit from move drafts, not just the active one.',
  },
  kings_rock: {
    id: 'kings_rock', name: "King's Rock", icon: '👑', category: 'held',
    description: '10% chance any damaging move causes flinch (enemy skips next turn).',
  },
  shell_bell: {
    id: 'shell_bell', name: 'Shell Bell', icon: '🔔', category: 'held',
    description: 'Heal 5 HP whenever a move deals 40+ damage.',
  },
  quick_claw: {
    id: 'quick_claw', name: 'Quick Claw', icon: '⚡', category: 'held',
    description: '20% chance active Pokémon moves first regardless of speed.',
  },
  poke_flute: {
    id: 'poke_flute', name: 'Poké Flute', icon: '🎵', category: 'held',
    description: 'Instantly cures Sleep status at the start of your turn.',
  },
};

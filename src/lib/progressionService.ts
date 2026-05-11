import { supabase } from './supabase';

export interface Progression {
  seenPokemon: number[];
  caughtPokemon: number[];
  defeatedGyms: string[];
  foundItems: string[];
  collectedCards: string[];
}

export async function loadProgression(userId: string): Promise<Progression> {
  const [pokemonRes, badgesRes, itemsRes, cardsRes] = await Promise.all([
    supabase.from('pokemon_seen').select('pokemon_id,caught').eq('user_id', userId),
    supabase.from('gym_badges').select('badge_id').eq('user_id', userId),
    supabase.from('items_seen').select('item_id').eq('user_id', userId),
    supabase.from('cards_seen').select('move_id,learned').eq('user_id', userId),
  ]);

  return {
    seenPokemon: pokemonRes.data?.map((r) => r.pokemon_id) ?? [],
    caughtPokemon: pokemonRes.data?.filter((r) => r.caught).map((r) => r.pokemon_id) ?? [],
    defeatedGyms: badgesRes.data?.map((r) => r.badge_id) ?? [],
    foundItems: itemsRes.data?.map((r) => r.item_id) ?? [],
    collectedCards: cardsRes.data?.filter((r) => r.learned).map((r) => r.move_id) ?? [],
  };
}

export async function upsertPokemon(userId: string, pokemonId: number, caught: boolean) {
  const { error } = await supabase.from('pokemon_seen').upsert(
    { user_id: userId, pokemon_id: pokemonId, caught, first_seen_at: new Date().toISOString() },
    { onConflict: 'user_id,pokemon_id' }
  );
  if (error) console.error('[progressionService] upsertPokemon:', error.message);
}

export async function upsertBadge(userId: string, badgeId: string) {
  const { error } = await supabase.from('gym_badges').upsert(
    { user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString() },
    { onConflict: 'user_id,badge_id' }
  );
  if (error) console.error('[progressionService] upsertBadge:', error.message);
}

export async function upsertItem(userId: string, itemId: string) {
  const { error } = await supabase.from('items_seen').upsert(
    { user_id: userId, item_id: itemId, owned: true, first_seen_at: new Date().toISOString() },
    { onConflict: 'user_id,item_id' }
  );
  if (error) console.error('[progressionService] upsertItem:', error.message);
}

export async function upsertCard(userId: string, moveId: string, learned: boolean) {
  const { error } = await supabase.from('cards_seen').upsert(
    { user_id: userId, move_id: moveId, learned, first_seen_at: new Date().toISOString() },
    { onConflict: 'user_id,move_id' }
  );
  if (error) console.error('[progressionService] upsertCard:', error.message);
}

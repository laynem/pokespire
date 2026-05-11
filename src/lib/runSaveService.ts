import { supabase } from './supabase';
import type { RunState } from '../types';

export async function loadSave(userId: string): Promise<RunState | null> {
  const { data, error } = await supabase
    .from('run_saves')
    .select('state')
    .eq('user_id', userId)
    .single();
  if (error || !data) return null;
  return data.state as RunState;
}

export async function upsertSave(userId: string, state: RunState): Promise<void> {
  const { error } = await supabase.from('run_saves').upsert(
    { user_id: userId, state, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
  if (error) console.error('[runSaveService] upsertSave failed:', error.message);
}

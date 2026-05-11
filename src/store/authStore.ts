import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ user: session?.user ?? null, loading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null, loading: false });
  });

  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
  };
});

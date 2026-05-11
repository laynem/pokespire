import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    set({ user: session?.user ?? null, loading: false });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    set({ user: session?.user ?? null, loading: false, isGuest: false });
  });

  return {
    user: null,
    loading: true,
    isGuest: false,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    loginAsGuest: () => set({ user: { id: 'guest' } as User, isGuest: true, loading: false }),
    logout: () => {
      supabase.auth.signOut();
      set({ user: null, isGuest: false });
    },
  };
});

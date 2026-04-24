import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Действия
  setUser: (user: AuthUser | null) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateToken: (accessToken: string, refreshToken?: string) => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateToken: (accessToken, refreshToken) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              accessToken,
              refreshToken,
            },
          });
        }
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
            },
          });
        }
      },
    }),
    {
      name: 'messenger-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

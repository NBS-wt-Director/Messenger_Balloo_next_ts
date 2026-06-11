import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/i18n/types';
import type { ThemePresetId } from '@balloo/core-theme';
import { useThemeStore } from '@balloo/core-theme';
import type { ThemeColors } from '@/types';

// Типы для пользовательских тем (экспортируются для обратной совместимости)
export interface CustomTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isFavorite: boolean;
  createdAt: number;
  updatedAt?: number;
  createdBy?: string;
}

export interface ThemeSubscription {
  isActive: boolean;
  expiresAt?: number;
  daysLeft?: number;
}

interface SettingsState {
  language: Language;
  customThemes: CustomTheme[];
  recentThemes: CustomTheme[];
  favorites: CustomTheme[];
  subscription: ThemeSubscription;
  
  // Действия
  setLanguage: (language: Language) => void;
  setCustomThemes: (themes: CustomTheme[]) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (themeId: string) => void;
  setSubscription: (subscription: ThemeSubscription) => void;
  loadThemesFromServer: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      language: 'ru',
      customThemes: [],
      recentThemes: [],
      favorites: [],
      subscription: { isActive: false },

      setLanguage: (language) => set({ language }),
      
      setCustomThemes: (themes) => set({ customThemes: themes }),
      
      addCustomTheme: (theme) => set((state) => ({
        customThemes: [...state.customThemes, theme]
      })),
      
      removeCustomTheme: (themeId) => set((state) => ({
        customThemes: state.customThemes.filter(t => t.id !== themeId)
      })),
      
      setSubscription: (subscription) => set({ subscription }),
      
      loadThemesFromServer: async () => {
        try {
          const response = await fetch('/api/v1/themes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const { data } = await response.json();
            set({
              customThemes: data.userThemes || [],
              recentThemes: data.recentThemes || [],
              favorites: data.favorites || [],
              subscription: data.subscription || { isActive: false }
            });
          }
        } catch (error) {
          console.error('Failed to load themes:', error);
        }
      }
    }),
    {
      name: 'messenger-settings',
    }
  )
);

// ============================================================================
// Theme delegation to @balloo/core-theme
// ============================================================================

/**
 * Get current theme from core-theme store
 * Use this instead of settings-store for theme access
 */
export function getCurrentTheme(): ThemePresetId {
  return useThemeStore.getState().theme;
}

/**
 * Set theme via core-theme store
 * Use this instead of settings-store for theme changes
 */
export function setTheme(theme: ThemePresetId): void {
  useThemeStore.getState().setTheme(theme);
}

/**
 * Toggle theme via core-theme store
 */
export function toggleTheme(): void {
  useThemeStore.getState().toggleTheme();
}

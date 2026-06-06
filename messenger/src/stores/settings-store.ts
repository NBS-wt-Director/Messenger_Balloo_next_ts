import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme } from '@/i18n/types';

// Типы для пользовательских тем
export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
  isFavorite: boolean;
  createdAt: number;
}

export interface ThemeSubscription {
  isActive: boolean;
  expiresAt?: number;
  daysLeft?: number;
}

interface SettingsState {
  theme: Theme;
  language: Language;
  customThemes: CustomTheme[];
  recentThemes: CustomTheme[];
  favorites: CustomTheme[];
  subscription: ThemeSubscription;
  
  // Действия
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
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
      theme: 'dark',
      language: 'ru',
      customThemes: [],
      recentThemes: [],
      favorites: [],
      subscription: { isActive: false },

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('messenger-theme', theme);
        }
      },

      toggleTheme: () => {
        const themes: Theme[] = ['dark', 'light', 'russia'];
        const currentIndex = themes.indexOf(get().theme);
        const newTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(newTheme);
      },

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

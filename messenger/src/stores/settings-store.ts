import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme } from '@/i18n/types';

interface SettingsState {
  theme: Theme;
  language: Language;
  
  // Действия
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'ru',

      setTheme: (theme) => {
        set({ theme });
        // Применяем тему к document
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
    }),
    {
      name: 'messenger-settings',
    }
  )
);

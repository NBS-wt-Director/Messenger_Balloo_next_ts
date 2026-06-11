/**
 * Core Theme - Theme Store
 * 
 * Zustand store for theme management.
 * Extracted from: messenger/src/stores/settings-store.ts
 * 
 * Rules:
 * - Platform presets (dark, light, russia) available everywhere
 * - Custom themes allowed only in user apps (web-main, mobile, desktop)
 * - Custom themes forbidden in admin/system nodes (admin, api, docs-site, abaut)
 * - Save custom themes only after 2 days of usage
 * - Available without registration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeStore, ThemePresetId, CustomTheme, ThemeSubscription } from './types';
import { PRESET_THEMES, DEFAULT_THEME_ID, THEME_IDS } from './presets';

// ============================================================================
// Theme Store Implementation
// ============================================================================

const createThemeStore = () => create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: DEFAULT_THEME_ID,
      customThemes: [],
      recentThemes: [],
      favorites: [],
      subscription: { isActive: false },

      // Set active theme
      setTheme: (theme: ThemePresetId) => {
        set({ theme });
        
        // Apply theme to document (browser only)
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('balloo-theme', theme);
        }
      },

      // Toggle through preset themes
      toggleTheme: () => {
        const currentIndex = THEME_IDS.indexOf(get().theme);
        const newTheme = THEME_IDS[(currentIndex + 1) % THEME_IDS.length];
        get().setTheme(newTheme);
      },

      // Set all custom themes
      setCustomThemes: (themes) => set({ customThemes: themes }),

      // Add custom theme
      addCustomTheme: (theme) => set((state) => ({
        customThemes: [...state.customThemes, theme]
      })),

      // Remove custom theme
      removeCustomTheme: (themeId) => set((state) => ({
        customThemes: state.customThemes.filter(t => t.id !== themeId)
      })),

      // Update custom theme
      updateCustomTheme: (themeId, updates) => set((state) => ({
        customThemes: state.customThemes.map(t => 
          t.id === themeId ? { ...t, ...updates, updatedAt: Date.now() } : t
        )
      })),

      // Toggle favorite status
      toggleFavorite: (themeId) => set((state) => {
        const theme = state.customThemes.find(t => t.id === themeId);
        if (!theme) return state;

        const isFavorite = !theme.isFavorite;
        
        return {
          customThemes: state.customThemes.map(t => 
            t.id === themeId ? { ...t, isFavorite } : t
          ),
          favorites: isFavorite
            ? [...state.favorites, { ...theme, isFavorite }]
            : state.favorites.filter(t => t.id !== themeId)
        };
      }),

      // Add to recent themes
      addRecentTheme: (theme) => set((state) => {
        // Remove if already exists
        const filtered = state.recentThemes.filter(t => t.id !== theme.id);
        // Add to beginning, keep last 10
        return { recentThemes: [theme, ...filtered].slice(0, 10) };
      }),

      // Set subscription
      setSubscription: (subscription) => set({ subscription }),

      // Activate subscription
      activateSubscription: (days) => {
        const now = Date.now();
        const expiresAt = now + (days * 24 * 60 * 60 * 1000);
        set({
          subscription: {
            isActive: true,
            expiresAt,
            daysLeft: days
          }
        });
      },

      // Load themes from server (user apps only)
      loadThemesFromServer: async () => {
        try {
          const response = await fetch('/api/v1/themes', {
            headers: {
              'Authorization': `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}`
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
      },

      // Record theme usage (for 2-day rule)
      recordThemeUsage: (themeId) => {
        // Implementation for tracking theme usage duration
        // Custom themes can be saved only after 2 days of usage
        const usageKey = `theme-usage-${themeId}`;
        if (typeof localStorage !== 'undefined') {
          const usage = JSON.parse(localStorage.getItem(usageKey) || '[]');
          usage.push(Date.now());
          localStorage.setItem(usageKey, JSON.stringify(usage));
        }
      }
    }),
    {
      name: 'balloo-theme-store',
    }
  )
);

// ============================================================================
// Store Instance
// ============================================================================

export const useThemeStore = createThemeStore();

// ============================================================================
// Theme Application Helper
// ============================================================================

/**
 * Apply theme to document (SSR-safe)
 */
export function applyTheme(theme: ThemePresetId): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('balloo-theme', theme);
  }
}

/**
 * Get current theme from localStorage (SSR-safe)
 */
export function getCurrentTheme(): ThemePresetId {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('balloo-theme') as ThemePresetId;
    if (stored && THEME_IDS.includes(stored)) {
      return stored;
    }
  }
  return DEFAULT_THEME_ID;
}

/**
 * Get preset theme by ID
 */
export function getPresetTheme(id: ThemePresetId) {
  return PRESET_THEMES.find(t => t.id === id);
}

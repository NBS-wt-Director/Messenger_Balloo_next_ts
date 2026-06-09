// Core Theme System - Stub
// Future implementation: migrate from messenger/src/stores/settings-store.ts

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export interface PresetTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isFavorite: boolean;
  createdAt: number;
}

// Preset themes (shared across all nodes)
export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'light',
    name: 'Светлая',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      accent: '#007bff'
    },
    isFavorite: false,
    createdAt: Date.now()
  },
  {
    id: 'dark',
    name: 'Тёмная',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      accent: '#0d6efd'
    },
    isFavorite: false,
    createdAt: Date.now()
  },
  {
    id: 'russia',
    name: 'Россия',
    colors: {
      primary: '#0039A6',
      secondary: '#D52B1E',
      background: '#ffffff',
      surface: '#f0f0f0',
      text: '#000000',
      textSecondary: '#555555',
      border: '#cccccc',
      accent: '#D52B1E'
    },
    isFavorite: false,
    createdAt: Date.now()
  }
];

// Rules:
// - Custom themes allowed only in: web-main, mobile, desktop
// - Custom themes forbidden in: admin, api, docs-site, abaut
// - Save only after 2 days of usage
// - Available without registration (for all users)
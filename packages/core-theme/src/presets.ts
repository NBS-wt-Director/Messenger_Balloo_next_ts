/**
 * Core Theme - Platform Preset Themes
 * 
 * Single source of truth for platform preset themes.
 * Exactly 3 themes: dark, light, russia
 * 
 * Contract: ThemeContract.md
 */

import type { PresetTheme, ThemeColors } from './types';

// ============================================================================
// Platform Preset Themes
// ============================================================================

const DARK_COLORS: ThemeColors = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  background: '#1a1a1a',
  surface: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#404040',
  accent: '#0d6efd'
};

const LIGHT_COLORS: ThemeColors = {
  primary: '#007bff',
  secondary: '#6c757d',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  accent: '#007bff'
};

const RUSSIA_COLORS: ThemeColors = {
  primary: '#0039A6',
  secondary: '#D52B1E',
  background: '#ffffff',
  surface: '#f0f0f0',
  text: '#000000',
  textSecondary: '#555555',
  border: '#cccccc',
  accent: '#D52B1E'
};

// ============================================================================
// Preset Themes Array (Single Source of Truth)
// ============================================================================

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'light',
    name: 'Светлая',
    colors: LIGHT_COLORS,
    isFavorite: false,
    createdAt: Date.now()
  },
  {
    id: 'dark',
    name: 'Тёмная',
    colors: DARK_COLORS,
    isFavorite: false,
    createdAt: Date.now()
  },
  {
    id: 'russia',
    name: 'Россия',
    colors: RUSSIA_COLORS,
    isFavorite: false,
    createdAt: Date.now()
  }
];

// ============================================================================
// Theme Colors by ID (for quick lookup)
// ============================================================================

export const THEME_COLORS: Record<string, ThemeColors> = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
  russia: RUSSIA_COLORS
};

// ============================================================================
// Theme IDs (for type-safe references)
// ============================================================================

export const THEME_IDS = ['light', 'dark', 'russia'] as const;

// ============================================================================
// Default Theme
// ============================================================================

export const DEFAULT_THEME_ID = 'dark';

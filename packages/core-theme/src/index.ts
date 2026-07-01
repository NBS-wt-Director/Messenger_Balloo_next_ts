// Stub for @balloo/core-theme
export const PRESET_THEMES = { dark: {}, light: {}, russia: {} };
export const THEME_IDS = ['dark', 'light', 'russia'];
export const DEFAULT_THEME_ID = 'dark';
export function useThemeStore() { return { theme: 'dark', setTheme: () => {}, toggleTheme: () => {} }; }
export function applyTheme() {}
export function getCurrentTheme() { return PRESET_THEMES.dark; }
export function getPresetTheme() { return PRESET_THEMES.dark; }
export type ThemePresetId = 'dark' | 'light' | 'russia';
export type PresetTheme = any;
export type ThemeColors = any;
export type ThemeSubscription = any;

/**
 * @balloo/core-theme
 * 
 * Core theme system for Balloo platform.
 * Single source of truth for platform preset themes.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Types
// ============================================================================

export type {
  ThemeColors,
  PresetTheme,
  CustomTheme,
  ThemeSubscription,
  ThemePresetId,
  ThemeStoreState,
  ThemeStoreActions,
  ThemeStore
} from './types';

// ============================================================================
// Presets
// ============================================================================

export {
  PRESET_THEMES,
  THEME_COLORS,
  THEME_IDS,
  DEFAULT_THEME_ID
} from './presets';

// ============================================================================
// Store
// ============================================================================

export {
  useThemeStore,
  applyTheme,
  getCurrentTheme,
  getPresetTheme
} from './theme-store';

// ============================================================================
// Rules (ThemeContract.md)
// ============================================================================

/**
 * Platform Preset Themes:
 * - Exactly 3 themes: dark, light, russia
 * - Available on all nodes
 * - Source of truth: packages/core-theme/src/presets.ts
 * 
 * Custom Themes:
 * - Allowed only in user apps: web-main, mobile, desktop
 * - Forbidden in admin/system nodes: admin, api, docs-site, abaut
 * - Save only after 2 days of usage
 * - Available without registration
 */
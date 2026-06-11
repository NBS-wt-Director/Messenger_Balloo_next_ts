/**
 * Core Theme - Type Definitions
 * 
 * Platform-wide theme types for Balloo platform.
 * Extracted from: messenger/src/stores/settings-store.ts, messenger/src/types/index.ts
 */

// ============================================================================
// Theme Colors Interface
// ============================================================================

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

// ============================================================================
// Preset Theme Interface
// ============================================================================

export interface PresetTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isFavorite: boolean;
  createdAt: number;
}

// ============================================================================
// Custom Theme Interface (user-app-only)
// ============================================================================

export interface CustomTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  isFavorite: boolean;
  createdAt: number;
  updatedAt?: number;
  createdBy?: string;
}

// ============================================================================
// Theme Subscription Interface
// ============================================================================

export interface ThemeSubscription {
  isActive: boolean;
  expiresAt?: number;
  daysLeft?: number;
}

// ============================================================================
// Theme Type Union (platform presets)
// ============================================================================

export type ThemePresetId = 'dark' | 'light' | 'russia';

// ============================================================================
// Theme Store State Interface
// ============================================================================

export interface ThemeStoreState {
  // Current active theme
  theme: ThemePresetId;
  
  // User's custom themes (only in user apps: web-main, mobile, desktop)
  customThemes: CustomTheme[];
  
  // Recently used themes
  recentThemes: CustomTheme[];
  
  // Favorite themes
  favorites: CustomTheme[];
  
  // Subscription status
  subscription: ThemeSubscription;
}

// ============================================================================
// Theme Store Actions Interface
// ============================================================================

export interface ThemeStoreActions {
  // Set active theme
  setTheme: (theme: ThemePresetId) => void;
  
  // Toggle through preset themes
  toggleTheme: () => void;
  
  // Custom themes management
  setCustomThemes: (themes: CustomTheme[]) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (themeId: string) => void;
  updateCustomTheme: (themeId: string, updates: Partial<CustomTheme>) => void;
  
  // Favorites management
  toggleFavorite: (themeId: string) => void;
  
  // Recent themes management
  addRecentTheme: (theme: CustomTheme) => void;
  
  // Subscription management
  setSubscription: (subscription: ThemeSubscription) => void;
  activateSubscription: (days: number) => void;
  
  // Server sync (for user apps)
  loadThemesFromServer: () => Promise<void>;
  
  // Theme usage tracking (for 2-day rule)
  recordThemeUsage: (themeId: string) => void;
}

// ============================================================================
// Combined Theme Store Interface
// ============================================================================

export type ThemeStore = ThemeStoreState & ThemeStoreActions;

/**
 * Core UI - Design Tokens
 * 
 * Platform-wide design tokens for Balloo platform.
 * Enforces DesignContract: border-radius: 0 (no rounded corners)
 */

// ============================================================================
// Border Radius (DesignContract: MUST be 0)
// ============================================================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0',   // Enforced: no rounding
  md: '0',   // Enforced: no rounding
  lg: '0',   // Enforced: no rounding
  xl: '0',   // Enforced: no rounding
  full: '0', // Enforced: no rounding
} as const;

export type BorderRadiusKey = keyof typeof BORDER_RADIUS;

// ============================================================================
// Spacing
// ============================================================================

export const SPACING = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export type SpacingKey = keyof typeof SPACING;

// ============================================================================
// Font Sizes (from @balloo/core-brand)
// ============================================================================

export const FONT_SIZE = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
} as const;

export type FontSizeKey = keyof typeof FONT_SIZE;

// ============================================================================
// Font Weights (from @balloo/core-brand)
// ============================================================================

export const FONT_WEIGHT = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export type FontWeightKey = keyof typeof FONT_WEIGHT;

// ============================================================================
// Colors (from @balloo/core-theme and @balloo/core-brand)
// ============================================================================

export const COLORS = {
  // Brand colors
  primary: '#0039A6',    // Russia blue
  secondary: '#D52B1E',  // Russia red
  accent: '#007bff',     // Modern blue
  
  // Semantic colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Neutrals
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

export type ColorKey = keyof typeof COLORS;

// ============================================================================
// Shadows
// ============================================================================

export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export type ShadowKey = keyof typeof SHADOWS;

// ============================================================================
// Transitions
// ============================================================================

export const TRANSITIONS = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;

export type TransitionKey = keyof typeof TRANSITIONS;

// ============================================================================
// Z-Index Scale
// ============================================================================

export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;

// ============================================================================
// DesignContract Enforcement
// ============================================================================

/**
 * DesignContract Rule: border-radius MUST be 0
 * 
 * This constant enforces the platform-wide design rule:
 * - No rounded corners on any component
 * - Sharp, modern aesthetic
 * - Consistent with ThemeContract.md
 * 
 * @deprecated Use BORDER_RADIUS instead
 */
export const DESIGN_CONTRACT = {
  BORDER_RADIUS_ENFORCED: '0',
  NO_ROUNDED_CORNERS: true,
  VERSION: '1.0.0',
} as const;

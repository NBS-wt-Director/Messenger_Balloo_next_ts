/**
 * Core Brand - Type Definitions
 * 
 * Platform-wide brand types for Balloo platform.
 */

// ============================================================================
// Logo Types
// ============================================================================

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  src?: string;
  alt?: string;
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}

// ============================================================================
// Brand Colors
// ============================================================================

export interface BrandColors {
  // Primary palette
  primary: string;
  secondary: string;
  accent: string;
  
  // Neutrals
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  
  // Russia flag colors (brand heritage)
  white: string;
  blue: string;
  red: string;
}

// ============================================================================
// Brand Typography
// ============================================================================

export interface BrandTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    bold: number;
  };
}

// ============================================================================
// Brand Guidelines
// ============================================================================

export interface BrandGuidelines {
  name: string;
  version: string;
  colors: BrandColors;
  typography: BrandTypography;
  logoMinSize: string;
  logoClearSpace: string;
}

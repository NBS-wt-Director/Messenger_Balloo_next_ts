/**
 * Core Brand - Brand Constants
 * 
 * Official brand colors, typography, company info, and guidelines for Balloo platform.
 */

import type { BrandColors, BrandTypography, BrandGuidelines, CompanyInfo } from './types';

// ============================================================================
// Company Information
// ============================================================================

/**
 * Company: NBS - web-tech
 * City: Екатеринбург
 * Slogan: Системы для Ваших Новых Начинаний.
 */
export const COMPANY_INFO: CompanyInfo = {
  name: 'NBS - web-tech',
  shortName: 'NBS-wt',
  city: 'Екатеринбург',
  slogan: 'Системы для Ваших Новых Начинаний.',
  founded: 2026,
  website: 'https://balloo.su',
};

// ============================================================================
// Brand Colors
// ============================================================================

export const BRAND_COLORS: BrandColors = {
  // Primary palette
  primary: '#0039A6',    // Russia blue
  secondary: '#D52B1E',  // Russia red
  accent: '#007bff',     // Modern blue
  
  // Neutrals
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  
  // Russia flag colors (brand heritage)
  white: '#ffffff',
  blue: '#0039A6',
  red: '#D52B1E',
};

// ============================================================================
// Brand Typography
// ============================================================================

export const BRAND_TYPOGRAPHY: BrandTypography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
};

// ============================================================================
// Brand Guidelines
// ============================================================================

export const BRAND_GUIDELINES: BrandGuidelines = {
  name: 'Balloo Brand Guidelines',
  version: '1.0.0',
  colors: BRAND_COLORS,
  typography: BRAND_TYPOGRAPHY,
  logoMinSize: '32px',
  logoClearSpace: '8px', // Design invariant #6
};

// ============================================================================
// Logo Gradient (Russia Flag)
// ============================================================================

export const LOGO_GRADIENT = 'linear-gradient(180deg, #FF0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0000FF 66%)';

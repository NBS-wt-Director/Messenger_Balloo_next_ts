/**
 * @balloo/core-brand
 * 
 * Core brand assets for Balloo platform.
 * Provides Logo component, brand colors, typography, and assets.
 * 
 * @packageDocumentation
 */

// ============================================================================
// Components
// ============================================================================

export { Logo } from './Logo';

// ============================================================================
// Types
// ============================================================================

export type {
  LogoProps,
  LogoSize,
  BrandColors,
  BrandTypography,
  BrandGuidelines
} from './types';

// ============================================================================
// Constants
// ============================================================================

export {
  BRAND_COLORS,
  BRAND_TYPOGRAPHY,
  BRAND_GUIDELINES,
  LOGO_GRADIENT,
  COMPANY_INFO
} from './brand';

// ============================================================================
// Assets (import paths)
// ============================================================================

/**
 * Logo assets - use these imports in your components
 * 
 * @example
 * ```tsx
 * import { LOGO_JPG, LOGO_PNG, LOGO_SVG } from '@balloo/core-brand';
 * 
 * <img src={LOGO_JPG} alt="Balloo" />
 * ```
 */
export const LOGO_JPG = '../assets/logo.jpg';
export const LOGO_PNG = '../assets/logo.png';
export const LOGO_SVG = '../assets/logo.svg';

/**
 * Company information
 * 
 * @example
 * ```tsx
 * import { COMPANY_INFO } from '@balloo/core-brand';
 * 
 * <footer>
 *   <p>{COMPANY_INFO.name} - {COMPANY_INFO.city}</p>
 *   <p>{COMPANY_INFO.slogan}</p>
 * </footer>
 * ```
 */
export { COMPANY_INFO } from './brand';

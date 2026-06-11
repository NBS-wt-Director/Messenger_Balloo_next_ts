/**
 * @balloo/core-ui
 * 
 * Core UI components for Balloo platform.
 * All components enforce DesignContract: border-radius: 0 (no rounded corners).
 * 
 * @packageDocumentation
 */

// ============================================================================
// Components
// ============================================================================

export { Button } from './components/Button';
export { Modal } from './components/Modal';
export { Alert } from './components/Alert';
export { Card } from './components/Card';

// ============================================================================
// Types
// ============================================================================

export type {
  // Common
  CommonProps,
  SizeProps,
  VariantProps,
  DisabledProps,
  
  // Component Props
  ButtonProps,
  InputProps,
  InputType,
  ModalProps,
  AlertProps,
  AlertType,
  CardProps,
  AvatarProps,
  BadgeProps,
  BadgeVariant,
  SpinnerProps,
  DividerProps,
  
  // DesignContract
  DesignContractCompliant,
} from './types';

// ============================================================================
// Design Tokens
// ============================================================================

export {
  BORDER_RADIUS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  COLORS,
  SHADOWS,
  TRANSITIONS,
  Z_INDEX,
  DESIGN_CONTRACT,
} from './design-tokens';

export type {
  BorderRadiusKey,
  SpacingKey,
  FontSizeKey,
  FontWeightKey,
  ColorKey,
  ShadowKey,
  TransitionKey,
  ZIndexKey,
} from './design-tokens';

/**
 * Core UI - Type Definitions
 * 
 * Platform-wide UI types for Balloo platform.
 */

import type { ReactNode } from 'react';
import type { BORDER_RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT, COLORS, SHADOWS } from './design-tokens';

// ============================================================================
// Common Props
// ============================================================================

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export interface SizeProps {
  size?: 'sm' | 'md' | 'lg';
}

export interface VariantProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export interface DisabledProps {
  disabled?: boolean;
}

// ============================================================================
// Button Types
// ============================================================================

export interface ButtonProps extends CommonProps, SizeProps, VariantProps, DisabledProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// ============================================================================
// Input Types
// ============================================================================

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends CommonProps, DisabledProps {
  type?: InputType;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

// ============================================================================
// Modal Types
// ============================================================================

export interface ModalProps extends CommonProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
}

// ============================================================================
// Alert Types
// ============================================================================

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps extends CommonProps {
  message: string;
  type?: AlertType;
  onClose: () => void;
  duration?: number;
  showIcon?: boolean;
}

// ============================================================================
// Card Types
// ============================================================================

export interface CardProps extends CommonProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  hoverable?: boolean;
}

// ============================================================================
// Avatar Types
// ============================================================================

export interface AvatarProps extends CommonProps, SizeProps {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
}

// ============================================================================
// Badge Types
// ============================================================================

export type BadgeVariant = 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info';

export interface BadgeProps extends CommonProps, SizeProps {
  variant?: BadgeVariant;
  dot?: boolean;
}

// ============================================================================
// Spinner Types
// ============================================================================

export interface SpinnerProps extends CommonProps, SizeProps {
  color?: keyof typeof COLORS;
}

// ============================================================================
// Divider Types
// ============================================================================

export interface DividerProps extends CommonProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: keyof typeof SPACING;
}

// ============================================================================
// DesignContract Compliance
// ============================================================================

/**
 * All components MUST enforce DesignContract:
 * - border-radius: 0 (no rounded corners)
 * - Sharp, modern aesthetic
 * - Consistent with platform design
 */
export interface DesignContractCompliant {
  /** Must be 0 - no rounded corners allowed */
  borderRadius: '0';
}

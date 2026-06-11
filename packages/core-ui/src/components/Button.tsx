'use client';

import type { ButtonProps } from '../types';
import { BORDER_RADIUS, SPACING, TRANSITIONS, COLORS } from '../design-tokens';

/**
 * Button Component
 * 
 * Primary action button with DesignContract enforcement (border-radius: 0).
 * 
 * @example
 * ```tsx
 * import { Button } from '@balloo/core-ui';
 * 
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
 */
export function Button({ 
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  style,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      border: `2px solid ${COLORS.primary}`,
    },
    secondary: {
      backgroundColor: COLORS.secondary,
      color: COLORS.white,
      border: `2px solid ${COLORS.secondary}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: '2px solid transparent',
    },
    danger: {
      backgroundColor: COLORS.error,
      color: COLORS.white,
      border: `2px solid ${COLORS.error}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        font-medium transition-all
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'}
        ${className}
      `}
      style={{
        ...variantStyles[variant],
        borderRadius: BORDER_RADIUS.none,
        transition: TRANSITIONS.fast,
        ...style,
      }}
    >
      <span className="flex items-center justify-center gap-2">
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {loading ? (
          <span className="animate-spin">⟳</span>
        ) : (
          children
        )}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </span>
    </button>
  );
}

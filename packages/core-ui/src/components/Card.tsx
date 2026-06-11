'use client';

import type { CardProps } from '../types';
import { BORDER_RADIUS, SHADOWS, SPACING } from '../design-tokens';

/**
 * Card Component
 * 
 * Container card with DesignContract enforcement (border-radius: 0).
 * 
 * @example
 * ```tsx
 * import { Card } from '@balloo/core-ui';
 * 
 * <Card variant="elevated" padding="4">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
export function Card({ 
  children,
  variant = 'elevated',
  padding = 4,
  hoverable = false,
  className = '',
  style,
}: CardProps) {
  const variantStyles = {
    elevated: {
      backgroundColor: 'bg-card',
      border: '1px solid var(--border)',
      boxShadow: SHADOWS.md,
    },
    outlined: {
      backgroundColor: 'transparent',
      border: '2px solid var(--border)',
      boxShadow: SHADOWS.none,
    },
    filled: {
      backgroundColor: 'bg-muted',
      border: '1px solid var(--border)',
      boxShadow: SHADOWS.none,
    },
  };

  const paddingClass = `p-${padding}`;

  return (
    <div
      className={`
        ${variantStyles[variant].backgroundColor}
        ${variantStyles[variant].border}
        ${paddingClass}
        ${hoverable ? 'transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
      style={{
        borderRadius: BORDER_RADIUS.none,
        boxShadow: variantStyles[variant].boxShadow,
        transition: hoverable ? 'box-shadow 200ms ease' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

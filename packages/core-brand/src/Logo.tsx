'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import type { LogoProps, LogoSize } from './types';

/**
 * Balloo Logo Component
 * 
 * Official brand logo for Balloo platform.
 * Supports image src or fallback gradient (Russia flag colors).
 * 
 * @example
 * ```tsx
 * import { Logo } from '@balloo/core-brand';
 * 
 * <Logo src="/logo.jpg" alt="Balloo" size="md" />
 * ```
 */
export function Logo({ 
  src, 
  alt = 'Balloo', 
  size = 'md',
  showText = true,
  className = ''
}: LogoProps) {
  const sizeClasses: Record<LogoSize, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const sizeMap: Record<LogoSize, number> = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  // Fallback: Russia flag gradient if no src provided
  if (!src) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div 
          className={`${sizeClasses[size]} relative overflow-hidden border-2 border-primary flex-shrink-0`}
          style={{
            background: 'linear-gradient(180deg, #FF0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0000FF 66%)',
            borderRadius: '4px',
          }}
          title={alt}
        />
        {showText && (
          <span className="font-bold text-xl tracking-wide">
            <MessageCircle size={24} className="inline mr-2" />
            Balloo
          </span>
        )}
      </div>
    );
  }

  // Image logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className={`${sizeClasses[size]} object-contain flex-shrink-0`}
      />
      {showText && (
        <span className="font-bold text-xl tracking-wide">
          Balloo
        </span>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

interface LogoProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * Адаптивный логотип мессенджера
 * Если картинка не предоставлена - выводит красно-бело-синий квадрат
 */
export function Logo({ 
  src, 
  alt = 'Balloo Messenger', 
  size = 'md',
  showText = true,
  className = ''
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  // Если картинка не предоставлена - показываем заглушку (красно-бело-синий квадрат)
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

  // Если картинка предоставлена - показываем её
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
        height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
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

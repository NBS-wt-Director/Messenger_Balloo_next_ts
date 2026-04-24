'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface BurgerMenuProps {
  mascotSrc?: string;
  mascotAlt?: string;
  size?: 'sm' | 'md' | 'lg';
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * Адаптивное бургер меню с маскотом
 * Если картинка маскота не предоставлена - выводит красно-бело-синий квадрат
 */
export function BurgerMenu({ 
  mascotSrc, 
  mascotAlt = 'Balloo Mascot',
  size = 'md',
  isOpen = false,
  onToggle,
  className = ''
}: BurgerMenuProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const handleClick = () => {
    onToggle?.();
  };

  // Если картинка маскота не предоставлена - показываем заглушку
  if (!mascotSrc) {
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-2 rounded-lg border-2 transition-all duration-150 ${
          isOpen || isHovered 
            ? 'border-primary bg-muted' 
            : 'border-transparent bg-transparent'
        } ${className}`}
        aria-label="Меню"
        aria-expanded={isOpen}
      >
        {/* Красно-бело-синий квадрат с иконкой меню */}
        <div className="relative">
          <div 
            className={`${sizeClasses[size]} relative overflow-hidden`}
            style={{
              background: isHovered || isOpen
                ? 'linear-gradient(180deg, #FF0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0000FF 66%)'
                : 'linear-gradient(135deg, #FF0000 25%, #FFFFFF 25%, #FFFFFF 50%, #0000FF 50%, #0000FF 75%, #FFFFFF 75%)',
              borderRadius: '6px',
              transition: 'background 0.2s ease',
            }}
          >
            {/* Иконка меню поверх квадрата */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Menu 
                size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} 
                className="text-white"
              />
            </div>
          </div>
        </div>
      </button>
    );
  }

  // Если картинка предоставлена - показываем её
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-2 rounded-lg border-2 transition-all duration-150 ${
        isOpen || isHovered 
          ? 'border-primary bg-muted' 
          : 'border-transparent bg-transparent'
      } ${className}`}
      aria-label="Меню"
      aria-expanded={isOpen}
    >
      <Image
        src={mascotSrc}
        alt={mascotAlt}
        width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
        height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
        className={`${sizeClasses[size]} object-contain transition-transform duration-200 ${
          isHovered || isOpen ? 'scale-110' : 'scale-100'
        }`}
      />
    </button>
  );
}

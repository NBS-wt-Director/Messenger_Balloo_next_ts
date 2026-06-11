'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '../types';
import { BORDER_RADIUS, SHADOWS, Z_INDEX, TRANSITIONS } from '../design-tokens';

/**
 * Modal Component
 * 
 * Accessible modal dialog with DesignContract enforcement (border-radius: 0).
 * 
 * @example
 * ```tsx
 * import { Modal } from '@balloo/core-ui';
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Modal Title"
 *   description="Optional description"
 * >
 *   <p>Modal content here</p>
 * </Modal>
 * ```
 */
export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Size variants
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[50] flex items-center justify-center p-4"
      style={{ zIndex: Z_INDEX.modal }}
      onClick={closeOnOverlay ? onClose : undefined}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ 
          animation: 'fadeIn 200ms ease',
        }}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-card border-2 border-border p-6 shadow-2xl`}
        style={{ 
          borderRadius: BORDER_RADIUS.none,
          boxShadow: SHADOWS.lg,
          animation: 'slideIn 200ms ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted transition-colors"
          style={{ 
            borderRadius: BORDER_RADIUS.none,
            transition: TRANSITIONS.normal,
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        
        {/* Description */}
        {description && (
          <p className="text-muted-foreground mb-4">{description}</p>
        )}
        
        {/* Children */}
        <div className="mb-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

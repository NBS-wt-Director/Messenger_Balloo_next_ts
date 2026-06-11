'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import type { AlertProps, AlertType } from '../types';
import { BORDER_RADIUS, Z_INDEX, TRANSITIONS, COLORS } from '../design-tokens';

/**
 * Alert Component
 * 
 * Toast-style alert notification with auto-dismiss.
 * DesignContract enforced (border-radius: 0).
 * 
 * @example
 * ```tsx
 * import { Alert } from '@balloo/core-ui';
 * 
 * <Alert
 *   message="Operation successful!"
 *   type="success"
 *   onClose={() => setShowAlert(false)}
 *   duration={3000}
 * />
 * ```
 */
export function Alert({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000,
  showIcon = true,
}: AlertProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Show with slight delay for animation
    const showTimer = setTimeout(() => setVisible(true), 50);
    
    // Auto-dismiss
    if (duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    
    return () => clearTimeout(showTimer);
  }, [duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 400); // Wait for exit animation
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={24} color={COLORS.success} />;
      case 'error': return <AlertCircle size={24} color={COLORS.error} />;
      case 'warning': return <AlertTriangle size={24} color={COLORS.warning} />;
      default: return <Info size={24} color={COLORS.info} />;
    }
  };

  const getTypeStyles = () => {
    const baseStyles = {
      borderLeft: `4px solid`,
    };
    
    switch (type) {
      case 'success': return { ...baseStyles, borderLeftColor: COLORS.success };
      case 'error': return { ...baseStyles, borderLeftColor: COLORS.error };
      case 'warning': return { ...baseStyles, borderLeftColor: COLORS.warning };
      default: return { ...baseStyles, borderLeftColor: COLORS.info };
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-[70] animate-slide-in"
      style={{ 
        zIndex: Z_INDEX.toast,
        opacity: visible ? 1 : 0,
        transform: exiting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'all 400ms ease',
      }}
    >
      <div 
        className="flex items-center gap-3 bg-card border-2 border-border p-4 shadow-lg min-w-[300px] max-w-md"
        style={{
          borderRadius: BORDER_RADIUS.none,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          ...getTypeStyles(),
        }}
      >
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
        )}
        
        {/* Message */}
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-muted transition-colors"
          style={{
            borderRadius: BORDER_RADIUS.none,
            transition: TRANSITIONS.fast,
          }}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden" style={{ borderRadius: BORDER_RADIUS.none }}>
          <div 
            className="h-full bg-primary"
            style={{
              animation: `shrink ${duration}ms linear`,
              borderRadius: BORDER_RADIUS.none,
            }}
          />
        </div>
      )}
    </div>
  );
}

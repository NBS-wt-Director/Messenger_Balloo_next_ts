'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Alert.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  message: string;
  type?: AlertType;
  onClose: () => void;
  duration?: number;
}

export function Alert({ message, type = 'info', onClose, duration = 3000 }: AlertProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Показываем с небольшой задержкой для анимации
    const showTimer = setTimeout(() => setVisible(true), 50);
    
    // Автоматическое закрытие
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
    }, 400); // Ждем завершения анимации
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={24} />;
      case 'error': return <AlertCircle size={24} />;
      case 'warning': return <AlertTriangle size={24} />;
      default: return <Info size={24} />;
    }
  };

  const getTypeClass = () => {
    return `alert-${type}`;
  };

  return (
    <div className={`alert-overlay ${visible ? 'visible' : ''} ${exiting ? 'exiting' : ''}`}>
      <div className={`alert-container ${getTypeClass()}`}>
        {/* Анимация из логотипа - позиционируется сверху */}
        <div className="alert-logo-origin">
          <div className="alert-logo-circle">
            <span className="alert-logo-letter">B</span>
          </div>
        </div>
        
        {/* Основное окно */}
        <div className="alert-content">
          <div className="alert-icon">
            {getIcon()}
          </div>
          
          <div className="alert-message">
            {message}
          </div>
          
          <button className="alert-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        {/* Прогресс бар для автозакрытия */}
        {duration > 0 && (
          <div className="alert-progress">
            <div className="alert-progress-bar" />
          </div>
        )}
      </div>
    </div>
  );
}

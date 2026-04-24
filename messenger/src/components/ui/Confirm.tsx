'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './Alert.css';

export type ConfirmType = 'success' | 'error' | 'warning' | 'info';

export interface ConfirmProps {
  message: string;
  type?: ConfirmType;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Confirm({ 
  message, 
  type = 'warning', 
  onConfirm, 
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена'
}: ConfirmProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  const handleConfirm = () => {
    setExiting(true);
    setTimeout(() => {
      onConfirm();
    }, 400);
  };

  const handleCancel = () => {
    setExiting(true);
    setTimeout(() => {
      onCancel();
    }, 400);
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
      <div className={`alert-container confirm-container ${getTypeClass()}`}>
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
          
          <button className="alert-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>
        
        {/* Кнопки действий */}
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

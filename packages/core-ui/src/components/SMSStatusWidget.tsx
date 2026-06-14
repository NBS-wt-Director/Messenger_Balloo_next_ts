'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, MessageSquare } from 'lucide-react';

export type SMSStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface SMSStatusWidgetProps {
  status: SMSStatus;
  phone: string;
  retryCount?: number;
  onRetry?: () => void;
  className?: string;
}

const statusConfig: Record<SMSStatus, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: '#F59E0B', label: 'Ожидание' },
  sent: { icon: MessageSquare, color: '#0066FF', label: 'Отправлено' },
  delivered: { icon: CheckCircle, color: '#10B981', label: 'Доставлено' },
  failed: { icon: XCircle, color: '#EF4444', label: 'Ошибка' },
};

export function SMSStatusWidget({ 
  status, 
  phone, 
  retryCount = 0,
  onRetry,
  className = '' 
}: SMSStatusWidgetProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const Config = statusConfig[status];
  const Icon = Config.icon;

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`sms-status-widget ${className}`}>
      <div className="sms-status-header">
        <div className="sms-status-icon" style={{ color: Config.color }}>
          <Icon size={24} />
        </div>
        <div className="sms-status-info">
          <div className="sms-status-label">{Config.label}</div>
          <div className="sms-phone">{phone}</div>
        </div>
      </div>

      <div className="sms-status-details">
        {retryCount > 0 && (
          <div className="sms-retry-info">
            Попыток: {retryCount}
          </div>
        )}

        {status === 'failed' && onRetry && (
          <button
            className="sms-retry-button"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            <RefreshCw size={16} className={isRetrying ? 'spinning' : ''} />
            {isRetrying ? 'Отправка...' : 'Повторить'}
          </button>
        )}

        {status === 'pending' && (
          <div className="sms-pending-message">
            Ожидание доставки...
          </div>
        )}

        {status === 'delivered' && (
          <div className="sms-delivered-message">
            SMS код успешно доставлен
          </div>
        )}
      </div>

      {/* Progress indicator for pending status */}
      {status === 'pending' && (
        <div className="sms-progress">
          <div className="sms-progress-bar">
            <div className="sms-progress-fill"></div>
          </div>
        </div>
      )}
    </div>
  );
}

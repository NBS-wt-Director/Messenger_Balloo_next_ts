/**
 * ThemeSubscriptionDialog - Диалог активации подписки
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import './ThemeSubscriptionDialog.css';

interface ThemeSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ThemeSubscriptionDialog: React.FC<ThemeSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { subscription } = useSettingsStore();
  
  const costPerDay = 3;
  const totalCost = days * costPerDay;

  const handleActivate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/themes/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ days })
      });

      const data = await response.json();

      if (data.success) {
        onConfirm();
      } else {
        if (data.error === 'Insufficient balance' && data.data) {
          setError(`Недостаточно средств. Не хватает ${data.data.deficit} баллов.`);
        } else {
          setError(data.error || 'Ошибка активации подписки');
        }
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="subscription-overlay" onClick={onClose}>
      <div className="subscription-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="subscription-header">
          <h2>Подписка на темы</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="subscription-content">
          <div className="price-info">
            <div className="price-per-day">
              <span className="price">{costPerDay}</span>
              <span className="currency">балла/день</span>
            </div>
            <p className="description">
              Доступ ко всем пользовательским темам
            </p>
          </div>

          <div className="days-selector">
            <label>Количество дней:</label>
            <div className="days-input-wrapper">
              <button
                className="days-btn"
                onClick={() => setDays(Math.max(1, days - 1))}
                disabled={days <= 1}
              >
                −
              </button>
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                min="1"
                max="30"
                className="days-input"
              />
              <button
                className="days-btn"
                onClick={() => setDays(Math.min(30, days + 1))}
                disabled={days >= 30}
              >
                +
              </button>
            </div>
          </div>

          <div className="cost-summary">
            <div className="cost-row">
              <span>Стоимость:</span>
              <span className="cost-value">{totalCost} баллов</span>
            </div>
            <div className="cost-row">
              <span>Срок действия:</span>
              <span>{days} дн.</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="actions">
            <button className="btn-cancel" onClick={onClose}>
              Отмена
            </button>
            <button
              className="btn-activate"
              onClick={handleActivate}
              disabled={loading}
            >
              {loading ? 'Обработка...' : 'Активировать подписку'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSubscriptionDialog;

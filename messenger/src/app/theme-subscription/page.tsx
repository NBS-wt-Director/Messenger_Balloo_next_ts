/**
 * Страница управления подпиской на темы
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import './page.css';

const ThemeSubscriptionPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { subscription, setSubscription } = useSettingsStore();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/themes/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSubscription(data.data);
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-page">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <h1>Управление подпиской на темы</h1>

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <div className="subscription-card">
          {subscription.isActive ? (
            <>
              <div className="active-badge">✅ Активна</div>
              <h2>Ваша подписка активна</h2>
              
              <div className="subscription-details">
                <div className="detail-row">
                  <span>Срок действия:</span>
                  <span>
                    {subscription.daysLeft} дн. 
                    ({subscription.expiresAt 
                      ? new Date(subscription.expiresAt).toLocaleDateString() 
                      : '-'
                    })
                  </span>
                </div>
                <div className="detail-row">
                  <span>Доступно тем:</span>
                  <span>Все пользовательские темы</span>
                </div>
              </div>

              <button className="btn-cancel-subscription">
                Отменить подписку
              </button>
            </>
          ) : (
            <>
              <div className="inactive-badge">🔒 Не активна</div>
              <h2>Активируйте подписку</h2>
              <p className="description">
                Получите доступ ко всем пользовательским темам:
                <ul>
                  <li>15 последних использованных тем</li>
                  <li>5 избранных тем</li>
                  <li>Создание собственных тем</li>
                  <li>Полная кастомизация цветов</li>
                </ul>
              </p>

              <div className="price-card">
                <div className="price-label">Стоимость</div>
                <div className="price-value">3 балла/день</div>
                <div className="price-note">
                  Примерно 90 баллов в месяц
                </div>
              </div>

              <button className="btn-activate-subscription">
                Активировать подписку
              </button>

              <button className="btn-recharge">
                Пополнить баланс
              </button>
            </>
          )}
        </div>

        <div className="features">
          <h3>Что даёт подписка</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <div className="feature-text">
                <strong>Пользовательские темы</strong>
                <p>Создавайте свои уникальные темы</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⭐</div>
              <div className="feature-text">
                <strong>Избранное</strong>
                <p>Сохраняйте до 5 любимых тем</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">
                <strong>История</strong>
                <p>Доступ к 15 последним темам</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔧</div>
              <div className="feature-text">
                <strong>Кастомизация</strong>
                <p>Полная настройка цветов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSubscriptionPage;

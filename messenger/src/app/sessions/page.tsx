'use client';

import { FC, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAlert } from '@/hooks/useAlert';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { Smartphone, Monitor, Tablet, Check, LogOut, Trash2, Shield } from 'lucide-react';
import { authApi } from '@/api/client';
import './SessionsPage.css';

interface Session {
  id: string;
  platform: string;
  deviceId?: string;
  lastActive: number;
  expiresAt: number;
  isCurrent: boolean;
}

export default function SessionsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadSessions();
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getSessions();
      
      if (response.success && response.data) {
        setSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error('[Sessions] Error:', error);
      alert({ message: 'Ошибка загрузки сессий', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const response = await authApi.terminateSession(sessionId);
      
      if (response.success) {
        alert({ message: 'Сессия завершена', type: 'success' });
        loadSessions();
      } else {
        alert({ message: 'Не удалось завершить сессию', type: 'error' });
      }
    } catch (error) {
      console.error('[Terminate Session] Error:', error);
      alert({ message: 'Ошибка при завершении сессии', type: 'error' });
    }
  };

  const handleTerminateAllSessions = async () => {
    const confirmed = confirm('Вы уверены, что хотите выйти из всех устройств? Текущая сессия также будет завершена.');
    if (!confirmed) return;

    try {
      const response = await authApi.terminateAllSessions();
      
      if (response.success) {
        alert({ 
          message: 'Все сессии завершены. Вам потребуется войти снова.', 
          type: 'success' 
        });
        setSessions([]);
        // Перезагрузка страницы или редирект на логин
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert({ message: 'Не удалось завершить все сессии', type: 'error' });
      }
    } catch (error) {
      console.error('[Terminate All Sessions] Error:', error);
      alert({ message: 'Ошибка при завершении всех сессий', type: 'error' });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'web':
        return <Monitor size={20} />;
      case 'mobile':
      case 'android':
      case 'ios':
        return <Smartphone size={20} />;
      case 'desktop':
        return <Monitor size={20} />;
      case 'tablet':
        return <Tablet size={20} />;
      default:
        return <Smartphone size={20} />;
    }
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      web: 'Web',
      mobile: 'Mobile',
      desktop: 'Desktop',
      android: 'Android',
      ios: 'iOS',
      tablet: 'Tablet',
    };
    return names[platform.toLowerCase()] || platform;
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    return `${days} дн. назад`;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="sessions-page">
        <div className="sessions-empty">
          <Shield size={48} />
          <h2>Требуется авторизация</h2>
          <p>Войдите в аккаунт для управления сессиями</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>Активные сессии</h1>
        <p className="sessions-description">
          Управляйте устройствами, на которых выполнен вход в ваш аккаунт
        </p>
      </div>

      {isLoading ? (
        <div className="sessions-loading">
          <div className="spinner" />
          <p>Загрузка сессий...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="sessions-empty">
          <Shield size={48} />
          <h2>Нет активных сессий</h2>
          <p>Ваш аккаунт не активен на других устройствах</p>
        </div>
      ) : (
        <>
          <div className="sessions-list">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className={`session-card ${session.isCurrent ? 'current' : ''}`}
              >
                <div className="session-icon">
                  {getPlatformIcon(session.platform)}
                </div>
                
                <div className="session-info">
                  <div className="session-header">
                    <h3>{getPlatformName(session.platform)}</h3>
                    {session.isCurrent && (
                      <span className="current-badge">
                        <Check size={14} />
                        Текущее
                      </span>
                    )}
                  </div>
                  
                  <div className="session-details">
                    <span className="session-detail">
                      Активность: {formatLastActive(session.lastActive)}
                    </span>
                    {session.deviceId && (
                      <span className="session-detail">
                        Устройство: {session.deviceId}
                      </span>
                    )}
                    <span className="session-detail">
                      Истекает: {new Date(session.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button 
                    className="session-logout-btn"
                    onClick={() => handleTerminateSession(session.id)}
                    title="Завершить сессию"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="sessions-actions">
            <button 
              className="terminate-all-btn"
              onClick={handleTerminateAllSessions}
            >
              <Trash2 size={18} />
              Выйти из всех устройств
            </button>
          </div>
        </>
      )}

      {AlertComponent}
    </div>
  );
}

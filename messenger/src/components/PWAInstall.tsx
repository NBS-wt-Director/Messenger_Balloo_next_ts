'use client';

import { useState, useEffect } from 'react';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { Download, Bell, X, Check } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';
import './PWAInstall.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstall() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();
  
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [checkNotifications, setCheckNotifications] = useState(true);
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  // Проверка разрешений на уведомления каждые 5 минут
  useEffect(() => {
    if (!checkNotifications) return;

    const checkInterval = setInterval(() => {
      if ('Notification' in window) {
        const currentPermission = Notification.permission;
        if (currentPermission === 'granted') {
          setNotificationsEnabled(true);
        } else if (currentPermission === 'default' && Date.now() - lastCheck > 5 * 60 * 1000) {
          setShowNotificationPrompt(true);
          setLastCheck(Date.now());
        }
      }
    }, 5 * 60 * 1000); // 5 минут

    // Первичная проверка при загрузке
    if ('Notification' in window) {
      const initialPermission = Notification.permission;
      if (initialPermission === 'granted') {
        setNotificationsEnabled(true);
      } else if (initialPermission === 'default') {
        // Первый запрос через 30 секунд после загрузки
        const initialTimeout = setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 30000);
        return () => clearTimeout(initialTimeout);
      }
    }

    return () => clearInterval(checkInterval);
  }, [checkNotifications, lastCheck]);

  useEffect(() => {
    // Проверяем, установлено ли уже приложение
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Проверяем, отклонено ли приглашение установки
    const installDismissed = localStorage.getItem('pwa-install-dismissed');
    if (installDismissed) {
      setDismissed(true);
    }

    // Проверяем разрешение на уведомления
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Проверяем настройки пользователя о проверке уведомлений
    const notificationsCheckSetting = localStorage.getItem('pwa-notifications-check');
    if (notificationsCheckSetting === 'false') {
      setCheckNotifications(false);
    }

    // Обработчик события установки PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      alert({ message: 'Ваш браузер не поддерживает уведомления', type: 'warning' });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      setShowNotificationPrompt(false);
      
      // Показываем тестовое уведомление
      new Notification(translations.appName, {
        body: 'Уведомления включены!',
        icon: '/icon-192.png',
      });
    }
  };

  const handleDisableCheck = () => {
    setCheckNotifications(false);
    localStorage.setItem('pwa-notifications-check', 'false');
    setShowNotificationPrompt(false);
  };

  // Не показывать, если приложение уже установлено и уведомления включены
  if (isInstalled && notificationsEnabled) {
    return null;
  }

  return (
    <div className="pwa-install">
      {AlertComponent}
      {/* Кнопка установки приложения */}
      {deferredPrompt && !isInstalled && !dismissed && (
        <div className="pwa-install-card">
          <div className="pwa-install-icon">
            <Download size={24} />
          </div>
          <div className="pwa-install-content">
            <p className="pwa-install-title">{translations.installApp || 'Установить приложение'}</p>
            <p className="pwa-install-desc">
              {translations.installAppDesc || 'Добавьте на главный экран для удобного доступа'}
            </p>
          </div>
          <div className="pwa-install-actions">
            <button className="pwa-install-btn" onClick={handleInstall}>
              <Download size={18} />
              <span>{translations.install || 'Установить'}</span>
            </button>
            <button className="pwa-dismiss-btn" onClick={handleDismiss}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Запрос на включение уведомлений */}
      {showNotificationPrompt && (
        <div className="pwa-notification-card">
          <div className="pwa-notification-icon">
            <Bell size={24} />
          </div>
          <div className="pwa-notification-content">
            <p className="pwa-notification-title">{translations.enableNotifications || 'Включить уведомления'}</p>
            <p className="pwa-notification-desc">
              {translations.notificationsDesc || 'Получайте сообщения даже когда приложение закрыто'}
            </p>
          </div>
          <div className="pwa-notification-actions">
            <button className="pwa-notification-btn" onClick={handleEnableNotifications}>
              <Bell size={18} />
              <span>{translations.enable || 'Включить'}</span>
            </button>
            <button className="pwa-notification-dismiss" onClick={handleDisableCheck}>
              {translations.later || 'Напомнить позже'}
            </button>
          </div>
        </div>
      )}

      {/* Кнопка включения уведомлений после установки */}
      {isInstalled && !notificationsEnabled && !showNotificationPrompt && (
        <div className="pwa-notification-card">
          <div className="pwa-notification-icon">
            <Bell size={24} />
          </div>
          <div className="pwa-notification-content">
            <p className="pwa-notification-title">{translations.enableNotifications || 'Включить уведомления'}</p>
            <p className="pwa-notification-desc">
              {translations.notificationsDesc || 'Получайте сообщения даже когда приложение закрыто'}
            </p>
          </div>
          <button className="pwa-notification-btn" onClick={handleEnableNotifications}>
            <Bell size={18} />
            <span>{translations.enable || 'Включить'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Хук для работы с уведомлениями
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return { success: false, error: 'Notifications not supported' };
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted') {
      // Здесь можно получить токен для пуш-уведомлений
      // Для Firebase Cloud Messaging это будет отдельная логика
      const notificationToken = await getNotificationToken();
      setToken(notificationToken);
    }

    return { success: result === 'granted', error: result === 'granted' ? null : result };
  };

  const getNotificationToken = async (): Promise<string | null> => {
    // Используем новую систему уведомлений
    const { NotificationManager } = await import('@/lib/notifications');
    const manager = NotificationManager.getInstance();
    
    try {
      const subscription = await manager.getActiveSubscription();
      if (subscription) {
        return JSON.stringify(subscription);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error getting notification token:', error);
      }
    }
    
    return null;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, options);
    }
  };

  return {
    permission,
    token,
    isEnabled: permission === 'granted',
    requestPermission,
    showNotification,
  };
}

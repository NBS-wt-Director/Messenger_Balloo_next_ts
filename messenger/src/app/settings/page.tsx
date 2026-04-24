'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations, Language } from '@/i18n';
import { 
  ArrowLeft, Globe, Moon, Sun, Flag, Bell, Shield, HardDrive, 
  User, MessageCircle, Download, Check, X, Smartphone, BellRing, 
  BellOff, TestTube
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import './settings.css';

interface PWAStatus {
  isInstalled: boolean;
  isInstallable: boolean;
  deferredPrompt: any;
}

interface NotificationSettings {
  enabled: boolean;
  permission: 'granted' | 'denied' | 'default';
  sound: boolean;
  vibrate: boolean;
  desktop: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useSettingsStore();
  const translations = getTranslations(language);

  // PWA State
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isInstallable: false,
    deferredPrompt: null,
  });

  // Push Notifications Hook
  const {
    isSupported,
    isSubscribed,
    permission,
    loading: pushLoading,
    error: pushError,
    subscribe,
    unsubscribe,
    requestPermission,
    checkSubscription,
    sendTestNotification,
  } = usePushNotifications();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
    
    // Check PWA status
    checkPWAStatus();
    
    // Check notification subscription
    if (user?.id) {
      checkSubscription(user.id);
    }
  }, [isAuthenticated, router, user?.id]);

  const checkPWAStatus = () => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const isInstallable = !!pwaStatus.deferredPrompt;
    setPwaStatus({ ...pwaStatus, isInstalled, isInstallable });
  };

  const handleInstallPWA = () => {
    if (pwaStatus.deferredPrompt) {
      pwaStatus.deferredPrompt.prompt();
      pwaStatus.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setPwaStatus({ ...pwaStatus, isInstalled: true, isInstallable: false, deferredPrompt: null });
        }
      });
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaStatus({ ...pwaStatus, deferredPrompt: e, isInstallable: true });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setPwaStatus({ isInstalled: true, isInstallable: false, deferredPrompt: null });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const toggleNotifications = async () => {
    if (!user?.id) return;

    if (isSubscribed) {
      // Отписка
      await unsubscribe(user.id);
    } else {
      // Подписка
      await subscribe(user.id);
    }
  };

  const handleRequestPermission = async () => {
    await requestPermission();
    if (user?.id) {
      checkSubscription(user.id);
    }
  };

  const handleSendTest = async () => {
    if (!user?.id) return;
    await sendTestNotification(user.id);
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
    { code: 'tt', name: 'Татарча' },
  ];

  // Наглядный список тем с описанием
  const themeOptions = [
    { 
      value: 'dark', 
      label: translations.darkTheme, 
      description: 'Тёмная тема для комфортного использования ночью',
      preview: { bg: '#000000', text: '#ffffff', accent: '#3b82f6' },
      icon: Moon
    },
    { 
      value: 'light', 
      label: translations.lightTheme, 
      description: 'Светлая тема для дневного использования',
      preview: { bg: '#ffffff', text: '#000000', accent: '#2563eb' },
      icon: Sun
    },
    { 
      value: 'russia', 
      label: translations.russiaTheme || 'Наша', 
      description: translations.russiaThemeDesc || 'Патриотическая тема с флагом России',
      preview: { bg: 'linear-gradient(180deg, #ffffff 0%, #ffffff 34%, #0039a6 34%, #0039a6 66%, #d52b1e 66%, #d52b1e 100%)', text: '#0039a6', accent: 'linear-gradient(135deg, #71797E 0%, #c0c0c0 25%, #FFD700 50%, #e5e4e2 75%, #c0c0c0 100%)' },
      icon: Flag
    },
  ];

  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button className="settings-back" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="settings-title">{translations.settings}</h1>
      </header>

      <main className="settings-main">
        {/* Профиль */}
        <section className="settings-section">
          <div className="settings-section-header">
            <User size={20} />
            <h2>{translations.profile}</h2>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">{translations.displayName}</span>
              <span className="settings-value">{user.displayName}</span>
            </div>
            {user.fullName && (
              <div className="settings-row">
                <span className="settings-label">{translations.fullName}</span>
                <span className="settings-value">{user.fullName}</span>
              </div>
            )}
            <div className="settings-row">
              <span className="settings-label">{translations.email}</span>
              <span className="settings-value">{user.email}</span>
            </div>
          </div>
          <button 
            className="settings-edit-btn"
            onClick={() => router.push('/profile')}
          >
            {translations.editProfile}
          </button>
        </section>

        {/* Язык */}
        <section className="settings-section">
          <div className="settings-section-header">
            <Globe size={20} />
            <h2>{translations.language}</h2>
          </div>
          <div className="settings-card">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="settings-select"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Тема */}
        <section className="settings-section">
          <div className="settings-section-header">
            {(() => {
              const ThemeIconComponent = themeOptions.find(t => t.value === theme)?.icon || Moon;
              return <ThemeIconComponent size={20} />;
            })()}
            <h2>{translations.theme}</h2>
          </div>
          <div className="settings-card">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="settings-select"
            >
              {themeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            
            {/* Наглядное предпросмотр темы */}
            <div className="settings-theme-preview">
              <div 
                className="settings-theme-preview-card"
                style={{ 
                  background: themeOptions.find(t => t.value === theme)?.preview.bg || '#000000',
                  color: themeOptions.find(t => t.value === theme)?.preview.text || '#ffffff'
                }}
              >
                <div 
                  className="settings-theme-preview-element"
                  style={{ 
                    background: themeOptions.find(t => t.value === theme)?.preview.accent || '#3b82f6',
                    border: '2px solid currentColor'
                  }}
                />
                <div 
                  className="settings-theme-preview-element"
                  style={{ 
                    background: themeOptions.find(t => t.value === theme)?.preview.accent || '#3b82f6',
                    opacity: 0.7
                  }}
                />
              </div>
              <p className="settings-theme-preview-desc">
                {themeOptions.find(t => t.value === theme)?.description}
              </p>
            </div>
          </div>
        </section>

        {/* Уведомления */}
        <section className="settings-section">
          <div className="settings-section-header">
            {isSubscribed ? <BellRing size={20} /> : <BellOff size={20} />}
            <h2>{translations.notifications}</h2>
          </div>
          <div className="settings-card">
            {/* Поддержка Push API */}
            {!isSupported && (
              <div className="settings-alert settings-alert-warning">
                <X size={16} />
                <div>
                  <strong>Push API не поддерживается</strong>
                  <p className="settings-alert-desc">
                    Ваш браузер не поддерживает push-уведомления. Попробуйте Chrome, Firefox или Edge.
                  </p>
                </div>
              </div>
            )}

            {/* Ошибка */}
            {pushError && (
              <div className="settings-alert settings-alert-error">
                <X size={16} />
                <div>
                  <strong>Ошибка</strong>
                  <p className="settings-alert-desc">{pushError}</p>
                </div>
              </div>
            )}

            {/* Главный переключатель */}
            <div className="settings-row-toggle">
              <div className="settings-toggle-info">
                <span className="settings-label">Push-уведомления</span>
                <span className="settings-desc">
                  {isSubscribed 
                    ? 'Подписка активна' 
                    : permission === 'denied'
                    ? 'Уведомления запрещены'
                    : permission === 'granted'
                    ? 'Разрешены, но не подписаны'
                    : 'Подпишитесь для получения уведомлений'}
                </span>
              </div>
              <button 
                className={`settings-toggle-btn ${isSubscribed ? 'active' : ''}`}
                onClick={toggleNotifications}
                disabled={!isSupported || pushLoading}
              >
                <span className={`toggle-switch ${isSubscribed ? 'checked' : ''}`} />
              </button>
            </div>

            {/* Статус разрешения */}
            <div className="settings-notification-status">
              <div className="status-indicator">
                {permission === 'granted' ? (
                  <>
                    <Check size={16} className="status-success" />
                    <span>Разрешены</span>
                  </>
                ) : permission === 'denied' ? (
                  <>
                    <X size={16} className="status-error" />
                    <span>Запрещены</span>
                  </>
                ) : (
                  <>
                    <Bell size={16} className="status-warning" />
                    <span>Не запрошены</span>
                  </>
                )}
              </div>
              {permission !== 'granted' && isSupported && (
                <button 
                  className="settings-btn-small"
                  onClick={handleRequestPermission}
                >
                  Разрешить
                </button>
              )}
            </div>

            {/* Кнопка тестового уведомления */}
            {isSubscribed && (
              <div className="settings-test-notification">
                <button 
                  className="settings-btn-test"
                  onClick={handleSendTest}
                >
                  <TestTube size={16} />
                  Тестовое уведомление
                </button>
              </div>
            )}

            {/* Информация */}
            <div className="settings-notification-info">
              <p className="settings-info-text">
                {isSubscribed 
                  ? '✅ Вы будете получать уведомления о новых сообщениях'
                  : permission === 'denied'
                  ? '❌ Разрешите уведомления в настройках браузера'
                  : '🔔 Подпишитесь, чтобы получать уведомления о новых сообщениях'}
              </p>
            </div>
          </div>
        </section>

        {/* PWA Установка */}
        <section className="settings-section">
          <div className="settings-section-header">
            <Smartphone size={20} />
            <h2>Приложение</h2>
          </div>
          <div className="settings-card">
            {/* Статус установки */}
            <div className="settings-pwa-status">
              {pwaStatus.isInstalled ? (
                <div className="pwa-status-item">
                  <Check size={20} className="status-success" />
                  <div>
                    <span className="settings-label">Приложение установлено</span>
                    <span className="settings-desc">Balloo Messenger работает как нативное приложение</span>
                  </div>
                </div>
              ) : pwaStatus.isInstallable ? (
                <div className="pwa-status-item">
                  <Download size={20} className="status-info" />
                  <div>
                    <span className="settings-label">Доступна установка</span>
                    <span className="settings-desc">Установите Balloo Messenger для быстрого доступа</span>
                  </div>
                  <button 
                    className="settings-btn-primary"
                    onClick={handleInstallPWA}
                  >
                    <Download size={16} />
                    Установить
                  </button>
                </div>
              ) : (
                <div className="pwa-status-item">
                  <Smartphone size={20} className="status-warning" />
                  <div>
                    <span className="settings-label">PWA доступно</span>
                    <span className="settings-desc">
                      {pwaStatus.isInstalled 
                        ? 'Приложение уже установлено'
                        : 'Установка невозможна в текущем браузере'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Информация о PWA */}
            <div className="settings-pwa-info">
              <h3>Преимущества приложения:</h3>
              <ul className="pwa-features">
                <li>⚡ Быстрый запуск</li>
                <li>📱 Работает офлайн</li>
                <li>🔔 Push-уведомления</li>
                <li>💾 Меньше расход памяти</li>
                <li>🔄 Автообновление</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Яндекс.Диск */}
        <section className="settings-section">
          <div className="settings-section-header">
            <HardDrive size={20} />
            <h2>{translations.connectYandexDisk}</h2>
          </div>
          <div className="settings-card">
            <button className="settings-btn">
              {translations.connectYandexDisk}
            </button>
          </div>
        </section>

        {/* О приложении */}
        <section className="settings-section">
          <div className="settings-section-header">
            <MessageCircle size={20} />
            <h2>{translations.appName}</h2>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Версия</span>
              <span className="settings-value">1.0.0</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
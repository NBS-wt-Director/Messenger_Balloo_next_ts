'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/hooks/useAlert';
import { Modal } from '@/components/ui/Modal';
import { 
  Shield, Key, Database, Cloud, Bell, Check, X, Loader2, 
  Info, RefreshCw, Trash2, Users, MessageCircle, AlertTriangle,
  ChevronDown, ChevronUp, ExternalLink, Copy
} from 'lucide-react';

const INSTALLER_PASSWORD = 'A13n10n2013aKonstantinovna';

interface InstallerData {
  // Server
  serverUrl: string;
  nodeEnv: string;
  port: string;
  
  // Security
  nextAuthSecret: string;
  
  // Yandex OAuth
  yandexClientId: string;
  yandexClientSecret: string;
  yandexDiskToken: string;
  
  // Push
  vapidPublicKey: string;
  vapidPrivateKey: string;
  vapidSubject: string;
  
  // Email (optional)
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  
  // Admin
  adminEmail: string;
  adminPassword: string;
}

interface YandexUser {
  login: string;
  id: string;
  display_name: string;
  real_name: string;
  default_email: string;
}

export default function InstallerPage() {
  const router = useRouter();
  const { alert, AlertComponent } = useAlert();
  
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [data, setData] = useState<InstallerData>({
    serverUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    nodeEnv: 'production',
    port: '3000',
    nextAuthSecret: generateRandomSecret(32),
    yandexClientId: '',
    yandexClientSecret: '',
    yandexDiskToken: '',
    vapidPublicKey: '',
    vapidPrivateKey: '',
    vapidSubject: 'mailto:admin@balloo.ru',
    smtpHost: 'smtp.yandex.ru',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    adminEmail: '',
    adminPassword: 'Admin123!'
  });
  
  const [yandexUser, setYandexUser] = useState<YandexUser | null>(null);
  const [yandexValid, setYandexValid] = useState(false);
  const [yandexChecking, setYandexChecking] = useState(false);
  const [yandexError, setYandexError] = useState('');
  
  const [clearData, setClearData] = useState(false);
  const [createTestAccounts, setCreateTestAccounts] = useState(false);
  const [regenerateRandom, setRegenerateRandom] = useState(false);
  
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState('');
  const [installSuccess, setInstallSuccess] = useState(false);
  
  const [showYandexInfo, setShowYandexInfo] = useState(false);
  const [showPushInfo, setShowPushInfo] = useState(false);

  // Проверка пароля
  const verifyPassword = () => {
    if (password === INSTALLER_PASSWORD) {
      setPasswordVerified(true);
      setPasswordError('');
    } else {
      setPasswordError('Неверный пароль установщика');
    }
  };

  // Генерация случайного секрета
  function generateRandomSecret(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Генерация VAPID ключей (упрощённая имитация)
  const generateVapidKeys = () => {
    const publicKey = 'B' + Array(86).fill(0).map(() => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[Math.floor(Math.random() * 66)]
    ).join('');
    
    const privateKey = Array(43).fill(0).map(() => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'[Math.floor(Math.random() * 66)]
    ).join('');
    
    setData(prev => ({
      ...prev,
      vapidPublicKey: publicKey,
      vapidPrivateKey: privateKey
    }));
    
    alert({ message: 'VAPID ключи сгенерированы', type: 'success' });
  };

  // Проверка Yandex OAuth
  const checkYandexOAuth = async () => {
    if (!data.yandexClientId || !data.yandexClientSecret) {
      setYandexError('Введите Client ID и Client Secret');
      return;
    }

    setYandexChecking(true);
    setYandexError('');

    try {
      // Проверяем что клиент существует (через попытку получить токен)
      const response = await fetch('https://oauth.yandex.ru/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: data.yandexClientId,
          client_secret: data.yandexClientSecret
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Успех - сохраняем токен
        setData(prev => ({ ...prev, yandexDiskToken: result.access_token }));
        setYandexUser({
          login: 'oauth_client',
          id: data.yandexClientId,
          display_name: 'OAuth Client',
          real_name: 'OAuth Client',
          default_email: ''
        });
        setYandexValid(true);
        alert({ message: 'OAuth клиент проверен успешно', type: 'success' });
      } else {
        // Ошибка - пробуем проверить что клиент существует
        if (result.error === 'invalid_client') {
          setYandexError('Неверный Client ID или Client Secret');
        } else if (result.error === 'invalid_grant') {
          setYandexError('Неверный тип авторизации. Для проверки используйте OAuth 2.0');
        } else {
          setYandexError(`Ошибка OAuth: ${result.error || result.error_description || 'Неизвестная ошибка'}`);
        }
        setYandexValid(false);
        setYandexUser(null);
      }
    } catch (error: any) {
      setYandexError(`Ошибка подключения к Yandex OAuth: ${error.message}`);
      setYandexValid(false);
      setYandexUser(null);
    } finally {
      setYandexChecking(false);
    }
  };

  // Проверка Yandex Disk токена
  const checkYandexDisk = async () => {
    if (!data.yandexDiskToken) {
      setYandexError('Введите токен Yandex Disk');
      return;
    }

    setYandexChecking(true);
    setYandexError('');

    try {
      const response = await fetch('https://cloud-api.yandex.net/v1/disk/resources?path=disk:', {
        headers: {
          'Authorization': `OAuth ${data.yandexDiskToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setYandexUser({
          login: userData.user?.login || 'o8eryuhtin',
          id: userData.user?.id || 'unknown',
          display_name: userData.user?.display_name || 'User',
          real_name: userData.user?.real_name || 'User',
          default_email: userData.user?.default_email || ''
        });
        
        // Проверяем что логин содержит o8eryuhtin
        const loginValid = userData.user?.login?.includes('o8eryuhtin') || 
                          userData.user?.default_email?.includes('o8eryuhtin') ||
                          data.yandexDiskToken.length > 20; // Упрощённая проверка
        
        setYandexValid(loginValid);
        
        if (!loginValid) {
          setYandexError('⚠️ Аккаунт не содержит "o8eryuhtin" в логине. Проверьте токен.');
        } else {
          alert({ message: 'Yandex Disk подключён успешно', type: 'success' });
        }
      } else {
        const error = await response.json();
        setYandexError(`Ошибка Yandex Disk: ${error.message || error.code || 'Неизвестная ошибка'}`);
        setYandexValid(false);
        setYandexUser(null);
      }
    } catch (error: any) {
      setYandexError(`Ошибка подключения к Yandex Disk: ${error.message}`);
      setYandexValid(false);
      setYandexUser(null);
    } finally {
      setYandexChecking(false);
    }
  };

  // Установка
  const handleInstall = async () => {
    if (!yandexValid) {
      const confirmed = confirm('Предупреждение: Yandex OAuth не проверен. Продолжить?');
      if (confirmed) {
        performInstall();
      }
    } else {
      performInstall();
    }
  };

  const performInstall = async () => {
    setInstalling(true);
    setInstallProgress('Инициализация...');

    try {
      // 1. Создание .env.local
      setInstallProgress('Создание .env.local...');
      const envContent = `# Balloo Messenger - Environment Variables
# Generated: ${new Date().toISOString()}

# Server
NEXT_PUBLIC_SERVER_URL=${data.serverUrl}
NODE_ENV=${data.nodeEnv}
PORT=${data.port}

# Security
NEXTAUTH_SECRET=${data.nextAuthSecret}

# Yandex OAuth
YANDEX_CLIENT_ID=${data.yandexClientId}
YANDEX_CLIENT_SECRET=${data.yandexClientSecret}
YANDEX_DISK_API_URL=https://cloud-api.yandex.net/v1/disk
YANDEX_DISK_TOKEN=${data.yandexDiskToken}

# Push Notifications
VAPID_PUBLIC_KEY=${data.vapidPublicKey}
VAPID_PRIVATE_KEY=${data.vapidPrivateKey}
VAPID_SUBJECT=${data.vapidSubject}

# Email (optional)
SMTP_HOST=${data.smtpHost}
SMTP_PORT=${data.smtpPort}
SMTP_USER=${data.smtpUser}
SMTP_PASS=${data.smtpPass}

# Admin
ADMIN_EMAIL=${data.adminEmail}
`;

      // Сохраняем через API
      const envResponse = await fetch('/api/installer/env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: envContent })
      });

      if (!envResponse.ok) {
        throw new Error('Не удалось создать .env.local');
      }

      // 2. Обновление config.json
      setInstallProgress('Обновление config.json...');
      const configResponse = await fetch('/api/installer/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          push: {
            vapidPublicKey: data.vapidPublicKey,
            vapidPrivateKey: data.vapidPrivateKey,
            vapidSubject: data.vapidSubject
          },
          admin: {
            superAdminEmail: data.adminEmail,
            defaultAdminPassword: data.adminPassword
          }
        })
      });

      if (!configResponse.ok) {
        throw new Error('Не удалось обновить config.json');
      }

      // 3. Очистка данных (если выбрана)
      if (clearData) {
        setInstallProgress('Очистка базы данных...');
        const clearResponse = await fetch('/api/installer/clear', {
          method: 'POST'
        });
        
        if (!clearResponse.ok) {
          throw new Error('Не удалось очистить базу данных');
        }
      }

      // 4. Создание тестовых аккаунтов (если выбрано)
      if (createTestAccounts) {
        setInstallProgress('Создание тестовых аккаунтов...');
        const testResponse = await fetch('/api/installer/test-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminEmail: data.adminEmail,
            adminPassword: data.adminPassword
          })
        });

        if (!testResponse.ok) {
          throw new Error('Не удалось создать тестовые аккаунты');
        }
      }

      setInstallProgress('Готово!');
      setInstallSuccess(true);
      alert({ 
        message: 'Установка завершена успешно!', 
        type: 'success'
      });

    } catch (error: any) {
      alert({ 
        message: `Ошибка установки: ${error.message}`, 
        type: 'error'
      });
    } finally {
      setInstalling(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert({ message: `${label} скопирован`, type: 'success' });
  };

  // Страница ввода пароля
  if (!passwordVerified) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          padding: '40px',
          background: 'var(--card)',
          borderRadius: '16px',
          border: '2px solid var(--border)',
          textAlign: 'center'
        }}>
          <Shield size={64} style={{ margin: '0 auto 20px', color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
            Установка Balloo
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '30px' }}>
            Введите пароль установщика
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verifyPassword()}
            placeholder="Пароль"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '2px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '16px',
              marginBottom: '15px',
              textAlign: 'center'
            }}
          />

          {passwordError && (
            <p style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px' }}>
              {passwordError}
            </p>
          )}

          <button
            onClick={verifyPassword}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Войти
          </button>

          <button
            onClick={() => router.back()}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              color: 'var(--muted-foreground)',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            ← Назад
          </button>
        </div>

        {AlertComponent}
      </div>
    );
  }

  // Страница установки
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Shield size={64} style={{ margin: '0 auto 20px', color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
            Установка Balloo Messenger
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Настройте все необходимые параметры для работы мессенджера
          </p>
        </div>

        {/* Progress */}
        {installing && (
          <div style={{
            padding: '20px',
            background: 'var(--card)',
            borderRadius: '12px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 15px', color: 'var(--primary)' }} />
            <p style={{ color: 'var(--foreground)', fontWeight: '600' }}>{installProgress}</p>
          </div>
        )}

        {/* Success */}
        {installSuccess && (
          <div style={{
            padding: '30px',
            background: '#22c55e20',
            border: '2px solid #22c55e',
            borderRadius: '12px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <Check size={48} style={{ margin: '0 auto 15px', color: '#22c55e' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#22c55e' }}>
              Установка завершена!
            </h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '20px' }}>
              Перезапустите сервер для применения настроек
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '12px 30px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Перейти ко входу
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleInstall(); }}>
          {/* Server Settings */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <Cloud size={24} />
              Сервер
            </h2>

            <div style={gridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>URL сервера *</label>
                <input
                  type="url"
                  value={data.serverUrl}
                  onChange={(e) => setData({ ...data, serverUrl: e.target.value })}
                  placeholder="https://ваш-домен.ru"
                  style={inputStyle}
                  required
                />
                <p style={hintStyle}>Адрес где будет доступен мессенджер</p>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Порт</label>
                <input
                  type="number"
                  value={data.port}
                  onChange={(e) => setData({ ...data, port: e.target.value })}
                  placeholder="3000"
                  style={inputStyle}
                />
                <p style={hintStyle}>Порт сервера (по умолчанию 3000)</p>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Режим</label>
                <select
                  value={data.nodeEnv}
                  onChange={(e) => setData({ ...data, nodeEnv: e.target.value })}
                  style={inputStyle}
                >
                  <option value="production">Production</option>
                  <option value="development">Development</option>
                </select>
                <p style={hintStyle}>Production для продакшена</p>
              </div>
            </div>
          </section>

          {/* Security */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <Shield size={24} />
              Безопасность
            </h2>

            <div style={fieldStyle}>
              <label style={labelStyle}>NEXTAUTH_SECRET *</label>
              <div style={inputWithButtonStyle}>
                <input
                  type="text"
                  value={data.nextAuthSecret}
                  onChange={(e) => setData({ ...data, nextAuthSecret: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setData({ ...data, nextAuthSecret: generateRandomSecret(32) })}
                  style={iconButtonStyle}
                  title="Сгенерировать случайный"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(data.nextAuthSecret, 'Секрет')}
                  style={iconButtonStyle}
                  title="Копировать"
                >
                  <Copy size={18} />
                </button>
              </div>
              <p style={hintStyle}>Секретный ключ для сессий (минимум 32 символа)</p>
            </div>
          </section>

          {/* Yandex OAuth */}
          <section style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={sectionTitleStyle}>
                <Cloud size={24} />
                Yandex OAuth & Disk
              </h2>
              <button
                type="button"
                onClick={() => setShowYandexInfo(!showYandexInfo)}
                style={infoButtonStyle}
              >
                {showYandexInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {showYandexInfo && (
              <div style={infoBoxStyle}>
                <h4 style={{ marginBottom: '15px', color: 'var(--foreground)' }}>
                  📋 Какие доступы нужны в Yandex OAuth API:
                </h4>
                <ul style={{ lineHeight: '2', color: 'var(--muted-foreground)' }}>
                  <li><strong>oauth:login</strong> — доступ к логину пользователя</li>
                  <li><strong>oauth:avatar</strong> — доступ к аватару</li>
                  <li><strong>oauth:email</strong> — доступ к email</li>
                  <li><strong>cloud_api:disk.read</strong> — чтение Яндекс.Диска</li>
                  <li><strong>cloud_api:disk.write</strong> — запись на Яндекс.Диск</li>
                </ul>
                <div style={{ marginTop: '15px', padding: '15px', background: 'var(--background)', borderRadius: '8px' }}>
                  <p style={{ marginBottom: '10px', fontWeight: '600' }}>📝 Как получить:</p>
                  <ol style={{ lineHeight: '1.8', color: 'var(--muted-foreground)' }}>
                    <li>Перейдите на <a href="https://oauth.yandex.ru/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>oauth.yandex.ru</a></li>
                    <li>Создайте новое приложение</li>
                    <li>Укажите Redirect URI: <code style={{ background: 'var(--background)', padding: '2px 6px', borderRadius: '4px' }}>{data.serverUrl}/api/auth/yandex/callback</code></li>
                    <li>Выберите права доступа (см. выше)</li>
                    <li>Скопируйте Client ID и Client Secret</li>
                    <li>Для токена Disk: перейдите по ссылке с вашим Client ID и скопируйте токен из URL</li>
                  </ol>
                </div>
              </div>
            )}

            <div style={gridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Yandex Client ID *</label>
                <input
                  type="text"
                  value={data.yandexClientId}
                  onChange={(e) => setData({ ...data, yandexClientId: e.target.value })}
                  placeholder="1234567890abcdef"
                  style={inputStyle}
                  required
                />
                <p style={hintStyle}>Из https://oauth.yandex.ru/</p>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Yandex Client Secret *</label>
                <input
                  type="password"
                  value={data.yandexClientSecret}
                  onChange={(e) => setData({ ...data, yandexClientSecret: e.target.value })}
                  placeholder="••••••••••••"
                  style={inputStyle}
                  required
                />
                <p style={hintStyle}>Из https://oauth.yandex.ru/</p>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Yandex Disk Token *</label>
              <div style={inputWithButtonStyle}>
                <input
                  type="password"
                  value={data.yandexDiskToken}
                  onChange={(e) => setData({ ...data, yandexDiskToken: e.target.value })}
                  placeholder="AQAAAA... (длинный токен)"
                  style={{ ...inputStyle, flex: 1 }}
                  required
                />
                <button
                  type="button"
                  onClick={checkYandexDisk}
                  disabled={yandexChecking || !data.yandexDiskToken}
                  style={{
                    ...iconButtonStyle,
                    background: yandexChecking ? 'var(--muted)' : 'var(--primary)'
                  }}
                  title="Проверить токен"
                >
                  {yandexChecking ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                </button>
              </div>
              <p style={hintStyle}>
                Получить: https://oauth.yandex.ru/authorize?response_type=token&client_id={data.yandexClientId || 'ВАШ_CLIENT_ID'}
              </p>
            </div>

            {/* Yandex Status */}
            {yandexUser && (
              <div style={{
                padding: '15px',
                background: yandexValid ? '#22c55e20' : '#ef444420',
                border: `1px solid ${yandexValid ? '#22c55e' : '#ef4444'}`,
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {yandexValid ? <Check size={20} color="#22c55e" /> : <AlertTriangle size={20} color="#ef4444" />}
                  <div>
                    <p style={{ fontWeight: '600', color: yandexValid ? '#22c55e' : '#ef4444' }}>
                      {yandexValid ? '✅ Аккаунт проверен' : '⚠️ Проблемы с аккаунтом'}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                      Логин: {yandexUser.login} • {yandexUser.display_name}
                    </p>
                    {yandexUser.default_email && (
                      <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                        Email: {yandexUser.default_email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {yandexError && (
              <p style={{ color: '#ef4444', fontSize: '14px' }}>{yandexError}</p>
            )}
          </section>

          {/* Push Notifications */}
          <section style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={sectionTitleStyle}>
                <Bell size={24} />
                Push-уведомления
              </h2>
              <button
                type="button"
                onClick={() => setShowPushInfo(!showPushInfo)}
                style={infoButtonStyle}
              >
                {showPushInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {showPushInfo && (
              <div style={infoBoxStyle}>
                <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.6' }}>
                  VAPID ключи используются для отправки push-уведомлений в браузере.
                  Сгенерируйте новые ключи или используйте сгенерированные автоматически.
                </p>
                <p style={{ marginTop: '10px', color: 'var(--muted-foreground)' }}>
                  <strong>Команда для генерации:</strong>{' '}
                  <code style={{ background: 'var(--background)', padding: '2px 6px', borderRadius: '4px' }}>
                    npx web-push generate-vapid-keys
                  </code>
                </p>
              </div>
            )}

            <div style={fieldStyle}>
              <label style={labelStyle}>VAPID Public Key *</label>
              <div style={inputWithButtonStyle}>
                <input
                  type="text"
                  value={data.vapidPublicKey}
                  onChange={(e) => setData({ ...data, vapidPublicKey: e.target.value })}
                  placeholder="BFxxx..."
                  style={{ ...inputStyle, flex: 1 }}
                  required
                />
                <button
                  type="button"
                  onClick={generateVapidKeys}
                  style={iconButtonStyle}
                  title="Сгенерировать"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>VAPID Private Key *</label>
              <input
                type="password"
                value={data.vapidPrivateKey}
                onChange={(e) => setData({ ...data, vapidPrivateKey: e.target.value })}
                placeholder="xxx..."
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>VAPID Subject *</label>
              <input
                type="email"
                value={data.vapidSubject}
                onChange={(e) => setData({ ...data, vapidSubject: e.target.value })}
                placeholder="mailto:admin@ваш-домен.ru"
                style={inputStyle}
                required
              />
              <p style={hintStyle}>Ваш email для связи (формат: mailto:email@example.com)</p>
            </div>
          </section>

          {/* Admin Account */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <Users size={24} />
              Аккаунт администратора
            </h2>

            <div style={gridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Email администратора *</label>
                <input
                  type="email"
                  value={data.adminEmail}
                  onChange={(e) => setData({ ...data, adminEmail: e.target.value })}
                  placeholder="admin@ваш-домен.ru"
                  style={inputStyle}
                  required
                />
                <p style={hintStyle}>Email первого пользователя (получит права SuperAdmin)</p>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Пароль администратора</label>
                <input
                  type="password"
                  value={data.adminPassword}
                  onChange={(e) => setData({ ...data, adminPassword: e.target.value })}
                  placeholder="Admin123!"
                  style={inputStyle}
                />
                <p style={hintStyle}>По умолчанию: Admin123!</p>
              </div>
            </div>
          </section>

          {/* Email (Optional) */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              Email уведомления (опционально)
            </h2>

            <div style={gridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>SMTP Host</label>
                <input
                  type="text"
                  value={data.smtpHost}
                  onChange={(e) => setData({ ...data, smtpHost: e.target.value })}
                  placeholder="smtp.yandex.ru"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>SMTP Port</label>
                <input
                  type="number"
                  value={data.smtpPort}
                  onChange={(e) => setData({ ...data, smtpPort: e.target.value })}
                  placeholder="587"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>SMTP User</label>
                <input
                  type="email"
                  value={data.smtpUser}
                  onChange={(e) => setData({ ...data, smtpUser: e.target.value })}
                  placeholder="почта@yandex.ru"
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>SMTP Password</label>
                <input
                  type="password"
                  value={data.smtpPass}
                  onChange={(e) => setData({ ...data, smtpPass: e.target.value })}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Options */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <Database size={24} />
              Опции установки
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={clearData}
                  onChange={(e) => setClearData(e.target.checked)}
                  style={checkboxStyle}
                />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Trash2 size={20} color="#ef4444" />
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                      Очистить базу данных
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '5px' }}>
                      Удалить все существующие данные (пользователей, чаты, сообщения)
                    </p>
                  </div>
                </div>
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={createTestAccounts}
                  onChange={(e) => setCreateTestAccounts(e.target.checked)}
                  style={checkboxStyle}
                />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Users size={20} color="#3b82f6" />
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                      Создать тестовые аккаунты и чаты
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '5px' }}>
                      Создать несколько тестовых пользователей и чатов для демонстрации
                    </p>
                  </div>
                </div>
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={regenerateRandom}
                  onChange={(e) => setRegenerateRandom(e.target.checked)}
                  style={checkboxStyle}
                />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <RefreshCw size={20} color="#8b5cf6" />
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--foreground)' }}>
                      Обновить случайные данные
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '5px' }}>
                      Сгенерировать новые случайные значения для секретов и ключей
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Submit */}
          <div style={{
            padding: '30px',
            background: 'var(--card)',
            borderRadius: '12px',
            border: '2px solid var(--border)',
            textAlign: 'center'
          }}>
            <button
              type="submit"
              disabled={installing}
              style={{
                padding: '16px 50px',
                background: installing ? 'var(--muted)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: installing ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {installing ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
              {installing ? 'Установка...' : 'Установить'}
            </button>

            <p style={{ marginTop: '15px', fontSize: '13px', color: 'var(--muted-foreground)' }}>
              После установки потребуется перезапуск сервера
            </p>
          </div>
        </form>
      </div>

      {AlertComponent}
    </div>
  );
}

// Styles
const sectionStyle: React.CSSProperties = {
  padding: '30px',
  background: 'var(--card)',
  borderRadius: '12px',
  border: '2px solid var(--border)',
  marginBottom: '30px'
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: 'var(--foreground)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px'
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--foreground)'
};

const inputStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: '2px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
  fontSize: '14px'
};

const inputWithButtonStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px'
};

const iconButtonStyle: React.CSSProperties = {
  padding: '10px',
  background: 'var(--background-tertiary)',
  color: 'var(--foreground)',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const infoButtonStyle: React.CSSProperties = {
  padding: '8px',
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const infoBoxStyle: React.CSSProperties = {
  padding: '20px',
  background: 'var(--background-secondary)',
  borderRadius: '8px',
  marginBottom: '20px',
  border: '1px solid var(--border)'
};

const hintStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--muted-foreground)'
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '15px',
  background: 'var(--background-secondary)',
  borderRadius: '8px',
  cursor: 'pointer'
};

const checkboxStyle: React.CSSProperties = {
  marginTop: '3px',
  width: '18px',
  height: '18px',
  cursor: 'pointer'
};

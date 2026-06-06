'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import * as authApi from '@/api/auth';
import { getYandexAuthUrl } from '@/api/auth';
import { Alert } from '@/components/ui/Alert';
import { Loader2, Mail, Lock, User, Smartphone } from 'lucide-react';
import './AuthPage.css';

type AuthMode = 'login' | 'register';
type TwoFAMode = 'sms' | 'bot' | 'totp';

interface AuthPageProps {
  mode?: AuthMode;
}

export default function AuthPage({ mode: initialMode = 'login' }: AuthPageProps) {
  const router = useRouter();
  const { login, setUser, setLoading } = useAuthStore();
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAMode, setTwoFAMode] = useState<TwoFAMode>('sms');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [yandexLoading, setYandexLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Валидация пароля
  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) {
      setPasswordError('Пароль должен содержать минимум 8 символов');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Пароль должен содержать заглавную букву');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Пароль должен содержать цифру');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowError(false);
    setShowSuccess(false);
    setPasswordError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (twoFARequired) {
          if (!tempUserId) {
            setError('Ошибка: userId не найден. Пожалуйста, попробуйте войти снова.');
            setShowError(true);
            setLoading(false);
            return;
          }
          const response = await authApi.verifyTwoFA(twoFACode, twoFAMode, tempUserId);
          login(response.user as any);
          setUser(response.user as any);
          router.push('/chats');
        } else {
          const response = await authApi.login({ email, password });
          
          if (response.requiresTwoFA) {
            setTempUserId(response.userId || response.user?.id || '');
            setTwoFARequired(true);
            await authApi.requestTwoFA(tempUserId, twoFAMode);
            setVerificationCodeSent(true);
            setSuccess('Код отправлен! Проверьте SMS/bot.');
            setShowSuccess(true);
          } else {
            login(response.user as any);
            setUser(response.user as any);
            router.push('/chats');
          }
        }
      } else {
        if (!validatePassword(password)) {
          setLoading(false);
          return;
        }
        
        const response = await authApi.register({
          email,
          password,
          displayName: displayName || undefined,
          phone: phone || undefined,
        });
        
        login(response.user as any);
        setUser(response.user as any);
        router.push('/chats');
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleYandexAuth = () => {
    setYandexLoading(true);
    const url = getYandexAuthUrl();
    // Сбрасываем loading если не перенаправило через 5 секунд
    setTimeout(() => setYandexLoading(false), 5000);
    window.location.href = url;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>App Balloo</h1>
          <p>Безопасный мессенджер</p>
        </div>

        {showError && <Alert message={error} type="error" onClose={() => setShowError(false)} duration={5000} />}
        {showSuccess && <Alert message={success} type="success" onClose={() => setShowSuccess(false)} duration={5000} />}

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setTwoFARequired(false);
              setVerificationCodeSent(false);
              setError('');
              setSuccess('');
              setShowError(false);
              setShowSuccess(false);
            }}
          >
            Вход
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setTwoFARequired(false);
              setVerificationCodeSent(false);
              setError('');
              setSuccess('');
              setShowError(false);
              setShowSuccess(false);
            }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <User className="icon" />
                <input
                  type="text"
                  placeholder="Имя (опционально)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={false}
                />
              </div>
              
              <div className="form-group">
                <Smartphone className="icon" />
                <input
                  type="tel"
                  placeholder="Телефон (опционально)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={false}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <Lock className="icon" />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {passwordError && (
            <div style={{ color: '#c33', fontSize: '14px', marginTop: '-8px', marginBottom: '8px' }}>
              {passwordError}
            </div>
          )}

          {twoFARequired && (
            <div className="form-group">
              <Smartphone className="icon" />
              <input
                type="text"
                placeholder={`Код из ${twoFAMode === 'sms' ? 'SMS' : twoFAMode === 'bot' ? 'бота' : 'TOTP'}`}
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                required
                maxLength={6}
              />
            </div>
          )}

          {twoFARequired && !verificationCodeSent && (
            <div className="twofa-mode-selector">
              <label>Способ получения кода:</label>
              <select
                value={twoFAMode}
                onChange={(e) => setTwoFAMode(e.target.value as TwoFAMode)}
              >
                <option value="sms">SMS</option>
                <option value="bot">Telegram Bot</option>
                <option value="totp">TOTP (Google Auth)</option>
              </select>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={useAuthStore.getState().isLoading}>
            {useAuthStore.getState().isLoading ? (
              <Loader2 className="spinner" />
            ) : (
              mode === 'login' ? (twoFARequired ? 'Подтвердить' : 'Войти') : 'Зарегистрироваться'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>или</span>
        </div>

        <button className="yandex-button" onClick={handleYandexAuth} disabled={yandexLoading}>
          {yandexLoading ? (
            <Loader2 className="spinner" />
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="yandex-icon">
                <path fill="#FC3F1D" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z"/>
                <path fill="#FC3F1D" d="M15.36 10.8c-.288-.576-.72-1.008-1.296-1.296-.576-.288-1.296-.432-2.16-.432h-2.88v5.76h2.88c.864 0 1.584-.144 2.16-.432.576-.288 1.008-.72 1.296-1.296.288-.576.432-1.296.432-2.16s-.144-1.584-.432-2.16zm-1.728 3.456c-.288.288-.72.432-1.296.432h-1.152v-3.456h1.152c.576 0 1.008.144 1.296.432.288.288.432.72.432 1.296s-.144 1.008-.432 1.296z"/>
              </svg>
              Войти через Яндекс
            </>
          )}
        </button>

        <div className="auth-footer">
          <p>Безопасность и приватность превыше всего</p>
        </div>
      </div>
    </div>
  );
}

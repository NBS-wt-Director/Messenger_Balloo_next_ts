'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAccountsStore } from '@/stores/accounts-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { useAlert } from '@/hooks/useAlert';
import { Eye, EyeOff, MessageCircle, Check, X, KeyRound } from 'lucide-react';
import { getYandexAuthUrl } from '@/api/auth';
import './AuthPage.css';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const { addAccount } = useAccountsStore();
  const { language } = useSettingsStore();
  const { alert, AlertComponent } = useAlert();
  const translations = getTranslations(language);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = mode === 'register' ? {
    length: password.length >= 8,
    number: /\d/.test(password),
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
  } : null;

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (mode === 'register') {
      if (!Object.values(passwordChecks!).every(Boolean)) {
        setError('Пароль должен содержать минимум 8 символов, цифры, строчные и заглавные буквы');
        setIsLoading(false);
        return;
      }
      if (!passwordsMatch) {
        setError('Пароли не совпадают');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Demo: just login
      const user = {
        id: 'user1',
        email: email || 'demo@balloo.app',
        displayName: displayName || 'Demo User',
        provider: 'email' as const,
      };
      
      login(user);
      addAccount(user);
      router.push('/chats');
    } catch (err) {
      setError(translations.errorNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  const handleYandex = () => {
    try {
      const yandexAuthUrl = getYandexAuthUrl();
      if (yandexAuthUrl) {
        window.location.href = yandexAuthUrl;
      } else {
        alert({ 
          message: 'Ошибка настройки Яндекс OAuth. Обратитесь к администратору.', 
          type: 'error' 
        });
      }
    } catch (error) {
      alert({ 
        message: 'Ошибка авторизации через Яндекс. Попробуйте позже.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="auth-page">
      {AlertComponent}
      <main className="auth-main">
        <div className="auth-container">
          {/* Логотип */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <MessageCircle size={40} />
            </div>
            <h1 className="auth-logo-title">
              {mode === 'login' ? translations.appName : translations.createAccount}
            </h1>
            <p className="auth-logo-subtitle">
              {mode === 'login' ? translations.loginWithEmail : translations.appName}
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">{translations.displayName}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-input"
                  placeholder="Ваше имя"
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">{translations.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
                placeholder="example@mail.ru"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">{translations.password}</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input auth-input-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-icon"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {mode === 'register' && password && passwordChecks && (
                <div className="password-checks">
                  <div className={`password-check ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                    {passwordChecks.length ? <Check size={14} /> : <X size={14} />}
                    Минимум 8 символов
                  </div>
                  <div className={`password-check ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                    {passwordChecks.number ? <Check size={14} /> : <X size={14} />}
                    Минимум 1 цифра
                  </div>
                  <div className={`password-check ${passwordChecks.lowercase ? 'valid' : 'invalid'}`}>
                    {passwordChecks.lowercase ? <Check size={14} /> : <X size={14} />}
                    Минимум 1 строчная буква
                  </div>
                  <div className={`password-check ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                    {passwordChecks.uppercase ? <Check size={14} /> : <X size={14} />}
                    Минимум 1 заглавная буква
                  </div>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">{translations.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="auth-input"
                  placeholder="••••••••"
                />
                {confirmPassword && (
                  <div className={`password-match ${passwordsMatch ? 'valid' : 'invalid'}`}>
                    {passwordsMatch ? <Check size={14} /> : <X size={14} />}
                    Пароли совпадают
                  </div>
                )}
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            {mode === 'login' && (
              <div className="forgot-password-link">
                <Link href="/forgot-password" className="auth-footer-link">
                  <KeyRound size={14} style={{ marginRight: '4px' }} />
                  Забыли пароль?
                </Link>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? translations.loading : (mode === 'login' ? translations.login : translations.createAccount)}
            </button>
          </form>

          {/* Разделитель */}
          <div className="auth-divider">
            <div className="auth-divider-line"><span></span></div>
            <div className="auth-divider-text"><span>{translations.orContinueWith}</span></div>
          </div>

          {/* Соцсеть */}
          <button onClick={handleYandex} className="auth-social">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            {translations.loginWithYandex}
          </button>

          {/* Ссылка */}
          <p className="auth-footer">
            {mode === 'login' ? translations.dontHaveAccount : translations.alreadyHaveAccount}{' '}
            <Link href={mode === 'login' ? '/register' : '/login'} className="auth-footer-link">
              {mode === 'login' ? translations.createAccount : translations.login}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
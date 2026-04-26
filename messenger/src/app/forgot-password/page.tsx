'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, AlertCircle, CheckCircle, Key, ArrowLeft } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n/translations';
import './forgot-password.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language } = useSettingsStore();
  const t = getTranslations(language);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке запроса');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-container">
          {/* Кнопка назад */}
          <button 
            className="back-button"
            onClick={() => router.push('/login')}
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>

          {/* Логотип */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Key size={40} />
            </div>
            <h1 className="auth-logo-title">
              {t.forgotPassword || 'Забыли пароль?'}
            </h1>
            <p className="auth-logo-subtitle">
              {t.resetPasswordDesc || 'Введите ваш email для восстановления доступа'}
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Инструкция отправлена на email!</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">{t.email}</label>
              <div className="auth-input-wrapper">
                <Mail 
                  size={18} 
                  className="auth-input-icon-left"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? t.loading : (t.resetPassword || 'Восстановить пароль')}
            </button>
          </form>

          {/* Ссылка на вход */}
          <p className="auth-footer">
            <span>{t.rememberPassword || 'Вспомнили пароль?'}</span>{' '}
            <button
              onClick={() => router.push('/login')}
              className="auth-footer-link"
            >
              {t.login || 'Войти'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

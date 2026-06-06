'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TwoFactorAuthPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [method, setMethod] = useState<'sms' | 'bot' | 'totp'>('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!code || code.length < 4) {
      setError('Введите код');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, method }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка проверки');
      }

      setSuccess(true);
      setTimeout(() => router.push('/chats'), 1000);
    } catch (err: any) {
      setError(err.message || 'Ошибка проверки кода');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-container">
          <button className="back-button" onClick={() => router.push('/profile')}>
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Smartphone size={40} />
            </div>
            <h1 className="auth-logo-title">Двухфакторная аутентификация</h1>
            <p className="auth-logo-subtitle">Введите код из приложения</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Успешно!</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Метод</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="auth-input"
              >
                <option value="sms">SMS</option>
                <option value="bot">Telegram Bot</option>
                <option value="totp">TOTP (Google Authenticator)</option>
              </select>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Код</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="auth-input auth-input-code"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? 'Проверка...' : 'Подтвердить'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

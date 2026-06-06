'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import './email-verification.css';

export default function EmailVerificationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanResend(true), 60000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!code || code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка проверки кода');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/chats');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка проверки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/email/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-container">
          <button 
            className="back-button"
            onClick={() => router.push('/profile')}
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Mail size={40} />
            </div>
            <h1 className="auth-logo-title">Подтверждение Email</h1>
            <p className="auth-logo-subtitle">
              Введите код, отправленный на {user?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Email подтвержден!</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Код подтверждения</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="auth-input auth-input-code"
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? 'Проверка...' : 'Подтвердить email'}
            </button>

            <button 
              type="button" 
              onClick={handleResend} 
              disabled={!canResend || isResending}
              className="auth-resend-button"
            >
              <RefreshCw size={16} className={isResending ? 'spinning' : ''} />
              {isResending ? 'Отправка...' : (canResend ? 'Отправить код повторно' : 'Код можно отправить через 1 мин')}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

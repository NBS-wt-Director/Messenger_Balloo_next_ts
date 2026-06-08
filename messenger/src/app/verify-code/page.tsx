'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import './verify-code.css';

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!code) {
      setError('Введите код');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при проверке кода');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/password-reset?email=' + encodeURIComponent(email));
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при проверке кода');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-container">
          <button 
            className="back-button"
            onClick={() => router.push('/forgot-password')}
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Mail size={40} />
            </div>
            <h1 className="auth-logo-title">Подтверждение кода</h1>
            <p className="auth-logo-subtitle">
              Введите код, отправленный на {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Код подтвержден!</span>
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
                  onChange={(e) => setCode(e.target.value)}
                  className="auth-input auth-input-code"
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
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

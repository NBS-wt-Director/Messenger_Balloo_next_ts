'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import './password-reset.css';

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setError('Все поля обязательны');
      return;
    }

    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: '', newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при сбросе пароля');
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при сбросе пароля');
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
            onClick={() => router.push('/login')}
          >
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Lock size={40} />
            </div>
            <h1 className="auth-logo-title">Сброс пароля</h1>
            <p className="auth-logo-subtitle">
              Установите новый пароль для {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Пароль успешно сброшен!</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Новый пароль</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon-left" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Минимум 8 символов"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Подтвердите пароль</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon-left" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Повторите пароль"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? 'Сброс...' : 'Сбросить пароль'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

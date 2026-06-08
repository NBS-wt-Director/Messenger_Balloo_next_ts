'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/api/client';
import './change-password.css';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Все поля обязательны');
      return;
    }

    if (newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError(typeof response.error === 'string' ? response.error : 'Ошибка при смене пароля');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

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
              <Lock size={40} />
            </div>
            <h1 className="auth-logo-title">Смена пароля</h1>
            <p className="auth-logo-subtitle">
              Установите новый безопасный пароль
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {success && (
              <div className="auth-success">
                <CheckCircle size={20} />
                <span>Пароль успешно изменен!</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Текущий пароль</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon-left" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Введите текущий пароль"
                  required
                />
              </div>
            </div>

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
              <label className="auth-label">Подтвердите новый пароль</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon-left" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  placeholder="Повторите новый пароль"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="auth-submit">
              {isLoading ? 'Изменение...' : 'Изменить пароль'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

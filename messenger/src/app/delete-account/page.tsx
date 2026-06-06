'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Trash2, AlertTriangle, Lock, ArrowLeft } from 'lucide-react';
import './delete-account.css';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Введите пароль');
      return;
    }

    if (confirmText !== 'Я понимаю последствия') {
      setError('Подтвердите удаление');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка удаления');
      }

      await logout();
      router.push('/login?deleted=1');
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления аккаунта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-account-page">
      <div className="delete-container">
        <button className="back-button" onClick={() => router.push('/profile')}>
          <ArrowLeft size={20} />
          <span>Назад</span>
        </button>

        <div className="delete-header">
          <div className="delete-icon">
            <AlertTriangle size={48} />
          </div>
          <h1>Удаление аккаунта</h1>
          <p className="delete-warning">
            Это действие необратимо. Все ваши данные будут удалены.
          </p>
        </div>

        <div className="delete-consequences">
          <h3>Что будет удалено:</h3>
          <ul>
            <li>Все личные сообщения</li>
            <li>Все чаты и группы</li>
            <li>Все файлы и вложения</li>
            <li>Контакты и история</li>
            <li>Настройки профиля</li>
          </ul>
        </div>

        <form onSubmit={handleDelete} className="delete-form">
          {error && (
            <div className="error-message">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} />
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Введите ваш пароль"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Для подтверждения введите: <strong>Я понимаю последствия</strong>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="form-input"
              placeholder="Я понимаю последствия"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-delete">
            <Trash2 size={18} />
            {isLoading ? 'Удаление...' : 'Удалить аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
}

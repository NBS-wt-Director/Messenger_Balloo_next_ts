'use client';

import { FC, useState } from 'react';
import { Trash2, X, ShieldAlert } from 'lucide-react';
import './DeleteAccountModal.css';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Введите DELETE для подтверждения');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/users/me/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Удалить токен и перенаправить
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        onSuccess();
      } else {
        setError(data.error?.message || 'Ошибка при удалении аккаунта');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-account-overlay" onClick={onClose}>
      <div className="delete-account-modal" onClick={(e) => e.stopPropagation()}>
        <button className="delete-account-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="delete-account-header">
          <div className="warning-icon">
            <ShieldAlert size={48} color="#ef4444" />
          </div>
          <h2>Удаление аккаунта</h2>
          <p className="warning-text">
            Это действие необратимо. Все ваши данные будут удалены без возможности восстановления.
          </p>
        </div>

        <div className="delete-account-content">
          <div className="warning-box">
            <h3>Что будет удалено:</h3>
            <ul>
              <li>✅ Все сообщения и чаты</li>
              <li>✅ Контакты и группы</li>
              <li>✅ Статусы и медиафайлы</li>
              <li>✅ Настройки и данные профиля</li>
              <li>✅ Все сессии и устройства</li>
            </ul>
          </div>

          <div className="input-group">
            <label>Введите пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль"
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label>Для подтверждения введите DELETE:</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="DELETE"
              disabled={isLoading}
              className="confirm-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={isLoading || !password || confirmText !== 'DELETE'}
          >
            <Trash2 size={18} />
            {isLoading ? 'Удаление...' : 'Удалить аккаунт'}
          </button>
        </div>

        <div className="delete-account-footer">
          <p>💡 Если вы передумали, просто закройте это окно</p>
        </div>
      </div>
    </div>
  );
};

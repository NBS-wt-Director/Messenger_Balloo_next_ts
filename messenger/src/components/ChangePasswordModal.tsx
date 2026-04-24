'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Lock, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при смене пароля');
      }

      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <Lock size={24} color="#4A90E2" />
            <h2 style={styles.title}>Смена пароля</h2>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {success && (
          <div style={styles.successMessage}>
            <CheckCircle size={20} color="#27ae60" />
            <span>Пароль успешно изменён</span>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <AlertCircle size={20} color="#e74c3c" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
              placeholder="Введите текущий пароль"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              placeholder="Минимум 6 символов"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Подтвердите новый пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Повторите новый пароль"
              required
            />
          </div>

          <div style={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              style={{ ...styles.button, ...styles.cancelButton }}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.submitButton }}
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--background-secondary, #1a1a2e)',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary, #ffffff)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary, #a0a0a0)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#27ae60',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#e74c3c',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-secondary, #a0a0a0)',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #2a2a4a)',
    backgroundColor: 'var(--background-input, #0f0f1a)',
    color: 'var(--text-primary, #ffffff)',
    fontSize: '14px',
    outline: 'none',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  button: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelButton: {
    backgroundColor: 'var(--background-tertiary, #2a2a4a)',
    color: 'var(--text-primary, #ffffff)',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    color: '#ffffff',
  },
};

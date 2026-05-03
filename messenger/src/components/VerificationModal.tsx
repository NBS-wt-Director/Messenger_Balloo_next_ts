'use client';

import { useState, useEffect } from 'react';
import { Lock, Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import './VerificationModal.css';

interface VerificationModalProps {
  userId: string;
  onClose: () => void;
  onVerify?: () => void;
}

export function VerificationModal({ userId, onClose, onVerify }: VerificationModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hint, setHint] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    // Запрос кода при открытии
    sendCode();

    // Таймер для повторной отправки
    const timer = setInterval(() => {
      setResendTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendCode = async () => {
    try {
      const response = await fetch('/api/auth/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setHint(data.hint || '');
        setResendTimer(60);
      } else {
        setError(data.error || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('[VerificationModal] Send code error:', error);
      setError('Ошибка сети');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Введите код');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerify?.();
          onClose?.();
        }, 1000);
      } else {
        setError(data.error || 'Ошибка проверки');
      }
    } catch (error) {
      console.error('[VerificationModal] Verify error:', error);
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="verification-modal-overlay">
      <div className="verification-modal">
        <div className="verification-modal-header">
          <div className="verification-modal-icon">
            <Mail size={32} />
          </div>
          <h2 className="verification-modal-title">Подтверждение email</h2>
          <p className="verification-modal-subtitle">
            Для продолжения работы подтвердите ваш email адрес
          </p>
        </div>

        <div className="verification-modal-body">
          <div className="verification-info">
            <p>
              Мы отправили код подтверждения на ваш email.
              Код действует в течение 15 минут.
            </p>
            {hint && (
              <div className="verification-hint">
                <strong>Подсказка:</strong> Код начинается с: {hint}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="verification-form">
            <div className="verification-input-group">
              <label htmlFor="code">Код из 7 слов:</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="солнце-месяц-звезда-небо-земля-вода-огонь"
                className="verification-input"
                disabled={loading || success}
                autoFocus
              />
            </div>

            {error && (
              <div className="verification-error">
                <XCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="verification-success">
                <CheckCircle size={16} />
                <span>Проверка успешна!</span>
              </div>
            )}

            <button
              type="submit"
              className="verification-button"
              disabled={loading || success || !code.trim()}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Проверка...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle size={18} />
                  <span>Проверено</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Подтвердить</span>
                </>
              )}
            </button>
          </form>

          <div className="verification-footer">
            <button
              onClick={sendCode}
              className="verification-resend"
              disabled={resendTimer > 0 || loading || success}
            >
              <RefreshCw size={14} />
              <span>
                {resendTimer > 0 
                  ? `Повторно через ${formatTimer(resendTimer)}`
                  : 'Отправить код повторно'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

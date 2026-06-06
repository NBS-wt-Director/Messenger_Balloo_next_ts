'use client';

import { FC, useState } from 'react';
import { Shield, X, QrCode, Smartphone } from 'lucide-react';
import './TwoFASetup.css';

interface TwoFASetupProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Method = 'totp' | 'sms';

export const TwoFASetup: FC<TwoFASetupProps> = ({ onClose, onSuccess }) => {
  const [method, setMethod] = useState<Method>('totp');
  const [step, setStep] = useState<'setup' | 'confirm'>('setup');
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TOTP methods
  const handleEnableTOTP = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSecret(data.data.secret);
        setQrCodeUrl(data.data.qrCodeUrl);
        setStep('confirm');
      } else {
        setError(data.error?.message || 'Ошибка при включении 2FA');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTOTP = async () => {
    if (!code || code.length !== 3) {
      setError('Введите 3-значный код');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/2fa/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error?.message || 'Ошибка при подтверждении 2FA');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  // SMS methods
  const handleEnableSMS = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/sms-2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setStep('confirm');
      } else {
        setError(data.error?.message || 'Ошибка при отправке SMS');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSMS = async () => {
    if (!code || code.length !== 3) {
      setError('Введите 3-значный код из SMS');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/sms-2fa/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error?.message || 'Ошибка при подтверждении SMS 2FA');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = () => {
    if (secret) {
      window.open(`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(qrCodeUrl || '')}`, '_blank');
    }
  };

  return (
    <div className="two-fa-overlay" onClick={onClose}>
      <div className="two-fa-modal" onClick={(e) => e.stopPropagation()}>
        <button className="two-fa-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="two-fa-header">
          <Shield size={48} color="#3b82f6" />
          <h2>Двухфакторная аутентификация</h2>
          <p>Добавьте дополнительный уровень безопасности аккаунта</p>
        </div>

        {/* Выбор метода */}
        {step === 'setup' && (
          <div className="two-fa-methods">
            <button 
              className={`method-btn ${method === 'totp' ? 'active' : ''}`}
              onClick={() => setMethod('totp')}
            >
              <QrCode size={24} />
              <div>
                <strong>Приложение аутентификации</strong>
                <p>RuTOTP, 2FAS, Aegis</p>
              </div>
            </button>

            <button
              className={`method-btn ${method === 'sms' ? 'active' : ''}`}
              onClick={() => setMethod('sms')}
            >
              <Smartphone size={24} />
              <div>
                <strong>SMS-код</strong>
                <p>Код на ваш номер телефона</p>
              </div>
            </button>
          </div>
        )}

        {/* TOTP Setup */}
        {method === 'totp' && step === 'setup' && (
          <div className="two-fa-content">
            <div className="two-fa-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Установите приложение</h3>
                <p>Рекомендуемые российские приложения:</p>
                <div className="auth-apps">
                  <a href="https://www.rustore.ru/catalog/app/com.rutotp.app" target="_blank" rel="noopener noreferrer" className="auth-app">
                    <div className="app-icon">🇷🇺</div>
                    <span>RuTOTP (RuStore)</span>
                  </a>
                  <a href="https://2fas.com/" target="_blank" rel="noopener noreferrer" className="auth-app">
                    <div className="app-icon">🔐</div>
                    <span>2FAS (Open Source)</span>
                  </a>
                  <a href="https://f-droid.org/en/packages/com.beemdevelopment.aegis/" target="_blank" rel="noopener noreferrer" className="auth-app">
                    <div className="app-icon">🛡️</div>
                    <span>Aegis (F-Droid)</span>
                  </a>
                </div>
              </div>
            </div>

            <button 
              className="two-fa-btn primary"
              onClick={handleEnableTOTP}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Продолжить'}
            </button>
          </div>
        )}

        {/* TOTP Confirm */}
        {method === 'totp' && step === 'confirm' && (
          <div className="two-fa-content">
            <div className="two-fa-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Сканируйте QR-код</h3>
                <p>Откройте приложение и отсканируйте QR-код:</p>
                
                {qrCodeUrl && (
                  <div className="qr-code-container">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code для 2FA" 
                      className="qr-code"
                    />
                  </div>
                )}

                <button 
                  className="two-fa-btn secondary"
                  onClick={handleManualEntry}
                >
                  <QrCode size={16} />
                  Открыть QR-код в новом окне
                </button>

                <div className="manual-entry">
                  <p>Или введите секрет вручную:</p>
                  <code className="secret-code">{secret}</code>
                </div>
              </div>
            </div>

            <div className="two-fa-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Подтвердите код</h3>
                <p>Введите 6-значный код из приложения:</p>
                
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  className="code-input"
                  maxLength={3}
                />

                {error && <div className="error-message">{error}</div>}

                <button 
                  className="two-fa-btn primary"
                  onClick={handleConfirmTOTP}
                  disabled={isLoading || code.length !== 3}
                >
                  {isLoading ? 'Проверка...' : 'Подтвердить и включить'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SMS Setup */}
        {method === 'sms' && step === 'setup' && (
          <div className="two-fa-content">
            <div className="two-fa-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Отправить SMS с кодом</h3>
                <p>Код будет отправлен на ваш номер телефона через SMS-сервер</p>
                
                {error && <div className="error-message">{error}</div>}

                <button 
                  className="two-fa-btn primary"
                  onClick={handleEnableSMS}
                  disabled={isLoading}
                >
                  {isLoading ? 'Отправка...' : 'Получить SMS код'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SMS Confirm */}
        {method === 'sms' && step === 'confirm' && (
          <div className="two-fa-content">
            <div className="two-fa-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Подтвердите код из SMS</h3>
                <p>Введите 6-значный код, который пришёл на ваш телефон:</p>
                
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  className="code-input"
                  maxLength={3}
                />

                {error && <div className="error-message">{error}</div>}

                <button 
                  className="two-fa-btn primary"
                  onClick={handleConfirmSMS}
                  disabled={isLoading || code.length !== 3}
                >
                  {isLoading ? 'Проверка...' : 'Подтвердить и включить'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="two-fa-footer">
          <p>🔒 Ваш аккаунт будет защищён после включения 2FA</p>
        </div>
      </div>
    </div>
  );
};

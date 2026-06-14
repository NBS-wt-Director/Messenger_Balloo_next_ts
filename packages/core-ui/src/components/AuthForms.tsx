'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, CheckCircle } from 'lucide-react';

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  onYandexLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<void>;
  onLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export interface SMSVerificationFormProps {
  phone: string;
  onSubmit: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  displayName: string;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onRegister,
  onYandexLogin,
  isLoading = false,
  error = null,
  className = ''
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form className={`auth-form login-form ${className}`} onSubmit={handleSubmit}>
      <h2 className="auth-form-title">Вход</h2>

      {error && <div className="auth-error">{error}</div>}

      {/* Email */}
      <div className="auth-field">
        <Mail size={20} className="auth-field-icon" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      {/* Password */}
      <div className="auth-field">
        <Lock size={20} className="auth-field-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="auth-input"
        />
        <button
          type="button"
          className="auth-eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Forgot password */}
      {onForgotPassword && (
        <button
          type="button"
          className="auth-forgot-link"
          onClick={onForgotPassword}
        >
          Забыли пароль?
        </button>
      )}

      {/* Submit */}
      <button type="submit" className="auth-submit-btn" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
        <ArrowRight size={18} />
      </button>

      {/* Divider */}
      <div className="auth-divider">
        <span>или</span>
      </div>

      {/* Yandex Login */}
      {onYandexLogin && (
        <button
          type="button"
          className="auth-yandex-btn"
          onClick={onYandexLogin}
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#FFCC00" d="M0 0h12v24H0z"/>
            <path fill="#FF0000" d="M12 0h12v24H12z"/>
          </svg>
          Войти через Яндекс
        </button>
      )}

      {/* Register link */}
      {onRegister && (
        <div className="auth-register-link">
          Нет аккаунта?{' '}
          <button type="button" onClick={onRegister}>
            Зарегистрироваться
          </button>
        </div>
      )}
    </form>
  );
}

export function RegisterForm({
  onSubmit,
  onLogin,
  isLoading = false,
  error = null,
  className = ''
}: RegisterFormProps) {
  const [data, setData] = useState<RegisterData>({
    email: '',
    password: '',
    phone: '',
    displayName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;
    await onSubmit(data);
  };

  const isPasswordValid = data.password.length >= 6 && data.password.length <= 9;

  return (
    <form className={`auth-form register-form ${className}`} onSubmit={handleSubmit}>
      <h2 className="auth-form-title">Регистрация</h2>

      {error && <div className="auth-error">{error}</div>}

      {/* Display Name */}
      <div className="auth-field">
        <input
          type="text"
          placeholder="Имя"
          value={data.displayName}
          onChange={handleChange('displayName')}
          required
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      {/* Email */}
      <div className="auth-field">
        <Mail size={20} className="auth-field-icon" />
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange('email')}
          required
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      {/* Phone */}
      <div className="auth-field">
        <Phone size={20} className="auth-field-icon" />
        <input
          type="tel"
          placeholder="+7 (___) ___-__-__"
          value={data.phone}
          onChange={handleChange('phone')}
          required
          disabled={isLoading}
          className="auth-input"
        />
      </div>

      {/* Password */}
      <div className="auth-field">
        <Lock size={20} className="auth-field-icon" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Пароль (6-9 символов)"
          value={data.password}
          onChange={handleChange('password')}
          required
          disabled={isLoading}
          className="auth-input"
          minLength={6}
          maxLength={9}
        />
        <button
          type="button"
          className="auth-eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Password validation indicator */}
      {data.password && (
        <div className={`password-validation ${isPasswordValid ? 'valid' : 'invalid'}`}>
          <CheckCircle size={14} />
          <span>
            {isPasswordValid ? 'Допустимая длина' : 'Длина 6-9 символов'}
          </span>
        </div>
      )}

      {/* Terms acceptance */}
      <div className="auth-terms">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />
        <label htmlFor="terms">
          Принимаю{' '}
          <a href="/terms" target="_blank">
            условия использования
          </a>
        </label>
      </div>

      {/* Submit */}
      <button type="submit" className="auth-submit-btn" disabled={isLoading || !acceptTerms}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        <ArrowRight size={18} />
      </button>

      {/* Login link */}
      {onLogin && (
        <div className="auth-register-link">
          Уже есть аккаунт?{' '}
          <button type="button" onClick={onLogin}>
            Войти
          </button>
        </div>
      )}
    </form>
  );
}

export function SMSVerificationForm({
  phone,
  onSubmit,
  onResend,
  isLoading = false,
  error = null,
  className = ''
}: SMSVerificationFormProps) {
  const [code, setCode] = useState(['', '', '']);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 2) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 3) return;
    await onSubmit(fullCode);
  };

  const handleResend = async () => {
    if (onResend) {
      setCode(['', '', '']);
      await onResend();
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <form className={`auth-form sms-form ${className}`} onSubmit={handleSubmit}>
      <h2 className="auth-form-title">Подтверждение телефона</h2>

      {error && <div className="auth-error">{error}</div>}

      <div className="sms-info">
        Введите 3-значный код из SMS, отправленного на{' '}
        <strong>{phone}</strong>
      </div>

      {/* Code inputs */}
      <div className="sms-code-inputs">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="sms-code-input"
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Timer placeholder */}
      <div className="sms-timer">
        Код действителен 5 минут
      </div>

      {/* Submit */}
      <button type="submit" className="auth-submit-btn" disabled={isLoading || code.join('').length !== 3}>
        {isLoading ? 'Проверка...' : 'Подтвердить'}
        <ArrowRight size={18} />
      </button>

      {/* Resend */}
      {onResend && (
        <button
          type="button"
          className="sms-resend-btn"
          onClick={handleResend}
          disabled={isLoading}
        >
          Отправить код повторно
        </button>
      )}
    </form>
  );
}

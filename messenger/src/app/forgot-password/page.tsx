'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, AlertCircle, CheckCircle, Key } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n/translations';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language } = useSettingsStore();
  const t = getTranslations(language);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/password/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке запроса');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <main className="flex-1 flex items-center justify-center p-4">
        <div style={{ maxWidth: '420px', width: '100%' }}>
          {/* Логотип */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              margin: '0 auto 16px', 
              borderRadius: '12px', 
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={30} color="white" />
            </div>
            <h1 style={{ color: 'var(--foreground)', marginBottom: '8px' }}>Забыли пароль?</h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Введите ваш email для восстановления доступа
            </p>
          </div>

          {/* Форма */}
          <div style={{ 
            background: 'var(--card)', 
            borderRadius: '16px', 
            padding: '24px',
            border: '1px solid var(--border)'
          }}>
            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#27ae60'
              }}>
                <CheckCircle size={20} />
                <span>Инструкция отправлена на email!</span>
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#e74c3c'
              }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'var(--muted-foreground)' 
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--muted-foreground)'
                    }} 
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: !isLoading ? 'var(--primary)' : 'var(--border)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: !isLoading ? 'pointer' : 'not-allowed',
                  marginTop: '8px'
                }}
              >
                {isLoading ? 'Отправка...' : 'Восстановить пароль'}
              </button>
            </form>

            <div style={{ 
              marginTop: '16px', 
              textAlign: 'center',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)'
            }}>
              <button
                onClick={() => router.push('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Вернуться на вход
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

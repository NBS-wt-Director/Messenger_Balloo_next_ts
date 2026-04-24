'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Users, Clock, Shield, Check, X, Mail, UserPlus } from 'lucide-react';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import './InvitePage.css';

interface Invitation {
  code: string;
  chatId: string;
  chatName: string;
  chatAvatar: string | null;
  chatType: 'private' | 'group';
  invitedBy: string;
  invitedByEmail: string;
  message: string;
  maxUses: number | null;
  currentUses: number;
  expiresAt: number | null;
  isActive: boolean;
  isOneTime: boolean;
  isExpired?: boolean;
  isMaxedOut?: boolean;
  isInactive?: boolean;
}

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { language } = useSettingsStore();
  const { isAuthenticated, user } = useAuthStore();
  const translations = getTranslations(language);
  
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [code, setCode] = useState('');

  // Получение кода из params
  useEffect(() => {
    params.then(p => setCode(p.code));
  }, [params]);

  // Загрузка информации о приглашении
  useEffect(() => {
    if (code) {
      fetchInvitation();
    }
  }, [code]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/invitations?code=${code}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitation(data.invitation);
      } else {
        setError(data.error || 'Ошибка загрузки приглашения');
      }
    } catch (err) {
      setError('Не удалось загрузить приглашение');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      setShowRegister(true);
      return;
    }

    await acceptInvitation();
  };

  const acceptInvitation = async () => {
    if (!invitation) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: invitation.code,
          userId: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/chats/${data.chatId}`);
      } else {
        setError(data.error || 'Не удалось присоединиться к чату');
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setProcessing(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Регистрация
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName
        })
      });

      const registerData = await registerResponse.json();

      if (!registerData.success) {
        setError(registerData.error || 'Ошибка регистрации');
        return;
      }

      // Авторизация
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });

      const loginData = await loginResponse.json();

      if (loginData.success) {
        // Принятие приглашения
        await acceptInvitation();
      } else {
        setError(loginData.error || 'Ошибка авторизации');
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Никогда';
    return new Date(timestamp).toLocaleDateString(language, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUses = (current: number, max: number | null) => {
    if (!max) return `${current} использований`;
    return `${current} из ${max} использований`;
  };

  if (loading) {
    return (
      <div className="invite-page">
        <Header />
        <div className="invite-loading">
          <div className="spinner" />
          <p>Загрузка информации о приглашении...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="invite-page">
        <Header />
        <div className="invite-error">
          <X size={64} className="invite-error-icon" />
          <h1>Ошибка</h1>
          <p>{error || 'Приглашение не найдено'}</p>
          <Link href="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (invitation.isExpired || invitation.isMaxedOut || invitation.isInactive) {
    return (
      <div className="invite-page">
        <Header />
        <div className="invite-invalid">
          <Clock size={64} className="invite-invalid-icon" />
          <h1>Приглашение недоступно</h1>
          <p>
            {invitation.isExpired && 'Срок действия приглашения истек'}
            {invitation.isMaxedOut && 'Приглашение достигло лимита использований'}
            {invitation.isInactive && 'Приглашение больше не активно'}
          </p>
          <Link href="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="invite-page">
      <Header />
      
      <main className="invite-main">
        <div className="invite-container">
          {/* Шапка приглашения */}
          <div className="invite-header">
            <div className="invite-avatar">
              {invitation.chatAvatar ? (
                <img src={invitation.chatAvatar} alt={invitation.chatName} />
              ) : (
                <Users size={48} />
              )}
            </div>
            <h1 className="invite-title">{invitation.chatName}</h1>
            <p className="invite-type">
              {invitation.chatType === 'group' ? 'Групповой чат' : 'Личный чат'}
            </p>
          </div>

          {/* Сообщение от отправителя */}
          <div className="invite-message">
            <div className="invite-message-content">
              <p>{invitation.message}</p>
            </div>
            <div className="invite-message-footer">
              <div className="inviter-info">
                <div className="inviter-avatar">
                  {invitation.invitedByEmail?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="inviter-details">
                  <span className="inviter-name">{invitation.invitedBy}</span>
                  <span className="inviter-email">{invitation.invitedByEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Информация о приглашении */}
          <div className="invite-info">
            <div className="invite-info-item">
              <Shield size={20} />
              <div className="invite-info-text">
                <span className="invite-info-label">Безопасное приглашение</span>
                <span className="invite-info-value">Код: {invitation.code}</span>
              </div>
            </div>
            
            {invitation.expiresAt && (
              <div className="invite-info-item">
                <Clock size={20} />
                <div className="invite-info-text">
                  <span className="invite-info-label">Срок действия</span>
                  <span className="invite-info-value">{formatDate(invitation.expiresAt)}</span>
                </div>
              </div>
            )}

            {invitation.maxUses && (
              <div className="invite-info-item">
                <Users size={20} />
                <div className="invite-info-text">
                  <span className="invite-info-label">Лимит использований</span>
                  <span className="invite-info-value">{formatUses(invitation.currentUses, invitation.maxUses)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Форма регистрации для неавторизованных */}
          {showRegister && !isAuthenticated && (
            <div className="invite-register">
              <h2>Создать аккаунт</h2>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.ru"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn-primary btn-full" disabled={processing}>
                  {processing ? 'Обработка...' : 'Создать аккаунт и присоединиться'}
                </button>
              </form>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="invite-actions">
            {!isAuthenticated && !showRegister && (
              <>
                <button 
                  className="btn-primary btn-full"
                  onClick={() => setShowRegister(true)}
                  disabled={processing}
                >
                  <UserPlus size={18} />
                  Создать аккаунт и присоединиться
                </button>
                <Link href="/login" className="btn-secondary btn-full">
                  Войти в аккаунт
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button 
                className="btn-primary btn-full"
                onClick={handleJoin}
                disabled={processing}
              >
                <Check size={18} />
                {processing ? 'Присоединяюсь...' : 'Присоединиться к чату'}
              </button>
            )}
          </div>

          {/* Отмена */}
          <div className="invite-footer">
            <Link href="/" className="invite-cancel">
              Отмена
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

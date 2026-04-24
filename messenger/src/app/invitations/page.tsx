'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { 
  Link, Copy, Check, Plus, Trash2, ExternalLink, 
  Clock, Users, AlertCircle, ArrowLeft 
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAlert } from '@/hooks/useAlert';
import './InvitationsPage.css';

interface Invitation {
  id: string;
  code: string;
  chatId: string;
  chatName: string;
  chatType: 'private' | 'group';
  invitedBy: string;
  maxUses: number;
  currentUses: number;
  expiresAt: number;
  isActive: boolean;
  createdAt: number;
}

export default function InvitationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, confirm, AlertComponent, ConfirmComponent } = useAlert();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Форма создания приглашения
  const [chatId, setChatId] = useState('');
  const [maxUses, setMaxUses] = useState(10);
  const [expiresIn, setExpiresIn] = useState(7); // дней

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadInvitations();
  }, [isAuthenticated, router]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invitations?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Invitations] Error loading:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!chatId) {
      alert({ message: 'Выберите чат', type: 'warning' });
      return;
    }

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          maxUses,
          expiresInDays: expiresIn
        })
      });

      if (response.ok) {
        setCreateModalOpen(false);
        setChatId('');
        setMaxUses(10);
        setExpiresIn(7);
        loadInvitations();
        alert({ message: 'Приглашение создано', type: 'success' });
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка создания приглашения', 'error');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Invitations] Error creating:', error);
      }
      alert({ message: 'Ошибка создания приглашения', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm('Удалить это приглашение?', 'warning', 'Удалить', 'Отмена');
    if (!confirmed) return;

    try {
      const response = await fetch('/api/invitations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: id })
      });

      if (response.ok) {
        loadInvitations();
        alert({ message: 'Приглашение удалено', type: 'success' });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Invitations] Error deleting:', error);
      }
      alert({ message: 'Ошибка при удалении', type: 'error' });
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    const inviteUrl = `${window.location.origin}/invite/${code}`;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Clipboard] Error:', error);
      }
      alert({ message: 'Не удалось скопировать', type: 'error' });
    }
  };

  const formatTime = (timestamp: number) => {
    const days = Math.floor((timestamp - Date.now()) / 86400000);
    if (days > 0) return `через ${days} дн.`;
    if (days === 0) return 'сегодня';
    return 'истекло';
  };

  const getStatusColor = (invitation: Invitation) => {
    if (!invitation.isActive) return 'expired';
    if (invitation.currentUses >= invitation.maxUses) return 'used';
    if (invitation.expiresAt < Date.now()) return 'expired';
    return 'active';
  };

  if (!user) {
    return (
      <div className="invitations-page">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="invitations-page">
      {/* Header */}
      <header className="invitations-header">
        <button className="invitations-back" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1>Мои приглашения</h1>
        <button 
          className="invitations-create-btn"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={18} />
          <span>Создать</span>
        </button>
      </header>

      {/* Content */}
      <main className="invitations-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Загрузка приглашений...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="invitations-empty">
            <Link size={64} />
            <h2>Нет приглашений</h2>
            <p>Создайте приглашение для подключения к чату</p>
            <button onClick={() => setCreateModalOpen(true)}>
              Создать первое приглашение
            </button>
          </div>
        ) : (
          <div className="invitations-list">
            {invitations.map(invitation => {
              const status = getStatusColor(invitation);
              const inviteUrl = `${window.location.origin}/invite/${invitation.code}`;

              return (
                <div key={invitation.id} className={`invitation-card ${status}`}>
                  <div className="invitation-card-header">
                    <div className="invitation-chat-info">
                      <span className="invitation-chat-name">{invitation.chatName}</span>
                      <span className="invitation-chat-type">
                        {invitation.chatType === 'group' ? 'Группа' : 'Личный'}
                      </span>
                    </div>
                    <span className={`invitation-status ${status}`}>
                      {status === 'active' && 'Активно'}
                      {status === 'used' && 'Использовано'}
                      {status === 'expired' && 'Истекло'}
                    </span>
                  </div>

                  <div className="invitation-card-body">
                    <div className="invitation-link-preview">
                      <ExternalLink size={14} />
                      <span>{inviteUrl}</span>
                    </div>

                    <div className="invitation-stats">
                      <div className="invitation-stat">
                        <Users size={14} />
                        <span>{invitation.currentUses}/{invitation.maxUses}</span>
                      </div>
                      <div className="invitation-stat">
                        <Clock size={14} />
                        <span>{formatTime(invitation.expiresAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="invitation-card-actions">
                    <button
                      className="btn-copy"
                      onClick={() => copyToClipboard(invitation.code, invitation.id)}
                      disabled={status !== 'active'}
                    >
                      {copiedId === invitation.id ? (
                        <>
                          <Check size={16} />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Копировать</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(invitation.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Создать приглашение"
      >
        <div className="create-invitation-form">
          <div className="form-group">
            <label>Чат</label>
            <select 
              value={chatId} 
              onChange={(e) => setChatId(e.target.value)}
              className="form-select"
            >
              <option value="">Выберите чат</option>
              <option value="chat1">Чат 1</option>
              <option value="chat2">Группа "Разработчики"</option>
            </select>
          </div>

          <div className="form-group">
            <label>Максимум использований</label>
            <input
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value))}
              min={1}
              max={100}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Срок действия (дней)</label>
            <input
              type="number"
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              min={1}
              max={365}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button 
              className="btn-secondary" 
              onClick={() => setCreateModalOpen(false)}
            >
              Отмена
            </button>
            <button className="btn-primary" onClick={handleCreate}>
              Создать приглашение
            </button>
          </div>
        </div>
      </Modal>

      {/* Alert и Confirm компоненты */}
      {AlertComponent}
      {ConfirmComponent}
    </div>
  );
}

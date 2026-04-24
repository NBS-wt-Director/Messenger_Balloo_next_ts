'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Link as LinkIcon, Copy, ExternalLink, Trash2, Check, Plus, Clock, Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import './InvitationsPage.css';

interface Invitation {
  id: string;
  code: string;
  chatId: string;
  chatName: string;
  chatType: string;
  invitedBy: string;
  message: string;
  maxUses: number;
  currentUses: number;
  expiresAt: number;
  isActive: boolean;
  isOneTime: boolean;
  createdAt: number;
  inviteUrl: string;
  isExpired: boolean;
}

export function InvitationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteExpiry, setInviteExpiry] = useState(7);
  const [inviteMaxUses, setInviteMaxUses] = useState(0);
  const [createdInvite, setCreatedInvite] = useState<Invitation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invitations/my?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('[Invitations] Error loading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvite = async () => {
    if (!selectedChat || !user) return;

    try {
      const response = await fetch('/api/invitations/my', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat,
          invitedBy: user.id,
          message: inviteMessage,
          expiresAt: Date.now() + (inviteExpiry * 24 * 60 * 60 * 1000),
          maxUses: inviteMaxUses,
          isOneTime: inviteMaxUses === 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedInvite(data.invitation);
        loadInvitations();
      }
    } catch (error) {
      console.error('[Invitations] Error creating:', error);
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('[Invitations] Error copying:', error);
    }
  };

  const handleDeleteInvite = async (id: string) => {
    try {
      const response = await fetch(`/api/invitations/my?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadInvitations();
      }
    } catch (error) {
      console.error('[Invitations] Error deleting:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusInfo = (invite: Invitation) => {
    if (!invite.isActive) return { text: 'Деактивировано', class: 'inactive' };
    if (invite.isExpired) return { text: 'Истекло', class: 'expired' };
    if (invite.isOneTime) return { text: 'Одноразовое', class: 'onetime' };
    if (invite.maxUses > 0 && invite.currentUses >= invite.maxUses) {
      return { text: 'Лимит исчерпан', class: 'expired' };
    }
    return { text: 'Активно', class: 'active' };
  };

  if (!user) {
    return <div className="invitations-page"><div className="loading">Загрузка...</div></div>;
  }

  return (
    <div className="invitations-page">
      <div className="invitations-header">
        <h1>Мои приглашения</h1>
        <button className="btn-create-invite" onClick={() => setCreateModalOpen(true)}>
          <Plus size={18} />
          <span>Создать приглашение</span>
        </button>
      </div>

      <div className="invitations-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <p>Загрузка приглашений...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="empty-state">
            <LinkIcon size={64} />
            <h2>Нет приглашений</h2>
            <p>Создайте приглашение для подключения новых участников</p>
            <button className="btn-create-invite" onClick={() => setCreateModalOpen(true)}>
              <Plus size={18} />
              <span>Создать первое приглашение</span>
            </button>
          </div>
        ) : (
          <div className="invitations-grid">
            {invitations.map(invite => {
              const status = getStatusInfo(invite);
              return (
                <div key={invite.id} className={`invitation-card ${status.class}`}>
                  <div className="invite-header">
                    <div className="invite-chat-info">
                      <div className="invite-chat-avatar">
                        {invite.chatType === 'group' ? <Users size={20} /> : <LinkIcon size={20} />}
                      </div>
                      <div className="invite-chat-name">
                        <h3>{invite.chatName}</h3>
                        <span className="invite-type">{invite.chatType === 'group' ? 'Группа' : 'Личный чат'}</span>
                      </div>
                    </div>
                    <span className={`invite-status ${status.class}`}>{status.text}</span>
                  </div>

                  {invite.message && (
                    <div className="invite-message">
                      <p>{invite.message}</p>
                    </div>
                  )}

                  <div className="invite-stats">
                    <div className="stat">
                      <Users size={14} />
                      <span>{invite.currentUses}{invite.maxUses > 0 ? `/${invite.maxUses}` : '∞'}</span>
                    </div>
                    <div className="stat">
                      <Clock size={14} />
                      <span>{formatDate(invite.expiresAt)}</span>
                    </div>
                  </div>

                  <div className="invite-link">
                    <input 
                      type="text" 
                      value={invite.inviteUrl} 
                      readOnly 
                      className="invite-url-input"
                    />
                    <div className="invite-actions">
                      <button 
                        className="btn-copy" 
                        onClick={() => handleCopyLink(invite.inviteUrl, invite.id)}
                        title="Копировать ссылку"
                      >
                        {copiedId === invite.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <a 
                        href={invite.inviteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-external"
                        title="Открыть в новой вкладке"
                      >
                        <ExternalLink size={16} />
                      </a>
                      {invite.isActive && !invite.isExpired && (
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDeleteInvite(invite.id)}
                          title="Деактивировать"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal создания приглашения */}
      {createModalOpen && (
        <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Создать приглашение">
          <div className="create-invite-modal">
            <h2>Создать приглашение</h2>
            
            {!createdInvite ? (
              <>
                <div className="form-group">
                  <label>Чат для приглашения</label>
                  <select 
                    value={selectedChat} 
                    onChange={(e) => setSelectedChat(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Выберите чат</option>
                    <option value="favorites">Избранное</option>
                    <option value="chat1">Чат с Иваном</option>
                    <option value="chat2">Разработчики</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Сообщение (необязательно)</label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Приветственное сообщение..."
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Срок действия (дней)</label>
                  <input
                    type="number"
                    value={inviteExpiry}
                    onChange={(e) => setInviteExpiry(parseInt(e.target.value))}
                    min={1}
                    max={365}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Максимум использований (0 = безлимитно)</label>
                  <input
                    type="number"
                    value={inviteMaxUses}
                    onChange={(e) => setInviteMaxUses(parseInt(e.target.value))}
                    min={0}
                    className="form-input"
                  />
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setCreateModalOpen(false)}>
                    Отмена
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleCreateInvite}
                    disabled={!selectedChat}
                  >
                    Создать
                  </button>
                </div>
              </>
            ) : (
              <div className="invite-created">
                <div className="success-icon">✓</div>
                <h3>Приглашение создано!</h3>
                <p>Скопируйте ссылку и отправьте нужному человеку</p>
                
                <div className="created-link">
                  <input 
                    type="text" 
                    value={createdInvite.inviteUrl} 
                    readOnly 
                    className="created-url-input"
                  />
                  <button 
                    className="btn-copy" 
                    onClick={() => handleCopyLink(createdInvite.inviteUrl, 'created')}
                  >
                    {copiedId === 'created' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setCreateModalOpen(false)}>
                    Закрыть
                  </button>
                  <button className="btn-primary" onClick={() => {
                    setCreatedInvite(null);
                    setSelectedChat('');
                    setInviteMessage('');
                    setInviteExpiry(7);
                    setInviteMaxUses(0);
                  }}>
                    Создать ещё
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

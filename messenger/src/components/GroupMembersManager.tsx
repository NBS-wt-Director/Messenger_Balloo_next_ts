'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, Plus, Trash2, Crown, UserCog, UserMinus } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';

interface Member {
  userId: string;
  role: 'creator' | 'moderator' | 'author' | 'reader';
  joinedAt: number;
  displayName: string;
  avatar?: string;
  email?: string;
  isOnline?: boolean;
}

interface GroupMembersManagerProps {
  chatId: string;
  currentUserId: string;
  currentRole?: string;
}

export function GroupMembersManager({ chatId, currentUserId, currentRole }: GroupMembersManagerProps) {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/chats/group/members?id=${chatId}`);
      const data = await response.json();

      if (data.success) {
        setMembers(data.members);
      }
    } catch (error) {
      alert({ message: 'Ошибка при загрузке участников', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [chatId]);

  const handleRemoveMember = async (userId: string) => {
    try {
      const response = await fetch('/api/chats/group/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          userId,
          currentUserId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert({ message: data.message, type: 'success' });
        fetchMembers();
      } else {
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка при удалении участника', type: 'error' });
    }
  };

  const handleExitGroup = async () => {
    if (!confirm('Вы уверены, что хотите выйти из группы?')) {
      return;
    }

    await handleRemoveMember(currentUserId);
  };

  const handleSetRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/chats/group/role/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          userId,
          role,
          operatedBy: currentUserId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert({ message: 'Роль успешно назначена', type: 'success' });
        fetchMembers();
        setShowRoleModal(false);
        setSelectedMember(null);
      } else {
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка при назначении роли', type: 'error' });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator':
        return <Crown size={16} color="#f39c12" />;
      case 'moderator':
        return <Shield size={16} color="#3498db" />;
      case 'author':
        return <UserCog size={16} color="#2ecc71" />;
      default:
        return <Users size={16} color="#95a5a6" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'creator':
        return 'Создатель';
      case 'moderator':
        return 'Модератор';
      case 'author':
        return 'Автор';
      default:
        return 'Участник';
    }
  };

  const canManageRoles = currentRole === 'creator';
  const canManageMembers = currentRole === 'creator' || currentRole === 'moderator';

  return (
    <div className="space-y-4">
      {AlertComponent}
      
      {/* Заголовок */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ color: 'var(--foreground)', fontSize: '18px', fontWeight: '600' }}>
          Участники ({members.length})
        </h3>
        {currentRole && (
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            fontSize: '12px',
            background: currentRole === 'creator' ? 'rgba(243, 156, 18, 0.1)' : 
                       currentRole === 'moderator' ? 'rgba(52, 152, 219, 0.1)' : 'rgba(149, 165, 166, 0.1)',
            color: currentRole === 'creator' ? '#f39c12' : 
                  currentRole === 'moderator' ? '#3498db' : 'var(--muted-foreground)'
          }}>
            {getRoleLabel(currentRole)}
          </span>
        )}
      </div>

      {/* Список участников */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
          Загрузка участников...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {members.map((member) => (
            <div
              key={member.userId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              {/* Аватар */}
              <div style={{ position: 'relative' }}>
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.displayName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {member.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {member.isOnline && (
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#27ae60',
                    border: '2px solid var(--card)'
                  }} />
                )}
              </div>

              {/* Информация */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  marginBottom: '2px'
                }}>
                  <span style={{ 
                    color: 'var(--foreground)', 
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {member.displayName}
                  </span>
                  {getRoleIcon(member.role)}
                </div>
                <span style={{ 
                  color: 'var(--muted-foreground)', 
                  fontSize: '12px'
                }}>
                  {getRoleLabel(member.role)}
                </span>
              </div>

              {/* Действия */}
              {member.userId !== currentUserId && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {canManageRoles && member.role !== 'creator' && (
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowRoleModal(true);
                      }}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(52, 152, 219, 0.1)',
                        color: '#3498db',
                        cursor: 'pointer'
                      }}
                      title="Изменить роль"
                    >
                      <Shield size={16} />
                    </button>
                  )}
                  {canManageMembers && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(231, 76, 60, 0.1)',
                        color: '#e74c3c',
                        cursor: 'pointer'
                      }}
                      title="Удалить из группы"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )}

              {member.userId === currentUserId && (
                <button
                  onClick={handleExitGroup}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(149, 165, 166, 0.1)',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Выйти
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно выбора роли */}
      {showRoleModal && selectedMember && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowRoleModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--card)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}
          >
            <h3 style={{ color: 'var(--foreground)', marginBottom: '16px' }}>
              Изменить роль: {selectedMember.displayName}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(['creator', 'moderator', 'author', 'reader'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleSetRole(selectedMember.userId, role)}
                  disabled={selectedMember.role === role}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedMember.role === role ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: selectedMember.role === role ? 'rgba(52, 152, 219, 0.1)' : 'var(--background)',
                    color: 'var(--foreground)',
                    cursor: selectedMember.role === role ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {getRoleIcon(role)}
                  <span>{getRoleLabel(role)}</span>
                  {selectedMember.role === role && (
                    <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: '12px' }}>
                      Текущая
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--background)',
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

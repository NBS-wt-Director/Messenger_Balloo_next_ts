'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Users, X, Plus, Search } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Демо контакты (в реальности - из базы)
  const contacts = [
    { id: 'user1', name: 'Александр Иванов' },
    { id: 'user2', name: 'Мария Петрова' },
    { id: 'user3', name: 'Дмитрий Сидоров' },
    { id: 'user4', name: 'Елена Козлова' },
    { id: 'user5', name: 'Алексей Смирнов' },
  ];

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Введите название группы');
      return;
    }

    if (selectedContacts.length === 0) {
      setError('Выберите хотя бы одного участника');
      return;
    }

    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chats/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName,
          description,
          creatorId: user.id,
          participantIds: selectedContacts,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании группы');
      }

      // Переход к созданной группе
      router.push(`/chats?id=${data.chatId}`);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании группы');
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
            <Users size={24} color="#4A90E2" />
            <h2 style={styles.title}>Новая группа</h2>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            <span>{error}</span>
          </div>
        )}

        <div style={styles.content}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Название группы</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={styles.input}
              placeholder="Введите название группы"
              maxLength={50}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Описание (необязательно)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
              placeholder="Описание группы"
              maxLength={200}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Участники</label>
            <div style={styles.searchBox}>
              <Search size={18} color="#a0a0a0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                placeholder="Поиск контактов..."
              />
            </div>

            <div style={styles.contactsList}>
              {filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  style={{
                    ...styles.contactItem,
                    backgroundColor: selectedContacts.includes(contact.id)
                      ? 'rgba(74, 144, 226, 0.2)'
                      : 'transparent'
                  }}
                  onClick={() => handleToggleContact(contact.id)}
                >
                  <div style={styles.contactAvatar}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.contactInfo}>
                    <span style={styles.contactName}>{contact.name}</span>
                  </div>
                  {selectedContacts.includes(contact.id) && (
                    <div style={styles.checkmark}>✓</div>
                  )}
                </div>
              ))}
            </div>

            {selectedContacts.length > 0 && (
              <div style={styles.selectedCount}>
                Выбрано: {selectedContacts.length}
              </div>
            )}
          </div>
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
            type="button"
            onClick={handleCreateGroup}
            style={{ ...styles.button, ...styles.submitButton }}
            disabled={isLoading || selectedContacts.length === 0}
          >
            {isLoading ? 'Создание...' : 'Создать'}
          </button>
        </div>
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
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
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
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '8px',
    marginBottom: '16px',
    color: '#e74c3c',
    fontSize: '14px',
  },
  content: {
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
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #2a2a4a)',
    backgroundColor: 'var(--background-input, #0f0f1a)',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    color: 'var(--text-primary, #ffffff)',
    fontSize: '14px',
  },
  contactsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '250px',
    overflowY: 'auto',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #2a2a4a)',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  contactAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4A90E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: '16px',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: 'var(--text-primary, #ffffff)',
    fontSize: '14px',
    fontWeight: '500',
  },
  checkmark: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#4A90E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  selectedCount: {
    fontSize: '13px',
    color: 'var(--text-secondary, #a0a0a0)',
    textAlign: 'right',
    marginTop: '4px',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
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

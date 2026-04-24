'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Users, UserPlus, Search, X, Check, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { useAlert } from '@/hooks/useAlert';
import './NewChatPage.css';

interface Contact {
  id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  isContact: boolean;
  selected: boolean;
}

export default function NewChatPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();
  
  const [chatType, setChatType] = useState<'private' | 'group'>('private');
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadContacts();
    }
  }, [isAuthenticated]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      // API вызов для загрузки контактов
      const response = await fetch('/api/contacts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const contactsList: Contact[] = (data.contacts || []).map((c: any) => ({
          id: c.id,
          displayName: c.displayName || c.name || 'Unknown',
          email: c.email || '',
          avatar: c.avatar || null,
          isContact: c.isContact ?? true,
          selected: false,
        }));
        setContacts(contactsList);
      } else {
        setContacts([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading contacts:', error);
      }
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      // API вызов для поиска контактов
      try {
        const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const searchResults: Contact[] = (data.contacts || []).map((c: any) => ({
            id: c.id,
            displayName: c.displayName || c.name || 'Unknown',
            email: c.email || '',
            avatar: c.avatar || null,
            isContact: c.isContact ?? false,
            selected: false,
          }));
          setContacts(searchResults);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Search error:', error);
        }
      }
    } else if (query.length === 0) {
      loadContacts();
    }
  };

  const toggleContact = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, selected: !c.selected } : c
    ));
  };

  const createChat = async () => {
    const selectedContacts = contacts.filter(c => c.selected);
    
    if (selectedContacts.length === 0) {
      alert({ message: 'Выберите хотя бы одного участника', type: 'warning' });
      return;
    }

    if (chatType === 'group' && !groupName.trim()) {
      alert({ message: 'Введите название группы', type: 'warning' });
      return;
    }

    setCreating(true);
    try {
      // API вызов для создания чата
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: chatType,
          name: chatType === 'group' ? groupName : undefined,
          participants: selectedContacts.map(c => c.id),
          createdBy: user?.id
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/chats/${data.chatId}`);
      } else {
        alert(data.error || 'Ошибка создания чата', 'error');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating chat:', error);
      }
      alert({ message: 'Ошибка создания чата', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const selectedCount = contacts.filter(c => c.selected).length;

  return (
    <div className="new-chat-page">
      <Header />
      
      <main className="new-chat-main">
        <div className="new-chat-container">
          {/* Header */}
          <div className="new-chat-header">
            <button className="back-btn" onClick={() => router.back()}>
              <ArrowLeft size={24} />
            </button>
            <h1>Новый чат</h1>
          </div>

          {/* Chat Type Selection */}
          <div className="chat-type-selector">
            <button
              className={`type-btn ${chatType === 'private' ? 'active' : ''}`}
              onClick={() => setChatType('private')}
            >
              <UserPlus size={24} />
              <span>Личный чат</span>
            </button>
            
            <button
              className={`type-btn ${chatType === 'group' ? 'active' : ''}`}
              onClick={() => setChatType('group')}
            >
              <Users size={24} />
              <span>Групповой чат</span>
            </button>
          </div>

          {/* Group Name Input */}
          {chatType === 'group' && (
            <div className="group-name-input">
              <label>Название группы</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Введите название группы..."
              />
            </div>
          )}

          {/* Search */}
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder={searchQuery.length >= 2 ? 'Поиск...' : 'Введите имя для поиска...'}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Contacts List */}
          <div className="contacts-list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Загрузка контактов...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="empty-state">
                <Users size={48} />
                <p>Контакты не найдены</p>
                <p className="hint">Попробуйте ввести имя для поиска</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`contact-item ${contact.selected ? 'selected' : ''}`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <div className="contact-avatar">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.displayName} />
                    ) : (
                      <span>{contact.displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  <div className="contact-info">
                    <div className="contact-name">{contact.displayName}</div>
                    <div className="contact-email">{contact.email}</div>
                  </div>

                  <div className="contact-checkbox">
                    {contact.selected && <Check size={18} />}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="new-chat-footer">
            <div className="selected-info">
              <span>{selectedCount} выбрано</span>
            </div>
            
            <button
              className="btn-primary"
              onClick={createChat}
              disabled={selectedCount === 0 || creating}
            >
              <MessageSquare size={18} />
              {creating ? 'Создание...' : 'Создать чат'}
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Alert компонент */}
      {AlertComponent}
    </div>
  );
}

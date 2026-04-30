'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { 
  Plus, Search, Star, MessageCircle, Users, MoreVertical, 
  Phone, MessageSquare, FileText, ShoppingCart, Package, 
  Building2, Video, BookOpen, Link as LinkIcon, Copy,
  Pin, PinOff, Heart, Trash2, ShieldBan, AlertTriangle,
  ArrowLeft, Image as ImageIcon
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAlert } from '@/hooks/useAlert';
import './ChatsPage.css';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
}

interface ChatItemProps {
  chat: any;
  currentUserId: string;
  translations: any;
  formatTime: (timestamp: number) => string;
  onClick: () => void;
  onActions?: (actions: any) => void;
}

function ChatItem({ chat, currentUserId, translations, formatTime, onClick, onActions }: ChatItemProps) {
  const [showActions, setShowActions] = useState(false);
  const unreadCount = chat.unreadCount?.[currentUserId] || 0;
  const isPinned = chat.pinned?.[currentUserId] || false;
  const isFavorite = chat.isFavorite?.[currentUserId] || false;
  const isSystemChat = chat.isSystemChat;
  
  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onActions?.({ action, chat });
    setShowActions(false);
  };

  return (
    <div 
      className="chat-item" 
      onClick={onClick}
      onMouseEnter={() => !isSystemChat && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div className="chat-avatar">
        <div className={`chat-avatar-image ${chat.type === 'group' ? 'chat-avatar-group' : chat.isSelf ? 'chat-avatar-notes' : 'chat-avatar-private'}`}>
          {chat.isSelf ? <FileText size={20} /> : chat.type === 'group' ? <Users size={20} /> : chat.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        {isFavorite && (
          <div className="chat-avatar-favorite">
            <Star size={10} fill="white" />
          </div>
        )}
      </div>

      <div className="chat-info">
        <div className="chat-info-top">
          <span className="chat-name">
            {chat.isSelf ? (translations.favorites || 'Избранное') : (chat.type === 'group' ? chat.name : chat.name || 'Пользователь')}
            {isSystemChat && <span className="chat-system-badge">System</span>}
          </span>
          <span className="chat-time">
            {formatTime(chat.lastMessage?.createdAt || chat.updatedAt)}
          </span>
        </div>
        <div className="chat-info-bottom">
          <p className="chat-preview">
            {chat.lastMessage?.content || translations.noMessages}
          </p>
          {unreadCount > 0 && (
            <span className="chat-unread">{unreadCount}</span>
          )}
        </div>
      </div>

      {/* Action Buttons - показываются при наведении */}
      {!isSystemChat && showActions && (
        <div className="chat-actions-overlay" onClick={(e) => e.stopPropagation()}>
          <button 
            className="chat-action-btn"
            onClick={(e) => handleAction(e, 'pin')}
            title={isPinned ? 'Открепить' : 'Закрепить'}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button 
            className="chat-action-btn"
            onClick={(e) => handleAction(e, 'favorite')}
            title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          >
            <Heart size={16} fill={isFavorite ? 'white' : 'none'} />
          </button>
          <button 
            className="chat-action-btn"
            onClick={(e) => handleAction(e, 'clear')}
            title="Очистить"
          >
            <Trash2 size={16} />
          </button>
          <button 
            className="chat-action-btn"
            onClick={(e) => handleAction(e, 'block')}
            title="Заблокировать"
          >
            <ShieldBan size={16} />
          </button>
          <button 
            className="chat-action-btn"
            onClick={(e) => handleAction(e, 'report')}
            title="Пожаловаться"
          >
            <AlertTriangle size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ContactItem({ contact, onMessage, onReport }: { 
  contact: Contact; 
  onMessage: () => void;
  onReport: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="contact-item"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="contact-avatar">
        {contact.avatar ? (
          <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          contact.name.charAt(0).toUpperCase()
        )}
      </div>
      <div className="contact-info">
        <div className="contact-name">{contact.name}</div>
        <div className="contact-phone">{contact.phone}</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="chat-actions" onClick={onMessage} style={{ opacity: 1 }}>
                  <MessageSquare size={18} />
                </button>
      </div>
    </div>
  );
}

export function ChatsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const { alert, confirm, AlertComponent, ConfirmComponent } = useAlert();
  
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'invitations'>('chats');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  
  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsPermission, setContactsPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [contactsLoading, setContactsLoading] = useState(false);
  
  // Invitations state
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [createInviteModal, setCreateInviteModal] = useState(false);
  const [newInviteLink, setNewInviteLink] = useState('');
  
  // Поиск по сообщениям
  const [searchMessagesOpen, setSearchMessagesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // 3-режимный поиск
  const [searchMode, setSearchMode] = useState<'chats' | 'messages' | 'global'>('chats');
  const [globalSearchResults, setGlobalSearchResults] = useState<any>({ users: [], chats: [] });
  const [chatSearchResults, setChatSearchResults] = useState<any[]>([]);
  
  const translations = getTranslations(language);

  // Загрузка чатов из API
  const [chats, setChats] = useState<any[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);

  // Поиск по чатам (локальный)
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Системные чаты (создаются у всех пользователей)
  const systemChats = [
    {
      id: 'favorites',
      type: 'private' as const,
      name: undefined,
      participants: [user?.id || '', user?.id || ''],
      members: { [user?.id || '']: 'author' as const },
      adminIds: [],
      createdBy: user?.id || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unreadCount: { [user?.id || '']: 0 },
      isFavorite: true,
      pinned: true,
      isRequired: true,
      isSelf: true,
      isSystemChat: true,
      lastMessage: { id: 'fav1', content: translations.yourNotes || 'Ваши заметки', type: 'text' as const, createdAt: Date.now() - 86400000 * 30 },
    },
    {
      id: 'support',
      type: 'private' as const,
      name: 'Техподдержка Balloo',
      participants: [user?.id || '', 'support'],
      members: { [user?.id || '']: 'author' as const, support: 'author' as const },
      adminIds: ['support'],
      createdBy: 'system',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      unreadCount: { [user?.id || '']: 0 },
      isFavorite: false,
      pinned: false,
      isRequired: true,
      isSelf: false,
      isSystemChat: true,
      lastMessage: { id: 'sup1', content: 'Напишите нам, если у вас возникли вопросы', type: 'text' as const, createdAt: Date.now() - 86400000 },
    },
    {
      id: 'balloo-news',
      type: 'group' as const,
      name: 'Balloo - новости и обновления',
      participants: [user?.id || '', 'system'],
      members: { [user?.id || '']: 'reader' as const, system: 'creator' as const },
      adminIds: ['system'],
      createdBy: 'system',
      createdAt: Date.now() - 86400000 * 365,
      updatedAt: Date.now() - 86400000,
      unreadCount: { [user?.id || '']: 0 },
      isFavorite: false,
      pinned: false,
      isRequired: true,
      isSelf: false,
      isSystemChat: true,
      canLeave: true,
      lastMessage: { id: 'bn1', content: 'Добро пожаловать в Balloo! Следите за новостями.', type: 'text' as const, createdAt: Date.now() - 86400000 },
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadChats();
    
    // Запрос контактов при переходе на вкладку контактов
    if (activeTab === 'contacts' && contactsPermission === 'prompt') {
      requestContactsPermission();
    }
  }, [isAuthenticated, router, activeTab]);

  const loadChats = async () => {
    try {
      setChatsLoading(true);
      const response = await fetch(`/api/chats?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        // Добавляем системные чаты к пользовательским
        const userChats = data.chats?.filter((c: any) => !['favorites', 'support', 'balloo-news'].includes(c.id)) || [];
        setChats([...systemChats, ...userChats]);
      } else {
        // Если API не работает, используем только системные чаты
        setChats(systemChats);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Chats] Error loading:', error);
      }
      setChats(systemChats);
    } finally {
      setChatsLoading(false);
    }
  };

  // Загрузка контактов с устройства (без демо-контактов)
  const requestContactsPermission = async () => {
    setContactsLoading(true);
    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const contactsManager = (navigator as any).contacts;
        const permission = await contactsManager.select(['name', 'tel', 'email'], { multiple: true });
        
        if (permission) {
          const contactsList: Contact[] = permission.map((c: any, index: number) => ({
            id: `contact_${index}`,
            name: c.name?.[0] || 'Unknown',
            phone: c.tel?.[0] || '',
            email: c.email?.[0],
          })).filter((c: Contact) => c.name !== 'Unknown' || c.phone);
          
          setContacts(contactsList);
          setContactsPermission('granted');
        }
      } else {
        // Контакты не поддерживаются браузером
        setContacts([]);
        setContactsPermission('denied');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Contacts permission denied or not available');
      }
      setContactsPermission('denied');
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  // Обработка действий с чатом
  const handleChatAction = async ({ action, chat }: { action: string; chat: any }) => {
    if (!user?.id) return;

    switch (action) {
      case 'pin':
        // Закрепить/открепить чат
        try {
          const isPinned = chat.pinned?.[user.id];
          
          // Проверка лимита на 15 закреплённых чатов
          if (!isPinned) {
            const pinnedCount = chats.filter((c: any) => c.pinned?.[user.id]).length;
            if (pinnedCount >= 15) {
              alert({ message: 'Можно закрепить максимум 15 чатов. Открепите один из чатов.', type: 'warning' });
              return;
            }
          }
          
          await fetch(`/api/chats/${chat.id}/pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, pinned: !isPinned })
          });
          loadChats();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Pin] Error:', error);
          }
        }
        break;

      case 'favorite':
        // В избранное/убрать
        try {
          const isFavorite = chat.isFavorite?.[user.id];
          await fetch(`/api/chats/${chat.id}/favorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, favorite: !isFavorite })
          });
          loadChats();
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Favorite] Error:', error);
          }
        }
        break;

      case 'clear':
        // Очистить чат
        confirm('Очистить историю сообщений?', 'warning', 'Очистить', 'Отмена')
          .then(async (confirmed) => {
            if (!confirmed) return;
            try {
              await fetch(`/api/chats/${chat.id}/clear`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
              });
              loadChats();
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[Clear] Error:', error);
              }
              alert({ message: 'Ошибка при очистке чата', type: 'error' });
            }
          });
        break;

      case 'block':
        // Заблокировать пользователя
        confirm('Заблокировать этого пользователя?', 'warning', 'Заблокировать', 'Отмена')
          .then(async (confirmed) => {
            if (!confirmed) return;
            try {
              await fetch(`/api/users/${chat.participants.find((p: string) => p !== user.id)}/block`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
              });
              loadChats();
              alert({ message: 'Пользователь заблокирован', type: 'success' });
            } catch (error) {
              if (process.env.NODE_ENV === 'development') {
                console.error('[Block] Error:', error);
              }
              alert({ message: 'Ошибка при блокировке', type: 'error' });
            }
          });
        break;

      case 'report':
        // Пожаловаться
        openReportModal(chat);
        break;
    }
  };

  // Модальное окно жалобы
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: string; id: string; name?: string } | null>(null);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDescription, setReportDescription] = useState('');

  const openReportModal = (chat: any) => {
    setReportTarget({
      type: 'chat',
      id: chat.id,
      name: chat.name || chat.participants?.find((p: string) => p !== user?.id) || 'Чат'
    });
    setReportModalOpen(true);
  };

  const submitReport = async () => {
    if (!reportTarget || !user?.id) return;

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: reportTarget.type,
          targetId: reportTarget.id,
          reportedBy: user.id,
          reason: reportReason,
          description: reportDescription
        })
      });

      if (response.ok) {
        setReportModalOpen(false);
        setReportTarget(null);
        setReportReason('spam');
        setReportDescription('');
        alert({ message: 'Жалоба отправлена. Спасибо!', type: 'success' });
      } else {
        const error = await response.json();
        alert({ message: 'Ошибка: ' + error.error, type: 'error' });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Report] Error:', error);
      }
      alert({ message: 'Не удалось отправить жалобу', type: 'error' });
    }
  };

  // Для контактов
  const openContactReportModal = (contact: Contact) => {
    setReportTarget({
      type: 'contact',
      id: contact.id,
      name: contact.name
    });
    setReportModalOpen(true);
  };

  const filteredChats = chats.filter((chat: any) => {
    const matchesSearch = !localSearchQuery || 
      (chat.name?.toLowerCase().includes(localSearchQuery.toLowerCase()));
    const matchesFavorites = showFavorites ? chat.isFavorite : true;
    return matchesSearch && matchesFavorites;
  });

  // Фильтрация контактов по поиску
  const filteredContacts = contacts.filter((contact: Contact) => {
    return !localSearchQuery || 
      contact.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      contact.phone.includes(localSearchQuery);
  });

  const pinnedChats = filteredChats.filter((c: any) => c.pinned);
  const regularChats = filteredChats.filter((c: any) => !c.pinned);

  // Поиск по сообщениям
  const handleSearchMessages = async () => {
    if (!searchQuery.trim() || !user?.id) return;

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/messages/search?q=${encodeURIComponent(searchQuery)}&userId=${user.id}&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.messages || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Search] Error:', error);
      }
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Глобальный поиск (по пользователям и чатам)
  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/global-search?q=${encodeURIComponent(searchQuery)}&type=all&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setGlobalSearchResults(data);
      } else {
        setGlobalSearchResults({ users: [], chats: [] });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Global Search] Error:', error);
      }
      setGlobalSearchResults({ users: [], chats: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  // Поиск по чатам пользователя
  const handleChatSearch = async () => {
    if (!searchQuery.trim() || !user?.id) return;

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/chats/search?q=${encodeURIComponent(searchQuery)}&userId=${user.id}&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setChatSearchResults(data.chats || []);
      } else {
        setChatSearchResults([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Chat Search] Error:', error);
      }
      setChatSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400000);
    
    if (days === 0) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return translations.yesterday || 'Вчера';
    } else if (days < 7) {
      const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      return daysOfWeek[new Date(timestamp).getDay()];
    } else {
      return new Date(timestamp).toLocaleDateString([], { day: 'numeric', month: 'numeric' });
    }
  };

  const handleCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setCallModalOpen(true);
  };

  if (!user) {
    return (
      <div className="chats-page">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="chats-page">
      <main className="chats-main">
        <div className="chats-header">
          <div className="chats-header-top">
            {/* Logo Section */}
            <div className="chats-logo-section">
              <div className="chats-logo">
                <div className="logo-balloon">🎈</div>
              </div>
              <h1 className="chats-title">
                {activeTab === 'chats' ? translations.chats : 
                 activeTab === 'contacts' ? (translations.contacts || 'Контакты') :
                 activeTab === 'invitations' ? 'Приглашения' : ''}
              </h1>
            </div>
            <button className="chats-add-button" onClick={() => {
              if (activeTab === 'invitations') {
                router.push('/invitations');
              } else {
                router.push('/chats/new');
              }
            }}>
              <Plus size={20} />
            </button>
          </div>

          {/* Navigation Buttons */}
          <nav className="chats-nav-buttons">
            <button 
              className={`chats-nav-btn ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              <MessageCircle size={16} />
              <span>{translations.chats}</span>
            </button>
            <button 
              className={`chats-nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              <Users size={16} />
              <span>{translations.contacts || 'Контакты'}</span>
            </button>
            <button 
              className={`chats-nav-btn ${activeTab === 'invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('invitations')}
            >
              <LinkIcon size={16} />
              <span>Приглашения</span>
            </button>
            <div className="chats-nav-btn disabled" title="Функция запланирована">
              <ShoppingCart size={16} />
              <span>Маркет</span>
            </div>
            <div className="chats-nav-btn disabled" title="Функция запланирована">
              <Package size={16} />
              <span>Балуниишка</span>
            </div>
            <div className="chats-nav-btn disabled" title="Функция запланирована">
              <Building2 size={16} />
              <span>Компании</span>
            </div>
            <div className="chats-nav-btn disabled" title="Функция запланирована">
              <Video size={16} />
              <span>Мои звонки</span>
            </div>
            <div className="chats-nav-btn disabled" title="Функция запланирована">
              <BookOpen size={16} />
              <span>Занятия</span>
            </div>
          </nav>

          {activeTab === 'chats' && (
            showSearch ? (
              <div className="chats-search-input-wrapper" style={{ marginTop: '0.5rem' }}>
                <Search size={18} className="chats-search-icon" />
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder={translations.search}
                  autoFocus
                  className="chats-search-input"
                />
                <button className="chats-search-close" onClick={() => { setShowSearch(false); setLocalSearchQuery(''); }}>
                  ✕
                </button>
              </div>
            ) : (
              <div className="chats-filters" style={{ marginTop: '0.5rem' }}>
                <button className="chats-filters-search" onClick={() => setShowSearch(true)}>
                  <Search size={18} />
                  <span>{translations.search}</span>
                </button>
                <button
                  className={`chats-filters-favorite ${showFavorites ? 'active' : ''}`}
                  onClick={() => setShowFavorites(!showFavorites)}
                >
                  <Star size={18} fill={showFavorites ? 'white' : 'none'} />
                  <span className="hidden sm:inline">{translations.favoriteChats}</span>
                </button>
                <button
                  className="chats-filters-search-messages"
                  onClick={() => { setSearchMessagesOpen(true); setShowSearch(true); }}
                  title="Поиск (чаты/сообщения/глобальный)"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            )
          )}

          {activeTab === 'contacts' && (
            <div className="chats-search-input-wrapper" style={{ marginTop: '0.5rem' }}>
              <Search size={18} className="chats-search-icon" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder={translations.searchContacts || 'Поиск контактов...'}
                className="chats-search-input"
              />
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'chats' ? (
          <div className="chats-list">
            {chatsLoading ? (
              <div className="chats-empty">
                <div className="spinner" />
                <p>Загрузка чатов...</p>
              </div>
            ) : (
              <>
                {pinnedChats.length > 0 && !showFavorites && (
                  <div className="chats-section-title">{translations.pinnedChats}</div>
                )}
                
                {pinnedChats.map((chat: any) => (
                  <ChatItem 
                    key={chat.id} 
                    chat={chat} 
                    currentUserId={user.id}
                    translations={translations}
                    formatTime={formatTime}
                    onClick={() => router.push(`/chats/${chat.id}`)}
                    onActions={handleChatAction}
                  />
                ))}

                {regularChats.length > 0 && (
                  <>
                    {!showFavorites && pinnedChats.length > 0 && (
                      <div className="chats-section-title">{translations.allChats}</div>
                    )}
                    {regularChats.map((chat: any) => (
                      <ChatItem 
                        key={chat.id} 
                        chat={chat} 
                        currentUserId={user.id}
                        translations={translations}
                        formatTime={formatTime}
                        onClick={() => router.push(`/chats/${chat.id}`)}
                        onActions={handleChatAction}
                      />
                    ))}
                  </>
                )}

                {filteredChats.length === 0 && !chatsLoading && (
                  <div className="chats-empty">
                    <MessageCircle size={64} className="chats-empty-icon" />
                    <p className="chats-empty-title">
                      {showFavorites ? 'Нет избранных чатов' : translations.noChats}
                    </p>
                    <p className="chats-empty-desc">
                      {showFavorites ? 'Добавьте чаты в избранное' : 'У вас пока нет чатов. Создайте первый!'}
                    </p>
                    {!showFavorites && (
                      <button className="chats-empty-button" onClick={() => router.push('/chats/new')}>
                        {translations.startConversation}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : activeTab === 'contacts' ? (
          /* Contacts List */
          <div className="contacts-list">
            {contactsLoading ? (
              <div className="contacts-empty">
                <div className="spinner" style={{ 
                  width: 32, height: 32, 
                  border: '3px solid var(--border)', 
                  borderTopColor: 'var(--primary)', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p>Загрузка контактов...</p>
              </div>
            ) : contactsPermission === 'denied' ? (
              <div className="contacts-permission">
                <Phone size={48} />
                <p>Доступ к контактам запрещён</p>
                <p>Разрешите доступ в настройках браузера</p>
                <button onClick={requestContactsPermission}>
                  Попробовать снова
                </button>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="contacts-empty">
                <Users size={48} />
                <p>{searchQuery ? 'Контакты не найдены' : 'Контакты не найдены'}</p>
                <p>{searchQuery ? 'Попробуйте другой запрос' : 'Нет контактов для отображения'}</p>
              </div>
            ) : (
              filteredContacts.map((contact: Contact) => (
                <ContactItem 
                  key={contact.id} 
                  contact={contact}
                  onMessage={() => {
                    router.push(`/chats/new?contactId=${contact.id}`);
                  }}
                  onReport={() => openContactReportModal(contact)}
                />
              ))
            )}
          </div>
        ) : (
          /* Invitations Tab */
          <div className="invitations-tab-content">
            <div className="invitations-tab-header">
              <h2>Мои приглашения</h2>
              <button 
                className="btn-primary"
                onClick={() => router.push('/invitations')}
              >
                <LinkIcon size={18} />
                <span>Управление приглашениями</span>
              </button>
            </div>
            <div className="invitations-tab-info">
              <p>Создавайте и управляйте приглашениями для ваших чатов</p>
              <div className="invitations-quick-actions">
                <button onClick={() => router.push('/invitations')}>
                  <LinkIcon size={20} />
                  <span>Все приглашения</span>
                </button>
                <button onClick={() => setCreateInviteModal(true)}>
                  <Plus size={20} />
                  <span>Создать новое</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3-режимный поиск */}
      {(searchMessagesOpen || showSearch) && (
        <Modal
          isOpen={searchMessagesOpen || showSearch}
          onClose={() => { setSearchMessagesOpen(false); setShowSearch(false); setSearchMode('chats'); setSearchQuery(''); }}
          title="Поиск"
        >
          <div className="search-messages-modal">
            {/* Режимы поиска */}
            <div className="search-mode-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <button 
                className={`btn-secondary ${searchMode === 'chats' ? 'active' : ''}`}
                onClick={() => { setSearchMode('chats'); setChatSearchResults([]); }}
              >
                По чатам
              </button>
              <button 
                className={`btn-secondary ${searchMode === 'messages' ? 'active' : ''}`}
                onClick={() => { setSearchMode('messages'); setSearchResults([]); }}
              >
                По сообщениям
              </button>
              <button
                className={`btn-secondary ${searchMode === 'global' ? 'active' : ''}`}
                onClick={() => { setSearchMode('global'); setGlobalSearchResults({ users: [], chats: [] }); }}
              >
                Глобальный
              </button>
            </div>

            {/* Поле ввода */}
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (searchMode === 'chats') handleChatSearch();
                    else if (searchMode === 'messages') handleSearchMessages();
                    else handleGlobalSearch();
                  }
                }}
                placeholder={
                  searchMode === 'chats' ? 'Поиск по чатам...' :
                  searchMode === 'messages' ? 'Поиск по сообщениям...' :
                  'Поиск по пользователям и чатам...'
                }
                className="search-messages-input"
                autoFocus
              />
              <button 
                className="search-messages-btn"
                onClick={() => {
                  if (searchMode === 'chats') handleChatSearch();
                  else if (searchMode === 'messages') handleSearchMessages();
                  else handleGlobalSearch();
                }}
                disabled={searchLoading || !searchQuery.trim()}
              >
                {searchLoading ? 'Поиск...' : 'Найти'}
              </button>
            </div>

            {/* Поиск по чатам пользователя */}
            {searchMode === 'chats' && (
              <>
                {searchLoading && (
                  <div className="search-loading">
                    <div className="spinner" />
                    <p>Поиск чатов...</p>
                  </div>
                )}

                {!searchLoading && chatSearchResults.length > 0 && (
                  <div className="search-results">
                    <p className="search-results-count">Найдено чатов: {chatSearchResults.length}</p>
                    {chatSearchResults.map((chat: any) => (
                      <div
                        key={chat.id}
                        className="search-result-item"
                        onClick={() => {
                          setSearchMessagesOpen(false);
                          setShowSearch(false);
                          router.push(`/chats/${chat.id}`);
                        }}
                      >
                        <div className="search-result-content">
                          <p className="search-result-text">{chat.name || 'Чат'}</p>
                          <span className="search-result-date">
                            {chat.lastMessage?.content?.substring(0, 50) || ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!searchLoading && searchQuery && chatSearchResults.length === 0 && (
                  <div className="search-empty">
                    <Search size={48} />
                    <p>Чаты не найдены</p>
                  </div>
                )}
              </>
            )}

            {/* Поиск по сообщениям */}
            {searchMode === 'messages' && (
              <>
                {searchLoading && (
                  <div className="search-loading">
                    <div className="spinner" />
                    <p>Поиск сообщений...</p>
                  </div>
                )}

                {!searchLoading && searchResults.length > 0 && (
                  <div className="search-results">
                    <p className="search-results-count">Найдено сообщений: {searchResults.length}</p>
                    {searchResults.map((msg: any) => (
                      <div
                        key={msg.id}
                        className="search-result-item"
                        onClick={() => {
                          setSearchMessagesOpen(false);
                          setShowSearch(false);
                          router.push(`/chats/${msg.chatId}`);
                        }}
                      >
                        <div className="search-result-content">
                          <p className="search-result-text">{msg.content}</p>
                          <span className="search-result-date">
                            {msg.chat?.name || 'Чат'} • {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <div className="search-empty">
                    <Search size={48} />
                    <p>Сообщения не найдены</p>
                  </div>
                )}
              </>
            )}

            {/* Глобальный поиск */}
            {searchMode === 'global' && (
              <>
                {searchLoading && (
                  <div className="search-loading">
                    <div className="spinner" />
                    <p>Глобальный поиск...</p>
                  </div>
                )}

                {!searchLoading && (globalSearchResults.users?.length > 0 || globalSearchResults.chats?.length > 0) && (
                  <div className="search-results">
                    {globalSearchResults.users?.length > 0 && (
                      <div>
                        <h4>Пользователи ({globalSearchResults.users.length})</h4>
                        {globalSearchResults.users.map((user: any) => (
                          <div key={user.id} className="search-result-item">
                            <div className="search-result-content">
                              <p className="search-result-text">{user.displayName || user.fullName}</p>
                              <span className="search-result-date">{user.status || 'offline'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {globalSearchResults.chats?.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4>Чаты ({globalSearchResults.chats.length})</h4>
                        {globalSearchResults.chats.map((chat: any) => (
                          <div key={chat.id} className="search-result-item">
                            <div className="search-result-content">
                              <p className="search-result-text">{chat.name || 'Чат'}</p>
                              <span className="search-result-date">{chat.description || chat.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!searchLoading && searchQuery && globalSearchResults.users?.length === 0 && globalSearchResults.chats?.length === 0 && (
                  <div className="search-empty">
                    <Search size={48} />
                    <p>Ничего не найдено</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Report Modal */}
      {reportModalOpen && reportTarget && (
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Пожаловаться"
        >
          <div className="report-modal-content">
            <p className="report-modal-subtitle">
              Жалоба на: {reportTarget.name || reportTarget.id}
            </p>

            <div className="form-group">
              <label>Причина жалобы</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="form-select"
              >
                <option value="spam">Спам</option>
                <option value="harassment">Оскорбления</option>
                <option value="inappropriate">Неуместный контент</option>
                <option value="fake">Фейковый аккаунт</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label>Описание (необязательно)</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Опишите проблему подробнее..."
                rows={4}
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setReportModalOpen(false)}
              >
                Отмена
              </button>
              <button className="btn-primary" onClick={submitReport}>
                Отправить жалобу
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert и Confirm компоненты */}
      {AlertComponent}
      {ConfirmComponent}
    </div>
  );
}

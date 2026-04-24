'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { useAlert } from '@/hooks/useAlert';
import { 
  ArrowLeft, Users, Phone, Video, MoreVertical, Paperclip, 
  Smile, Mic, Send, Star, Trash2 
} from 'lucide-react';
import './ChatPage.css';

const MESSAGE_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉', '👎', '👏', '🤝', '💯', '✨', '🎯', '💡', '⭐'];

const POPULAR_EMOJI = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
  '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
  '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥',
  '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝',
  '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁',
  '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩',
  '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡',
  '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠',
  '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿',
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
  '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
  '🎉', '🎊', '🎈', '🎁', '🎀', '🎂', '🎄', '🎃', '🎆', '🎇',
  '🔥', '✨', '⭐', '🌟', '💫', '💥', '💢', '💨', '💦', '💤',
  '👀', '👁️', '🧠', '🫀', '🫁', '🦷', '🦴', '👅', '👄', '👶'
];

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text';
  content: string;
  createdAt: number;
  readBy: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions: Record<string, { emoji: string; userId: string; createdAt: number }>;
  reactionsCount: Record<string, number>;
  replyToId?: string;
}

interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  participants: string[];
  isFavorite: boolean;
}

export function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chat: Chat = {
    id: chatId,
    type: chatId === 'balloo-news' || chatId === 'chat2' ? 'group' : 'private',
    name: chatId === 'balloo-news' ? 'Balloo - новости, фичи, план' : chatId === 'chat2' ? 'Разработчики' : undefined,
    participants: [user?.id || 'user1', 'user2'],
    isFavorite: false,
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Загрузка сообщений из API
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages?chatId=${chatId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Chat] Error loading messages:', error);
        }
        setMessages([]);
      }
    };

    loadMessages();
  }, [chatId, user, isAuthenticated, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Отправка индикатора набора текста
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (messageText && user) {
        // Отправляем событие "печатает" через API
        fetch('/api/messages/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId,
            userId: user.id,
            isTyping: true
          })
        }).catch(err => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Typing] Error:', err);
          }
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [messageText, chatId, user]);

  // Подписка на события набора текста от других пользователей
  useEffect(() => {
    const handleTypingEvent = (event: CustomEvent) => {
      if (event.detail.chatId === chatId && event.detail.userId !== user?.id) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    };

    window.addEventListener('typing' as any, handleTypingEvent as any);
    return () => window.removeEventListener('typing' as any, handleTypingEvent as any);
  }, [chatId, user]);

  const sendMessage = async () => {
    if (!messageText.trim() || !user) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          senderId: user.id,
          type: 'text',
          content: messageText.trim(),
          replyToId: replyTo?.id,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        setMessageText('');
        setReplyTo(null);
      } else {
        const error = await response.json();
        if (process.env.NODE_ENV === 'development') {
          console.error('[Send] Error:', error);
        }
        alert({ message: 'Не удалось отправить сообщение: ' + error.error, type: 'error' });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Send] Error:', error);
      }
      alert({ message: 'Не удалось отправить сообщение', type: 'error' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const reactions = { ...m.reactions };
        const reactionsCount = { ...m.reactionsCount };
        
        if (reactions[user?.id || '']) {
          delete reactions[user?.id || ''];
          reactionsCount[emoji] = (reactionsCount[emoji] || 1) - 1;
          if (reactionsCount[emoji] === 0) delete reactionsCount[emoji];
        } else {
          reactions[user?.id || ''] = { emoji, userId: user?.id || '', createdAt: Date.now() };
          reactionsCount[emoji] = (reactionsCount[emoji] || 0) + 1;
        }
        
        return { ...m, reactions, reactionsCount };
      }
      return m;
    }));
  };

  if (!user) {
    return (
      <div className="chat-page">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <div className="chat-header-left">
          <button className="chat-header-back" onClick={() => router.push('/chats')}>
            <ArrowLeft size={24} />
          </button>
          
          <div className="chat-header-avatar">
            {chat.type === 'group' ? <Users size={20} /> : 'U'}
          </div>
          
          <div className="chat-header-info">
            <h1 className="chat-header-name">
              {chat.type === 'group' ? chat.name : 'User'}
            </h1>
            <p className="chat-header-status">
              {otherUserTyping ? translations.typing : 'Был(а) недавно'}
            </p>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="chat-header-action"><Phone size={20} /></button>
          <button className="chat-header-action"><Video size={20} /></button>
          <button className="chat-header-action" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`chat-message ${message.senderId === user.id ? 'chat-message-own' : 'chat-message-other'}`}>
            <div className="chat-message-bubble">
              {message.content}
            </div>
            <div className="chat-message-time">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {replyTo && (
        <div className="chat-reply">
          <div className="chat-reply-line" />
          <div className="chat-reply-content">
            <p className="chat-reply-label">{translations.reply}</p>
            <p className="chat-reply-text">{replyTo.content}</p>
          </div>
          <button className="chat-reply-close" onClick={() => setReplyTo(null)}>
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <button className="chat-input-action"><Paperclip size={20} /></button>
          
          <textarea
            ref={inputRef as any}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={translations.typeMessage}
            rows={1}
            className="chat-input-field"
          />
          
          <div className="chat-input-actions-right">
            <button className="chat-input-action" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile size={20} />
            </button>
            {messageText.trim() ? (
              <button className="chat-input-send" onClick={sendMessage}>
                <Send size={20} />
              </button>
            ) : (
              <button className="chat-input-action"><Mic size={20} /></button>
            )}
          </div>
        </div>

        {showEmojiPicker && (
          <div className="chat-emoji-picker">
            <div className="emoji-section">
              <div className="emoji-section-title">Реакции</div>
              <div className="emoji-grid">
                {MESSAGE_REACTIONS.map((emoji) => (
                  <button 
                    key={emoji} 
                    className="chat-emoji-button" 
                    onClick={() => { setMessageText(prev => prev + emoji); setShowEmojiPicker(false); }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="emoji-section">
              <div className="emoji-section-title">Популярные</div>
              <div className="emoji-grid">
                {POPULAR_EMOJI.slice(0, 40).map((emoji) => (
                  <button 
                    key={emoji} 
                    className="chat-emoji-button" 
                    onClick={() => { setMessageText(prev => prev + emoji); }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <button 
              className="emoji-close-btn"
              onClick={() => setShowEmojiPicker(false)}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>

      {showMobileMenu && (
        <div className="chat-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="chat-menu-content" onClick={(e) => e.stopPropagation()}>
            <button className="chat-menu-item">
              <Star size={20} />
              <span>{translations.favoriteChats}</span>
            </button>
            <button className="chat-menu-item">
              <Users size={20} />
              <span>{translations.addParticipants}</span>
            </button>
            <button className="chat-menu-item chat-menu-item-danger">
              <Trash2 size={20} />
              <span>{translations.delete}</span>
            </button>
          </div>
        </div>
      )}

      {AlertComponent}
    </div>
  );
}
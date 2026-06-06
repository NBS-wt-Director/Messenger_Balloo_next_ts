'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useE2EEncryption } from '@/hooks/useE2EEncryption';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getTranslations } from '@/i18n';
import { useAlert } from '@/hooks/useAlert';
import { 
  ArrowLeft, Users, Phone, PhoneOff, Video, VideoOff, MoreVertical, Paperclip, 
  Smile, Mic, Send, Star, Trash2, Image as ImageIcon, Film, FileText,
  Forward, Copy, Share2, Bell, BellOff, Archive, Lock, Unlock
} from 'lucide-react';
import { getMessages, sendMessage as sendApiMessage, sendTyping, toggleMute } from '@/api/chats';
import { messagesApi } from '@/api/client';
import { createCall, endCall, updateCall } from '@/api/calls';
import { AttachmentViewer, AttachmentThumbnail } from '@/components/AttachmentViewer';
import { CallInterface } from '@/components/CallInterface';
import type { Attachment } from '@/types';
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
  type: 'text' | 'image' | 'video' | 'file' | 'audio';
  content: string;
  createdAt: number;
  readBy: string[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions: Record<string, { emoji: string; userId: string; createdAt: number }>;
  reactionsCount: Record<string, number>;
  replyToId?: string;
  attachmentId?: string;
  attachment?: Attachment;
  forwardFromId?: string;
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
  const chatId = (params?.id as string) || '';
  
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const { alert, AlertComponent } = useAlert();
  
  // E2E Encryption
  const e2e = useE2EEncryption();
  
  // WebSocket
  const ws = useWebSocket({
    enabled: isAuthenticated,
    chatId,
    onMessageReceived: (message) => {
      // Расшифровка сообщения если нужно
      if (message.encrypted && e2e.isReady) {
        const decrypted = e2e.decryptMessage(message.content, message.senderId);
        if (decrypted) {
          message.content = decrypted;
          message.decrypted = true;
        }
      }
      setMessages(prev => [...prev, message]);
    },
  });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showMessageMenu, setShowMessageMenu] = useState<{ messageId: string; x: number; y: number } | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [messageToForward, setMessageToForward] = useState<Message | null>(null);
  const [forwardToChatId, setForwardToChatId] = useState('');
  const [showMuteMenu, setShowMuteMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [currentCall, setCurrentCall] = useState<{ id: string; type: 'audio' | 'video'; peerId: string; peerName: string; peerAvatar?: string; isInitiator: boolean } | null>(null);
  const [isE2EReady, setIsE2EReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Инициализация E2E при загрузке чата
  useEffect(() => {
    if (e2e.isReady && !isE2EReady) {
      setIsE2EReady(true);
      // TODO: Загрузить публичный ключ собеседника из API
      // const peerPublicKey = await getPeerPublicKey(otherUserId);
      // e2e.setPeerPublicKey(otherUserId, peerPublicKey);
    }
  }, [e2e.isReady, isE2EReady]);

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
        const result = await getMessages(chatId);
        if (result.success) {
          setMessages(result.messages || []);
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
        sendTyping(chatId).catch(err => {
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
      let content = messageText.trim();
      let encrypted = false;

      // Шифрование если E2E готов и это private чат
      if (e2e.isReady && chat.type === 'private') {
        const otherUserId = chat.participants.find((p: string) => p !== user.id);
        if (otherUserId) {
          const encryptedContent = e2e.encryptMessage(content, otherUserId);
          if (encryptedContent) {
            content = encryptedContent;
            encrypted = true;
          }
        }
      }

      // Отправка через WebSocket если подключен
      if (ws.isConnected && !encrypted) {
        ws.sendMessage(chatId, content);
      }

      // Отправка через API
      const result = await sendApiMessage(chatId, {
        text: content,
        replyToId: replyTo?.id,
      });

      if (result.success) {
        setMessages(prev => [...prev, result.message]);
        setMessageText('');
        setReplyTo(null);
      } else {
        alert({ message: 'Не удалось отправить сообщение: ' + (result.error || 'Unknown error'), type: 'error' });
      }
    } catch (error: any) {
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

  const handleForwardMessage = async () => {
    if (!messageToForward || !forwardToChatId) {
      alert({ message: 'Выберите чат для пересылки', type: 'error' });
      return;
    }

    try {
      const result = await messagesApi.forward(messageToForward.id, forwardToChatId);
      
      if (result.success) {
        alert({ message: 'Сообщение переслано', type: 'success' });
        setShowForwardDialog(false);
        setMessageToForward(null);
        setForwardToChatId('');
      } else {
        alert({ message: 'Не удалось переслать сообщение', type: 'error' });
      }
    } catch (error: any) {
      console.error('[Forward] Error:', error);
      alert({ message: 'Ошибка при пересылке сообщения', type: 'error' });
    }
  };

  const handleShowMessageMenu = (e: React.MouseEvent, messageId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessageMenu({ messageId, x: e.clientX, y: e.clientY });
  };

  const handleSelectForward = (message: Message) => {
    setMessageToForward(message);
    setShowMessageMenu(null);
    setShowForwardDialog(true);
  };

  const handleMuteChat = async (duration: number | null) => {
    try {
      const result = await toggleMute(chatId, duration !== null, duration ? Date.now() + duration : null);
      
      if (result.success) {
        setIsMuted(duration !== null);
        setShowMuteMenu(false);
        alert({ 
          message: duration ? `Уведомления отключены на ${duration / 3600000} ч.` : 'Уведомления включены', 
          type: 'success' 
        });
      } else {
        alert({ message: result.error || 'Не удалось изменить настройки уведомлений', type: 'error' });
      }
    } catch (error: any) {
      console.error('[Mute] Error:', error);
      alert({ message: 'Ошибка при изменении настроек уведомлений', type: 'error' });
    }
  };

  const startCall = async (type: 'audio' | 'video') => {
    try {
      const result = await createCall(chatId, type, chatId);
      
      if (result.success && result.data) {
        setCurrentCall({
          id: result.data.id,
          type,
          peerId: chatId,
          peerName: chat.type === 'group' ? chat.name || 'Группа' : 'Пользователь',
          peerAvatar: undefined,
          isInitiator: true
        });
        setShowCallInterface(true);
      } else {
        alert({ message: 'Не удалось начать звонок', type: 'error' });
      }
    } catch (error: any) {
      console.error('[Call] Start error:', error);
      alert({ message: 'Ошибка при начале звонка', type: 'error' });
    }
  };

  const handleCallSignal = async (callId: string, data: any) => {
    try {
      await updateCall(callId, data);
    } catch (error: any) {
      console.error('[Call] Signal error:', error);
    }
  };

  const handleCallEnd = async (callId: string, duration: number) => {
    try {
      await endCall(callId, duration);
    } catch (error: any) {
      console.error('[Call] End error:', error);
    } finally {
      setShowCallInterface(false);
      setCurrentCall(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Проверка размера файла (макс 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert({ 
        message: `Размер файла не должен превышать 100MB. Ваш файл: ${(file.size / (1024 * 1024)).toFixed(2)}MB`, 
        type: 'error' 
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);
      formData.append('messageId', `temp_${Date.now()}`);
      formData.append('uploaderId', user.id);

      // Создаём XMLHttpRequest для отслеживания прогресса
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        
        xhr.open('POST', '/api/yandex-disk/upload');
        xhr.send(formData);
      });

      const result = await uploadPromise;
      
      if (result.success && result.attachment) {
        // Отправка сообщения с вложением
        const sendResult = await sendApiMessage(chatId, {
          attachmentIds: [result.attachment.id],
          text: '',
        });

        if (sendResult.success) {
          // Добавляем сообщение с вложением локально
          const newMessage: Message = {
            ...sendResult.message,
            attachment: result.attachment,
          };
          setMessages(prev => [...prev, newMessage]);
          alert({ message: 'Файл загружен', type: 'success' });
        }
      }
    } catch (error: any) {
      console.error('[File Upload] Error:', error);
      alert({ 
        message: 'Ошибка загрузки файла: ' + (error.message || 'Неизвестная ошибка'), 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowAttachMenu(false);
      // Очистить input file
      e.target.value = '';
    }
  };

  const openAttachMenu = () => {
    setShowAttachMenu(!showAttachMenu);
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
              {chat.type === 'private' && isE2EReady && (
                <Lock size={14} className="e2e-indicator" />
              )}
            </h1>
            <p className="chat-header-status">
              {otherUserTyping ? translations.typing : 'Был(а) недавно'}
            </p>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="chat-header-action" onClick={() => startCall('audio')} title="Аудиозвонок">
            <Phone size={20} />
          </button>
          <button className="chat-header-action" onClick={() => startCall('video')} title="Видеозвонок">
            <Video size={20} />
          </button>
          <button className="chat-header-action" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`chat-message ${message.senderId === user.id ? 'chat-message-own' : 'chat-message-other'}`}
            onContextMenu={(e) => handleShowMessageMenu(e, message.id)}
          >
            <div className="chat-message-bubble">
              {/* Вложения */}
              {message.attachment && (
                <div className="message-attachment">
                  <AttachmentThumbnail 
                    attachment={message.attachment}
                    onClick={() => setSelectedAttachment(message.attachment!)}
                  />
                </div>
              )}
              
              {/* Информация о пересылке */}
              {message.forwardFromId && (
                <div className="message-forward-info">
                  <Forward size={14} />
                  <span>Переслано от {message.senderId === user.id ? 'вас' : 'пользователя'}</span>
                </div>
              )}
              
              {/* Реакции */}
              {message.reactionsCount && Object.keys(message.reactionsCount).length > 0 && (
                <div className="message-reactions">
                  {Object.entries(message.reactionsCount).map(([emoji, count]) => (
                    <span 
                      key={emoji} 
                      className={`reaction-badge ${message.reactions?.[user?.id || '']?.emoji === emoji ? 'active' : ''}`}
                      onClick={() => handleReact(message.id, emoji)}
                    >
                      {emoji} {count > 1 && count}
                    </span>
                  ))}
                </div>
              )}
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
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <button className="chat-input-action" onClick={() => document.getElementById('file-upload')?.click()}>
            <Paperclip size={20} />
          </button>
          
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

      {/* Меню вложений */}
      {showAttachMenu && (
        <div className="attach-menu">
          <button className="attach-menu-item" onClick={() => document.getElementById('file-upload')?.click()}>
            <ImageIcon size={20} />
            <span>Фото</span>
          </button>
          <button className="attach-menu-item" onClick={() => document.getElementById('file-upload')?.click()}>
            <Film size={20} />
            <span>Видео</span>
          </button>
          <button className="attach-menu-item" onClick={() => document.getElementById('file-upload')?.click()}>
            <FileText size={20} />
            <span>Документ</span>
          </button>
        </div>
      )}

      {/* Прогресс загрузки */}
      {isUploading && (
        <div className="upload-progress-overlay">
          <div className="upload-progress-content">
            <div className="upload-spinner" />
            <p>Загрузка файла... {uploadProgress}%</p>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        </div>
      )}

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

      {/* Модальное окно просмотра вложений */}
      {selectedAttachment && (
        <div className="attachment-modal-overlay" onClick={() => setSelectedAttachment(null)}>
          <div className="attachment-modal-content" onClick={(e) => e.stopPropagation()}>
            <AttachmentViewer 
              attachment={selectedAttachment}
              onClose={() => setSelectedAttachment(null)}
            />
          </div>
        </div>
      )}

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
            
            {/* Mute Menu */}
            <div className="chat-menu-item" onClick={(e) => { e.stopPropagation(); setShowMuteMenu(!showMuteMenu); }}>
              {isMuted ? <BellOff size={20} /> : <Bell size={20} />}
              <span>{isMuted ? 'Включить уведомления' : 'Отключить уведомления'}</span>
            </div>
            
            {showMuteMenu && (
              <div className="mute-submenu">
                <button className="mute-option" onClick={() => handleMuteChat(3600000)}>
                  На 1 час
                </button>
                <button className="mute-option" onClick={() => handleMuteChat(28800000)}>
                  На 8 часов
                </button>
                <button className="mute-option" onClick={() => handleMuteChat(86400000)}>
                  На 24 часа
                </button>
                <button className="mute-option" onClick={() => handleMuteChat(null)}>
                  Включить уведомления
                </button>
              </div>
            )}
            
            <button className="chat-menu-item">
              <Archive size={20} />
              <span>Архивировать</span>
            </button>
            <button className="chat-menu-item chat-menu-item-danger">
              <Trash2 size={20} />
              <span>{translations.delete}</span>
            </button>
          </div>
        </div>
      )}

      {/* Контекстное меню сообщения */}
      {showMessageMenu && (
        <div 
          className="message-menu-overlay" 
          onClick={() => setShowMessageMenu(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}
        >
          <div 
            className="message-menu"
            style={{ 
              position: 'absolute', 
              left: Math.min(showMessageMenu.x, window.innerWidth - 200), 
              top: Math.min(showMessageMenu.y, window.innerHeight - 200) 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="message-menu-item"
              onClick={() => {
                const msg = messages.find(m => m.id === showMessageMenu.messageId);
                if (msg) handleSelectForward(msg);
              }}
            >
              <Forward size={18} />
              <span>Переслать</span>
            </button>
            <button className="message-menu-item">
              <Copy size={18} />
              <span>Копировать</span>
            </button>
            <button className="message-menu-item">
              <Share2 size={18} />
              <span>Поделиться</span>
            </button>
          </div>
        </div>
      )}

      {/* Диалог пересылки */}
      {showForwardDialog && (
        <div className="forward-dialog-overlay" onClick={() => setShowForwardDialog(false)}>
          <div className="forward-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Переслать сообщение</h3>
            <p className="forward-preview">{messageToForward?.content}</p>
            
            <div className="forward-chats-list">
              {/* Здесь должен быть список чатов - заглушка */}
              <div className="forward-chat-item" onClick={() => setForwardToChatId(chatId)}>
                <div className="forward-chat-avatar">
                  <Users size={20} />
                </div>
                <div className="forward-chat-info">
                  <span className="forward-chat-name">Текущий чат</span>
                </div>
              </div>
              {/* TODO: Загрузить реальный список чатов */}
            </div>
            
            <div className="forward-dialog-actions">
              <button 
                className="forward-dialog-cancel"
                onClick={() => setShowForwardDialog(false)}
              >
                Отмена
              </button>
              <button 
                className="forward-dialog-send"
                onClick={handleForwardMessage}
                disabled={!forwardToChatId}
              >
                Переслать
              </button>
            </div>
          </div>
        </div>
      )}

      {AlertComponent}
    </div>
  );

  // Call Interface
  if (showCallInterface && currentCall) {
    return (
      <CallInterface
        callId={currentCall!.id}
        type={currentCall!.type}
        peerId={currentCall!.peerId}
        peerName={currentCall!.peerName}
        peerAvatar={currentCall!.peerAvatar || undefined}
        isInitiator={currentCall!.isInitiator}
        onEnd={handleCallEnd}
        onSignal={handleCallSignal}
      />
    );
  }
}
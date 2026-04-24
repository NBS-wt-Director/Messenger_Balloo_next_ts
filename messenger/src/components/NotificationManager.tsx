'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/lib/notifications';
import { Modal } from '@/components/ui/Modal';
import { useAlert } from '@/hooks/useAlert';
import './NotificationManager.css';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'message' | 'system' | 'friend';
  read: boolean;
  createdAt: number;
  icon?: string;
  url?: string;
}

export function NotificationManager() {
  const { status, loading, subscribe, unsubscribe, isSupported, hasPermission, isSubscribed } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { alert, AlertComponent } = useAlert();

  // VAPID public key - должен быть в .env.local
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
    'BNJLyFhP7q8K9KqJZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xK';

  // Загрузка уведомлений из API
  useEffect(() => {
    if (!loading) {
      loadNotifications();
    }
  }, [loading]);

  const loadNotifications = async () => {
    try {
      // Получение userId из localStorage или контекста
      const userId = localStorage.getItem('balloo_userId');
      
      if (!userId) {
        setLocalNotifications([]);
        setUnreadCount(0);
        return;
      }

      const response = await fetch(`/api/notifications?userId=${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        const notifications = data.notifications || [];
        
        setLocalNotifications(notifications);
        setUnreadCount(notifications.filter((n: any) => !n.read).length);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('[NotificationManager] Failed to load notifications');
        }
        setLocalNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[NotificationManager] Error loading notifications:', error);
      }
      setLocalNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleSubscribe = async () => {
    if (!isSupported) {
      alert({ message: 'Ваш браузер не поддерживает push-уведомления', type: 'warning' });
      return;
    }

    const success = await subscribe(vapidPublicKey);
    if (success) {
      showLocalNotification('Уведомления включены', 'Вы будете получать уведомления о новых сообщениях');
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe();
    if (success) {
      showLocalNotification('Уведомления отключены', 'Push-уведомления больше не будут приходить');
    }
  };

  const showLocalNotification = (title: string, body: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192x192.png'
      });
    }
  };

  const markAsRead = (id: string) => {
    setLocalNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <button
        className="notification-toggle"
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        title="Уведомления"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {notificationsOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Уведомления</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-read-btn">
                Отметить все прочитанными
              </button>
            )}
          </div>

          <div className="notification-content">
            {!isSupported ? (
              <div className="notification-empty">
                <Bell size={48} className="notification-empty-icon" />
                <p>Ваш браузер не поддерживает push-уведомления</p>
              </div>
            ) : !hasPermission ? (
              <div className="notification-permission">
                <Bell size={48} className="notification-empty-icon" />
                <p>Разрешите уведомления в настройках браузера</p>
                <button onClick={handleSubscribe} className="btn-primary">
                  Включить уведомления
                </button>
              </div>
            ) : !isSubscribed ? (
              <div className="notification-subscribe">
                <Bell size={48} className="notification-empty-icon" />
                <p>Включите push-уведомления для получения сообщений</p>
                <button onClick={handleSubscribe} className="btn-primary">
                  Подписаться
                </button>
              </div>
            ) : localNotifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={48} className="notification-empty-icon" />
                <p>У вас пока нет уведомлений</p>
              </div>
            ) : (
              <div className="notification-list">
                {localNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => {
                      markAsRead(notification.id);
                      setNotificationsOpen(false);
                      if (notification.url) {
                        window.location.href = notification.url;
                      }
                    }}
                  >
                    <div className="notification-icon">
                      {notification.type === 'message' && '💬'}
                      {notification.type === 'system' && '⚙️'}
                      {notification.type === 'friend' && '👤'}
                    </div>
                    <div className="notification-body">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-text">{notification.body}</div>
                      <div className="notification-time">
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                    <button
                      className="notification-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isSubscribed && (
            <div className="notification-footer">
              <button onClick={handleUnsubscribe} className="btn-secondary">
                Отписаться
              </button>
            </div>
          )}
        </div>
      )}

      {AlertComponent}
    </>
  );
}

function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Только что';
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  if (days < 7) return `${days} дн. назад`;
  return new Date(timestamp).toLocaleDateString();
}

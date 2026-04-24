 'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export interface NotificationToken {
  token: string;
  platform: 'web' | 'android' | 'ios';
  createdAt: number;
  expiresAt?: number;
}

// Используем браузерный тип PushSubscription вместо кастомного интерфейса

export class NotificationManager {
  private static instance: NotificationManager;
  private subscription: globalThis.PushSubscription | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Проверка поддержки уведомлений
   */
  async isSupported(): Promise<boolean> {
    if (!('Notification' in window)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Уведомления не поддерживаются в этом браузере');
      }
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Service Worker не поддерживается');
      }
      return false;
    }

    if (!('PushManager' in window)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Push Manager не поддерживается');
      }
      return false;
    }

    return true;
  }

  /**
   * Запрос разрешения на уведомления
   */
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка запроса разрешения:', error);
      }
      return false;
    }
  }

  /**
   * Регистрация Service Worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('Service Worker зарегистрирован:', registration.scope);
      }
      return registration;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка регистрации Service Worker:', error);
      }
      throw error;
    }
  }

  /**
   * Подписка на push-уведомления
   */
  async subscribeToPush(vapidPublicKey: string): Promise<globalThis.PushSubscription> {
    const registration = await this.registerServiceWorker();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey).buffer.slice(0) as ArrayBuffer
    });

    this.subscription = subscription;
    return subscription;
  }

  /**
   * Отписка от push-уведомлений
   */
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.subscription) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Нет активной подписки');
      }
      return false;
    }

    try {
      const unsubscribed = await this.subscription.unsubscribe();
      this.subscription = null;
      return unsubscribed;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка отписки:', error);
      }
      return false;
    }
  }

  /**
   * Получение активной подписки
   */
  async getActiveSubscription(): Promise<globalThis.PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка получения подписки:', error);
      }
      return null;
    }
  }

  /**
   * Отправка токена на сервер
   */
  async sendTokenToServer(token: string, userId: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: 'web',
          userId
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки токена на сервер');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Токен успешно отправлен на сервер');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка при отправке токена:', error);
      }
      throw error;
    }
  }

  /**
   * Удаление токена с сервера
   */
  async removeTokenFromServer(token: string): Promise<void> {
    try {
      const response = await fetch('/api/notifications/token', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления токена с сервера');
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Токен успешно удален с сервера');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка при удалении токена:', error);
      }
      throw error;
    }
  }

  /**
   * Преобразование VAPID ключа в Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Показ уведомления
   */
  showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (Notification.permission !== 'granted') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Разрешение на уведомления не получено');
      }
      return null;
    }

    try {
      const notification = new Notification(title, options);
      return notification;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка показа уведомления:', error);
      }
      return null;
    }
  }

  /**
   * Очистка всех уведомлений
   */
  async clearAllNotifications(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Проверяем поддержку getNotifications
        if ('getNotifications' in registration) {
          const notifications = await (registration as any).getNotifications();
          notifications.forEach((n: Notification) => n.close());
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Ошибка очистки уведомлений:', error);
        }
      }
    }
  }

  /**
   * Получение статуса уведомлений
   */
  async getStatus(): Promise<{
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
  }> {
    const supported = await this.isSupported();
    const permission = Notification.permission;
    
    let subscribed = false;
    if (supported) {
      const subscription = await this.getActiveSubscription();
      subscribed = subscription !== null;
    }

    return {
      supported,
      permission,
      subscribed
    };
  }
}

/**
 * Хук для работы с уведомлениями
 */
export function useNotifications() {
  const { user, isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState<{
    supported: boolean;
    permission: NotificationPermission;
    subscribed: boolean;
  }>({
    supported: false,
    permission: 'default',
    subscribed: false
  });
  const [loading, setLoading] = useState(true);

  const notificationManager = NotificationManager.getInstance();

  // Проверка статуса при монтировании
  useEffect(() => {
    const checkStatus = async () => {
      const newStatus = await notificationManager.getStatus();
      setStatus(newStatus);
      setLoading(false);
    };
      
    checkStatus();
  }, []);

  // Подписка при авторизации
  useEffect(() => {
    if (isAuthenticated && user) {
      handleSubscribe();
    }
  }, [isAuthenticated, user]);

  /**
   * Подписка на уведомления
   */
  const subscribe = async (vapidPublicKey?: string): Promise<boolean> => {
    if (!vapidPublicKey) {
      if (process.env.NODE_ENV === 'development') {
        console.error('VAPID public key не указан');
      }
      return false;
    }

    try {
      const hasPermission = await notificationManager.requestPermission();
      if (!hasPermission) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Разрешение на уведомления отклонено');
        }
        return false;
      }

      const subscription = await notificationManager.subscribeToPush(vapidPublicKey);
      
      if (user) {
        await notificationManager.sendTokenToServer(
          JSON.stringify(subscription),
          user.id
        );
      }

      const newStatus = await notificationManager.getStatus();
      setStatus(newStatus);
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка подписки:', error);
      }
      return false;
    }
  };

  /**
   * Отписка от уведомлений
   */
  const unsubscribe = async (): Promise<boolean> => {
    try {
      if (status.subscribed) {
        const subscription = await notificationManager.getActiveSubscription();
        if (subscription) {
          await notificationManager.removeTokenFromServer(
            JSON.stringify(subscription)
          );
        }
      }

      await notificationManager.unsubscribeFromPush();
      
      const newStatus = await notificationManager.getStatus();
      setStatus(newStatus);
      
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Ошибка отписки:', error);
      }
      return false;
    }
  };

  /**
   * Обновление статуса
   */
  const refreshStatus = async () => {
    const newStatus = await notificationManager.getStatus();
    setStatus(newStatus);
  };

  const handleSubscribe = async () => {
    // VAPID public key из переменных окружения
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
      'BNJLyFhP7q8K9KqJZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xKZ9xK';
    
    if (status.permission === 'granted' && !status.subscribed) {
      await subscribe(vapidPublicKey);
    }
  };

  return {
    status,
    loading,
    subscribe,
    unsubscribe,
    refreshStatus,
    isSupported: status.supported,
    hasPermission: status.permission === 'granted',
    isSubscribed: status.subscribed
  };
}


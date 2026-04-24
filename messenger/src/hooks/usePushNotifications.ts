'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAlert } from './useAlert';

interface PushSubscriptionStatus {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission;
  loading: boolean;
  error: string | null;
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Хук для управления Push-уведомлениями
 * Работает в любом браузере с поддержкой Push API
 */
export function usePushNotifications() {
  const [status, setStatus] = useState<PushSubscriptionStatus>({
    isSupported: false,
    isSubscribed: false,
    permission: 'default',
    loading: true,
    error: null,
  });

  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null);
  const { alert } = useAlert();

  // Проверка поддержки Push API
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
      
      setStatus(prev => ({
        ...prev,
        isSupported,
        loading: false,
      }));

      if (isSupported) {
        // Получаем VAPID ключ
        try {
          const response = await fetch('/api/notifications/vapid-key');
          const data = await response.json();
          if (data.success) {
            setVapidPublicKey(data.publicKey);
          }
        } catch (error) {
          if (isDevelopment) console.error('[Push] Error getting VAPID key:', error);
        }
      }
    };

    checkSupport();
  }, []);

  // Проверка текущей подписки и разрешения
  const checkSubscription = useCallback(async (userId: string | null) => {
    if (!status.isSupported || !userId) return;

    try {
      // Проверяем разрешение
      const permission = Notification.permission;
      
      // Проверяем подписку
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setStatus(prev => ({
        ...prev,
        permission,
        isSubscribed: !!subscription,
      }));
    } catch (error) {
      if (isDevelopment) console.error('[Push] Error checking subscription:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Не удалось проверить подписку',
      }));
    }
  }, [status.isSupported]);

  // Запрос разрешения на уведомления
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      setStatus(prev => ({
        ...prev,
        error: 'Ваш браузер не поддерживает уведомления',
      }));
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      setStatus(prev => ({
        ...prev,
        permission,
      }));

      return permission === 'granted';
    } catch (error) {
      if (isDevelopment) console.error('[Push] Error requesting permission:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Не удалось запросить разрешение',
      }));
      return false;
    }
  }, []);

  // Подписка на push-уведомления
  const subscribe = useCallback(async (userId: string): Promise<boolean> => {
    if (!status.isSupported) {
      setStatus(prev => ({
        ...prev,
        error: 'Push API не поддерживается',
      }));
      return false;
    }

    if (!vapidPublicKey) {
      setStatus(prev => ({
        ...prev,
        error: 'VAPID ключ не загружен',
      }));
      return false;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));

      // Запрашиваем разрешение
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        throw new Error('Разрешение не получено');
      }

      // Регистрируем Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Подписываемся на push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer.slice(0) as ArrayBuffer,
      });

      // Отправляем подписку на сервер
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.getKey('p256dh') ? arrayBufferToBase64(subscription.getKey('p256dh')!) : '',
              auth: subscription.getKey('auth') ? arrayBufferToBase64(subscription.getKey('auth')!) : '',
            },
          },
          platform: 'web',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка подписки');
      }

      setStatus(prev => ({
        ...prev,
        isSubscribed: true,
        loading: false,
        error: null,
      }));

      if (isDevelopment) console.log('[Push] Subscribed successfully:', data);
      return true;
    } catch (error: any) {
      if (isDevelopment) console.error('[Push] Subscribe error:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Не удалось подписаться',
      }));
      return false;
    }
  }, [status.isSupported, vapidPublicKey, requestPermission]);

  // Отписка от push-уведомлений
  const unsubscribe = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setStatus(prev => ({ ...prev, loading: true }));

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setStatus(prev => ({ ...prev, loading: false }));
        return true;
      }

      // Отписываемся на уровне браузера
      await subscription.unsubscribe();

      // Отписываемся на сервере
      await fetch('/api/notifications/subscribe', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      setStatus(prev => ({
        ...prev,
        isSubscribed: false,
        loading: false,
        error: null,
      }));

      if (isDevelopment) console.log('[Push] Unsubscribed successfully');
      return true;
    } catch (error: any) {
      if (isDevelopment) console.error('[Push] Unsubscribe error:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Не удалось отписаться',
      }));
      return false;
    }
  }, []);

  // Отправка тестового уведомления
  const sendTestNotification = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: 'Balloo Messenger - Тест',
          body: 'Это тестовое уведомление! ✅',
          url: '/settings',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'test-notification',
          requireInteraction: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отправки');
      }

      if (isDevelopment) console.log('[Push] Test notification sent:', data);
      return true;
    } catch (error: any) {
      if (isDevelopment) console.error('[Push] Send test error:', error);
      alert({ message: 'Ошибка: ' + error.message, type: 'error' } as any);
      return false;
    }
  }, [alert]);

  return {
    ...status,
    subscribe,
    unsubscribe,
    requestPermission,
    checkSubscription,
    sendTestNotification,
  };
}

// Утилиты для конвертации ключей
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
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

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}

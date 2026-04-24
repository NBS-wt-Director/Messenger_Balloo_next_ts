/**
 * Регистрация Service Worker для PWA и Push-уведомлений
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!('serviceWorker' in navigator)) {
    if (isDevelopment) console.log('[SW] Service Worker не поддерживается');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      type: 'module',
    });

    if (isDevelopment) console.log('[SW] Service Worker зарегистрирован:', registration.scope);

    // Обработка обновлений
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          if (isDevelopment) console.log('[SW] Доступно обновление');
          // Можно показать пользователю уведомление об обновлении
        }
      });
    });

    return registration;
  } catch (error) {
    if (isDevelopment) console.error('[SW] Ошибка регистрации Service Worker:', error);
    return null;
  }
}

/**
 * Отмена регистрации Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    if (isDevelopment) console.log('[SW] Service Worker отменён:', success);
    return success;
  } catch (error) {
    if (isDevelopment) console.error('[SW] Ошибка отмены регистрации:', error);
    return false;
  }
}

/**
 * Отправка сообщения Service Worker
 */
export async function sendMessageToWorker(message: any): Promise<void> {
  if (!navigator.serviceWorker.controller) {
    if (isDevelopment) console.log('[SW] Service Worker не активен');
    return;
  }

  navigator.serviceWorker.controller.postMessage(message);
}

/**
 * Получение активной подписки на push
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    if (isDevelopment) console.error('[Push] Ошибка получения подписки:', error);
    return null;
  }
}

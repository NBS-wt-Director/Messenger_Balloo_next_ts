
// Service Worker для Secure Messenger
// Обработка push-уведомлений и фоновая синхронизация

const CACHE_NAME = 'balloo-v1';
const urlsToCache = [
  '/',
  '/chats',
  '/login',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэширование статических ресурсов');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Получено push-уведомление');
  
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Новое сообщение', body: 'Нажмите, чтобы открыть' };
  }

  const title = data.title || 'Secure Messenger';
  const options = {
    body: data.body || 'У вас новое сообщение',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    data: data.data || {},
    tag: data.tag || 'default',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Клик по уведомлению');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Если окно уже открыто, фокусируемся на нём
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Иначе открываем новое окно
      if (clients.openWindow) {
        return clients.openWindow('/chats');
      }
    })
  );
});

// Обработка фоновой синхронизации
self.addEventListener('sync', (event) => {
  console.log('[SW] Фоновая синхронизация:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Здесь можно добавить логику синхронизации сообщений
      Promise.resolve()
    );
  }
});

// перехват запросов (опционально, для офлайн режима)
self.addEventListener('fetch', (event) => {
  // Стратегия: cache first, then network
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              return response;
            });
        })
    );
  }
});

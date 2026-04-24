'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker } from '@/lib/service-worker';

/**
 * Компонент для регистрации Service Worker
 * Должен быть на клиенте (use client)
 */
export function ServiceWorkerRegistration() {
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    async function register() {
      if (registered) return;

      const registration = await registerServiceWorker();
      
      if (registration) {
        setRegistered(true);
        if (process.env.NODE_ENV === 'development') {
          console.log('[SW] Service Worker готов');
        }
      }
    }

    register();
  }, [registered]);

  return null; // Не рендерит ничего видимого
}

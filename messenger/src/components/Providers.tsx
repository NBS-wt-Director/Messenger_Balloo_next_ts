'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';
import { PWAInstall } from '@/components/PWAInstall';
import { ensureDBInitialized } from '@/lib/db-init';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Инициализация базы данных при запуске приложения
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await ensureDBInitialized();
        if (process.env.NODE_ENV === 'development') {
          console.log('[Providers] ✅ База данных готова к работе');
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[Providers] ❌ Ошибка инициализации БД:', error);
        }
      }
    };

    initDatabase();
  }, []);

  return (
    <>
      {children}
      <PWAInstall />
    </>
  );
}

'use client';

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  useEffect(() => {
    // Логируем ошибку
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Иконка ошибки */}
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--destructive)' + '20' }}
          >
            <AlertTriangle size={48} style={{ color: 'var(--destructive)' }} />
          </div>
          
          {/* Заголовок */}
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            {translations.somethingWrong || 'Что-то пошло не так'}
          </h2>
          
          {/* Описание */}
          <p 
            className="text-lg mb-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {translations.errorOccurred || 'Произошла непредвиденная ошибка.'}
          </p>
          
          {error?.message && (
            <p 
              className="text-sm mb-6 p-3 rounded-lg"
              style={{ background: 'var(--card)', color: 'var(--muted-foreground)' }}
            >
              {error.message}
            </p>
          )}
          
          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <RefreshCw size={20} />
              {translations.tryAgain || 'Попробовать снова'}
            </button>
            
            <button
              onClick={() => router.push('/chats')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <Home size={20} />
              {translations.goHome || 'На главную'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

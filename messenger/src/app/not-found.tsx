'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Home, Search, MessageCircle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Иконка ошибки */}
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: 'var(--card)' }}
          >
            <Search size={48} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          
          {/* Код ошибки */}
          <h1 
            className="text-6xl font-bold mb-2"
            style={{ color: 'var(--primary)' }}
          >
            404
          </h1>
          
          {/* Заголовок */}
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            {translations.pageNotFound || 'Страница не найдена'}
          </h2>
          
          {/* Описание */}
          <p 
            className="text-lg mb-8"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {translations.pageNotFoundDesc || 'Извините, запрашиваемая страница не существует или была перемещена.'}
          </p>
          
          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/chats')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <Home size={20} />
              {translations.goHome || 'На главную'}
            </button>
            
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <MessageCircle size={20} />
              {translations.goBack || 'Назад'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

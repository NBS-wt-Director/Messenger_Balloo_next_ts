'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  return (
    <html>
      <body style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <Header />
        
        <main className="flex-1 px-4 py-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--destructive)' + '20' }}
            >
              <AlertTriangle size={48} style={{ color: 'var(--destructive)' }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              {translations.criticalError || 'Критическая ошибка'}
            </h2>
            
            <p className="text-lg mb-6" style={{ color: 'var(--muted-foreground)' }}>
              {translations.appCrashed || 'Приложение столкнулось с критической ошибкой.'}
            </p>
            
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              <RefreshCw size={20} />
              {translations.reloadPage || 'Перезагрузить страницу'}
            </button>
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

export default function Maintenance() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 минут

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse"
            style={{ background: 'var(--card)' }}
          >
            <Wrench size={48} style={{ color: 'var(--primary)' }} />
          </div>
          
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            {translations.maintenance || 'Технические работы'}
          </h2>
          
          <p 
            className="text-lg mb-6"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {translations.maintenanceDesc || 'В данный момент проводятся плановые технические работы. Мы скоро вернёмся!'}
          </p>
          
          {/* Таймер */}
          <div 
            className="flex items-center justify-center gap-2 mb-8 p-4 rounded-lg"
            style={{ background: 'var(--card)' }}
          >
            <Clock size={20} style={{ color: 'var(--primary)' }} />
            <span className="text-xl font-mono font-bold" style={{ color: 'var(--foreground)' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <button
            onClick={handleReload}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            <RefreshCw size={20} />
            {translations.refresh || 'Обновить'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

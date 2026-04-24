'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin"
          />
          <p style={{ color: 'var(--muted-foreground)' }}>Загрузка...</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

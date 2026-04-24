'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatsPage } from '@/components/pages/ChatsPage';

export default function Chats() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      <ChatsPage />
      <Footer />
    </div>
  );
}
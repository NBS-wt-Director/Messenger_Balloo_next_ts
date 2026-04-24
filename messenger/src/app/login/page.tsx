'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthPage } from '@/components/pages/AuthPage';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chats');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      <AuthPage mode="login" />
      <Footer />
    </div>
  );
}
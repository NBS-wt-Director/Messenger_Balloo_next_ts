'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MessageCircle, Shield, Zap, Users, Download, ArrowRight, Heart, Globe } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  const features = [
    {
      icon: Shield,
      title: translations.security || 'Безопасность',
      description: translations.securityDesc || 'Сквозное шифрование защищает ваши сообщения',
      color: '#3b82f6'
    },
    {
      icon: Zap,
      title: translations.speed || 'Скорость',
      description: translations.speedDesc || 'Мгновенная доставка сообщений по всему миру',
      color: '#8b5cf6'
    },
    {
      icon: Users,
      title: translations.community || 'Сообщество',
      description: translations.communityDesc || 'Миллионы пользователей доверяют Balloo',
      color: '#10b981'
    },
    {
      icon: Globe,
      title: translations.global || 'Глобально',
      description: translations.globalDesc || 'Доступно на 12 языках мира',
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(135deg, var(--card) 0%, var(--background) 100%)',
          borderBottom: '2px solid var(--border)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              border: '4px solid var(--primary-foreground)'
            }}>
              <MessageCircle size={48} color="white" />
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '24px',
              color: 'var(--foreground)',
              letterSpacing: '1px'
            }}>
              {translations.appName || 'Balloo'}
            </h1>
            
            <p style={{
              fontSize: '20px',
              lineHeight: '1.6',
              marginBottom: '40px',
              color: 'var(--muted-foreground)',
              maxWidth: '700px',
              margin: '0 auto 40px'
            }}>
              {translations.ballooDescription || 'Современный мессенджер для безопасного общения. Защищайте свою приватность с сквозным шифрованием.'}
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <a href="/chats" style={{
                  padding: '16px 32px',
                  background: 'var(--primary)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '16px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {translations.chats}
                  <ArrowRight size={20} />
                </a>
              ) : (
                <>
                  <a href="/register" style={{
                    padding: '16px 32px',
                    background: 'var(--primary)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '16px'
                  }}>
                    {translations.register}
                  </a>
                  <a href="/login" style={{
                    padding: '16px 32px',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    border: '2px solid var(--border)'
                  }}>
                    {translations.login}
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: '60px',
              color: 'var(--foreground)'
            }}>
              {translations.features || 'Функции'}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px'
            }}>
              {features.map((feature, index) => (
                <div key={index} style={{
                  padding: '32px',
                  background: 'var(--card)',
                  border: '2px solid var(--border)',
                  transition: 'all 0.15s'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    border: '3px solid var(--primary-foreground)'
                  }}>
                    <feature.icon size={32} color="white" />
                  </div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: 'var(--foreground)'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: 'var(--muted-foreground)',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '80px 24px',
          background: 'var(--card)',
          borderTop: '2px solid var(--border)',
          borderBottom: '2px solid var(--border)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Heart size={48} color="var(--primary)" style={{ marginBottom: '24px' }} />
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '16px',
              color: 'var(--foreground)'
            }}>
              {translations.supportProject || 'Поддержать проект'}
            </h2>
            <p style={{
              fontSize: '18px',
              color: 'var(--muted-foreground)',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              {translations.supportDescription || 'Ваша поддержка помогает нам развивать Balloo и добавлять новые функции'}
            </p>
            <a href="/support" style={{
              padding: '16px 32px',
              background: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Download size={20} />
              {translations.support || 'Поддержать'}
            </a>
          </div>
        </section>

        {/* Download Section */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '48px',
              color: 'var(--foreground)'
            }}>
              {translations.downloads || 'Загрузки'}
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px'
            }}>
              <a href="/downloads" style={{
                padding: '40px',
                background: 'var(--card)',
                border: '2px solid var(--border)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <Download size={48} color="var(--primary)" />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--foreground)'
                }}>
                  {translations.mobileApp || 'Мобильное приложение'}
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {translations.mobileAppDesc || 'iOS и Android'}
                </p>
              </a>
              
              <a href="/downloads" style={{
                padding: '40px',
                background: 'var(--card)',
                border: '2px solid var(--border)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <Download size={48} color="var(--primary)" />
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--foreground)'
                }}>
                  {translations.desktopApp || 'Десктопное приложение'}
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {translations.desktopAppDesc || 'Windows, macOS, Linux'}
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

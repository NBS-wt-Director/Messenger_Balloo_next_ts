
'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User, MapPin, Dumbbell, Code, Heart, Coffee, Shield, Zap, MessageCircle, Image, FileText, Monitor, Video, Moon, MessageSquare } from 'lucide-react';

interface PageSection {
  id: string;
  type: string;
  title: string;
  content: string;
  data: any;
}

interface PageData {
  id: string;
  title: string;
  content: string;
  sections: PageSection[];
  metadata: any;
}

export default function AboutCompanyPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages?slug=about-company');
      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[About] Error loading page:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const developerSection = pageData?.sections.find((s: PageSection) => s.type === 'person' || s.id === 'developer');
  const storySection = pageData?.sections.find((s: PageSection) => s.type === 'text' || s.id === 'story');
  const techSection = pageData?.sections.find((s: PageSection) => s.type === 'features' || s.id === 'tech');

  const developer = developerSection?.data || {
    name: 'Иван Оберюхтин',
    location: 'Екатеринбург, Россия',
    bio: 'Разработчик-одиночка, создающий Balloo Messenger с любовью к приватности и безопасности',
    interests: [
      { text: 'Разработка на React/Next.js', icon: 'code' },
      { text: 'Ушу (тренируется и тренирует)', icon: 'sport' },
      { text: 'ГРБ (тренируется и тренирует)', icon: 'sport' },
      { text: 'Вайбкодинг — код в потоке', icon: 'flow' }
    ]
  };

  const technologies = techSection?.data?.technologies || [
    { name: 'React', icon: '⚛️', description: 'UI библиотека' },
    { name: 'Next.js', icon: '▲', description: 'Фреймворк' },
    { name: 'TypeScript', icon: '📘', description: 'Типизация' },
    { name: 'RxDB', icon: '🗄️', description: 'Локальная БД' },
    { name: 'WebRTC', icon: '📞', description: 'Звонки' },
    { name: 'Web Crypto API', icon: '🔐', description: 'Шифрование' },
    { name: 'Vibe Coding', icon: '🌊', description: 'Код в потоке' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
              {pageData?.title || 'О компании'}
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
              {pageData?.content || 'История создания Balloo Messenger'}
            </p>
          </div>

          {/* Developer Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={50} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  {developer.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--muted-foreground)', marginBottom: '10px' }}>
                  <MapPin size={18} />
                  <span>{developer.location}</span>
                </div>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {developer.bio}
                </p>
              </div>
            </div>

            {/* Interests */}
            <div style={{ display: 'grid', gap: '15px' }}>
              {developer.interests?.map((interest: any, index: number) => {
                const interestText = typeof interest === 'string' ? interest : interest.text;
                const interestIcon = typeof interest === 'object' ? interest.icon : 'heart';
                
                let Icon = Heart;
                let bgColor = '#ef4444';
                
                if (interestText.includes('Разработ') || interestText.includes('React') || interestText.includes('Next') || interestText.includes('вайбкод') || interestText.includes('Вайбкод')) {
                  Icon = Code;
                  bgColor = '#3b82f6';
                } else if (interestText.includes('Ушу') || interestText.includes('ГРБ') || interestText.includes('тренир')) {
                  Icon = Dumbbell;
                  bgColor = '#ef4444';
                }

                return (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px',
                    padding: '15px',
                    background: 'var(--background-secondary)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ 
                      padding: '10px', 
                      background: bgColor,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '16px', color: 'var(--foreground)' }}>{interestText}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Story Section */}
          {storySection && (
            <div style={{ 
              padding: '40px', 
              border: '2px solid var(--border)', 
              background: 'var(--card)',
              borderRadius: '16px',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
                {storySection.title || 'История проекта'}
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--muted-foreground)' }}>
                {storySection.content || 'Balloo был создан как независимый мессенджер с фокусом на приватность и безопасность'}
              </p>
            </div>
          )}

          {/* Technologies Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: 'var(--foreground)' }}>
              {techSection?.title || 'Технологии'}
            </h2>
            <p style={{ marginBottom: '25px', color: 'var(--muted-foreground)' }}>
              {techSection?.content || 'Современный стек технологий для безопасного общения'}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              {technologies.map((tech: any, index: number) => (
                <div key={index} style={{ 
                  padding: '20px',
                  background: 'var(--background-secondary)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{tech.icon}</div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{tech.name}</p>
                  {tech.description && (
                    <p style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginTop: '5px' }}>{tech.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: 'var(--foreground)' }}>
              Принципы проекта
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
                <Shield size={32} style={{ marginBottom: '15px', color: '#22c55e' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Приватность
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  End-to-end шифрование и полная защита ваших данных
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
                <Zap size={32} style={{ marginBottom: '15px', color: '#eab308' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Производительность
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Быстрая работа и оптимизация для любых устройств
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
                <Heart size={32} style={{ marginBottom: '15px', color: '#ef4444' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Независимость
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Никаких Big Tech, никаких скрытых отслеживаний
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px' }}>
                <Coffee size={32} style={{ marginBottom: '15px', color: '#7c3aed' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Открытость
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Прозрачная разработка и обратная связь с пользователями
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: 'var(--foreground)' }}>
              Функции Balloo
            </h2>
            <p style={{ marginBottom: '25px', color: 'var(--muted-foreground)' }}>
              Полный набор возможностей для комфортного общения
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <MessageCircle size={32} style={{ marginBottom: '15px', color: '#3b82f6' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Личные чаты
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Общайтесь один на один с шифрованием
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <MessageSquare size={32} style={{ marginBottom: '15px', color: '#8b5cf6' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Группы
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Создавайте группы до 1000 участников
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Image size={32} style={{ marginBottom: '15px', color: '#10b981' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Медиа
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Отправляйте фото, видео и файлы
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Shield size={32} style={{ marginBottom: '15px', color: '#f59e0b' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Сквозное шифрование
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Все сообщения шифруются на устройстве отправителя
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Zap size={32} style={{ marginBottom: '15px', color: '#ec4899' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Аудиосообщения
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Отправляйте голосовые сообщения с регулировкой скорости
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <FileText size={32} style={{ marginBottom: '15px', color: '#06b6d4' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Обмен файлами
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Отправляйте файлы до 2 ГБ с облачным хранением
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Monitor size={32} style={{ marginBottom: '15px', color: '#6366f1' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Мультиустройство
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Используйте Balloo на нескольких устройствах
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Video size={32} style={{ marginBottom: '15px', color: '#ef4444' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Видеозвонки
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Качественные видеозвонки до 10 участников
                </p>
              </div>

              <div style={{ padding: '25px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Moon size={32} style={{ marginBottom: '15px', color: '#7c3aed' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                  Тёмная тема
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                  Удобная тёмная тема для вечернего использования
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MessageCircle, Shield, Zap, Users, Star, Send, Lock, Video, Image, Mic, FileText, Bell, Search, Palette, Cloud, Smartphone, Globe, Heart, Plus, X, ThumbsUp } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';
import { Modal } from '@/components/ui/Modal';


interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'planned' | 'in-progress' | 'completed' | 'rejected';
  votes: number;
  createdBy: string;
  createdByName: string;
  createdAt: number;
}

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

const FEATURE_CATEGORIES = [
  { value: 'general', label: 'Общее', icon: Globe },
  { value: 'ui', label: 'Интерфейс', icon: Palette },
  { value: 'security', label: 'Безопасность', icon: Lock },
  { value: 'performance', label: 'Производительность', icon: Zap },
];

const BUILT_IN_FEATURES = [
  { icon: MessageCircle, title: 'Сообщения', description: 'Текстовые сообщения с реакциями и ответами', color: '#3b82f6' },
  { icon: Shield, title: 'E2E Шифрование', description: 'Сквозное шифрование всех сообщений', color: '#22c55e' },
  { icon: Video, title: 'Видеозвонки', description: 'WebRTC звонки с демонстрацией экрана', color: '#8b5cf6' },
  { icon: Image, title: 'Вложения', description: 'Фото, видео и файлы через Яндекс.Диск', color: '#f59e0b' },
  { icon: Users, title: 'Групповые чаты', description: 'Чаты с ролями и правами доступа', color: '#ef4444' },
  { icon: Bell, title: 'Уведомления', description: 'Push-уведомления в реальном времени', color: '#ec4899' },
  { icon: Search, title: 'Поиск', description: 'Поиск по сообщениям и контактам', color: '#06b6d4' },
  { icon: Cloud, title: 'Облако', description: 'Синхронизация между устройствами', color: '#6366f1' },
  { icon: Smartphone, title: 'PWA', description: 'Работает как нативное приложение', color: '#14b8a6' },
  { icon: Lock, title: 'Приватность', description: 'Никаких отслеживаний и рекламы', color: '#84cc16' },
];

export default function AboutBallooPage() {
  const { language } = useSettingsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { alert, AlertComponent } = useAlert();
  const translations = getTranslations(language);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', category: 'general' });
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPageData();
    loadFeatures();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages?slug=about-balloo');
      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[About Balloo] Error loading page:', error);
      }
    }
  };

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/features?status=completed');
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.features || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Features] Error loading:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestFeature = async () => {
    if (!user) {
      alert({ message: 'Войдите чтобы предложить функцию', type: 'warning' });
      return;
    }

    if (!newFeature.title || !newFeature.description) {
      alert({ message: 'Заполните название и описание', type: 'warning' });
      return;
    }

    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFeature.title,
          description: newFeature.description,
          category: newFeature.category,
          userId: user.id,
          userName: user.displayName
        })
      });

      if (response.ok) {
        alert({ message: 'Функция предложена! Спасибо!', type: 'success' });
        setShowSuggestModal(false);
        setNewFeature({ title: '', description: '', category: 'general' });
        loadFeatures();
      } else {
        const data = await response.json();
        alert({ message: data.error, type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка при отправке', type: 'error' });
    }
  };

  const handleVote = async (featureId: string) => {
    if (!user) {
      alert({ message: 'Войдите чтобы голосовать', type: 'warning' });
      return;
    }

    if (votedFeatures.has(featureId)) {
      alert({ message: 'Вы уже голосовали за эту функцию', type: 'warning' });
      return;
    }

    try {
      const response = await fetch('/api/features', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId,
          updates: {
            votes: (features.find(f => f.id === featureId)?.votes || 0) + 1
          }
        })
      });

      if (response.ok) {
        setVotedFeatures(new Set([...votedFeatures, featureId]));
        loadFeatures();
      }
    } catch (error) {
      alert({ message: 'Ошибка голосования', type: 'error' });
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <MessageCircle size={64} style={{ marginBottom: '20px', color: 'var(--primary)', margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
              {pageData?.title || 'О Balloo'}
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--muted-foreground)', maxWidth: '800px', margin: '0 auto' }}>
              {pageData?.content || 'Balloo — современный мессенджер с фокусом на приватность и безопасность'}
            </p>
          </div>

          {/* Built-in Features Grid */}
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: 'var(--foreground)' }}>
              Возможности мессенджера
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
              {BUILT_IN_FEATURES.map((feature, index) => (
                <div key={index} style={{ 
                  padding: '25px', 
                  border: '2px solid var(--border)', 
                  background: 'var(--card)',
                  borderRadius: '16px',
                  transition: 'transform 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: feature.color, 
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <feature.icon size={32} color="white" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* User Suggested Features */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--foreground)' }}>
                  Предложения пользователей
                </h2>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '5px' }}>
                  Функции, которые предлагают наши пользователи
                </p>
              </div>
              <button
                onClick={() => setShowSuggestModal(true)}
                disabled={!isAuthenticated}
                style={{
                  padding: '12px 24px',
                  background: isAuthenticated ? 'var(--primary)' : 'var(--muted)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isAuthenticated ? 1 : 0.6
                }}
              >
                <Plus size={20} />
                Предложить функцию
              </button>
            </div>

            {features.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted-foreground)' }}>
                <Heart size={48} style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p>Пока нет предложенных функций</p>
                <p>Будьте первым!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {features.map((feature) => (
                  <div key={feature.id} style={{ 
                    padding: '20px', 
                    background: 'var(--background-secondary)', 
                    borderRadius: '12px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)' }}>
                            {feature.title}
                          </h3>
                          <span style={{
                            padding: '4px 10px',
                            background: feature.status === 'completed' ? '#22c55e' : 
                                       feature.status === 'in-progress' ? '#3b82f6' :
                                       feature.status === 'planned' ? '#8b5cf6' : '#6b7280',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {feature.status === 'completed' ? '✅ Реализовано' :
                             feature.status === 'in-progress' ? '🔄 В работе' :
                             feature.status === 'planned' ? '📅 Запланировано' : '⏳ На рассмотрении'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '10px' }}>
                          {feature.description}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                          Предложил: {feature.createdByName}
                        </p>
                      </div>
                      <button
                        onClick={() => handleVote(feature.id)}
                        disabled={votedFeatures.has(feature.id)}
                        style={{
                          padding: '10px 15px',
                          background: votedFeatures.has(feature.id) ? '#22c55e' : 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: votedFeatures.has(feature.id) ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: '600',
                          opacity: votedFeatures.has(feature.id) ? 0.7 : 1
                        }}
                      >
                        <ThumbsUp size={18} />
                        {feature.votes + (votedFeatures.has(feature.id) ? 1 : 0)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Suggest Feature Modal */}
      <Modal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        title="Предложить функцию"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
              Название функции *
            </label>
            <input
              type="text"
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              placeholder="Например: Тёмная тема"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
              Описание *
            </label>
            <textarea
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              placeholder="Опишите зачем нужна эта функция..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
              Категория
            </label>
            <select
              value={newFeature.category}
              onChange={(e) => setNewFeature({ ...newFeature, category: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '14px'
              }}
            >
              {FEATURE_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setShowSuggestModal(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--background-tertiary)',
                color: 'var(--foreground)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSuggestFeature}
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      </Modal>

      {AlertComponent}
    </div>
  );
}

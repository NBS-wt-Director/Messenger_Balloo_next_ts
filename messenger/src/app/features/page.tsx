'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MessageSquare, Users, Shield, Zap, Image, FileText, Bell, Settings, Plus, Send, Check, X } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';

interface BuiltinFeature {
  id: string;
  icon: any;
  title: string;
  description: string;
  source: 'builtin';
}

interface DbFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'planned' | 'in-progress' | 'completed';
  source: 'database';
}

type Feature = BuiltinFeature | DbFeature;

export default function FeaturesPage() {
  const { language } = useSettingsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { alert, AlertComponent } = useAlert();
  const translations = getTranslations(language);

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: '', description: '', category: 'general' });
  const [submitting, setSubmitting] = useState(false);

  // Нативные функции
  const builtinFeatures: BuiltinFeature[] = [
    {
      id: 'builtin-chats',
      icon: MessageSquare,
      title: translations.privateChats || 'Личные чаты',
      description: translations.privateChatsDesc || 'Общайтесь один на один с шифрованием',
      source: 'builtin'
    },
    {
      id: 'builtin-groups',
      icon: Users,
      title: translations.groups || 'Группы',
      description: translations.groupsDesc || 'Создавайте группы до 1000 участников',
      source: 'builtin'
    },
    {
      id: 'builtin-privacy',
      icon: Shield,
      title: translations.privacy || 'Приватность',
      description: translations.privacyDesc || 'Сквозное шифрование всех сообщений',
      source: 'builtin'
    },
    {
      id: 'builtin-speed',
      icon: Zap,
      title: translations.speed2 || 'Скорость',
      description: translations.speed2Desc || 'Мгновенная доставка сообщений',
      source: 'builtin'
    },
    {
      id: 'builtin-media',
      icon: Image,
      title: translations.media || 'Медиа',
      description: translations.mediaDesc || 'Отправляйте фото, видео и файлы',
      source: 'builtin'
    },
    {
      id: 'builtin-documents',
      icon: FileText,
      title: translations.documents || 'Документы',
      description: translations.documentsDesc || 'Работа с документами любого формата',
      source: 'builtin'
    },
    {
      id: 'builtin-notifications',
      icon: Bell,
      title: translations.notifications2 || 'Уведомления',
      description: translations.notifications2Desc || 'Настройте уведомления под себя',
      source: 'builtin'
    },
    {
      id: 'builtin-settings',
      icon: Settings,
      title: translations.customization || 'Настройки',
      description: translations.customizationDesc || 'Полная кастомизация интерфейса',
      source: 'builtin'
    }
  ];

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const response = await fetch('/api/features?status=all');
      if (response.ok) {
        const data = await response.json();
        const dbFeatures: DbFeature[] = (data.features || [])
          .filter((f: any) => f.status === 'completed' || f.status === 'in-progress' || f.status === 'planned')
          .map((f: any) => ({
            id: f.id,
            title: f.title,
            description: f.description,
            category: f.category,
            status: f.status,
            source: 'database' as const
          }));
        
        setFeatures([...builtinFeatures, ...dbFeatures]);
      } else {
        setFeatures(builtinFeatures);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Features] Error loading:', error);
      }
      setFeatures(builtinFeatures);
    } finally {
      setLoading(false);
    }
  };

  const submitFeature = async () => {
    if (!newFeature.title.trim() || !newFeature.description.trim()) {
      alert({ message: 'Заполните название и описание', type: 'error' });
      return;
    }

    if (!isAuthenticated || !user) {
      alert({ message: 'Войдите, чтобы предложить функцию', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newFeature.title,
          description: newFeature.description,
          category: newFeature.category,
          userId: user.id,
          userName: user.displayName || user.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert({ message: 'Спасибо! Ваше предложение отправлено на рассмотрение', type: 'success' });
        setNewFeature({ title: '', description: '', category: 'general' });
        setShowForm(false);
        loadFeatures();
      } else {
        alert({ message: data.error || 'Ошибка отправки', type: 'error' });
      }
    } catch (error) {
      alert({ message: 'Ошибка отправки', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'completed': '✅ Реализовано',
      'in-progress': '🔄 В работе',
      'planned': '📅 Запланировано'
    };
    return badges[status] || '';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': '#22c55e',
      'in-progress': '#3b82f6',
      'planned': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--foreground)' }}>
                {translations.features || 'Функции'}
              </h1>
              <p style={{ fontSize: '16px', color: 'var(--muted-foreground)', marginTop: '10px' }}>
                Нативные возможности и функции из базы данных
              </p>
            </div>
            
            {isAuthenticated ? (
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  padding: '12px 24px',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={20} />
                Предложить функцию
              </button>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Войдите</a>, чтобы предложить свою функцию
              </p>
            )}
          </div>

          {/* Feature Suggestion Form */}
          {showForm && (
            <div style={{ 
              padding: '30px', 
              border: '2px solid var(--border)', 
              background: 'var(--card)',
              borderRadius: '16px',
              marginBottom: '40px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
                Предложить новую функцию
              </h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
                  Название функции
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--foreground)' }}>
                  Описание
                </label>
                <textarea
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                  placeholder="Опишите, как должна работать эта функция..."
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

              <div style={{ marginBottom: '20px' }}>
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
                  <option value="general">📌 Общее</option>
                  <option value="ui">🎨 Интерфейс</option>
                  <option value="security">🔒 Безопасность</option>
                  <option value="performance">⚡ Производительность</option>
                  <option value="integration">🔗 Интеграции</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={submitFeature}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: submitting ? 'var(--muted-foreground)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={18} />
                  {submitting ? 'Отправка...' : 'Отправить'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'var(--background-tertiary)',
                    color: 'var(--foreground)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <X size={18} />
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Features Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  style={{ 
                    padding: '30px', 
                    border: '2px solid var(--border)', 
                    background: 'var(--card)',
                    borderRadius: '16px',
                    position: 'relative'
                  }}
                >
                  {'icon' in feature && feature.icon && (
                    <feature.icon size={40} style={{ marginBottom: '15px', color: 'var(--primary)' }} />
                  )}
                  {'source' in feature && feature.source === 'database' && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '15px', 
                      right: '15px',
                      padding: '4px 10px',
                      background: getStatusColor(feature.status),
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {getStatusBadge(feature.status)}
                    </div>
                  )}
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--foreground)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    {feature.description}
                  </p>
                  {'source' in feature && feature.source === 'builtin' && (
                    <span style={{ 
                      display: 'inline-block',
                      marginTop: '15px',
                      padding: '4px 10px',
                      background: 'rgba(37, 99, 235, 0.1)',
                      color: '#3b82f6',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      ✓ Доступно
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      {AlertComponent}
    </div>
  );
}

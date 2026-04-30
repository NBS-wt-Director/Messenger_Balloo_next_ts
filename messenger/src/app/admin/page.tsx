'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAdminCheck, ADMIN_ROLE_LABELS, ADMIN_ROLE_DESCRIPTIONS } from '@/lib/admin';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import { ArrowLeft, Users, MessageCircle, Settings, Shield, BarChart3, Ban, FileText, Crown, Heart, Tag } from 'lucide-react';
import { AdminUsersSection, AdminChatsSection, AdminMessagesSection, AdminBansSection, AdminSettingsSection } from './sections';
import { FeaturesSection } from './features-section';
import { VersionsAdmin } from '@/components/admin/VersionsAdmin';
import './page.css';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { language } = useSettingsStore();
  const { isSuperAdmin, adminRoles, adminSince } = useAdminCheck();

  // Проверяем доступ - если пользователь авторизован и имеет права
  const hasAdminAccess = isAuthenticated && (user?.isAdmin || user?.isSuperAdmin || isSuperAdmin);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    users: 0,
    chats: 0,
    messages: 0,
    bans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Загрузка статистики
  useEffect(() => {
    if (hasAdminAccess) {
      loadStats();
    }
  }, [hasAdminAccess]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || { users: 0, chats: 0, messages: 0, bans: 0 });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Admin] Error loading stats:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Если нет доступа - показываем сообщение
  if (!hasAdminAccess) {
    return (
      <div className="admin-page">
        <div className="admin-access-denied">
          <Shield size={64} className="text-red-500" />
          <h1>Доступ запрещён</h1>
          <p>У вас нет прав администратора</p>
          <button onClick={() => router.push('/chats')}>
            Вернуться к чатам
          </button>
        </div>
      </div>
    );
  }

  const adminSections = [
    { id: 'overview', label: 'Обзор', icon: BarChart3, roles: [] as string[] },
    { id: 'users', label: 'Пользователи', icon: Users, roles: ['users'] as string[] },
    { id: 'chats', label: 'Чаты', icon: MessageCircle, roles: ['chats'] as string[] },
    { id: 'messages', label: 'Сообщения', icon: FileText, roles: ['messages'] as string[] },
    { id: 'bans', label: 'Блокировки', icon: Ban, roles: ['bans'] as string[] },
    { id: 'versions', label: 'Версии', icon: Tag, roles: ['settings'] as string[] },
    { id: 'features', label: 'Функции и страницы', icon: Heart, roles: ['settings'] as string[] },
    { id: 'settings', label: 'Настройки', icon: Settings, roles: ['settings'] as string[] },
  ];

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <button className="admin-back" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </button>
        <div className="admin-header-title">
          <Shield size={24} />
          <h1>Админ-панель</h1>
        </div>
        {isSuperAdmin && (
          <span className="admin-badge-super">
            <Crown size={14} />
            SuperAdmin
          </span>
        )}
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {adminSections.map(section => {
              const Icon = section.icon;
              const hasAccess = section.roles.length === 0 || 
                isSuperAdmin || 
                section.roles.some(role => adminRoles.includes(role as any));
              
              return (
                <button
                  key={section.id}
                  className={`admin-nav-item ${activeTab === section.id ? 'active' : ''} ${!hasAccess ? 'disabled' : ''}`}
                  onClick={() => hasAccess && setActiveTab(section.id)}
                  disabled={!hasAccess}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="admin-info">
            <p className="admin-info-label">Права администратора</p>
            <div className="admin-roles">
              {adminRoles.map(role => (
                <span key={role} className="admin-role-badge" title={ADMIN_ROLE_DESCRIPTIONS[role as keyof typeof ADMIN_ROLE_DESCRIPTIONS]}>
                  {ADMIN_ROLE_LABELS[role as keyof typeof ADMIN_ROLE_LABELS]}
                </span>
              ))}
            </div>
            {adminSince && (
              <p className="admin-since">
                Админ с: {new Date(adminSince).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="admin-content">
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <h2>Обзор системы</h2>
              
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <Users size={24} />
                  <div className="stat-info">
                    <span className="stat-value">{loading ? '...' : stats.users.toLocaleString()}</span>
                    <span className="stat-label">Пользователей</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <MessageCircle size={24} />
                  <div className="stat-info">
                    <span className="stat-value">{loading ? '...' : stats.chats.toLocaleString()}</span>
                    <span className="stat-label">Чатов</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <FileText size={24} />
                  <div className="stat-info">
                    <span className="stat-value">{loading ? '...' : stats.messages.toLocaleString()}</span>
                    <span className="stat-label">Сообщений</span>
                  </div>
                </div>
              </div>

              <div className="admin-welcome">
                <h3>Добро пожаловать в админ-панель!</h3>
                <p>Вы авторизованы как: <strong>{user?.displayName}</strong></p>
                <p>Email: <strong>{user?.email}</strong></p>
                {user?.fullName && <p>ФИО: <strong>{user.fullName}</strong></p>}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <AdminUsersSection />
          )}

          {activeTab === 'chats' && (
            <AdminChatsSection />
          )}

          {activeTab === 'messages' && (
            <AdminMessagesSection />
          )}

          {activeTab === 'bans' && (
            <AdminBansSection />
          )}

          {activeTab === 'versions' && (
            <VersionsAdmin />
          )}

          {activeTab === 'features' && (
            <FeaturesSection />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsSection />
          )}
        </main>
      </div>
    </div>
  );
}
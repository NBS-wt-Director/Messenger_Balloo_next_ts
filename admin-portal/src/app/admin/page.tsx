'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Users, MessageCircle, Settings, Shield, BarChart3, 
  Ban, FileText, Crown, Heart, Tag, MessageSquare, Headphones,
  LogOut, LayoutDashboard, Users as UsersIcon
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { apiClient } from '@/lib/api-client';
import { InternalChatSection } from '@/components/InternalChat';
import { SupportSection } from '@/components/Support';
import { UsersSection } from '@/components/Users';
import { ChatsSection } from '@/components/Chats';
import { VersionsSection } from '@/components/Versions';

interface User {
  id: string;
  email: string;
  displayName: string;
  fullName?: string;
  avatar?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminRoles: string[];
  adminSince?: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  const adminSections = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'chats', label: 'Чаты', icon: MessageCircle },
    { id: 'messages', label: 'Сообщения', icon: FileText },
    { id: 'internal-chat', label: 'Корпоративный чат', icon: MessageSquare },
    { id: 'support', label: 'Техподдержка', icon: Headphones },
    { id: 'versions', label: 'Версии', icon: Tag },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Загрузка...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.isAdmin || user.isSuperAdmin;
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Доступ запрещён</h1>
          <p className="text-gray-400">У вас нет прав администратора</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 btn-primary"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-blue-500" />
              <h1 className="text-xl font-bold">Admin Portal</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user.isSuperAdmin && (
              <span className="badge badge-superadmin flex items-center gap-1">
                <Crown size={14} />
                SuperAdmin
              </span>
            )}
            <div className="flex items-center gap-2">
              {user.avatar && (
                <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full" />
              )}
              <span className="text-sm">{user.displayName}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="space-y-1">
            {adminSections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                  onClick={() => setActiveTab(section.id)}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin Info */}
          <div className="mt-8 p-4 bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Права администратора</p>
            <div className="flex flex-wrap gap-2">
              {user.adminRoles?.map(role => (
                <span key={role} className="badge badge-admin capitalize">{role}</span>
              ))}
            </div>
            {user.adminSince && (
              <p className="text-xs text-slate-400 mt-2">
                Админ с: {new Date(user.adminSince).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="admin-content">
          {activeTab === 'dashboard' && <DashboardSection />}
          {activeTab === 'users' && <UsersSection />}
          {activeTab === 'chats' && <ChatsSection />}
          {activeTab === 'messages' && <MessagesSection />}
          {activeTab === 'internal-chat' && <InternalChatSection />}
          {activeTab === 'support' && <SupportSection />}
          {activeTab === 'versions' && <VersionsSection />}
          {activeTab === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Section
function DashboardSection() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/admin/analytics');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Обзор системы</h2>
      
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="admin-card">
              <Users size={24} className="text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-slate-400">Пользователей</div>
            </div>
            <div className="admin-card">
              <MessageCircle size={24} className="text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats?.totalChats || 0}</div>
              <div className="text-sm text-slate-400">Чатов</div>
            </div>
            <div className="admin-card">
              <FileText size={24} className="text-yellow-500 mb-2" />
              <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
              <div className="text-sm text-slate-400">Сообщений</div>
            </div>
            <div className="admin-card">
              <Shield size={24} className="text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{stats?.totalAdmins || 0}</div>
              <div className="text-sm text-slate-400">Админов</div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-semibold mb-4">Добро пожаловать!</h3>
            <p className="text-slate-300">
              Вы авторизованы как администратор системы App Balloo.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// Placeholder sections
function MessagesSection() { return <div className="admin-card"><h2>Сообщения</h2></div>; }
function SettingsSection() { return <div className="admin-card"><h2>Настройки системы</h2></div>; }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { User, Mail, Phone, Shield, Calendar, Edit2, Save, X, LogOut, Trash2 } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';
import './ProfilePage.css';

export function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const { language } = useSettingsStore();
  const { alert, confirm, AlertComponent, ConfirmComponent } = useAlert();

  const translations = getTranslations(language);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    fullName: '',
    phone: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        displayName: user.displayName || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, isAuthenticated, router]);

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          fullName: formData.fullName,
          phone: formData.phone
        })
      });

      if (response.ok) {
        const updated = await response.json();
        updateProfile(updated.user);
        alert({ message: 'Профиль обновлён', type: 'success' });
        setEditMode(false);
      } else {
        const error = await response.json();
        alert({ message: 'Ошибка: ' + error.error, type: 'error' });
      }
    } catch (error) {
      console.error('[Profile] Error:', error);
      alert({ message: 'Ошибка при сохранении', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
    setEditMode(false);
  };

  const handleLogout = async () => {
    const confirmed = await confirm(
      'Вы действительно хотите выйти?',
      'warning',
      'Выйти',
      'Отмена'
    );
    if (confirmed) {
      logout();
      router.push('/login');
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <main className="profile-main">
        {/* Avatar Section */}
        <div className="profile-section profile-avatar-section">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            {editMode && (
              <button 
                className="profile-avatar-edit"
                onClick={() => alert({ message: 'Загрузка аватара в разработке', type: 'info' })}
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>
          <div className="profile-name">{user.displayName}</div>
          <div className="profile-email">{user.email}</div>
        </div>

        {/* User Info Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Информация о пользователе</h2>
          <div className="profile-form">
            {/* ID */}
            <div className="profile-form-group">
              <label className="profile-label">
                <Shield size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                ID пользователя
              </label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="profile-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Shield size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>

            {/* Email */}
            <div className="profile-form-group">
              <label className="profile-label">
                <Mail size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Email
              </label>
              <div className="profile-input-wrapper">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="profile-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>

            {/* DisplayName */}
            <div className="profile-form-group">
              <label className="profile-label">
                <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Отображаемое имя
              </label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!editMode}
                  className="profile-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>

            {/* Full Name */}
            <div className="profile-form-group">
              <label className="profile-label">Полное имя</label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!editMode}
                  className="profile-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>

            {/* Phone */}
            <div className="profile-form-group">
              <label className="profile-label">
                <Phone size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Номер телефона
              </label>
              <div className="profile-input-wrapper">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editMode}
                  className="profile-input"
                  placeholder="+7 (999) 123-45-67"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Phone size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>

            {/* Online Status */}
            <div className="profile-form-group">
              <label className="profile-label">Статус онлайн</label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  value={user.isOnline ? 'Онлайн' : 'Офлайн'}
                  disabled
                  className="profile-input"
                  style={{ 
                    paddingLeft: '2.5rem',
                    color: user.isOnline ? '#22c55e' : '#64748b'
                  }}
                />
                <div 
                  className="profile-input-icon" 
                  style={{ 
                    left: '0.75rem',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: user.isOnline ? '#22c55e' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
              <small style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                Статус обновляется автоматически
              </small>
            </div>

            {/* Registration Date */}
            <div className="profile-form-group">
              <label className="profile-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Дата регистрации
              </label>
              <div className="profile-input-wrapper">
                <input
                  type="text"
                  value={new Date(user.createdAt || Date.now()).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  disabled
                  className="profile-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Calendar size={16} className="profile-input-icon" style={{ left: '0.75rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-section">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {editMode ? (
              <>
                <button 
                  className="profile-button profile-button-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={18} />
                  <span>Сохранить</span>
                </button>
                <button 
                  className="profile-button profile-button-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X size={18} />
                  <span>Отмена</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  className="profile-button profile-button-primary"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 size={18} />
                  <span>Редактировать</span>
                </button>
                <button 
                  className="profile-button profile-button-secondary"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Выйти</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Alert и Confirm компоненты */}
      {AlertComponent}
      {ConfirmComponent}
    </div>
  );
}

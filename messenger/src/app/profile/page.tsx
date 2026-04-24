'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { useAccountsStore } from '@/stores/accounts-store';
import { getTranslations, Language } from '@/i18n';
import { FamilyRelation, FamilyRelationType } from '@/types';
import { InviteManager } from '@/components/InviteManager';
import { AccountSwitcher } from '@/components/AccountSwitcher';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { 
  ArrowLeft, User, Lock, Globe, Moon, Sun, Cloud, CloudOff, Flag,
  Camera, Save, LogOut, Gift, Plus, X, Heart, Users 
} from 'lucide-react';
import './profile.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, updateProfile } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useSettingsStore();
  const { accounts, addAccount } = useAccountsStore();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '');
  const [familyRelations, setFamilyRelations] = useState<FamilyRelation[]>(user?.familyRelations || []);
  
  const [yandexDiskConnected, setYandexDiskConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddRelation, setShowAddRelation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newRelation, setNewRelation] = useState<{ type: FamilyRelationType; userId: string }>({
    type: 'spouse',
    userId: '',
  });
  
  const translations = getTranslations(language);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setFullName(user?.fullName || '');
    setBirthDate(user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '');
    setFamilyRelations(user?.familyRelations || []);
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    
    updateProfile({
      displayName,
      fullName: fullName || undefined,
      birthDate: birthDate ? new Date(birthDate).getTime() : undefined,
      familyRelations,
    });
    
    if (user) {
      addAccount({
        ...user,
        displayName,
        fullName: fullName || undefined,
        birthDate: birthDate ? new Date(birthDate).getTime() : undefined,
        familyRelations,
      });
    }
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleConnectYandexDisk = () => {
    const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';
    const redirectUri = `${window.location.origin}/api/disk/callback`;
    const scope = 'disk:read disk:write';
    
    const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user.id);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.avatarUrl) {
        updateProfile({ avatar: data.avatarUrl });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Profile] Error uploading avatar:', error);
      }
    }
  };

  const handleAddRelation = () => {
    if (newRelation.userId.trim()) {
      const relation: FamilyRelation = {
        id: `rel_${Date.now()}`,
        userId: user?.id || '',
        relatedUserId: newRelation.userId,
        type: newRelation.type,
        createdAt: Date.now(),
      };
      setFamilyRelations([...familyRelations, relation]);
      setShowAddRelation(false);
      setNewRelation({ type: 'spouse', userId: '' });
    }
  };

  const handleRemoveRelation = (id: string) => {
    setFamilyRelations(familyRelations.filter(r => r.id !== id));
  };

  const getRelationLabel = (type: FamilyRelationType): string => {
    const labels: Record<FamilyRelationType, string> = {
      child_mother: translations.relationChildMother,
      child_father: translations.relationChildFather,
      sibling: translations.relationSibling,
      spouse: translations.relationSpouse,
    };
    return labels[type];
  };

  const languages: { code: Language; name: string }[] = [
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
    { code: 'tt', name: 'Татарча' },
  ];

  const themeOptions = [
    { value: 'dark', label: translations.darkTheme, icon: Moon },
    { value: 'light', label: translations.lightTheme, icon: Sun },
    { value: 'russia', label: translations.russiaTheme, icon: Flag },
    { value: 'india', label: translations.indiaTheme, icon: Flag },
    { value: 'china', label: translations.chinaTheme, icon: Flag },
    { value: 'tatarstan', label: translations.tatarstanTheme, icon: Flag },
    { value: 'belarus', label: translations.belarusTheme, icon: Flag },
    { value: 'bashkortostan', label: translations.bashkortostanTheme, icon: Flag },
    { value: 'chuvashia', label: translations.chuvashiaTheme, icon: Flag },
    { value: 'yakutia', label: translations.yakutiaTheme, icon: Flag },
    { value: 'udmurtia', label: translations.udmurtiaTheme, icon: Flag },
    { value: 'chechnya', label: translations.chechnyaTheme, icon: Flag },
    { value: 'ossetia', label: translations.ossetiaTheme, icon: Flag },
  ];

  const relationTypes: { value: FamilyRelationType; label: string }[] = [
    { value: 'spouse', label: translations.relationSpouse },
    { value: 'child_mother', label: translations.relationChildMother },
    { value: 'child_father', label: translations.relationChildFather },
    { value: 'sibling', label: translations.relationSibling },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      {/* Hero Header с аватаром */}
      <div className="profile-header-hero">
        <div className="profile-header-bg" />
        <button
          onClick={() => router.back()} 
          className="profile-back-btn"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="profile-avatar-section">
          <div className="profile-avatar-large">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} className="profile-avatar-img" />
            ) : (
              <span className="profile-avatar-letter">
                {user.displayName?.charAt(0).toUpperCase() || '?'}
              </span>
            )}
            <label className="profile-avatar-edit" style={{ cursor: 'pointer' }}>
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className="profile-name-section">
            <h1 className="profile-display-name">{user.displayName}</h1>
            <p className="profile-email">{user.email}</p>
            {user.fullName && <p className="profile-fullname">{user.fullName}</p>}
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Мультиаккаунты */}
        {accounts.length > 0 && (
          <section className="profile-section">
            <div className="profile-section-header">
              <Users size={20} />
              <h2>{translations.switchAccount}</h2>
            </div>
            <AccountSwitcher />
          </section>
        )}

        {/* Основная информация */}
        <section className="profile-section">
          <div className="profile-section-header">
            <User size={20} />
            <h2>{translations.personalInfo}</h2>
          </div>
          
          <div className="profile-form">
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {translations.displayName}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="form-input"
                placeholder={translations.displayName}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                {translations.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input"
                placeholder={translations.fullNamePlaceholder || 'Иванов Иван Иванович'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Globe size={16} />
                {translations.birthDate}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              onClick={handleSave}
              className="btn-save-profile"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="spinner-small" />
              ) : (
                <>
                  <Save size={18} />
                  {translations.save}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Семья */}
        <section className="profile-section">
          <div className="profile-section-header">
            <Heart size={20} />
            <h2>{translations.familyRelations}</h2>
          </div>

          {familyRelations.length === 0 ? (
            <div className="profile-empty-state">
              <Heart size={48} className="empty-icon" />
              <p>{translations.noRelations}</p>
            </div>
          ) : (
            <div className="relations-list">
              {familyRelations.map(relation => (
                <div key={relation.id} className="relation-item">
                  <div className="relation-info">
                    <Users size={20} className="relation-icon" />
                    <div>
                      <p className="relation-type">{getRelationLabel(relation.type)}</p>
                      <p className="relation-user-id">ID: {relation.relatedUserId}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRelation(relation.id)}
                    className="relation-remove"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddRelation ? (
            <div className="add-relation-form">
              <select
                value={newRelation.type}
                onChange={(e) => setNewRelation({ ...newRelation, type: e.target.value as FamilyRelationType })}
                className="form-select"
              >
                {relationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={newRelation.userId}
                onChange={(e) => setNewRelation({ ...newRelation, userId: e.target.value })}
                className="form-input"
                placeholder="ID пользователя"
              />
              <div className="form-actions-row">
                <button onClick={handleAddRelation} className="btn-confirm">
                  {translations.addRelation}
                </button>
                <button onClick={() => setShowAddRelation(false)} className="btn-cancel">
                  {translations.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAddRelation(true)} className="btn-add-relation">
              <Plus size={18} />
              {translations.addRelation}
            </button>
          )}
        </section>

        {/* Настройки */}
        <section className="profile-section">
          <div className="profile-section-header">
            <Globe size={20} />
            <h2>{translations.preferences}</h2>
          </div>

          <div className="settings-grid">
            {/* Язык */}
            <div className="setting-item">
              <label className="setting-label">{translations.language}</label>
              <div className="setting-control">
                <Globe size={18} />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="setting-select"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Тема */}
            <div className="setting-item">
              <label className="setting-label">{translations.theme}</label>
              <div className="theme-toggle-grid">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => theme !== option.value && setTheme(option.value as any)}
                      className={`theme-option ${theme === option.value ? 'active' : ''}`}
                      title={option.label}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button 
            className="setting-item-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={18} />
            <span>{translations.changePassword}</span>
          </button>

          <button 
            className="setting-item-btn disk-connect"
            onClick={handleConnectYandexDisk}
          >
            {yandexDiskConnected ? <Cloud size={18} /> : <CloudOff size={18} />}
            <span>{yandexDiskConnected ? translations.yandexDiskConnected : translations.connectYandexDisk}</span>
          </button>
        </section>

        {/* Инвайты */}
        <section className="profile-section">
          <div className="profile-section-header">
            <Gift size={20} />
            <h2>{translations.invite}</h2>
          </div>
          <p className="section-desc">{translations.inviteFriendsAndGetPoints}</p>
          <InviteManager userId={user.id} />
        </section>

        {/* Выход */}
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
          <span>{translations.logout}</span>
        </button>

        <div className="profile-bottom-spacer" />
      </div>

      {/* Модальное окно смены пароля */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}

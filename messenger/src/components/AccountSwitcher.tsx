'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useAccountsStore } from '@/stores/accounts-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { User, LogOut, Plus, ChevronRight, Moon, Sun, Flag, Globe } from 'lucide-react';
import './AccountSwitcher.css';

export function AccountSwitcher() {
  const router = useRouter();
  const { user, login, logout } = useAuthStore();
  const { accounts, currentAccountId, setCurrentAccount, removeAccount, addAccount } = useAccountsStore();
  const { language, setLanguage, theme, setTheme } = useSettingsStore();
  const translations = getTranslations(language);
  
  const [showAccounts, setShowAccounts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const currentAccount = accounts.find(a => a.id === currentAccountId);
  const otherAccounts = accounts.filter(a => a.id !== currentAccountId);

  // При смене аккаунта - логинимся под ним
  const handleSwitchAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (account && user) {
      // Создаём AuthUser из данных аккаунта
      login({
        id: account.userId,
        email: account.email,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        provider: account.provider,
      });
      setCurrentAccount(accountId);
      setShowAccounts(false);
    }
  };

  // Добавить новый аккаунт
  const handleAddAccount = () => {
    logout();
    setShowAccounts(false);
    router.push('/login');
  };

  // Выйти из текущего аккаунта
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Выйти из всех аккаунтов
  const handleLogoutAll = () => {
    accounts.forEach(a => removeAccount(a.id));
    logout();
    router.push('/login');
  };

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
    { code: 'tt', name: 'Татарча' },
  ];

  return (
    <div className="account-switcher">
      {/* Текущий аккаунт */}
      <button 
        className="account-switcher-current"
        onClick={() => setShowAccounts(!showAccounts)}
      >
        <div className="account-avatar">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} />
          ) : (
            <span>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
          )}
        </div>
        <div className="account-info">
          <span className="account-name">{user?.displayName}</span>
          <span className="account-email">{user?.email}</span>
        </div>
        <ChevronRight size={20} className={`account-chevron ${showAccounts ? 'open' : ''}`} />
      </button>

      {/* Выпадающий список аккаунтов */}
      {showAccounts && (
        <div className="account-dropdown">
          {/* Другие аккаунты */}
          {otherAccounts.map(account => (
            <button
              key={account.id}
              className="account-item"
              onClick={() => handleSwitchAccount(account.id)}
            >
              <div className="account-avatar small">
                {account.avatarUrl ? (
                  <img src={account.avatarUrl} alt={account.displayName} />
                ) : (
                  <span>{account.displayName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="account-info">
                <span className="account-name">{account.displayName}</span>
                <span className="account-email">{account.email}</span>
              </div>
            </button>
          ))}

          {/* Кнопка добавления аккаунта */}
          <button
            className="account-item add-account"
            onClick={handleAddAccount}
          >
            <div className="account-avatar small add">
              <Plus size={16} />
            </div>
            <span className="account-name">{translations.addAccount}</span>
          </button>

          <div className="account-divider" />

          {/* Настройки */}
          <button
            className="account-item"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Globe size={18} />
            <span className="account-name">{translations.settings}</span>
          </button>

          {showSettings && (
            <div className="account-settings">
              {/* Язык */}
              <div className="account-setting-group">
                <label className="account-setting-label">{translations.language}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="account-setting-select"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Тема */}
              <div className="account-setting-group">
                <label className="account-setting-label">{translations.theme}</label>
                <div className="account-setting-theme-grid">
                  <button
                    className={`theme-btn-icon ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                    title={translations.darkTheme}
                  >
                    <Moon size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                    title={translations.lightTheme}
                  >
                    <Sun size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'russia' ? 'active' : ''}`}
                    onClick={() => setTheme('russia')}
                    title={translations.russiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'india' ? 'active' : ''}`}
                    onClick={() => setTheme('india')}
                    title={translations.indiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'china' ? 'active' : ''}`}
                    onClick={() => setTheme('china')}
                    title={translations.chinaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'tatarstan' ? 'active' : ''}`}
                    onClick={() => setTheme('tatarstan')}
                    title={translations.tatarstanTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'belarus' ? 'active' : ''}`}
                    onClick={() => setTheme('belarus')}
                    title={translations.belarusTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'bashkortostan' ? 'active' : ''}`}
                    onClick={() => setTheme('bashkortostan')}
                    title={translations.bashkortostanTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'chuvashia' ? 'active' : ''}`}
                    onClick={() => setTheme('chuvashia')}
                    title={translations.chuvashiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'yakutia' ? 'active' : ''}`}
                    onClick={() => setTheme('yakutia')}
                    title={translations.yakutiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'udmurtia' ? 'active' : ''}`}
                    onClick={() => setTheme('udmurtia')}
                    title={translations.udmurtiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'chechnya' ? 'active' : ''}`}
                    onClick={() => setTheme('chechnya')}
                    title={translations.chechnyaTheme}
                  >
                    <Flag size={18} />
                  </button>
                  <button
                    className={`theme-btn-icon ${theme === 'ossetia' ? 'active' : ''}`}
                    onClick={() => setTheme('ossetia')}
                    title={translations.ossetiaTheme}
                  >
                    <Flag size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="account-divider" />

          {/* Выход */}
          <button
            className="account-item logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="account-name">{translations.logout}</span>
          </button>

          {accounts.length > 1 && (
            <button
              className="account-item logout-all"
              onClick={handleLogoutAll}
            >
              <LogOut size={18} />
              <span className="account-name">{translations.logoutAll}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
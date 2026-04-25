'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations, Language } from '@/i18n';
import { Settings, LogOut, User, Moon, Sun, Flag, Globe, Shield, Home, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './ui/Logo';
import { BurgerMenu } from './ui/BurgerMenu';
import './layout/Header.css';

// Карта путей к заголовкам страниц
const PAGE_TITLES: Record<string, string> = {
  '/': 'main',
  '/downloads': 'downloads',
  '/about-balloo': 'aboutBalloo',
  '/about-company': 'aboutCompany',
  '/features': 'features',
  '/support': 'supportProject',
  '/chats': 'chats',
  '/settings': 'settings',
  '/admin': 'adminPanel',
  '/profile': 'profile',
  '/login': 'login',
  '/register': 'register',
  '/terms': 'termsOfService',
  '/privacy': 'privacyPolicy',
  '/error': 'error',
  '/forbidden': 'accessDenied',
  '/maintenance': 'maintenanceMode',
  '/not-found': 'pageNotFound',
};

// Страницы, которые требуют кнопку назад
const BACK_BUTTON_PAGES = ['/chats', '/settings', '/profile', '/admin'];

// Полное меню для всех страниц
const MAIN_MENU_ITEMS = [
  { path: '/', label: 'main', icon: Home },
  { path: '/downloads', label: 'downloads', icon: null },
  { path: '/about-balloo', label: 'aboutBalloo', icon: null },
  { path: '/about-company', label: 'aboutCompany', icon: null },
  { path: '/features', label: 'features', icon: null },
  { path: '/support', label: 'supportProject', icon: null },
];

const AUTH_MENU_ITEMS = [
  { path: '/chats', label: 'chats', icon: null },
  { path: '/settings', label: 'settings', icon: Settings },
  { path: '/admin', label: 'adminPanel', icon: Shield },
  { path: '/profile', label: 'profile', icon: User },
];

// Темы оформления
const THEMES = [
  { value: 'dark', label: 'darkTheme', icon: Moon, color: '#1a1a2e' },
  { value: 'light', label: 'lightTheme', icon: Sun, color: '#f5f5f5' },
  { value: 'russia', label: 'russiaTheme', icon: Flag, color: '#0039a6' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, setTheme } = useSettingsStore();
  const { language, setLanguage } = useSettingsStore();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  const translations = getTranslations(language);

  const languages: { code: Language; name: string }[] = [
    { code: 'ru', name: 'Русский' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
    { code: 'tt', name: 'Татарча' },
    { code: 'en', name: 'English' },
    { code: 'be', name: 'Беларуская' },
    { code: 'ba', name: 'Башҡорт' },
    { code: 'cv', name: 'Чăваш' },
    { code: 'sah', name: 'Саха' },
    { code: 'udm', name: 'Удмурт' },
    { code: 'ce', name: 'Нохчийн' },
    { code: 'os', name: 'Ирон' },
  ];

  // Установка заголовка страницы и title
  useEffect(() => {
    const routeKey = Object.keys(PAGE_TITLES).find(key => 
      pathname === key || (pathname?.startsWith(key + '/') && key !== '/')
    ) || '/';
    
    const titleKey = PAGE_TITLES[routeKey];
    const title = titleKey ? (translations[titleKey as keyof typeof translations] || titleKey) : 'Balloo';
    setPageTitle(title);
    document.title = `${title} | Balloo`;
  }, [pathname, translations]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
    setMenuOpen(false);
  };

  const handleThemeChange = (newTheme: any) => {
    setTheme(newTheme);
    setMenuOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  const isAdmin = user?.isAdmin || user?.isSuperAdmin;

  const handleMenuClick = (path: string) => {
    setMenuOpen(false);
    setLangMenuOpen(false);
    setUserMenuOpen(false);
  };

  const showBackButton = BACK_BUTTON_PAGES.some(page => pathname.startsWith(page));

  return (
    <>
      <header className="header">
        <div className="header-row">
          {/* Кнопка назад */}
          {showBackButton && (
            <div className="header-left">
              <button 
                className="header-back-btn"
                onClick={handleBack}
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          )}

          {/* Логотип - адаптивный с заглушкой */}
          {!showBackButton && (
            <div className="header-left">
              <Link href="/" className="header-logo" onClick={() => {
                setMenuOpen(false);
                setLangMenuOpen(false);
                setUserMenuOpen(false);
              }}>
                <Logo 
                  src="/logo.jpg" 
                  alt="Balloo Messenger" 
                  size="md"
                  showText={true}
                />
              </Link>
            </div>
          )}

          {/* Заголовок страницы */}
          <div className="header-center">
            <div className="header-page-title">
              <span>{pageTitle}</span>
            </div>
          </div>

          {/* Правая часть - Меню */}
          <div className="header-right">
            {/* Бургер меню с маскотом - адаптивное с заглушкой */}
            <BurgerMenu 
              mascotSrc="/mascot.png"
              mascotAlt="Balloo Mascot"
              size="md"
              isOpen={menuOpen}
              onToggle={() => {
                setLangMenuOpen(false);
                setUserMenuOpen(false);
                setMenuOpen(!menuOpen);
              }}
            />
            
            {/* Полное меню */}
            {menuOpen && (
              <div className="header-full-menu">
                {/* Темы оформления */}
                <div className="header-menu-section">
                  <div className="header-menu-section-title">{translations.theme}</div>
                  <div className="header-theme-grid">
                    {THEMES.map((t) => {
                      const ThemeIcon = t.icon;
                      return (
                        <button
                          key={t.value}
                          onClick={() => handleThemeChange(t.value)}
                          className={`header-theme-option ${theme === t.value ? 'active' : ''}`}
                        >
                          <div 
                            className="header-theme-color"
                            style={{ background: t.color }}
                          />
                          <ThemeIcon size={16} />
                          <span>{translations[t.label as keyof typeof translations] || t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Общие разделы */}
                <div className="header-menu-section">
                  <div className="header-menu-section-title">{translations.main}</div>
                  {MAIN_MENU_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`header-full-menu-item ${pathname === item.path ? 'active' : ''}`}
                        onClick={() => handleMenuClick(item.path)}
                      >
                        {Icon && <Icon size={16} />}
                        {translations[item.label as keyof typeof translations] || item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Для авторизованных */}
                {isAuthenticated && (
                  <div className="header-menu-section">
                    <div className="header-menu-section-title">{translations.chats}</div>
                    {AUTH_MENU_ITEMS.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`header-full-menu-item ${pathname === item.path ? 'active' : ''}`}
                          onClick={() => handleMenuClick(item.path)}
                        >
                          {Icon && <Icon size={16} />}
                          {translations[item.label as keyof typeof translations] || item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Для неавторизованных */}
                {!isAuthenticated && (
                  <div className="header-menu-section">
                    <div className="header-menu-section-title">{translations.auth}</div>
                    <Link
                      href="/login"
                      className={`header-full-menu-item ${pathname === '/login' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('/login')}
                    >
                      <User size={16} />
                      {translations.login}
                    </Link>
                    <Link
                      href="/register"
                      className={`header-full-menu-item ${pathname === '/register' ? 'active' : ''}`}
                      onClick={() => handleMenuClick('/register')}
                    >
                      <User size={16} />
                      {translations.register}
                    </Link>
                  </div>
                )}

                {/* Настройки */}
                <div className="header-menu-section">
                  <div className="header-menu-section-title">{translations.settings}</div>
                  
                  {/* Язык */}
                  <div className="header-menu-language">
                    <Globe size={16} />
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className="header-language-select"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Для авторизованных - профиль и выход */}
                {isAuthenticated && (
                  <>
                    <div className="header-menu-divider" />
                    <div className="header-menu-section">
                      <Link
                        href="/profile"
                        className="header-full-menu-item"
                        onClick={() => handleMenuClick('/profile')}
                      >
                        <User size={16} />
                        {translations.profile}
                      </Link>
                      <button
                        className="header-full-menu-item danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        {translations.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Аватар/Маскот для авторизованных */}
            {isAuthenticated && (
              <div className="header-dropdown">
                <button 
                  className="header-action header-user" 
                  onClick={() => {
                    setMenuOpen(false);
                    setLangMenuOpen(false);
                    setUserMenuOpen(!userMenuOpen);
                  }}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.displayName || 'User'}
                      className="header-avatar-img"
                    />
                  ) : (
                    <div className="header-avatar">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <ChevronDown size={14} className={userMenuOpen ? 'rotate' : ''} />
                </button>
                {userMenuOpen && (
                  <div className="header-dropdown-menu">
                    <Link 
                      href="/profile" 
                      className="header-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      {translations.profile}
                    </Link>
                    <Link 
                      href="/settings" 
                      className="header-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      {translations.settings}
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/admin" 
                        className="header-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Shield size={16} />
                        {translations.adminPanel}
                      </Link>
                    )}
                    <div className="header-dropdown-divider" />
                    <button 
                      className="header-dropdown-item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      {translations.logout}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Кнопки входа для неавторизованных */}
            {!isAuthenticated && (
              <>
                <Link href="/login" className="header-action header-login-btn">
                  <User size={18} />
                  <span>{translations.login}</span>
                </Link>
                <Link href="/register" className="header-action header-register-btn">
                  <User size={18} />
                  <span>{translations.register}</span>
                </Link>
              </>
            )}
          </div>
      </div>
    </header>
  </>
);
}

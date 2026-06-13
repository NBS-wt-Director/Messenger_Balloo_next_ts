
/**
 * ThemeSelector - Модальное окно выбора тем
 */

import type { ThemePresetId } from '@balloo/core-theme';
import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore, PRESET_THEMES, type PresetTheme } from '@balloo/core-theme';
import ThemeCard from './ThemeCard';
import ThemeSubscriptionDialog from './ThemeSubscriptionDialog';
import './ThemeSelector.css';

type TabType = 'presets' | 'recent' | 'favorites';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  
  const {
    customThemes,
    recentThemes,
    favorites,
    subscription,
    loadThemesFromServer
  } = useSettingsStore();

  const { setTheme } = useThemeStore();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      setWasAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        loadThemesFromServer();
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleSelectTheme = (themeId: ThemePresetId) => {
    setSelectedTheme(themeId);
    
    if (!isAuthenticated) {
      // Неавторизованный - применяем временно
      setTheme(themeId);
      return;
    }
    
    if (subscription.isActive) {
      // Подписка активна - применяем тему
      setTheme(themeId);
      onClose();
    } else {
      // Нет подписки - показываем диалог
      setShowSubscription(true);
    }
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscription(false);
    setTheme(selectedTheme as ThemePresetId);
    onClose();
  };

  // При закрытии окна, если пользователь не был авторизован
  const handleClose = () => {
    if (!wasAuthenticated && !isAuthenticated) {
      // Сброс на светлую тему
      setTheme('light');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="theme-selector-overlay" onClick={handleClose}>
      <div className="theme-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="theme-selector-header">
          <h2>Выбор темы</h2>
          <button className="theme-selector-close" onClick={handleClose}>×</button>
        </div>

        <div className="theme-selector-tabs">
          <button
            className={`tab ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            Предустановленные
          </button>
          <button
            className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Последние {isAuthenticated ? `(${recentThemes.length})` : ''}
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Избранное {isAuthenticated ? `(${favorites.length})` : ''}
          </button>
        </div>

        <div className="theme-selector-content">
          {activeTab === 'presets' && (
            <div className="theme-grid">
              {(PRESET_THEMES as unknown as PresetTheme[]).map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={selectedTheme === theme.id}
                  onSelect={() => handleSelectTheme(theme.id as ThemePresetId)}
                  onFavorite={() => {}}
                  isFavorite={false}
                  locked={false}
                />
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="theme-grid">
              {!isAuthenticated ? (
                <p className="no-themes">
                  Пожалуйста, <a href="/login">войдите</a>, чтобы увидеть историю тем
                </p>
              ) : recentThemes.length === 0 ? (
                <p className="no-themes">Нет последних использованных тем</p>
              ) : (
                recentThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedTheme === theme.id}
                    onSelect={() => handleSelectTheme(theme.id as ThemePresetId)}
                    onFavorite={() => {}}
                    isFavorite={false}
                    locked={!subscription.isActive}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="theme-grid">
              {!isAuthenticated ? (
                <p className="no-themes">
                  Пожалуйста, <a href="/login">войдите</a>, чтобы увидеть избранное
                </p>
              ) : favorites.length === 0 ? (
                <p className="no-themes">Нет избранных тем</p>
              ) : (
                favorites.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedTheme === theme.id}
                    onSelect={() => handleSelectTheme(theme.id as ThemePresetId)}
                    onFavorite={() => {}}
                    isFavorite={true}
                    locked={!subscription.isActive}
                  />
                ))
              )}
            </div>
          )}
        </div>

        <div className="theme-selector-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>

      {showSubscription && (
        <ThemeSubscriptionDialog
          isOpen={showSubscription}
          onClose={() => setShowSubscription(false)}
          onConfirm={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
};

export default ThemeSelector;

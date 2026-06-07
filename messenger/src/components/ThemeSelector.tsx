/**
 * ThemeSelector - Модальное окно выбора тем
 */

import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import ThemeCard from './ThemeCard';
import ThemeSubscriptionDialog from './ThemeSubscriptionDialog';
import './ThemeSelector.css';

type TabType = 'presets' | 'recent' | 'favorites';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_THEMES = [
  {
    id: 'light',
    name: 'Светлая',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6',
      accent: '#007bff'
    }
  },
  {
    id: 'dark',
    name: 'Тёмная',
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      accent: '#0d6efd'
    }
  },
  {
    id: 'russia',
    name: 'Россия',
    colors: {
      primary: '#0039A6',
      secondary: '#D52B1E',
      background: '#ffffff',
      surface: '#f0f0f0',
      text: '#000000',
      textSecondary: '#555555',
      border: '#cccccc',
      accent: '#D52B1E'
    }
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  
  const {
    customThemes,
    recentThemes,
    favorites,
    subscription,
    setTheme,
    loadThemesFromServer
  } = useSettingsStore();

  useEffect(() => {
    if (isOpen) {
      loadThemesFromServer();
    }
  }, [isOpen]);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    
    if (subscription.isActive) {
      // Подписка активна - применяем тему
      setTheme(themeId as any);
      onClose();
    } else {
      // Нет подписки - показываем диалог
      setShowSubscription(true);
    }
  };

  const handleSubscriptionSuccess = () => {
    setShowSubscription(false);
    setTheme(selectedTheme as any);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="theme-selector-overlay" onClick={onClose}>
      <div className="theme-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="theme-selector-header">
          <h2>Выбор темы</h2>
          <button className="theme-selector-close" onClick={onClose}>×</button>
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
            Последние ({recentThemes.length})
          </button>
          <button
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Избранное ({favorites.length})
          </button>
        </div>

        <div className="theme-selector-content">
          {activeTab === 'presets' && (
            <div className="theme-grid">
              {PRESET_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={selectedTheme === theme.id}
                  onSelect={() => handleSelectTheme(theme.id)}
                  onFavorite={() => {}}
                  isFavorite={false}
                  locked={false}
                />
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="theme-grid">
              {recentThemes.length === 0 ? (
                <p className="no-themes">Нет последних использованных тем</p>
              ) : (
                recentThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedTheme === theme.id}
                    onSelect={() => handleSelectTheme(theme.id)}
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
              {favorites.length === 0 ? (
                <p className="no-themes">Нет избранных тем</p>
              ) : (
                favorites.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    selected={selectedTheme === theme.id}
                    onSelect={() => handleSelectTheme(theme.id)}
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
          <button className="btn-secondary" onClick={onClose}>
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

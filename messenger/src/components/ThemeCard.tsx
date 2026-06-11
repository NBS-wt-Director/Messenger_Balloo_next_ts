/**
 * ThemeCard - Карточка темы с превью
 */

import React from 'react';
import type { PresetTheme } from '@balloo/core-theme';
import './ThemeCard.css';

interface ThemeCardProps {
  theme: PresetTheme;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
  locked?: boolean;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  selected,
  onSelect,
  onFavorite,
  isFavorite,
  locked = false
}) => {
  const colors = theme.colors;

  return (
    <div
      className={`theme-card ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`}
      onClick={onSelect}
    >
      <div
        className="theme-preview"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        {locked && (
          <div className="lock-overlay">
            <span className="lock-icon">🔒</span>
          </div>
        )}
        
        <div className="preview-colors">
          <div className="color-swatch" style={{ background: colors.primary }} />
          <div className="color-swatch" style={{ background: colors.background }} />
          <div className="color-swatch" style={{ background: colors.surface }} />
          <div className="color-swatch" style={{ background: colors.accent }} />
        </div>
      </div>

      <div className="theme-info">
        <h3>{theme.name}</h3>
        
        <div className="theme-actions">
          {isFavorite && (
            <button
              className="favorite-btn"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              title="Убрать из избранного"
            >
              ❤️
            </button>
          )}
          
          <button className="select-btn">
            {selected ? 'Выбрано' : locked ? 'Купить' : 'Выбрать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;

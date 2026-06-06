# 🎨 РЕАЛИЗАЦИЯ 4-Й ТЕМЫ (ПОЛЬЗОВАТЕЛЬСКИЕ НАСТРОЙКИ)

**Статус:** 🟡 В разработке  
**Приоритет:** 🔴 Высокий  
**Оценка:** 16 часов (2 рабочих дня)

---

## 📋 СОДЕРЖАНИЕ

1. [Требования](#1-требования)
2. [Архитектура](#2-архитектура)
3. [Бэкенд (API)](#3-бэкенд-api)
4. [Фронтенд (Messenger)](#4-фронтенд-messenger)
5. [База данных](#5-база-данных)
6. [Тестирование](#6-тестирование)
7. [Документация](#7-документация)

---

## 1. ТРЕБОВАНИЯ

### 1.1 Функциональные требования

1. **Всплывающее окно** выбора тем
   - Открытие по кнопке в настройках
   - Закрываемое модальное окно
   - Адаптивный дизайн

2. **Предустановленные темы**
   - 15 последних использованных тем
   - Автоматическое сохранение истории
   - Лимит 15 записей

3. **Избранное**
   - До 5 тем в избранном
   - Быстрый доступ к избранным
   - Возможность удалять из избранного

4. **Платная функция**
   - Стоимость: 3 балла/сутки
   - Проверка баланса перед активацией
   - Автопродление по желанию

5. **Для неавторизованных**
   - Просмотр тем без изменений
   - После закрытия - сброс на светлую тему
   - Предложение зарегистрироваться

6. **При недостатке средств**
   - Сообщение о недостатке баллов
   - Ссылка на страницу пополнения
   - Автоматический сброс на светлую тему

---

### 1.2 Нефункциональные требования

- **Производительность:** Загрузка тем < 100ms
- **UX:** Плавные анимации переходов
- **Безопасность:** Проверка подписки на сервере
- **Масштабируемость:** Поддержка 1000+ пользователей

---

## 2. АРХИТЕКТУРА

### 2.1 Компоненты

```
messenger/src/
├── components/
│   ├── ThemeSelector.tsx              # Основное модальное окно
│   ├── ThemeCard.tsx                  # Карточка темы
│   ├── ThemePreview.tsx               # Предпросмотр темы
│   └── ThemeSubscriptionDialog.tsx    # Диалог подписки
├── stores/
│   └── settings-store.ts              # Обновлённый store
├── app/
│   └── theme-subscription/
│       └── page.tsx                   # Страница подписки
└── types/
    └── themes.ts                      # Типы тем
```

### 2.2 API Endpoints

```
GET    /api/v1/themes                    # Получить список тем
GET    /api/v1/themes/subscriptions      # Статус подписки
POST   /api/v1/themes/subscriptions      # Активировать подписку
POST   /api/v1/themes/user               # Создать пользовательскую тему
DELETE /api/v1/themes/user/:id           # Удалить тему
POST   /api/v1/themes/favorites          # Добавить в избранное
DELETE /api/v1/themes/favorites/:id      # Удалить из избранного
```

---

## 3. БЭКЕНД (API)

### 3.1 Схема базы данных

```sql
-- themes.sql

-- Таблица пользовательских тем
CREATE TABLE IF NOT EXISTS user_themes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  colors JSON NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица подписок на темы
CREATE TABLE IF NOT EXISTS theme_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activated_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  days_count INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Таблица истории использованных тем
CREATE TABLE IF NOT EXISTS theme_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  used_at INTEGER NOT NULL
);

-- Индексы
CREATE INDEX idx_user_themes_user ON user_themes(user_id);
CREATE INDEX idx_user_themes_favorite ON user_themes(user_id, is_favorite);
CREATE INDEX idx_theme_subscriptions_user ON theme_subscriptions(user_id);
CREATE INDEX idx_theme_subscriptions_status ON theme_subscriptions(status, expires_at);
CREATE INDEX idx_theme_history_user ON theme_history(user_id, used_at);
```

### 3.2 Контроллер тем

```javascript
// api/src/controllers/themes.controller.js

const db = require('../config/database');

const themesController = {
  // Получить все доступные темы для пользователя
  getThemes: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Получить пользовательские темы
      const userThemes = db.prepare(`
        SELECT id, name, colors, is_favorite, created_at
        FROM user_themes
        WHERE user_id = ?
        ORDER BY created_at DESC
      `).all(userId);
      
      // Получить последние использованные темы (15)
      const recentThemes = db.prepare(`
        SELECT th.theme_id, ut.name, ut.colors
        FROM theme_history th
        LEFT JOIN user_themes ut ON th.theme_id = ut.id
        WHERE th.user_id = ?
        GROUP BY th.theme_id
        ORDER BY th.used_at DESC
        LIMIT 15
      `).all(userId);
      
      // Получить избранное
      const favorites = db.prepare(`
        SELECT id, name, colors, created_at
        FROM user_themes
        WHERE user_id = ? AND is_favorite = 1
        ORDER BY created_at DESC
        LIMIT 5
      `).all(userId);
      
      // Проверить подписку
      const subscription = db.prepare(`
        SELECT id, expires_at, status
        FROM theme_subscriptions
        WHERE user_id = ? AND status = 'active' AND expires_at > ?
        LIMIT 1
      `).get(userId, Date.now());
      
      res.json({
        success: true,
        data: {
          userThemes: userThemes.map(t => ({
            id: t.id,
            name: t.name,
            colors: JSON.parse(t.colors),
            isFavorite: t.is_favorite === 1,
            createdAt: t.created_at
          })),
          recentThemes: recentThemes.map(t => ({
            id: t.theme_id,
            name: t.name,
            colors: JSON.parse(t.colors)
          })),
          favorites: favorites.map(t => ({
            id: t.id,
            name: t.name,
            colors: JSON.parse(t.colors),
            createdAt: t.created_at
          })),
          subscription: subscription ? {
            isActive: true,
            expiresAt: subscription.expires_at
          } : { isActive: false }
        }
      });
    } catch (error) {
      console.error('[Themes] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch themes'
      });
    }
  },
  
  // Создать пользовательскую тему
  createUserTheme: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, colors, isFavorite } = req.body;
      
      // Проверить лимит избранных
      if (isFavorite) {
        const favoriteCount = db.prepare(`
          SELECT COUNT(*) as count
          FROM user_themes
          WHERE user_id = ? AND is_favorite = 1
        `).get(userId);
        
        if (favoriteCount.count >= 5) {
          return res.status(400).json({
            success: false,
            error: 'Maximum 5 favorite themes allowed'
          });
        }
      }
      
      const themeId = `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      
      db.prepare(`
        INSERT INTO user_themes (id, user_id, name, colors, is_favorite, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(themeId, userId, name, JSON.stringify(colors), isFavorite ? 1 : 0, now, now);
      
      res.json({
        success: true,
        data: {
          id: themeId,
          name,
          colors,
          isFavorite: isFavorite || false,
          createdAt: now
        }
      });
    } catch (error) {
      console.error('[Themes] Create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create theme'
      });
    }
  },
  
  // Удалить тему
  deleteUserTheme: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const result = db.prepare(`
        DELETE FROM user_themes
        WHERE id = ? AND user_id = ?
      `).run(id, userId);
      
      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          error: 'Theme not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Theme deleted'
      });
    } catch (error) {
      console.error('[Themes] Delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete theme'
      });
    }
  },
  
  // Добавить в избранное
  addToFavorites: async (req, res) => {
    try {
      const { id } = req.body;
      const userId = req.user.id;
      
      // Проверить лимит
      const favoriteCount = db.prepare(`
        SELECT COUNT(*) as count
        FROM user_themes
        WHERE user_id = ? AND is_favorite = 1
      `).get(userId);
      
      if (favoriteCount.count >= 5) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 5 favorite themes allowed'
        });
      }
      
      db.prepare(`
        UPDATE user_themes
        SET is_favorite = 1, updated_at = ?
        WHERE id = ? AND user_id = ?
      `).run(Date.now(), id, userId);
      
      res.json({
        success: true,
        message: 'Added to favorites'
      });
    } catch (error) {
      console.error('[Themes] Favorite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add to favorites'
      });
    }
  },
  
  // Удалить из избранного
  removeFromFavorites: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      db.prepare(`
        UPDATE user_themes
        SET is_favorite = 0, updated_at = ?
        WHERE id = ? AND user_id = ?
      `).run(Date.now(), id, userId);
      
      res.json({
        success: true,
        message: 'Removed from favorites'
      });
    } catch (error) {
      console.error('[Themes] Unfavorite error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove from favorites'
      });
    }
  },
  
  // Сохранить использование темы
  recordThemeUsage: async (userId, themeId) => {
    try {
      // Удалить старую запись если есть
      db.prepare(`
        DELETE FROM theme_history
        WHERE user_id = ? AND theme_id = ?
      `).run(userId, themeId);
      
      // Добавить новую запись
      db.prepare(`
        INSERT INTO theme_history (id, user_id, theme_id, used_at)
        VALUES (?, ?, ?, ?)
      `).run(
        `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        themeId,
        Date.now()
      );
      
      // Оставить только 15 последних
      db.prepare(`
        DELETE FROM theme_history
        WHERE id NOT IN (
          SELECT id FROM theme_history
          WHERE user_id = ?
          ORDER BY used_at DESC
          LIMIT 15
        ) AND user_id = ?
      `).run(userId, userId);
    } catch (error) {
      console.error('[Themes] Record usage error:', error);
    }
  }
};

module.exports = themesController;
```

### 3.3 Контроллер подписок

```javascript
// api/src/controllers/theme-subscriptions.controller.js

const db = require('../config/database');

const subscriptionsController = {
  // Получить статус подписки
  getStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const subscription = db.prepare(`
        SELECT id, activated_at, expires_at, days_count, cost, status
        FROM theme_subscriptions
        WHERE user_id = ? AND status = 'active' AND expires_at > ?
        LIMIT 1
      `).get(userId, Date.now());
      
      if (!subscription) {
        return res.json({
          success: true,
          data: { isActive: false }
        });
      }
      
      res.json({
        success: true,
        data: {
          isActive: true,
          activatedAt: subscription.activated_at,
          expiresAt: subscription.expires_at,
          daysCount: subscription.days_count,
          cost: subscription.cost,
          daysLeft: Math.ceil((subscription.expires_at - Date.now()) / (1000 * 60 * 60 * 24))
        }
      });
    } catch (error) {
      console.error('[Subscription] Status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch subscription status'
      });
    }
  },
  
  // Активировать подписку
  activate: async (req, res) => {
    try {
      const userId = req.user.id;
      const { days } = req.body;
      
      if (!days || days < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid days count'
        });
      }
      
      const cost = days * 3; // 3 балла в день
      
      // Проверить баланс
      const user = db.prepare(`
        SELECT points
        FROM users
        WHERE id = ?
      `).get(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      if (user.points < cost) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance',
          data: {
            balance: user.points,
            required: cost,
            deficit: cost - user.points
          }
        });
      }
      
      // Списываем баллы
      db.prepare(`
        UPDATE users
        SET points = points - ?
        WHERE id = ?
      `).run(cost, userId);
      
      // Записываем транзакцию
      db.prepare(`
        INSERT INTO point_transactions (
          id, user_id, type, amount, description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        'spent',
        -cost,
        `Theme subscription for ${days} days`,
        Date.now()
      );
      
      // Активируем подписку
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      const expiresAt = now + (days * 24 * 60 * 60 * 1000);
      
      db.prepare(`
        INSERT INTO theme_subscriptions (
          id, user_id, activated_at, expires_at, days_count, cost, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?)
      `).run(
        subscriptionId,
        userId,
        now,
        expiresAt,
        days,
        cost,
        now,
        now
      );
      
      res.json({
        success: true,
        data: {
          id: subscriptionId,
          activatedAt: now,
          expiresAt,
          daysCount: days,
          cost,
          daysLeft: days
        }
      });
    } catch (error) {
      console.error('[Subscription] Activate error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to activate subscription'
      });
    }
  },
  
  // Отменить подписку
  cancel: async (req, res) => {
    try {
      const userId = req.user.id;
      
      db.prepare(`
        UPDATE theme_subscriptions
        SET status = 'cancelled', updated_at = ?
        WHERE user_id = ? AND status = 'active'
      `).run(Date.now(), userId);
      
      res.json({
        success: true,
        message: 'Subscription cancelled'
      });
    } catch (error) {
      console.error('[Subscription] Cancel error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel subscription'
      });
    }
  }
};

module.exports = subscriptionsController;
```

### 3.4 Роуты

```javascript
// api/src/routes/themes.js

const express = require('express');
const router = express.Router();
const themesController = require('../controllers/themes.controller');
const subscriptionsController = require('../controllers/theme-subscriptions.controller');
const { authenticate } = require('../middleware/auth');

// Все роуты требуют аутентификации
router.use(authenticate);

// Темы
router.get('/', themesController.getThemes);
router.post('/', themesController.createUserTheme);
router.delete('/:id', themesController.deleteUserTheme);
router.post('/favorites', themesController.addToFavorites);
router.delete('/favorites/:id', themesController.removeFromFavorites);

// Подписки
router.get('/subscriptions', subscriptionsController.getStatus);
router.post('/subscriptions', subscriptionsController.activate);
router.delete('/subscriptions', subscriptionsController.cancel);

module.exports = router;
```

---

## 4. ФРОНТЕНД (MESSENGER)

### 4.1 Типы

```typescript
// messenger/src/types/themes.ts

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  colors: ThemeColors;
  isPredefined: boolean;
}

export interface UserTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  createdAt: number;
  isFavorite?: boolean;
}

export interface ThemeSubscription {
  isActive: boolean;
  expiresAt?: number;
  daysLeft?: number;
  cost?: number;
}

export interface ThemesData {
  userThemes: UserTheme[];
  recentThemes: UserTheme[];
  favorites: UserTheme[];
  subscription: ThemeSubscription;
}

export type Theme = 'dark' | 'light' | 'russia' | string; // string для пользовательских
```

### 4.2 Обновлённый settings-store

```typescript
// messenger/src/stores/settings-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme } from '@/i18n/types';
import { UserTheme, ThemeSubscription } from '@/types/themes';

interface SettingsState {
  theme: Theme;
  language: Language;
  userThemes: UserTheme[];
  recentThemes: string[]; // ID тем
  favoriteThemes: string[]; // ID тем
  themeSubscription: ThemeSubscription;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  loadUserThemes: () => Promise<void>;
  addUserTheme: (theme: UserTheme) => void;
  removeUserTheme: (id: string) => void;
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  checkSubscription: () => Promise<void>;
  activateSubscription: (days: number) => Promise<boolean>;
  recordThemeUsage: (themeId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      language: 'ru',
      userThemes: [],
      recentThemes: [],
      favoriteThemes: [],
      themeSubscription: { isActive: false },

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          localStorage.setItem('messenger-theme', theme);
        }
        // Записать в историю
        get().recordThemeUsage(theme);
      },

      toggleTheme: () => {
        const themes: Theme[] = ['dark', 'light', 'russia'];
        const currentIndex = themes.indexOf(get().theme as Theme);
        const newTheme = themes[(currentIndex + 1) % themes.length];
        get().setTheme(newTheme);
      },

      setLanguage: (language) => set({ language }),

      loadUserThemes: async () => {
        try {
          const response = await fetch('/api/v1/themes', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const result = await response.json();
          
          if (result.success) {
            set({
              userThemes: result.data.userThemes,
              recentThemes: result.data.recentThemes.map((t: any) => t.id),
              favoriteThemes: result.data.favorites.map((t: any) => t.id),
              themeSubscription: result.data.subscription
            });
          }
        } catch (error) {
          console.error('[Settings] Load themes error:', error);
        }
      },

      addUserTheme: (theme) => {
        set((state) => ({
          userThemes: [...state.userThemes, theme]
        }));
      },

      removeUserTheme: (id) => {
        set((state) => ({
          userThemes: state.userThemes.filter(t => t.id !== id)
        }));
      },

      addToFavorites: (id) => {
        set((state) => {
          if (state.favoriteThemes.length >= 5) {
            console.warn('Maximum 5 favorite themes');
            return state;
          }
          return {
            favoriteThemes: [...state.favoriteThemes, id]
          };
        });
      },

      removeFromFavorites: (id) => {
        set((state) => ({
          favoriteThemes: state.favoriteThemes.filter(tid => tid !== id)
        }));
      },

      checkSubscription: async () => {
        try {
          const response = await fetch('/api/v1/themes/subscriptions', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });
          const result = await response.json();
          
          if (result.success) {
            set({ themeSubscription: result.data });
          }
        } catch (error) {
          console.error('[Settings] Check subscription error:', error);
        }
      },

      activateSubscription: async (days: number) => {
        try {
          const response = await fetch('/api/v1/themes/subscriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ days })
          });
          const result = await response.json();
          
          if (result.success) {
            set({ 
              themeSubscription: {
                isActive: true,
                expiresAt: result.data.expiresAt,
                daysLeft: result.data.daysCount
              }
            });
            return true;
          } else {
            alert(result.error);
            return false;
          }
        } catch (error) {
          console.error('[Settings] Activate subscription error:', error);
          alert('Ошибка при активации подписки');
          return false;
        }
      },

      recordThemeUsage: (themeId) => {
        set((state) => {
          const filtered = state.recentThemes.filter(id => id !== themeId);
          const updated = [themeId, ...filtered].slice(0, 15);
          return { recentThemes: updated };
        });
      }
    }),
    {
      name: 'messenger-settings',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language
      })
    }
  )
);
```

### 4.3 ThemeSelector компонент

```typescript
// messenger/src/components/ThemeSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { ThemeCard } from './ThemeCard';
import { ThemeSubscriptionDialog } from './ThemeSubscriptionDialog';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { ThemePreset } from '@/types/themes';
import './ThemeSelector.css';

const PREDEFINED_THEMES: ThemePreset[] = [
  {
    id: 'dark',
    name: 'Тёмная',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#9ca3af',
      accent: '#ef4444'
    },
    isPredefined: true
  },
  {
    id: 'light',
    name: 'Светлая',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      accent: '#ef4444'
    },
    isPredefined: true
  },
  {
    id: 'russia',
    name: 'Россия',
    colors: {
      primary: '#0039a6',
      secondary: '#d52b1e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      accent: '#ffffff'
    },
    isPredefined: true
  }
];

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { 
    theme, 
    userThemes, 
    recentThemes, 
    favoriteThemes,
    themeSubscription,
    setTheme,
    loadUserThemes,
    checkSubscription,
    activateSubscription,
    recordThemeUsage
  } = useSettingsStore();
  
  const { user, isAuthenticated } = useAuthStore();
  const translations = getTranslations(useSettingsStore(state => state.language));
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка тем при открытии
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadUserThemes();
      checkSubscription();
      setIsLoading(false);
    }
  }, [isOpen, isAuthenticated]);

  // Для неавторизованных - сброс темы при закрытии
  useEffect(() => {
    if (!isAuthenticated) {
      return () => {
        setTheme('light');
      };
    }
  }, [isAuthenticated, setTheme]);

  const handleThemeChange = async (themeId: string) => {
    // Для платных тем проверяем подписку
    if (isAuthenticated && !themeSubscription.isActive) {
      const isPremiumTheme = userThemes.some(t => t.id === themeId);
      if (isPremiumTheme) {
        setSelectedTheme(themeId);
        setShowPaymentDialog(true);
        return;
      }
    }
    
    setTheme(themeId);
    recordThemeUsage(themeId);
  };

  const handleSubscriptionSuccess = async (success: boolean) => {
    setShowPaymentDialog(false);
    if (success && selectedTheme) {
      await activateSubscription(1); // Активируем на 1 день
      setTheme(selectedTheme);
      recordThemeUsage(selectedTheme);
      setSelectedTheme(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="theme-selector">
        <div className="theme-selector-header">
          <h2>{translations.themeSettings}</h2>
          <button onClick={onClose} className="theme-selector-close">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="theme-selector-loading">
            <div className="spinner" />
            <p>{translations.loading}</p>
          </div>
        ) : (
          <div className="theme-selector-content">
            {/* Предустановленные темы */}
            <section className="theme-section">
              <h3>{translations.predefinedThemes}</h3>
              <div className="theme-grid">
                {PREDEFINED_THEMES.map(t => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    isActive={theme === t.id}
                    onSelect={() => handleThemeChange(t.id)}
                  />
                ))}
              </div>
            </section>

            {/* Недавние темы */}
            {recentThemes.length > 0 && (
              <section className="theme-section">
                <h3>{translations.recentThemes} ({recentThemes.length}/15)</h3>
                <div className="theme-grid">
                  {recentThemes.map(themeId => {
                    const themeData = [
                      ...PREDEFINED_THEMES,
                      ...userThemes
                    ].find(t => t.id === themeId);
                    
                    if (!themeData) return null;
                    
                    return (
                      <ThemeCard
                        key={themeId}
                        theme={themeData}
                        isActive={theme === themeId}
                        onSelect={() => handleThemeChange(themeId)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Избранные темы */}
            {favoriteThemes.length > 0 && (
              <section className="theme-section">
                <h3>{translations.favoriteThemes} ({favoriteThemes.length}/5)</h3>
                <div className="theme-grid">
                  {favoriteThemes.map(themeId => {
                    const themeData = [
                      ...PREDEFINED_THEMES,
                      ...userThemes
                    ].find(t => t.id === themeId);
                    
                    if (!themeData) return null;
                    
                    return (
                      <ThemeCard
                        key={themeId}
                        theme={themeData}
                        isActive={theme === themeId}
                        onSelect={() => handleThemeChange(themeId)}
                        isFavorite
                        onToggleFavorite={() => {}}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Для неавторизованных */}
            {!isAuthenticated && (
              <div className="theme-selector-auth-prompt">
                <p>{translations.loginToSaveThemes}</p>
                <button onClick={() => onClose()}>
                  {translations.login}
                </button>
              </div>
            )}

            {/* Кнопка управления подпиской */}
            {isAuthenticated && (
              <div className="theme-selector-subscription">
                {themeSubscription.isActive ? (
                  <div className="subscription-active">
                    <p>Подписка активна до {new Date(themeSubscription.expiresAt!).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <button onClick={() => window.location.href = '/theme-subscription'}>
                    {translations.subscribeForThemes}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Диалог подписки */}
      {showPaymentDialog && (
        <ThemeSubscriptionDialog
          isOpen={showPaymentDialog}
          onClose={() => handleSubscriptionSuccess(false)}
          onConfirm={handleSubscriptionSuccess}
        />
      )}
    </Modal>
  );
}
```

---

## 5. БАЗА ДАННЫХ

Скрипт миграции:

```javascript
// api/scripts/migrate-themes.js

const db = require('../src/config/database');
const fs = require('fs');
const path = require('path');

function migrate() {
  console.log('🚀 Starting themes migration...');
  
  try {
    // Создаём таблицы
    const schema = fs.readFileSync(
      path.join(__dirname, '../src/schema/themes.sql'),
      'utf8'
    );
    
    db.exec(schema);
    
    console.log('✅ Themes tables created successfully');
    console.log('📊 Tables:');
    console.log('   - user_themes');
    console.log('   - theme_subscriptions');
    console.log('   - theme_history');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

---

## 6. ТЕСТИРОВАНИЕ

### 6.1 Unit тесты

```javascript
// api/__tests__/themes.test.js

const request = require('supertest');
const app = require('../src/index');
const db = require('../src/config/database');

describe('Themes API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Создать тестового пользователя
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'theme-test@balloo.ru',
        password: 'Test1234!',
        displayName: 'Theme Test User'
      });
    
    authToken = res.body.data.accessToken;
    userId = res.body.data.user.id;
  });

  describe('GET /api/v1/themes', () => {
    test('should return themes data', async () => {
      const res = await request(app)
        .get('/api/v1/themes')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('userThemes');
      expect(res.body.data).toHaveProperty('recentThemes');
      expect(res.body.data).toHaveProperty('subscription');
    });
  });

  describe('POST /api/v1/themes', () => {
    test('should create user theme', async () => {
      const res = await request(app)
        .post('/api/v1/themes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Theme',
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
            background: '#000000',
            surface: '#111111',
            text: '#ffffff',
            textSecondary: '#cccccc',
            accent: '#ffff00'
          },
          isFavorite: false
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test Theme');
    });

    test('should fail with max favorites', async () => {
      // Создать 5 избранных тем
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/themes')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Favorite ${i}`,
            colors: { /* ... */ },
            isFavorite: true
          });
      }
      
      // 6-я должна упасть
      const res = await request(app)
        .post('/api/v1/themes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Extra Favorite',
          colors: { /* ... */ },
          isFavorite: true
        });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Maximum 5');
    });
  });

  describe('POST /api/v1/themes/subscriptions', () => {
    test('should activate subscription', async () => {
      const res = await request(app)
        .post('/api/v1/themes/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ days: 1 });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('expiresAt');
    });

    test('should fail with insufficient balance', async () => {
      // Сначала потратить все баллы
      const res = await request(app)
        .post('/api/v1/themes/subscriptions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ days: 1000 });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Insufficient balance');
    });
  });
});
```

---

## 7. ДОКУМЕНТАЦИЯ

### 7.1 Обновить README

```markdown
## 🎨 Темы

Balloo поддерживает пользовательские темы с платной подпиской.

### Бесплатные функции
- Выбор из предустановленных тем (3 темы)
- История последних 15 использованных тем
- Избранное (до 5 тем)

### Платная подписка
- **Стоимость:** 3 балла/сутки
- **Преимущества:**
  - Доступ ко всем пользовательским темам
  - Создание собственных тем
  - Синхронизация тем между устройствами

### Управление темами
1. Откройте настройки
2. Нажмите "Темы"
3. Выберите тему или создайте свою
```

---

**Конец документации**

*Документ создан Koda (NLP-Core-Team)*  
*Дата: 2026-06-07*

# 📊 ПОЛНЫЙ АУДИТ ПРОЕКТА BALLOO MESSAGER И ПЛАН ИМПРОВЕЗИЙ

**Дата аудита:** 2026-06-07  
**Аудитор:** Koda (NLP-Core-Team)  
**Версия проекта:** 2.0.0  
**Статус:** ⚠️ Требует доработки перед продакшеном

---

## 📋 СОДЕРЖАНИЕ

1. [Найденные проблемы](#1-найденные-проблемы)
2. [Недоделки и несоответствия](#2-недоделки-и-несоответствия)
3. [Проблемы с переводом](#3-проблемы-с-переводом)
4. [Проблемы дизайна и UX](#4-проблемы-дизайна-и-ux)
5. [Архитектурные проблемы](#5-архитектурные-проблемы)
6. [План реализации 4-й темы (пользовательские темы)](#6-план-реализации-4-й-темы-пользовательские-темы)
7. [План реализации вложений в сообщения](#7-план-реализации-вложений-в-сообщения)
8. [Приоритеты исправлений](#8-приоритеты-исправлений)
9. [Чек-лист перед релизом](#9-чек-лист-перед-релизом)

---

## 1. НАЙДЕННЫЕ ПРОБЛЕМЫ

### 🔴 КРИТИЧЕСКИЕ (TypeScript ошибки)

| № | Проблема | Файл | Статус |
|---|----------|------|--------|
| 1 | Missing export `getDatabase` | `scripts/create-admin.ts` | ❌ Не исправлено |
| 2 | Missing export `generateCSRFToken` | `src/app/api/csrf-token/route.ts` | ❌ Не исправлено |
| 3 | Missing import `getUserById` | `src/app/api/auth/register-extended.ts` | ❌ Не исправлено |
| 4 | Missing import `isOneTime` | `src/app/api/invitations/route.ts` | ❌ Не исправлено |
| 5 | Duplicate function implementation | `scripts/createSystemChats.ts` / `scripts/setup-test-data.ts` | ❌ Не исправлено |
| 6 | Type error в useState | `src/app/admin/logs/page.tsx` | ❌ Не исправлено |
| 7 | Buffer type error в crypto.ts | `src/lib/crypto.ts` | ❌ Не исправлено |

**Всего критических ошибок:** 9

---

### 🟡 ВЫСОКАЯ КРИТИЧНОСТЬ (any типы)

**Всего найдено:** 150+ мест с `any` типами

**Критичные файлы:**
- `src/app/api/admin/backup/route.ts` - 7 any
- `src/app/api/admin/users/route.ts` - 4 any
- `src/app/api/auth/profile/route.ts` - 4 any
- `src/app/api/messages/route.ts` - 5 any
- `src/app/api/chats/route.ts` - 5 any
- `src/lib/logger.ts` - 8 any
- `src/lib/file-logger.ts` - 6 any

---

### 🟠 СРЕДНЯЯ КРИТИЧНОСТЬ

1. **Неполная документация** - 14 файлов содержат упоминания Prisma
2. **Отсутствует валидация данных** в API (Zod/yup)
3. **Отсутствует тестовое покрытие** - 0% unit тестов
4. **TODO комментарии** с незавершённым функционалом

---

### 🔵 НИЗКАЯ КРИТИЧНОСТЬ

1. Устаревшие примеры в `.env.example`
2. Отсутствует `.editorconfig`
3. Нет pre-commit hooks (husky)
4. Отсутствует CONTRIBUTING.md

---

## 2. НЕДОДЕЛКИ И НЕСОТВЕТСТВИЯ

### 2.1 Отсутствуют Header и Footer на некоторых страницах

**Проблема:** Страницы `/chats/[id]`, `/login`, `/register` не имеют единого header/footer

**Файлы:**
- `messenger/src/app/layout.tsx` - нет Header/Footer в root layout
- `messenger/src/components/Header.tsx` - компонент существует но не используется везде
- `messenger/src/components/Footer.tsx` - компонент существует но не используется везде

**Решение:** Интегрировать Header и Footer в RootLayout или создать обёртку

---

### 2.2 Разные данные в логически одинаковых компонентах

| Компонент | Проблема | Файлы |
|-----------|----------|-------|
| **Темы** | В `settings-store.ts` 3 темы, в `types.ts` 13 тем | `settings-store.ts`, `i18n/types.ts` |
| **Языки** | Разные списки языков в разных файлах | `i18n/types.ts`, `i18n/translations.ts`, `i18n/index.ts` |
| **Реакции** | 16 реакций в types, 15 в ChatPage | `types/index.ts`, `ChatPage.tsx` |
| **Типы сообщений** | Разные enum значений | `schema.ts`, `types/index.ts` |

---

### 2.3 Несогласованность типов

**Проблема:** Типы Message, Chat, User различаются между:
- `messenger/src/types/index.ts`
- `messenger/src/lib/database/schema.ts`
- `messenger/src/stores/*.ts`

**Пример:**
```typescript
// types/index.ts
type MessageType = 'text' | 'image' | 'video' | 'file' | 'audio';

// schema.ts  
type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'system';
```

---

### 2.4 API несогласованности

**Проблема:** Разные форматы ответов API

| Endpoint | Формат | Проблема |
|----------|--------|----------|
| `/auth/login` | `{ success, data: { token, user } }` | OK |
| `/chats` | `{ success, messages }` | Должно быть `{ data }` |
| `/users/me` | `{ success, data }` | OK |
| `/messages` | `[messages]` | Должно быть `{ success, data }` |

---

## 3. ПРОБЛЕМЫ С ПЕРЕВОДОМ

### 3.1 Неполный перевод (fallback на русский)

**Языки с полным fallback'ом:**
- be (Белорусский)
- ba (Башкирский)
- cv (Чувашский)
- sah (Якутский)
- udm (Удмуртский)
- ce (Чеченский)
- os (Осетинский)

**Проблема:** В `translations.ts` эти языки копируют русский текст вместо перевода

```typescript
be: createFallback(baseTranslationsData.ru),
ba: createFallback(baseTranslationsData.ru),
// ... и т.д.
```

### 3.2 Отсутствие переводов в локальных файлах

**Файл:** `messenger/src/i18n/locales/tt.ts` (Татарский)

**Отсутствуют переводы:**
- `downloads`
- `mobileApp`
- `aboutBalloo`
- `features`
- `supportProject`
- И многие другие новые поля

**Статус:** ~40% переводов отсутствуют

---

### 3.3 Несогласованность ключей переводов

**Пример:**
```typescript
// ru.ts
supportProject: 'Поддержать проект',

// en.ts
supportProject: 'Support Project',

// tt.ts
// Отсутствует - fallback на русский
```

---

## 4. ПРОБЛЕМЫ ДИЗАЙНА И UX

### 4.1 Разные темы не соответствуют концепции

**Проблема:** В `i18n/types.ts` определены 13 тем:
```typescript
export type Theme = 
  | 'dark' | 'light' | 'russia'
  | 'india' | 'china' | 'tatarstan'
  | 'belarus' | 'bashkortostan' | 'chuvashia'
  | 'yakutia' | 'udmurtia' | 'chechnya' | 'ossetia';
```

**Но:**
1. В `settings-store.ts` только 3 темы: `['dark', 'light', 'russia']`
2. Нет CSS стилей для большинства тем
3. Нет UI для выбора темы

---

### 4.2 Отсутствует UI для пользовательских настроек

**Требуется по ТЗ:**
- Всплывающее окно с выбором тем
- 15 последних использованных настроек
- 5 избранных тем
- Платная функция (3 балла/сутки)

**Статус:** ❌ Не реализовано

---

### 4.3 Непоследовательный дизайн

**Проблемы:**
1. Разные стили кнопок в разных компонентах
2. Разные отступы и padding/margin
3. Нет единой дизайн-системы (Tailwind config)
4. Отсутствует dark mode для всех компонентов

---

## 5. АРХИТЕКТУРНЫЕ ПРОБЛЕМЫ

### 5.1 Дублирование кода

**Файлы с дубликатами:**
- `scripts/createSystemChats.ts` vs `scripts/setup-test-data.ts`
- `src/lib/database.js` vs `src/lib/database/index.ts`
- `src/i18n/translations.ts` vs `src/i18n/index.ts`

---

### 5.2 Смешение клиентского и серверного кода

**Проблема:** Next.js App Router требует разделение на 'use client' и 'use server'

**Примеры:**
- `src/app/layout.tsx` - серверный, но использует localStorage
- `src/components/Header.tsx` - нет 'use client' директивы

---

### 5.3 Отсутствует централизованная типизация API

**Проблема:** Каждый API endpoint возвращает разный формат

**Решение:** Создать единый тип `ApiResponse<T>`

---

### 5.4 WebSocket и API не синхронизированы

**Проблема:** Сообщения могут дублироваться или теряться

**Решение:** Синхронизация состояния через Redux/Zustand

---

## 6. ПЛАН РЕАЛИЗАЦИИ 4-Й ТЕМЫ (ПОЛЬЗОВАТЕЛЬСКИЕ ТЕМЫ)

### 6.1 Требования по ТЗ

1. **Всплывающее окно** с выбором настроек темы
2. **Предустановленные настройки** (15 последних)
3. **Избранное** (до 5 тем)
4. **Платная функция** - 3 балла/сутки
5. **Для незарегистрированных** - просмотр изменений, но после закрытия - генеральная тема
6. **При недостатке средств** - просьба пополнить счёт

---

### 6.2 Техническая реализация

#### Шаг 1: Расширить типы тем

```typescript
// messenger/src/i18n/types.ts

export interface ThemePreset {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  isPredefined: boolean;
}

export interface UserTheme {
  id: string;
  name: string;
  colors: ThemePreset['colors'];
  createdAt: number;
  isFavorite: boolean;
}

export type Theme = 'dark' | 'light' | 'russia' | string; // Добавляем пользовательские
```

#### Шаг 2: Обновить settings-store

```typescript
// messenger/src/stores/settings-store.ts

interface SettingsState {
  theme: Theme;
  language: Language;
  userThemes: UserTheme[];
  recentThemes: string[]; // 15 последних
  favoriteThemes: string[]; // 5 избранных
  themeSubscription: {
    isActive: boolean;
    expiresAt?: number;
  };
  
  // Actions
  setTheme: (theme: Theme) => void;
  addUserTheme: (theme: UserTheme) => void;
  removeUserTheme: (id: string) => void;
  toggleFavoriteTheme: (id: string) => void;
  checkThemeSubscription: () => boolean;
  activateThemeSubscription: () => Promise<boolean>;
}
```

#### Шаг 3: Создать ThemeSelector компонент

```typescript
// messenger/src/components/ThemeSelector.tsx

'use client';

import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';

export function ThemeSelector({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { 
    theme, 
    userThemes, 
    recentThemes, 
    favoriteThemes,
    themeSubscription,
    setTheme,
    addUserTheme,
    toggleFavoriteTheme
  } = useSettingsStore();
  
  const { user, isAuthenticated } = useAuthStore();
  const translations = getTranslations(useSettingsStore(state => state.language));
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Для неавторизованных - возвращаем генеральную тему при закрытии
  useEffect(() => {
    if (!isAuthenticated) {
      return () => {
        setTheme('light'); // Генеральная тема
      };
    }
  }, [isAuthenticated, setTheme]);

  // Проверка подписки
  const handleThemeChange = (newTheme: Theme) => {
    if (isAuthenticated && !themeSubscription.isActive) {
      // Проверяем, платная ли тема
      const isPremiumTheme = userThemes.some(t => t.id === newTheme);
      if (isPremiumTheme) {
        setShowPaymentDialog(true);
        return;
      }
    }
    
    setTheme(newTheme);
    
    // Сохраняем в recentThemes
    // ...
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="theme-selector">
        <h2>{translations.themeSettings}</h2>
        
        {/* Предустановленные темы */}
        <section>
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
          <section>
            <h3>{translations.recentThemes} ({recentThemes.length}/15)</h3>
            <div className="theme-grid">
              {recentThemes.map(themeId => {
                const themeData = findThemeById(themeId);
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
          <section>
            <h3>{translations.favoriteThemes} ({favoriteThemes.length}/5)</h3>
            <div className="theme-grid">
              {favoriteThemes.map(themeId => {
                const themeData = findThemeById(themeId);
                return (
                  <ThemeCard 
                    key={themeId} 
                    theme={themeData}
                    isActive={theme === themeId}
                    onSelect={() => handleThemeChange(themeId)}
                    onToggleFavorite={() => toggleFavoriteTheme(themeId)}
                  />
                );
              })}
            </div>
          </section>
        )}
        
        {/* Для неавторизованных */}
        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>{translations.loginToSaveThemes}</p>
            <button onClick={() => onClose()}>
              {translations.login}
            </button>
          </div>
        )}
        
        {/* Для тех у кого нет подписки */}
        {isAuthenticated && !themeSubscription.isActive && (
          <div className="subscription-prompt">
            <p>{translations.noSubscription}</p>
            <button onClick={() => setShowPaymentDialog(true)}>
              {translations.subscribe}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
```

#### Шаг 4: API для подписки на темы

```javascript
// api/src/controllers/theme.controller.js

const themeController = {
  // Получить статус подписки
  getSubscriptionStatus: async (req, res) => {
    const userId = req.user.id;
    const subscription = await db.getSubscription(userId);
    
    res.json({
      success: true,
      data: {
        isActive: subscription?.isActive || false,
        expiresAt: subscription?.expiresAt,
        daysLeft: subscription?.daysLeft
      }
    });
  },
  
  // Активировать подписку (3 балла/сутки)
  activateSubscription: async (req, res) => {
    const userId = req.user.id;
    const { days } = req.body;
    
    // Проверить баланс
    const balance = await getUserBalance(userId);
    const cost = days * 3;
    
    if (balance.points < cost) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }
    
    // Списываем баллы
    await deductPoints(userId, cost, 'theme_subscription');
    
    // Активируем подписку
    const subscription = await createSubscription(userId, days);
    
    res.json({
      success: true,
      data: subscription
    });
  },
  
  // Создать пользовательскую тему
  createUserTheme: async (req, res) => {
    const userId = req.user.id;
    const { name, colors } = req.body;
    
    // Проверить лимит (5 избранных)
    const favorites = await getUserFavoriteThemes(userId);
    if (favorites.length >= 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum favorite themes reached'
      });
    }
    
    const theme = await createUserTheme(userId, { name, colors });
    
    res.json({
      success: true,
      data: theme
    });
  }
};
```

#### Шаг 5: Страница оплаты

```typescript
// messenger/src/app/theme-subscription/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';

export default function ThemeSubscriptionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { themeSubscription } = useSettingsStore();
  const translations = getTranslations(useSettingsStore(state => state.language));
  
  const [days, setDays] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const cost = days * 3;
  const balance = user?.points || 0;
  const canAfford = balance >= cost;
  
  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/theme-subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days })
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push('/settings');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Ошибка при оформлении подписки');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="theme-subscription-page">
      <h1>{translations.themeSubscription}</h1>
      
      <div className="subscription-card">
        <div className="balance-info">
          <p>{translations.currentBalance}: <strong>{balance} {translations.points}</strong></p>
        </div>
        
        <div className="subscription-options">
          <h2>{translations.selectDuration}</h2>
          
          <div className="duration-selector">
            {[1, 3, 7, 30].map(d => (
              <button
                key={d}
                className={days === d ? 'active' : ''}
                onClick={() => setDays(d)}
              >
                {d} {translations.days}
                <span>{d * 3} {translations.points}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="subscription-summary">
          <p>{translations.totalCost}: <strong>{cost} {translations.points}</strong></p>
          {themeSubscription.isActive && (
            <p className="active-subscription">
              {translations.activeUntil}: {new Date(themeSubscription.expiresAt!).toLocaleDateString()}
            </p>
          )}
        </div>
        
        {!canAfford && (
          <div className="insufficient-funds">
            <p>{translations.insufficientFunds}</p>
            <button onClick={() => router.push('/support')}>
              {translations.topUpBalance}
            </button>
          </div>
        )}
        
        <button 
          className="subscribe-button"
          onClick={handleSubscribe}
          disabled={!canAfford || isProcessing}
        >
          {isProcessing ? translations.processing : translations.subscribe}
        </button>
      </div>
    </div>
  );
}
```

---

## 7. ПЛАН РЕАЛИЗАЦИИ ВЛОЖЕНИЙ В СООБЩЕНИЯ

### 7.1 Требования по ТЗ

1. **Голосования** - с возможностью текстового ответа
2. **Списки** - чек-листы
3. **Опросы** - несколько вопросов
4. **Тесты** - связанные голосования с правильными ответами

---

### 7.2 Типы данных

```typescript
// messenger/src/types/attachments.ts

// Типы вложений
export type AttachmentType = 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'poll' 
  | 'list' 
  | 'survey' 
  | 'quiz';

// Голосование
export interface PollAttachment {
  type: 'poll';
  question: string;
  options: PollOption[];
  allowTextResponse: boolean; // Разрешить текстовый ответ
  multipleChoice: boolean; // Несколько вариантов
  expiresAt?: number;
  totalVotes: number;
  userVoted?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  userVoted?: boolean;
}

// Список (чек-лист)
export interface ListAttachment {
  type: 'list';
  title: string;
  items: ListItem[];
  completedCount: number;
}

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string[]; // userId[]
}

// Опрос (несколько вопросов)
export interface SurveyAttachment {
  type: 'survey';
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  submittedAt?: number;
  userSubmitted?: boolean;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'multiple-choice' | 'single-choice' | 'rating';
  question: string;
  options?: string[]; // Для multiple/single choice
  required: boolean;
}

// Тест
export interface QuizAttachment {
  type: 'quiz';
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number; // Процент для прохождения
  maxAttempts: number;
  userAttempts: number;
  userScore?: number;
  userPassed?: boolean;
  showCorrectAnswers?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice';
  question: string;
  options: QuizOption[];
  correctOptions: string[]; // IDs правильных ответов
  explanation?: string; // Объяснение ответа
}

export interface QuizOption {
  id: string;
  text: string;
}
```

---

### 7.3 Компоненты вложений

```typescript
// messenger/src/components/attachments/PollAttachment.tsx

'use client';

import { useState } from 'react';
import { PollAttachment as PollType, PollOption } from '@/types/attachments';
import { useAuthStore } from '@/stores/auth-store';

interface PollAttachmentProps {
  poll: PollType;
  messageId: string;
  onVote: (pollId: string, options: string[], textResponse?: string) => Promise<void>;
  onUpdate?: (updatedPoll: PollType) => void;
}

export function PollAttachment({ 
  poll, 
  messageId, 
  onVote,
  onUpdate 
}: PollAttachmentProps) {
  const { user } = useAuthStore();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  const handleOptionToggle = (optionId: string) => {
    if (poll.multipleChoice) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsVoting(true);
    try {
      await onVote(poll.id, selectedOptions, poll.allowTextResponse ? textInput : undefined);
      
      // Обновляем polling
      const updatedPoll = {
        ...poll,
        options: poll.options.map(opt => ({
          ...opt,
          userVoted: selectedOptions.includes(opt.id)
        })),
        totalVotes: poll.totalVotes + 1,
        userVoted: true
      };
      onUpdate?.(updatedPoll);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="poll-attachment">
      <h4 className="poll-question">{poll.question}</h4>
      
      <div className="poll-options">
        {poll.options.map(option => (
          <div 
            key={option.id} 
            className={`poll-option ${option.userVoted ? 'voted' : ''}`}
          >
            <div className="poll-option-bar" style={{ width: `${option.percentage}%` }} />
            <div className="poll-option-content">
              {poll.multipleChoice ? (
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  disabled={poll.userVoted}
                />
              ) : (
                <input
                  type="radio"
                  name={`poll-${poll.id}`}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleOptionToggle(option.id)}
                  disabled={poll.userVoted}
                />
              )}
              <span>{option.text}</span>
              <span className="poll-option-votes">{option.votes} ({option.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
      
      {poll.allowTextResponse && (
        <div className="poll-text-response">
          <input
            type="text"
            placeholder="Ваш вариант ответа..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={poll.userVoted}
          />
        </div>
      )}
      
      {!poll.userVoted && (
        <button 
          className="poll-vote-button"
          onClick={handleSubmitVote}
          disabled={selectedOptions.length === 0 || isVoting}
        >
          {isVoting ? 'Голосование...' : 'Проголосовать'}
        </button>
      )}
      
      <div className="poll-footer">
        <span>Всего голосов: {poll.totalVotes}</span>
        {poll.expiresAt && (
          <span>Заканчивается: {new Date(poll.expiresAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}
```

```typescript
// messenger/src/components/attachments/QuizAttachment.tsx

'use client';

import { useState } from 'react';
import { QuizAttachment as QuizType } from '@/types/attachments';
import { useAuthStore } from '@/stores/auth-store';

interface QuizAttachmentProps {
  quiz: QuizType;
  messageId: string;
  onSubmit: (quizId: string, answers: Record<string, string[]>) => Promise<void>;
}

export function QuizAttachment({ quiz, messageId, onSubmit }: QuizAttachmentProps) {
  const { user } = useAuthStore();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, optionIds: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIds
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id] || [];
      const isCorrect = 
        q.correctOptions.length === userAnswer.length &&
        q.correctOptions.every(opt => userAnswer.includes(opt));
      if (isCorrect) correct++;
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const allAnswered = quiz.questions.every(q => answers[q.id]);
    if (!allAnswered) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(quiz.id, answers);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const score = showResults ? calculateScore() : null;
  const passed = score !== null && score >= quiz.passingScore;

  return (
    <div className="quiz-attachment">
      <div className="quiz-header">
        <h4>{quiz.title}</h4>
        {quiz.description && <p>{quiz.description}</p>}
        {quiz.userAttempts >= quiz.maxAttempts && (
          <p className="max-attempts-reached">Максимальное количество попыток исчерпано</p>
        )}
      </div>
      
      <div className="quiz-questions">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="quiz-question">
            <p className="question-number">Вопрос {index + 1}</p>
            <p className="question-text">{question.question}</p>
            
            <div className="question-options">
              {question.options.map(option => (
                <label 
                  key={option.id}
                  className={`option ${showResults ? (question.correctOptions.includes(option.id) ? 'correct' : '') : ''}`}
                >
                  <input
                    type={question.type === 'multiple-choice' ? 'checkbox' : 'radio'}
                    name={`question-${question.id}`}
                    checked={answers[question.id]?.includes(option.id) || false}
                    onChange={(e) => {
                      if (question.type === 'multiple-choice') {
                        const current = answers[question.id] || [];
                        const updated = e.target.checked
                          ? [...current, option.id]
                          : current.filter(id => id !== option.id);
                        handleAnswer(question.id, updated);
                      } else {
                        handleAnswer(question.id, [option.id]);
                      }
                    }}
                    disabled={showResults}
                  />
                  <span>{option.text}</span>
                  {showResults && question.correctOptions.includes(option.id) && (
                    <span className="correct-indicator">✓</span>
                  )}
                </label>
              ))}
            </div>
            
            {showResults && question.explanation && (
              <div className="question-explanation">
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showResults && quiz.userAttempts < quiz.maxAttempts && (
        <button
          className="submit-quiz-button"
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}
        >
          {isSubmitting ? 'Проверка...' : 'Завершить тест'}
        </button>
      )}
      
      {showResults && (
        <div className="quiz-results">
          <div className={`result-score ${passed ? 'passed' : 'failed'}`}>
            <h3>{passed ? 'Тест пройден!' : 'Тест не пройден'}</h3>
            <p className="score">{score}% правильных ответов</p>
            <p>Попытка {quiz.userAttempts + 1} из {quiz.maxAttempts}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 8. ПРИОРИТЕТЫ ИСПРАВЛЕНИЙ

### Приоритет 0 - КРИТИЧНО (Блокер релиза)

| № | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 1 | Исправить все TypeScript ошибки | 🔴 Критично | 2ч |
| 2 | Исправить missing exports/imports | 🔴 Критично | 1ч |
| 3 | Устранить дублирование кода | 🔴 Критично | 3ч |

### Приоритет 1 - ВЫСОКОЕ (Перед релизом)

| № | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 4 | Реализовать 4-ю тему (пользовательские темы) | 🔴 Высокое | 16ч |
| 5 | Реализовать вложения (голосования, тесты) | 🔴 Высокое | 24ч |
| 6 | Интегрировать Header/Footer везде | 🟡 Среднее | 4ч |
| 7 | Унифицировать типы данных | 🟡 Среднее | 6ч |
| 8 | Исправить переводы (минимум en, ru, tt) | 🟡 Среднее | 8ч |

### Приоритет 2 - СРЕДНЕЕ (После релиза)

| № | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 9 | Заменить any типы на конкретные | 🟢 Низкое | 20ч |
| 10 | Написать unit тесты | 🟢 Низкое | 40ч |
| 11 | Обновить документацию | 🟢 Низкое | 8ч |
| 12 | Добавить валидацию данных (Zod) | 🟢 Низкое | 12ч |

### Приоритет 3 - НИЗКОЕ (По возможности)

| № | Задача | Приоритет | Оценка |
|---|--------|-----------|--------|
| 13 | Добавить pre-commit hooks | 🔵 Низкое | 4ч |
| 14 | Настроить CI/CD | 🔵 Низкое | 8ч |
| 15 | Добавить мониторинг (Sentry) | 🔵 Низкое | 6ч |

---

## 9. ЧЕК-ЛИСТ ПЕРЕД РЕЛИЗОМ

### Критические проверки

- [ ] Все TypeScript ошибки исправлены
- [ ] Все API endpoints возвращают согласованный формат
- [ ] Header и Footer на всех публичных страницах
- [ ] Минимум ru, en, tt переводы полные
- [ ] 4-я тема (пользовательские темы) работает
- [ ] Вложения (голосования, тесты) работают
- [ ] Платная подписка на темы работает
- [ ] Баланс пользователя учитывается
- [ ] Для неавторизованных тема сбрасывается

### Тестирование

- [ ] Auth flow (регистрация, логин, 2FA)
- [ ] Создание чатов и сообщений
- [ ] Отправка файлов
- [ ] Голосования и тесты
- [ ] Смена тем
- [ ] Оплата подписки
- [ ] WebSocket real-time обновление

### Документация

- [ ] README обновлён
- [ ] API документация актуальна
- [ ] DEPLOYMENT инструкция проверена
- [ ] CHANGELOG обновлён

---

**Срок реализации:** 5-7 дней  
**Команда:** 1 разработчик + AI агент  
**Статус:** Готовность к началу работ

---

*Документ создан Koda (NLP-Core-Team)*  
*Дата: 2026-06-07*

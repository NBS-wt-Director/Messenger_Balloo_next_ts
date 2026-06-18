---
title: Premium Вложения Balloo Messenger
description: Документация по платным вложениям для пользователей с отметкой "Шейх"
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: complete
audience: both
tags:
  - premium
  - attachments
  - sheikh
  - monetization
related_docs:
  - SUMMARY_DOCS/premium/PREMIUM_CONTRACT_payment.md
  - SUMMARY_DOCS/premium/PREMIUM_CONTRACT_game.md
  - SUMMARY_DOCS/premium/PREMIUM_CONTRACT_expiring.md
  - SUMMARY_DOCS/premium/PREMIUM_CONTRACT_collaborative.md
  - SUMMARY_DOCS/premium/PREMIUM_CONTRACT_combined.md
  - SUMMARY_DOCS/modules/summary/MODULE_SUMMARY_messenger.md
---

# 💎 PREMIUM ВЛОЖЕНИЯ BALLOO MESSENGER

**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**Автор:** Koda (NLP-Core-Team)  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР PREMIUM ВЛОЖЕНИЙ

### Модель доступа:

```
┌──────────────────────────────────────────────────────────────────┐
│                    ДОСТУП К ВЛОЖЕНИЯМ                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🆓 БЕСПЛАТНО (все пользователи)                                 │
│  ├── 📁 Медиа (изображения, видео, аудио, файлы)                │
│  └── 🎯 Интерактивные (опросы, списки, анкеты, тесты)           │
│                                                                  │
│  💎 PREMIUM (только "Шейх")                                      │
│  ├── 💰 Переводы (payment)                                       │
│  ├── 🎮 Игры (game)                                              │
│  ├── ⏰ Исчезающие (expiring)                                    │
│  ├── 👥 Совместные (collaborative)                               │
│  └── 🔄 Комбинированные (combined)                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ СТАТУС "ШЕЙХ"

### Что такое "Шейх"?

**"Шейх"** — это премиум-статус пользователя в Balloo Messenger, предоставляющий доступ к эксклюзивным функциям и вложениям.

### Как получить статус "Шейх":

| Способ | Описание | Стоимость |
|--------|----------|-----------|
| **Подписка** | Ежемесячная/годовая подписка | $9.99/мес или $99.99/год |
| **Покупка** | Единоразовая покупка статуса | $299.99 (навсегда) |
| **Достижение** | Топ-донаторы платформы | Бесплатно (по усмотрению) |
| **Партнёрство** | Официальные партнёры Balloo | Бесплатно |

### Преимущества статуса "Шейх":

```
┌─────────────────────────────────────────────────────────┐
│  👑 ПРЕИМУЩЕСТВА "ШЕЙХ"                                 │
├─────────────────────────────────────────────────────────┤
│  ✅ Premium вложения (5 типов)                          │
│  ✅ Эксклюзивные стикеры и эмодзи                       │
│  ✅ Приоритетная поддержка 24/7                         │
│  ✅ Расширенные лимиты (файлы до 500 MB)                │
│  ✅ Статус "Шейх" в профиле                             │
│  ✅ Золотая рамка аватара                               │
│  ✅ Ранний доступ к новым функциям                      │
│  ✅ Отключение рекламы (если есть)                      │
│  ✅ Статистика профиля                                  │
│  ✅ Кастомизация темы                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 💎 PREMIUM ВЛОЖЕНИЯ — ДЕТАЛЬНЫЙ ОБЗОР

### 1. 💰 **Переводы** (`payment`)

**Категория:** Финансы  
**Статус:** 💎 Premium  
**Сложность:** 🔴 Очень высокая

**Описание:** Быстрые денежные переводы между пользователями внутри чата.

**Ключевые функции:**
- Мгновенные переводы между пользователями Balloo
- Интеграция с СБП, Яндекс.Деньги, Тинькофф
- Внутренний баланс Balloo
- История транзакций
- Чеки и квитанции
- Комиссии (0% для "Шейх")

**Use Cases:**
- Раздел счёта в ресторане
- Возврат долга другу
- Оплата услуг фрилансера
- Донаты создателям контента

**📄 Полная документация:** `SUMMARY_DOCS/premium/PREMIUM_CONTRACT_payment.md`

---

### 2. 🎮 **Игры** (`game`)

**Категория:** Развлечения  
**Статус:** 💎 Premium  
**Сложность:** 🔴 Высокая

**Описание:** Мини-игры прямо в чате для развлечения с друзьями.

**Ключевые функции:**
- Шахматы, шашки, нарды
- Крестики-нолики
- Викторины и квизы
- Карточные игры (Дурак, Уно)
- Аркады (Змейка, Тетрис)
- Турниры и лидерборды
- Ставки (виртуальная валюта)

**Use Cases:**
- Развлечение в чате с друзьями
- Командные турниры
- Обучение через игры
- Тайм-киллер

**📄 Полная документация:** `SUMMARY_DOCS/premium/PREMIUM_CONTRACT_game.md`

---

### 3. ⏰ **Исчезающие вложения** (`expiring`)

**Категория:** Безопасность  
**Статус:** 💎 Premium  
**Сложность:** 🟠 Средняя

**Описание:** Вложения, которые автоматически удаляются после прочтения или по таймеру.

**Ключевые функции:**
- Удаление после прочтения
- Удаление по таймеру (1 сек - 30 дней)
- Защита от скриншотов (уведомление)
- Невозможность пересылки
- Шифрование
- Аудит доступа

**Use Cases:**
- Конфиденциальные документы
- Временные доступы
- Секретная информация
- Приватные фото/видео

**📄 Полная документация:** `SUMMARY_DOCS/premium/PREMIUM_CONTRACT_expiring.md`

---

### 4. 👥 **Совместные вложения** (`collaborative`)

**Категория:** Продуктивность  
**Статус:** 💎 Premium  
**Сложность:** 🟡 Высокая

**Описание:** Вложения, которые можно редактировать совместно в реальном времени.

**Ключевые функции:**
- Real-time синхронизация (WebSocket)
- Одновременное редактирование
- История изменений
- Блокировки секций
- Комментарии и обсуждения
- Экспорт версий

**Use Cases:**
- Совместные документы
- Планирование проектов
- Мозговые штурмы
- Коллективные списки

**📄 Полная документация:** `SUMMARY_DOCS/premium/PREMIUM_CONTRACT_collaborative.md`

---

### 5. 🔄 **Комбинированные вложения** (`combined`)

**Категория:** Продуктивность  
**Статус:** 💎 Premium  
**Сложность:** 🟡 Высокая

**Описание:** Комбинация нескольких типов вложений в одном.

**Ключевые функции:**
- Опрос + Список = План с голосованием
- Событие + Опрос = Выбор времени
- Заметка + Файлы = Документ
- Диаграмма + Данные = Интерактив

**Use Cases:**
- Планирование мероприятий
- Голосование за идеи
- Презентации с данными
- Отчёты с визуализацией

**📄 Полная документация:** `SUMMARY_DOCS/premium/PREMIUM_CONTRACT_combined.md`

---

## 🔒 ПРОВЕРКА ДОСТУПА

### Алгоритм проверки:

```typescript
async function canUsePremiumAttachment(
  userId: string,
  attachmentType: PremiumAttachmentType
): Promise<{ allowed: boolean; reason?: string }> {
  
  // 1. Получаем статус пользователя
  const user = await getUserById(userId);
  
  // 2. Проверяем статус "Шейх"
  if (!user.sheikhStatus) {
    return {
      allowed: false,
      reason: 'PREMIUM_REQUIRED',
      upgradeUrl: '/premium/upgrade'
    };
  }
  
  // 3. Проверяем срок действия статуса
  if (user.sheikhExpiresAt && user.sheikhExpiresAt < Date.now()) {
    return {
      allowed: false,
      reason: 'PREMIUM_EXPIRED',
      renewUrl: '/premium/renew'
    };
  }
  
  // 4. Проверяем конкретный тип вложения
  const attachmentConfig = PREMIUM_ATTACHMENTS[attachmentType];
  
  if (!attachmentConfig.enabled) {
    return {
      allowed: false,
      reason: 'FEATURE_DISABLED'
    };
  }
  
  // 5. Дополнительные проверки (лимиты, регион и т.д.)
  if (attachmentConfig.limits) {
    const usage = await getUserUsage(userId, attachmentType);
    if (usage >= attachmentConfig.limits.daily) {
      return {
        allowed: false,
        reason: 'DAILY_LIMIT_REACHED',
        resetAt: getDailyResetTime()
      };
    }
  }
  
  return { allowed: true };
}
```

### Типы ответов API:

```typescript
// ✅ Успешный доступ
{
  "success": true,
  "data": {
    "allowed": true,
    "attachmentId": "att_123456"
  }
}

// ❌ Требуется премиум
{
  "success": false,
  "error": {
    "code": "PREMIUM_REQUIRED",
    "message": "Это вложение доступно только пользователям с статусом Шейх",
    "upgradeUrl": "/premium/upgrade",
    "pricing": {
      "monthly": 9.99,
      "yearly": 99.99,
      "lifetime": 299.99
    }
  }
}

// ❌ Истёк премиум
{
  "success": false,
  "error": {
    "code": "PREMIUM_EXPIRED",
    "message": "Ваш статус Шейх истёк",
    "renewUrl": "/premium/renew",
    "discount": 0.20  // 20% скидка на продление
  }
}
```

---

## 💰 МОНЕТИЗАЦИЯ

### Модель доходов:

```
┌─────────────────────────────────────────────────────────┐
│           ИСТОЧНИКИ ДОХОДА ОТ PREMIUM                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Подписки "Шейх"                                     │
│  ├── $9.99/мес (основной)                              │
│  ├── $99.99/год (выгода 17%)                           │
│  └── $299.99 lifetime (единоразово)                    │
│                                                         │
│  💸 Комиссии с переводов                                │
│  ├── 0% для "Шейх"                                     │
│  └── 1.5% для обычных пользователей (если открыть)     │
│                                                         │
│  🎮 Внутриигровые покупки                               │
│  ├── Виртуальная валюта                                │
│  ├── Премиум игры                                      │
│  └── Турнирные взносы                                  │
│                                                         │
│  📦 Корпоративные лицензии                              │
│  ├── Команды до 10 человек                             │
│  └── Команды до 100 человек                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Прогноз доходов:

| Метрика |保守ный | Оптимистичный |
|---------|--------|---------------|
| Конверсия в премиум | 3% | 8% |
| ARPU (месяц) | $8.50 | $12.00 |
| LTV (12 мес) | $102 | $144 |
| Churn rate | 5%/мес | 3%/мес |

---

## 📱 UI/UX PREMIUM ИНДИКАТОРЫ

### В интерфейсе чата:

```
┌─────────────────────────────────────────────────────────┐
│  Чат: Команда проекта                    👑 Шейх       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💎 [Перевод]  [Игры]  [Исчезает]  [Совместно]  [2в1] │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  👤 Иван (Шейх) отправил перевод 💰 500₽               │
│  👤 Мария создала игру 🎮 Шахматы                      │
│  👤 Пётр отправил 🔥 Исчезающее фото                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [💎 Оформить Шейх за $9.99/мес]                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Модальное окно при попытке использования:

```
┌─────────────────────────────────────────────────────────┐
│  💎 Premium Вложение                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Это вложение доступно только пользователям             │
│  со статусом 👑 Шейх                                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Преимущества Шейх:                               │  │
│  │  ✅ 5 premium вложений                            │  │
│  │  ✅ Эксклюзивные стикеры                          │  │
│  │  ✅ Файлы до 500 MB                               │  │
│  │  ✅ Приоритетная поддержка                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  [❌ Отмена]  [💳 Оформить за $9.99/мес]               │
│                                                         │
│  ⚡ Уже есть Шейх? [Войти]                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### База данных:

```sql
-- Таблица пользователей с премиум-статусом
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- Sheikh статус
  is_sheikh BOOLEAN DEFAULT FALSE,
  sheikh_type ENUM('monthly', 'yearly', 'lifetime', 'partner') DEFAULT NULL,
  sheikh_started_at TIMESTAMP NULL,
  sheikh_expires_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица premium вложений
CREATE TABLE premium_attachments (
  id UUID PRIMARY KEY,
  type ENUM('payment', 'game', 'expiring', 'collaborative', 'combined') NOT NULL,
  owner_id UUID REFERENCES users(id),
  
  -- Метаданные вложения
  data JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  
  -- Статус
  status ENUM('active', 'expired', 'deleted') DEFAULT 'active',
  expires_at TIMESTAMP NULL,
  
  -- Аудит
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

-- Таблица использования premium функций
CREATE TABLE premium_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  attachment_type VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрой проверки
CREATE INDEX idx_premium_usage_daily 
ON premium_usage(user_id, attachment_type, DATE(created_at));
```

### Middleware для проверки:

```typescript
// middleware/premiumAccess.ts

import { Request, Response, NextFunction } from 'express';
import { PremiumAttachmentType } from '../types/premium';

export function requirePremium(attachmentType: PremiumAttachmentType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const user = await getUserById(userId);
      
      // Проверка статуса Шейх
      if (!user.is_sheikh) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'PREMIUM_REQUIRED',
            message: 'Требуется статус Шейх',
            upgradeUrl: '/api/premium/upgrade'
          }
        });
      }
      
      // Проверка срока действия
      if (user.sheikh_expires_at && new Date(user.sheikh_expires_at) < new Date()) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'PREMIUM_EXPIRED',
            message: 'Статус Шейх истёк',
            renewUrl: '/api/premium/renew'
          }
        });
      }
      
      // Проверка лимитов
      const dailyLimit = getDailyLimit(attachmentType);
      const todayUsage = await getTodayUsage(userId, attachmentType);
      
      if (todayUsage >= dailyLimit) {
        return res.status(429).json({
          success: false,
          error: {
            code: 'DAILY_LIMIT_REACHED',
            message: 'Дневной лимит исчерпан',
            resetAt: getDailyResetTime()
          }
        });
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Использование в роутах
router.post('/attachments/payment',
  authenticate,
  requirePremium('payment'),
  createPaymentAttachment
);

router.post('/attachments/game',
  authenticate,
  requirePremium('game'),
  createGameAttachment
);
```

---

## 📊 МЕТРИКИ И АНАЛИТИКА

### Ключевые метрики:

```typescript
interface PremiumMetrics {
  // Подписки
  totalSheikhs: number;
  newSheikhsToday: number;
  churnRate: number;           // % отписок
  conversionRate: number;      // % конверсии в премиум
  
  // Использование вложений
  attachmentUsage: {
    payment: { count: number; volume: number };
    game: { count: number; players: number };
    expiring: { count: number };
    collaborative: { count: number; editors: number };
    combined: { count: number };
  };
  
  // Доходы
  revenue: {
    subscriptions: number;
    transactionFees: number;
    inGamePurchases: number;
    total: number;
  };
  
  // Engagement
  premiumUserRetention: number;
  avgSessionDuration: number;
  featureAdoptionRate: number;
}
```

---

## 🎯 ROADMAP

### Фаза 1 (Q3 2026):
- ✅ Документация premium вложений
- ⏳ Реализация Переводов (payment)
- ⏳ Система проверки статуса "Шейх"

### Фаза 2 (Q4 2026):
- ⏳ Исчезающие вложения (expiring)
- ⏳ Платёжная инфраструктура
- ⏳ UI премиум-индикаторов

### Фаза 3 (Q1 2027):
- ⏳ Игры (game) — базовые
- ⏳ Совместные вложения (collaborative)
- ⏳ Маркетинг премиума

### Фаза 4 (Q2 2027):
- ⏳ Комбинированные вложения (combined)
- ⏳ Расширенная аналитика
- ⏳ Корпоративные лицензии

---

## 📄 ДОКУМЕНТАЦИЯ

| Вложение | Контракт | Summary | API |
|----------|----------|---------|-----|
| 💰 Переводы | `PREMIUM_CONTRACT_payment.md` | ✅ | ✅ |
| 🎮 Игры | `PREMIUM_CONTRACT_game.md` | ✅ | ✅ |
| ⏰ Исчезающие | `PREMIUM_CONTRACT_expiring.md` | ✅ | ✅ |
| 👥 Совместные | `PREMIUM_CONTRACT_collaborative.md` | ✅ | ✅ |
| 🔄 Комбинированные | `PREMIUM_CONTRACT_combined.md` | ✅ | ✅ |

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0  
**Статус:** Complete  
**Автор:** Koda (NLP-Core-Team)

---
title: Premium Вложения Balloo Messenger
description: Документация по 5 типам платных вложений для пользователей с ролью Шейх
version: 2.0.0
date: 2026-06-14
author: NLP-Core-Team
status: complete
audience: both
tags:
  - attachments
  - premium
  - sheikh
  - monetization
related_docs:
  - SUMMARY_DOCS/attachments/ATTACHMENTS_OVERVIEW.md
  - SUMMARY_DOCS/attachments/FREE_ATTACHMENTS.md
  - SUMMARY_DOCS/premium/SHEIKH_ROLE.md
  - messenger/src/types/attachments.ts
---

# 💎 PREMIUM ВЛОЖЕНИЯ BALLOO MESSENGER

**Версия:** 2.0.0  
**Дата:** 2026-06-14  
**Автор:** NLP-Core-Team  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР

```
┌─────────────────────────────────────────────────────────┐
│        PREMIUM ВЛОЖЕНИЯ (5 типов) — ТОЛЬКО ШЕЙХ         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  💰 payment          — Переводы и платежи              │
│  🎮 game             — Игры в чате                     │
│  ⏰ expiring         — Исчезающие вложения             │
│  👥 collaborative    — Совместная работа               │
│  🔄 combined         — Комбинированные вложения        │
│                                                         │
│  Доступ: 👑 Только пользователи с ролью "Шейх"         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 👑 РОЛЬ "ШЕЙХ"

### Что такое Шейх?

**"Шейх"** — это премиум-статус пользователя в Balloo Messenger, предоставляющий доступ к эксклюзивным функциям и вложениям.

### Как получить статус Шейх:

| Тариф | Описание | Стоимость | Выгода |
|-------|----------|-----------|--------|
| **Monthly** | Доступ на 30 дней | $9.99/мес | — |
| **Yearly** | Доступ на 365 дней | $99.99/год | 17% |
| **Lifetime** | Пожизненный доступ | $299.99 | Единоразово |
| **Partner** | Официальные партнёры | Бесплатно | По приглашению |

### Преимущества статуса Шейх:

```
┌─────────────────────────────────────────────────────────┐
│  👑 ПРЕИМУЩЕСТВА "ШЕЙХ"                                 │
├─────────────────────────────────────────────────────────┤
│  ✅ 5 premium вложений                                  │
│  ✅ Эксклюзивные стикеры и темы                         │
│  ✅ Файлы до 500 MB (вместо 100 MB)                     │
│  ✅ Приоритетная поддержка 24/7                         │
│  ✅ Статус "Шейх" в профиле                             │
│  ✅ Золотая рамка аватара                               │
│  ✅ Ранний доступ к новым функциям                      │
│  ✅ 0% комиссия на переводы                             │
│  ✅ Расширенные лимиты (в 5 раз больше)                 │
│  ✅ Без рекламы                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💎 PREMIUM ВЛОЖЕНИЯ (5 типов)

### 1. 💰 ПЕРЕВОДЫ (`payment`)

**Описание:** Переводы денег между пользователями, платежи

**Тип:** `AttachmentType = 'payment'`  
**Категория:** `premium`  
**Доступ:** `premium` (только Шейх)  
**Сложность:** 🔴 Очень высокая

**TypeScript интерфейс:**
```typescript
interface PaymentAttachment {
  type: 'payment';
  attachmentId: string;
  paymentId: string;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR' | 'KZT' | 'BTC' | 'ETH';
  sender: string;
  recipient: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'balance' | 'sbp' | 'yandex' | 'crypto';
  message?: string;
  transactionId?: string;
  fee?: number;
  feePercent: number;
  feePayer: 'sender' | 'recipient' | 'platform';
  sheikhDiscount: boolean;  // true = 0% комиссия
  conversion?: {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    convertedAmount: number;
  };
  createdAt: number;
  completedAt?: number;
  receiptUrl?: string;
  accessInfo: AttachmentAccessInfo;
}
```

**Характеристики:**
| Параметр | Значение |
|----------|----------|
| **Валюты** | RUB, USD, EUR, KZT, BTC, ETH |
| **Методы** | Карта, Баланс, СБП, Яндекс, Крипто |
| **Комиссия для Шейх** | 0% |
| **Лимит за перевод** | До 1,000,000 ₽ |
| **Дневной лимит** | До 5,000,000 ₽ |

**UI/UX:**
```
┌─────────────────────────────────────────────────────────┐
│  💰 Перевод                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Кому: [Мария Иванова]                                  │
│  Сумма: [5 000.00 ₽]                                    │
│  ─────────────────────────────────────────────────────  │
│  Комиссия: 0.00 ₽ (Скидка Шейх 100%)                   │
│  К списанию: 5 000.00 ₽                                │
│  ─────────────────────────────────────────────────────  │
│  [Отправить]                                            │
│                                                         │
│  👑 Перевод без комиссии — преимущество Шейх           │
└─────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/v1/payments/create
GET  /api/v1/payments/:id
POST /api/v1/payments/:id/confirm
GET  /api/v1/payments/:id/receipt
```

**Пример запроса:**
```json
POST /api/v1/payments/create
Authorization: Bearer <token>
X-Sheikh-Status: true

{
  "recipientId": "user_456",
  "amount": 5000,
  "currency": "RUB",
  "paymentMethod": "sbp",
  "message": "За обед"
}
```

**Пример ответа:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_789",
    "amount": 5000,
    "currency": "RUB",
    "fee": 0,
    "feePercent": 0,
    "sheikhDiscount": true,
    "status": "processing",
    "estimatedCompletion": 1718400000000
  }
}
```

**Use Cases:**
- Переводы между друзьями
- Оплата услуг
- Возврат долгов
- Донаты авторам
- Разделение счетов

---

### 2. 🎮 ИГРЫ (`game`)

**Описание:** Мини-игры в чате для развлечения и соревнований

**Тип:** `AttachmentType = 'game'`  
**Категория:** `premium`  
**Доступ:** `premium` (только Шейх)  
**Сложность:** 🔴 Высокая

**TypeScript интерфейс:**
```typescript
interface GameAttachment {
  type: 'game';
  attachmentId: string;
  gameId: string;
  gameType: GameType;
  title: string;
  description?: string;
  gameState: GameState;
  players: GamePlayer[];
  spectators: string[];
  settings: GameSettings;
  results?: GameResults;
  session: GameSession;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  accessInfo: AttachmentAccessInfo;
}

type GameType = 
  | 'chess' | 'checkers' | 'tictactoe' | 'quiz' | 'cards'
  | 'board' | 'arcade' | 'puzzle' | 'trivia' | 'custom';
```

**Доступные игры:**
| Игра | Тип | Игроков | Описание |
|------|-----|---------|----------|
| 🏁 **Шахматы** | strategy | 2 | Классические шахматы |
| 🏁 **Шашки** | strategy | 2 | Русские шашки |
| 🏁 **Крестики-нолики** | casual | 2 | Быстрая игра |
| 🏁 **Викторина** | trivia | 2-10 | Вопросы и ответы |
| 🏁 **Карточные** | cards | 2-6 | Дурак, Уно |
| 🏁 **Настольные** | board | 2-8 | Монополия, Каркассон |
| 🏁 **Аркады** | arcade | 1-4 | Пинг-понг, Тетрис |
| 🏁 **Головоломки** | puzzle | 1-4 | Судоку, 2048 |

**UI/UX:**
```
┌─────────────────────────────────────────────────────────┐
│  🎮 Игры в чате                        💎 Только Шейх   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Выберите игру:                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │  ♟️     │ │  ⭕❌   │ │  🎯     │                  │
│  │ Шахматы │ │Крестики │ │Викторина│                  │
│  │  2 игрока│ │  2 игрока│ │ 2-10    │                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
│                                                         │
│  [Создать комнату] [Быстрый матч] [Турниры]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/v1/games/create
POST /api/v1/games/:id/join
POST /api/v1/games/:id/move
GET  /api/v1/games/:id/state
POST /api/v1/games/:id/resign
```

**Use Cases:**
- Развлечение в чате
- Командные турниры
- Образовательные квизы
- Тимбилдинг

---

### 3. ⏰ ИСЧЕЗАЮЩИЕ (`expiring`)

**Описание:** Вложения, которые автоматически удаляются после просмотра

**Тип:** `AttachmentType = 'expiring'`  
**Категория:** `premium`  
**Доступ:** `premium` (только Шейх)  
**Сложность:** 🟠 Средняя

**TypeScript интерфейс:**
```typescript
interface ExpiringAttachment {
  type: 'expiring';
  attachmentId: string;
  expiringType: ExpiringType;
  originalAttachment: ImageAttachment | VideoAttachment | ...;
  expiresAt: number;
  destroyOnRead: boolean;
  destroyOnScreenshot: boolean;
  notifyBeforeExpire: number;
  isViewed: boolean;
  viewedAt?: number;
  viewedBy: string[];
  isDestroyed: boolean;
  destroyedAt?: number;
  screenshotDetected?: boolean;
  screenshotAt?: number;
  screenshotBy?: string[];
  createdBy: string;
  createdAt: number;
  accessInfo: AttachmentAccessInfo;
}

type ExpiringType = 'image' | 'video' | 'voice_message' | 'video_note' | 'note' | 'file';
```

**Режимы исчезновения:**
| Режим | Описание | Время |
|-------|----------|-------|
| **После прочтения** | Удалить после просмотра | Сразу |
| **По таймеру** | Удалить через N часов/дней | 1ч - 30дней |
| **После скриншота** | Удалить при попытке скриншота | Мгновенно |

**UI/UX:**
```
┌─────────────────────────────────────────────────────────┐
│  ⏰ Исчезнувшее вложение               💎 Только Шейх   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Это вложение уничтожено                                │
│                                                         │
│  🔥 Просмотрено: 2 раза                                 │
│  🔥 Уничтожено: 15.06.2026 14:30                       │
│                                                         │
│  ⚠️ Была попытка скриншота!                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/v1/attachments/expiring/create
GET  /api/v1/attachments/expiring/:id/view
POST /api/v1/attachments/expiring/:id/destroy
```

**Use Cases:**
- Конфиденциальные фото
- Временные документы
- Секретная информация
- Приватные сообщения

---

### 4. 👥 СОВМЕСТНЫЕ (`collaborative`)

**Описание:** Вложения с возможностью совместного редактирования в реальном времени

**Тип:** `AttachmentType = 'collaborative'`  
**Категория:** `premium`  
**Доступ:** `premium` (только Шейх)  
**Сложность:** 🟡 Высокая

**TypeScript интерфейс:**
```typescript
interface CollaborativeAttachment {
  type: 'collaborative';
  attachmentId: string;
  collaborativeType: CollaborativeType;
  title: string;
  description?: string;
  content: any;
  editors: CollaborativeEditor[];
  currentEditors: string[];
  realTimeSync: boolean;
  lastSyncAt: number;
  editHistory: Edit[];
  locks: Record<string, string>;
  permissions: CollaborativePermissions;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  accessInfo: AttachmentAccessInfo;
}

type CollaborativeType = 'list' | 'note' | 'chart' | 'document' | 'whiteboard';
```

**Типы совместных вложений:**
| Тип | Описание | Пример |
|-----|----------|--------|
| **list** | Совместный список | План поездки |
| **note** | Совместная заметка | Конспект встречи |
| **chart** | Совместная диаграмма | Отчёт по продажам |
| **document** | Совместный документ | Договор |
| **whiteboard** | Виртуальная доска | Мозговой штурм |

**Возможности:**
- ✅ Real-time синхронизация (WebSocket)
- ✅ Несколько редакторов одновременно
- ✅ История изменений
- ✅ Блокировки секций
- ✅ Роли и разрешения

**UI/UX:**
```
┌─────────────────────────────────────────────────────────┐
│  👥 Совместный документ                💎 Только Шейх   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  План проекта "Запуск"                                  │
│  ─────────────────────────────────────────────────────  │
│  1. Исследование рынка (Иван) ✏️                       │
│  2. Разработка продукта (Мария) ✏️                     │
│  3. Маркетинговая кампания (Пётр)                      │
│  ─────────────────────────────────────────────────────  │
│  👥 Сейчас редактируют: Иван, Мария                    │
│  📝 История: 15 изменений                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/v1/collaborative/create
POST /api/v1/collaborative/:id/edit
GET  /api/v1/collaborative/:id/sync
WS   /api/v1/collaborative/:id/realtime
```

**Use Cases:**
- Совместная работа над документами
- Планирование проектов
- Мозговые штурмы
- Командные заметки

---

### 5. 🔄 КОМБИНИРОВАННЫЕ (`combined`)

**Описание:** Комбинация нескольких типов вложений с взаимосвязями

**Тип:** `AttachmentType = 'combined'`  
**Категория:** `premium`  
**Доступ:** `premium` (только Шейх)  
**Сложность:** 🟡 Высокая

**TypeScript интерфейс:**
```typescript
interface CombinedAttachment {
  type: 'combined';
  attachmentId: string;
  combinedType: CombinedType;
  title: string;
  description?: string;
  components: CombinedComponent[];
  relations: ComponentRelation[];
  results?: CombinedResults;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  accessInfo: AttachmentAccessInfo;
}

type CombinedType = 
  | 'poll_list' | 'event_poll' | 'quiz_survey' 
  | 'chart_note' | 'location_event' | 'custom';
```

**Типы комбинаций:**
| Тип | Компоненты | Описание |
|-----|------------|----------|
| **poll_list** | Poll + List | План с голосованием |
| **event_poll** | Event + Poll | Выбор времени встречи |
| **quiz_survey** | Quiz + Survey | Тест с обратной связью |
| **chart_note** | Chart + Note | Диаграмма с описанием |
| **location_event** | Location + Event | Событие с местом |

**UI/UX:**
```
┌─────────────────────────────────────────────────────────┐
│  🔄 Комбинированное вложение           💎 Только Шейх   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📅 Планирование поездки               💎 Только Шейх   │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  🗳️ Выбор направления:                                 │
│  ☐ Сочи (45%)  ☐ Крым (35%)  ☐ Казань (20%)          │
│                                                         │
│  📝 План поездки:                                       │
│  ☐ Купить билеты                                        │
│  ☐ Забронировать отель                                 │
│  ☐ Составить маршрут                                   │
│                                                         │
│  📍 Место: [Выбрать на карте]                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**API:**
```
POST /api/v1/combined/create
POST /api/v1/combined/:id/component/add
POST /api/v1/combined/:id/relation/add
GET  /api/v1/combined/:id/results
```

**Use Cases:**
- Комплексное планирование
- Многоэтапные опросы
- Интерактивные отчёты

---

## 🔧 ПРОВЕРКА ДОСТУПА

### Middleware для проверки статуса Шейх:

```typescript
// middleware/premium.ts
import { PREMIUM_ATTACHMENTS, AttachmentType } from '@balloo/core-types';

export async function premiumAccessMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  
  const attachmentType = req.params.type as AttachmentType;
  const userId = req.user.id;
  
  // Проверяем, является ли вложение premium
  if (PREMIUM_ATTACHMENTS.includes(attachmentType)) {
    
    const user = await getUserById(userId);
    
    // Проверяем статус Шейх
    if (!user.isSheikh) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PREMIUM_REQUIRED',
          message: 'Это вложение доступно только пользователям с ролью Шейх',
          upgradeUrl: '/api/v1/premium/upgrade',
          pricing: {
            monthly: '$9.99/мес',
            yearly: '$99.99/год',
            lifetime: '$299.99'
          },
          benefits: [
            '5 premium вложений',
            'Файлы до 500 MB',
            '0% комиссия на переводы',
            'Приоритетная поддержка 24/7'
          ]
        }
      });
    }
    
    // Проверяем срок действия
    if (user.sheikhExpiresAt && user.sheikhExpiresAt < Date.now()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'PREMIUM_EXPIRED',
          message: 'Ваш статус Шейх истёк',
          renewUrl: '/api/v1/premium/renew',
          discount: 0.20  // 20% скидка на продление
        }
      });
    }
    
    // Добавляем флаг в запрос
    req.isSheikh = true;
  }
  
  next();
}
```

---

## 📊 МЕТРИКИ PREMIUM

```typescript
interface PremiumMetrics {
  // Подписки
  totalSheikhs: number;
  newSheikhsToday: number;
  newSheikhsWeek: number;
  newSheikhsMonth: number;
  churnRate: number;           // % отписок
  conversionRate: number;      // % конверсии в премиум
  
  // Использование premium вложений
  premiumAttachmentsUsage: {
    payment: { 
      count: number; 
      volume: number;  // объём в рублях
      totalFees: number;  // комиссии
    };
    game: { 
      count: number; 
      activeGames: number;
      averageDuration: number;
    };
    expiring: { 
      count: number; 
      destroyed: number;
      screenshotDetected: number;
    };
    collaborative: { 
      count: number; 
      activeEditors: number;
      totalEdits: number;
    };
    combined: { 
      count: number;
      popularCombinations: string[];
    };
  };
  
  // Доходы
  revenue: {
    subscriptions: {
      monthly: number;
      yearly: number;
      lifetime: number;
    };
    transactionFees: number;
    total: number;
  };
  
  // LTV
  averageLTV: number;
  averageSubscriptionLength: number;  // месяцев
}
```

---

## 💰 МОДЕЛЬ МОНЕТИЗАЦИИ

### Прогнозируемые доходы:

```
┌─────────────────────────────────────────────────────────┐
│  💰 ПРОГНОЗ ДОХОДОВ (в месяц)                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Подписки:                                              │
│  ├── Monthly (1000 users × $9.99)    = $9,990          │
│  ├── Yearly (500 users × $99.99/12)  = $4,166          │
│  └── Lifetime (50 users × $299.99/24)= $625            │
│                                                         │
│  Комиссии с переводов (не Шейх):                        │
│  └── 1.5% × $100,000                   = $1,500        │
│                                                         │
│  ИТОГО:                                $16,281/мес     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 ROADMAP

### Q3 2026:
- ✅ Все 5 premium вложений реализованы
- ✅ Система проверки доступа
- ✅ Документация

### Q4 2026:
- ⏳ Интеграция платёжных систем (СБП, Яндекс, Тинькофф)
- ⏳ 10+ игр для premium
- ⏳ AI-модерация premium контента

### Q1 2027:
- ⏳ Enterprise тариф (для компаний)
- ⏳ API для разработчиков
- ⏳ White-label решения

---

## 📄 СВЯЗАННАЯ ДОКУМЕНТАЦИЯ

### Основная:
- [`ATTACHMENTS_OVERVIEW.md`](./ATTACHMENTS_OVERVIEW.md) — Общий обзор
- [`FREE_ATTACHMENTS.md`](./FREE_ATTACHMENTS.md) — Бесплатные вложения

### Premium контракты:
- [`../premium/PREMIUM_CONTRACT_payment.md`](../premium/PREMIUM_CONTRACT_payment.md) — Переводы
- [`../premium/PREMIUM_CONTRACT_game.md`](../premium/PREMIUM_CONTRACT_game.md) — Игры
- [`../premium/PREMIUM_CONTRACT_expiring.md`](../premium/PREMIUM_CONTRACT_expiring.md) — Исчезающие
- [`../premium/PREMIUM_CONTRACT_collaborative.md`](../premium/PREMIUM_CONTRACT_collaborative.md) — Совместные
- [`../premium/PREMIUM_CONTRACT_combined.md`](../premium/PREMIUM_CONTRACT_combined.md) — Комбинированные

### Роль Шейх:
- [`../premium/SHEIKH_ROLE.md`](../premium/SHEIKH_ROLE.md) — Документация по роли Шейх

### Технические:
- [`messenger/src/types/attachments.ts`](../../messenger/src/types/attachments.ts) — TypeScript типы

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 2.0.0  
**Статус:** Complete  
**Автор:** NLP-Core-Team

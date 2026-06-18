
---
title: Обзор Вложений Balloo Messenger
description: Полное руководство по всем типам вложений — бесплатные и premium (Шейх)
version: 2.0.0
date: 2026-06-14
author: NLP-Core-Team
status: complete
audience: both
tags:
  - attachments
  - overview
  - free
  - premium
  - sheikh
related_docs:
  - messenger/src/types/attachments.ts
  - SUMMARY_DOCS/attachments/FREE_ATTACHMENTS.md
  - SUMMARY_DOCS/attachments/PREMIUM_ATTACHMENTS.md
  - SUMMARY_DOCS/premium/SHEIKH_ROLE.md
---

# 📎 ВЛОЖЕНИЯ BALLOO MESSENGER — ПОЛНЫЙ ОБЗОР

**Версия:** 2.0.0  
**Дата:** 2026-06-14  
**Автор:** NLP-Core-Team  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР ВСЕХ ВЛОЖЕНИЙ

```
┌──────────────────────────────────────────────────────────────────┐
│                    ВСЕ ВЛОЖЕНИЯ BALLOO (26 типов)                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🆓 БЕСПЛАТНЫЕ (21 тип) — доступны ВСЕМ пользователям           │
│  ├── 📁 МЕДИА (6)                                                │
│  │   ├── 🖼️ Изображения (image)                                 │
│  │   ├── 🎬 Видео (video)                                       │
│  │   ├── 🎵 Аудио (audio)                                       │
│  │   ├── 📄 Документы (file/document)                           │
│  │   ├── 🎤 Голосовые сообщения (voice_message)                 │
│  │   └── 🎥 Видео-сообщения (video_note)                        │
│  ├── 🎯 ИНТЕРАКТИВНЫЕ (4)                                        │
│  │   ├── 🗳️ Опросы (poll)                                       │
│  │   ├── 📝 Списки (list)                                       │
│  │   ├── 📊 Анкеты (survey)                                     │
│  │   └── 🧩 Тесты (quiz)                                        │
│  ├── 📦 КОНТЕНТ (6)                                              │
│  │   ├── 🎬 GIF (gif)                                           │
│  │   ├── 🏷️ Стикеры (sticker)                                   │
│  │   ├── 🔗 Предпросмотр ссылок (link_preview)                  │
│  │   ├── 📝 Заметки (note)                                      │
│  │   ├── 📊 Диаграммы (chart)                                   │
│  │   └── 🎵 Музыка (music)                                      │
│  └── 💬 КОММУНИКАЦИЯ (5)                                         │
│      ├── 📍 Геолокация (location)                               │
│      ├── 👤 Контакты (contact)                                  │
│      ├── 📅 События (event)                                     │
│      ├── 🏷️ Упоминания (mention)                                │
│      └── 📹 Записи звонков (call_recording)                     │
│                                                                  │
│  💎 PREMIUM (5 типов) — ТОЛЬКО для пользователей с ролью Шейх  │
│  ├── 💰 Переводы (payment)                                      │
│  ├── 🎮 Игры (game)                                             │
│  ├── ⏰ Исчезающие (expiring)                                   │
│  ├── 👥 Совместные (collaborative)                              │
│  └── 🔄 Комбинированные (combined)                              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🆓 БЕСПЛАТНЫЕ ВЛОЖЕНИЯ (21 тип)

**Доступ:** ✅ Все пользователи Balloo Messenger

### 📁 МЕДИА (6 типов)

| # | Тип | Описание | Макс размер | Форматы |
|---|-----|----------|-------------|---------|
| 1 | 🖼️ **image** | Фотографии, изображения | 100 MB | JPG, PNG, GIF, WebP |
| 2 | 🎬 **video** | Видеоролики | 100 MB | MP4, WebM |
| 3 | 🎵 **audio** | Аудиофайлы, подкасты | 100 MB | MP3, WAV, OGG |
| 4 | 📄 **file/document** | Документы, файлы | 100 MB | PDF, DOC, XLS, PPTX, ZIP |
| 5 | 🎤 **voice_message** | Голосовые заметки | 10 MB | OGG, OPUS |
| 6 | 🎥 **video_note** | Видео-кружочки | 10 MB | MP4, WebM |

### 🎯 ИНТЕРАКТИВНЫЕ (4 типа)

| # | Тип | Описание | Особенности |
|---|-----|----------|-------------|
| 7 | 🗳️ **poll** | Опросы, голосования | Анонимные, несколько вариантов |
| 8 | 📝 **list** | Списки задач | Совместные TODO, прогресс |
| 9 | 📊 **survey** | Анкеты, опросы | 10 типов вопросов, секции |
| 10 | 🧩 **quiz** | Тесты, викторины | Баллы, таймер, лидерборд |

### 📦 КОНТЕНТ (6 типов)

| # | Тип | Описание | Особенности |
|---|-----|----------|-------------|
| 11 | 🎬 **gif** | GIF-анимации | Giphy, Tenor интеграция |
| 12 | 🏷️ **sticker** | Стикеры | Паки, премиум стикеры |
| 13 | 🔗 **link_preview** | Предпросмотр ссылок | Open Graph мета |
| 14 | 📝 **note** | Заметки | Markdown, версии |
| 15 | 📊 **chart** | Диаграммы, графики | 12 типов图表 |
| 16 | 🎵 **music** | Музыкальные треки | ID3 теги, обложки |

### 💬 КОММУНИКАЦИЯ (5 типов)

| # | Тип | Описание | Особенности |
|---|-----|----------|-------------|
| 17 | 📍 **location** | Геолокация | Карты, Live Location |
| 18 | 👤 **contact** | Контакты | vCard, телефонная книга |
| 19 | 📅 **event** | События календаря | RSVP, напоминания |
| 20 | 🏷️ **mention** | Упоминания | @users, #hashtags |
| 21 | 📹 **call_recording** | Записи звонков | Аудио/видео, расшифровка |

---

## 💎 PREMIUM ВЛОЖЕНИЯ (5 типов)

**Доступ:** 👑 Только пользователи с ролью **Шейх**

| # | Тип | Описание | Почему Premium |
|---|-----|----------|----------------|
| 22 | 💰 **payment** | Переводы, платежи | 💳 Финансовые операции, комиссии |
| 23 | 🎮 **game** | Игры в чате | 🎮 Серверы, синхронизация, рейтинг |
| 24 | ⏰ **expiring** | Исчезающие вложения | 🔒 Приватность, безопасность |
| 25 | 👥 **collaborative** | Совместная работа | 📝 Real-time sync, редакторы |
| 26 | 🔄 **combined** | Комбинированные | 🎯 Сложная логика, компоненты |

---

## 👑 РОЛЬ "ШЕЙХ"

### Что такое Шейх?

**"Шейх"** — это премиум-статус пользователя в Balloo Messenger, предоставляющий доступ к эксклюзивным функциям и вложениям.

### Как получить статус Шейх:

| Способ | Описание | Стоимость |
|--------|----------|-----------|
| **Месячная подписка** | Доступ на 30 дней | $9.99/мес |
| **Годовая подписка** | Доступ на 365 дней | $99.99/год (выгода 17%) |
| **Lifetime** | Пожизненный доступ | $299.99 (единоразово) |
| **Партнёрство** | Официальные партнёры Balloo | Бесплатно |

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
└─────────────────────────────────────────────────────────┘
```

---

## 📊 СРАВНЕНИЕ ТАРИФОВ

| Функция | 🆓 Бесплатный | 💎 Шейх |
|---------|--------------|---------|
| **Медиа вложения** | ✅ 6 типов | ✅ 6 типов |
| **Интерактивные** | ✅ 4 типа | ✅ 4 типа |
| **Контент** | ✅ 6 типов | ✅ 6 типов |
| **Коммуникация** | ✅ 5 типов | ✅ 5 типов |
| **Переводы** | ❌ | ✅ |
| **Игры** | ❌ | ✅ |
| **Исчезающие** | ❌ | ✅ |
| **Совместные** | ❌ | ✅ |
| **Комбинированные** | ❌ | ✅ |
| **Макс размер файла** | 100 MB | 500 MB |
| **Комиссия за перевод** | — | 0% |
| **Поддержка** | Стандартная | Приоритетная 24/7 |

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Проверка доступа к premium вложениям:

```typescript
import { 
  PREMIUM_ATTACHMENTS, 
  ATTACHMENT_ACCESS_INFO,
  AttachmentType 
} from '@balloo/core-types';

async function checkAttachmentAccess(
  userId: string,
  attachmentType: AttachmentType
): Promise<AccessCheckResult> {
  
  const accessInfo = ATTACHMENT_ACCESS_INFO[attachmentType];
  
  // Если бесплатное — разрешаем
  if (accessInfo.level === 'free') {
    return { allowed: true };
  }
  
  // Проверяем статус Шейх
  const user = await getUserById(userId);
  
  if (!user.isSheikh) {
    return {
      allowed: false,
      reason: 'Требуется статус Шейх',
      upgradeUrl: '/premium/upgrade',
      error: {
        code: 'PREMIUM_REQUIRED',
        message: 'Это вложение доступно только пользователям с ролью Шейх'
      }
    };
  }
  
  // Проверяем срок действия
  if (user.sheikhExpiresAt && user.sheikhExpiresAt < Date.now()) {
    return {
      allowed: false,
      reason: 'Статус Шейх истёк',
      renewUrl: '/premium/renew',
      error: {
        code: 'PREMIUM_EXPIRED',
        message: 'Ваш статус Шейх истёк. Продлите подписку.'
      }
    };
  }
  
  return { allowed: true };
}
```

### API ответы:

#### ✅ Успешный доступ (Шейх):
```json
{
  "success": true,
  "data": {
    "attachmentId": "att_123",
    "type": "payment",
    "accessInfo": {
      "level": "premium",
      "premiumType": "sheikh",
      "requiredRole": "sheikh",
      "description": "Переводы и платежи"
    }
  }
}
```

#### ❌ Отказ (не Шейх):
```json
{
  "success": false,
  "error": {
    "code": "PREMIUM_REQUIRED",
    "message": "Переводы доступны только пользователям с ролью Шейх",
    "upgradeUrl": "/api/v1/premium/upgrade",
    "pricing": {
      "monthly": "$9.99/мес",
      "yearly": "$99.99/год",
      "lifetime": "$299.99"
    },
    "benefits": [
      "5 premium вложений",
      "Файлы до 500 MB",
      "0% комиссия на переводы",
      "Приоритетная поддержка"
    ]
  }
}
```

---

## 📋 МОНИТОРИНГ И МЕТРИКИ

### Premium Metrics:

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
    payment: { count: number; volume: number };
    game: { count: number; activeGames: number };
    expiring: { count: number; destroyed: number };
    collaborative: { count: number; activeEditors: number };
    combined: { count: number };
  };
  
  // Доходы
  revenue: {
    monthly: number;
    yearly: number;
    lifetime: number;
    total: number;
  };
  
  // LTV
  averageLTV: number;
  averageSubscriptionLength: number;
}
```

---

## 🎯 ROADMAP

### Q3 2026:
- ✅ Все 26 типов вложений реализованы
- ✅ Система проверки доступа
- ✅ Документация

### Q4 2026:
- ⏳ AI-расшифровка голосовых
- ⏳ Интеграция платёжных систем
- ⏳ 10+ игр для premium

### Q1 2027:
- ⏳ AR/VR вложения
- ⏳ Голограммы (experimental)
- ⏳ NFT вложения

---

## 📄 СВЯЗАННАЯ ДОКУМЕНТАЦИЯ

### Основная:
- [`ATTACHMENTS_COMPLETE_CATALOG.md`](./ATTACHMENTS_COMPLETE_CATALOG.md) — Полный каталог всех вложений
- [`FREE_ATTACHMENTS.md`](./FREE_ATTACHMENTS.md) — Бесплатные вложения (21 тип)
- [`PREMIUM_ATTACHMENTS.md`](./PREMIUM_ATTACHMENTS.md) — Premium вложения (5 типов)

### Premium:
- [`../premium/SHEIKH_ROLE.md`](../premium/SHEIKH_ROLE.md) — Роль Шейх
- [`../premium/PREMIUM_CONTRACT_payment.md`](../premium/PREMIUM_CONTRACT_payment.md) — Переводы
- [`../premium/PREMIUM_CONTRACT_game.md`](../premium/PREMIUM_CONTRACT_game.md) — Игры
- [`../premium/PREMIUM_CONTRACT_expiring.md`](../premium/PREMIUM_CONTRACT_expiring.md) — Исчезающие
- [`../premium/PREMIUM_CONTRACT_collaborative.md`](../premium/PREMIUM_CONTRACT_collaborative.md) — Совместные
- [`../premium/PREMIUM_CONTRACT_combined.md`](../premium/PREMIUM_CONTRACT_combined.md) — Комбинированные

### Технические:
- [`messenger/src/types/attachments.ts`](../../messenger/src/types/attachments.ts) — TypeScript типы

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 2.0.0  
**Статус:** Complete  
**Автор:** NLP-Core-Team


---
title: Документация Вложений Balloo Messenger
description: Индекс всей документации по вложениям — бесплатные и premium (Шейх)
version: 2.0.0
date: 2026-06-14
author: NLP-Core-Team
status: complete
audience: both
tags:
  - attachments
  - documentation
  - index
  - overview
related_docs:
  - SUMMARY_DOCS/README.md
  - messenger/src/types/attachments.ts
---

# 📎 ДОКУМЕНТАЦИЯ ВЛОЖЕНИЙ BALLOO MESSENGER

**Версия:** 2.0.0  
**Дата обновления:** 2026-06-14  
**Автор:** NLP-Core-Team  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР

```
┌──────────────────────────────────────────────────────────────────┐
│                    ВСЕ ВЛОЖЕНИЯ BALLOO                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🆓 БЕСПЛАТНЫЕ (21 тип) — доступны ВСЕМ                          │
│  ├── 📁 МЕДИА (6): image, video, audio, file, voice_message,    │
│  │                 video_note                                    │
│  ├── 🎯 ИНТЕРАКТИВНЫЕ (4): poll, list, survey, quiz             │
│  ├── 📦 КОНТЕНТ (6): gif, sticker, link_preview, note, chart,   │
│  │                 music                                         │
│  └── 💬 КОММУНИКАЦИЯ (5): location, contact, event, mention,    │
│                    call_recording                                │
│                                                                  │
│  💎 PREMIUM (5 типов) — ТОЛЬКО для Шейх                          │
│  ├── 💰 payment          — Переводы и платежи                   │
│  ├── 🎮 game             — Игры в чате                          │
│  ├── ⏰ expiring         — Исчезающие вложения                  │
│  ├── 👥 collaborative    — Совместная работа                    │
│  └── 🔄 combined         — Комбинированные вложения             │
│                                                                  │
│  ИТОГО: 26 типов вложений                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 СТРУКТУРА ДОКУМЕНТАЦИИ

```
SUMMARY_DOCS/attachments/
│
├── README.md                          # Этот файл (индекс)
├── ATTACHMENTS_OVERVIEW.md            # Общий обзор всех вложений
├── FREE_ATTACHMENTS.md                # Бесплатные вложения (21 тип)
├── PREMIUM_ATTACHMENTS.md             # Premium вложения (5 типов)
│
└── ../premium/
    ├── SHEIKH_ROLE.md                 # Роль Шейх
    ├── PREMIUM_CONTRACT_payment.md    # Переводы
    ├── PREMIUM_CONTRACT_game.md       # Игры
    ├── PREMIUM_CONTRACT_expiring.md   # Исчезающие
    ├── PREMIUM_CONTRACT_collaborative.md  # Совместные
    └── PREMIUM_CONTRACT_combined.md   # Комбинированные
```

---

## 📄 СПИСОК ДОКУМЕНТОВ

### Основная документация:

| Документ | Описание | Статус |
|----------|----------|--------|
| [`README.md`](./README.md) | Индекс документации | ✅ |
| [`ATTACHMENTS_OVERVIEW.md`](./ATTACHMENTS_OVERVIEW.md) | Общий обзор всех 26 типов | ✅ |
| [`FREE_ATTACHMENTS.md`](./FREE_ATTACHMENTS.md) | 21 бесплатное вложение | ✅ |
| [`PREMIUM_ATTACHMENTS.md`](./PREMIUM_ATTACHMENTS.md) | 5 premium вложений | ✅ |

### Premium документация:

| Документ | Описание | Статус |
|----------|----------|--------|
| [`../premium/SHEIKH_ROLE.md`](../premium/SHEIKH_ROLE.md) | Роль Шейх, тарифы, API | ✅ |
| [`../premium/PREMIUM_CONTRACT_payment.md`](../premium/PREMIUM_CONTRACT_payment.md) | Переводы (payment) | ✅ |
| [`../premium/PREMIUM_CONTRACT_game.md`](../premium/PREMIUM_CONTRACT_game.md) | Игры (game) | ✅ |
| [`../premium/PREMIUM_CONTRACT_expiring.md`](../premium/PREMIUM_CONTRACT_expiring.md) | Исчезающие (expiring) | ✅ |
| [`../premium/PREMIUM_CONTRACT_collaborative.md`](../premium/PREMIUM_CONTRACT_collaborative.md) | Совместные (collaborative) | ✅ |
| [`../premium/PREMIUM_CONTRACT_combined.md`](../premium/PREMIUM_CONTRACT_combined.md) | Комбинированные (combined) | ✅ |

### Анализ и рекомендации:

| Документ | Описание | Статус |
|----------|----------|--------|
| [`../analysis/ATTACHMENTS_ANALYSIS_AND_RECOMMENDATIONS.md`](../analysis/ATTACHMENTS_ANALYSIS_AND_RECOMMENDATIONS.md) | Анализ и рекомендации | ✅ |
| [`../analysis/ATTACHMENTS_COMPLETE_CATALOG.md`](../analysis/ATTACHMENTS_COMPLETE_CATALOG.md) | Полный каталог (1500+ строк) | ✅ |
| [`../analysis/MESSENGER_MAIN_PAGE_ANALYSIS.md`](../analysis/MESSENGER_MAIN_PAGE_ANALYSIS.md) | Анализ мессенджера | ✅ |

### Технические файлы:

| Файл | Описание | Статус |
|------|----------|--------|
| [`messenger/src/types/attachments.ts`](../../messenger/src/types/attachments.ts) | TypeScript типы (26 типов) | ✅ |
| [`messenger/src/types/index.ts`](../../messenger/src/types/index.ts) | Экспорты типов | ✅ |
| [`core-types/src/index.ts`](../../core-types/src/index.ts) | Общие типы | ✅ |

---

## 🎯 БЫСТРЫЙ СТАРТ

### Для разработчиков:

1. **Изучите типы:**
   ```bash
   cat messenger/src/types/attachments.ts
   ```

2. **Проверьте доступ:**
   ```typescript
   import { 
     ATTACHMENT_ACCESS_INFO,
     PREMIUM_ATTACHMENTS,
     FREE_ATTACHMENTS
   } from '@balloo/core-types';
   
   const accessInfo = ATTACHMENT_ACCESS_INFO['payment'];
   // { level: 'premium', requiredRole: 'sheikh' }
   ```

3. **Реализуйте middleware:**
   ```typescript
   import { requireSheikh } from './middleware/sheikh';
   
   router.post('/upload/payment', requireSheikh('payment'), handler);
   ```

### Для пользователей:

1. **Бесплатные вложения** — доступны сразу после регистрации
2. **Premium вложения** — оформите статус Шейх за $9.99/мес

---

## 📊 ТАБЛИЦА ВСЕХ ВЛОЖЕНИЙ

### Бесплатные (21 тип):

| # | Тип | Категория | Описание | Макс размер |
|---|-----|-----------|----------|-------------|
| 1 | 🖼️ `image` | media | Изображения | 100 MB |
| 2 | 🎬 `video` | media | Видео | 100 MB |
| 3 | 🎵 `audio` | media | Аудио | 100 MB |
| 4 | 📄 `file/document` | media | Документы | 100 MB |
| 5 | 🎤 `voice_message` | media | Голосовые | 10 MB |
| 6 | 🎥 `video_note` | media | Видео-кружочки | 10 MB |
| 7 | 🗳️ `poll` | interactive | Опросы | — |
| 8 | 📝 `list` | interactive | Списки | — |
| 9 | 📊 `survey` | interactive | Анкеты | — |
| 10 | 🧩 `quiz` | interactive | Тесты | — |
| 11 | 🎬 `gif` | content | GIF-анимации | 10 MB |
| 12 | 🏷️ `sticker` | content | Стикеры | 1 MB |
| 13 | 🔗 `link_preview` | content | Предпросмотр ссылок | — |
| 14 | 📝 `note` | content | Заметки | 100 KB |
| 15 | 📊 `chart` | content | Диаграммы | — |
| 16 | 🎵 `music` | content | Музыка | 100 MB |
| 17 | 📍 `location` | communication | Геолокация | — |
| 18 | 👤 `contact` | communication | Контакты | — |
| 19 | 📅 `event` | communication | События | — |
| 20 | 🏷️ `mention` | communication | Упоминания | — |
| 21 | 📹 `call_recording` | communication | Записи звонков | 100 MB |

### Premium (5 типов — только Шейх):

| # | Тип | Категория | Описание | Доступ |
|---|-----|-----------|----------|--------|
| 22 | 💰 `payment` | premium | Переводы | 👑 Шейх |
| 23 | 🎮 `game` | premium | Игры | 👑 Шейх |
| 24 | ⏰ `expiring` | premium | Исчезающие | 👑 Шейх |
| 25 | 👥 `collaborative` | premium | Совместные | 👑 Шейх |
| 26 | 🔄 `combined` | premium | Комбинированные | 👑 Шейх |

---

## 🔧 ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ

### Константы:

```typescript
// Список premium вложений
export const PREMIUM_ATTACHMENTS: AttachmentType[] = [
  'payment',
  'game',
  'expiring',
  'collaborative',
  'combined',
];

// Список бесплатных вложений
export const FREE_ATTACHMENTS: AttachmentType[] = [
  'image', 'video', 'audio', 'file', 'document',
  'voice_message', 'video_note',
  'poll', 'list', 'survey', 'quiz',
  'gif', 'sticker', 'link_preview', 'note', 'chart', 'music',
  'location', 'contact', 'event', 'mention', 'call_recording',
];

// Информация о доступе
export const ATTACHMENT_ACCESS_INFO: Record<AttachmentType, AttachmentAccessInfo> = {
  // ... см. messenger/src/types/attachments.ts
};
```

### Проверка доступа:

```typescript
import { 
  ATTACHMENT_ACCESS_INFO,
  PREMIUM_ATTACHMENTS 
} from '@balloo/core-types';

async function checkAccess(
  userId: string,
  attachmentType: AttachmentType
): Promise<AccessCheckResult> {
  
  const accessInfo = ATTACHMENT_ACCESS_INFO[attachmentType];
  
  // Бесплатное — разрешаем
  if (accessInfo.level === 'free') {
    return { allowed: true };
  }
  
  // Premium — проверяем Шейх
  const user = await getUserById(userId);
  
  if (!user.isSheikh) {
    return {
      allowed: false,
      error: {
        code: 'PREMIUM_REQUIRED',
        message: 'Требуется статус Шейх'
      },
      upgradeUrl: '/premium/upgrade'
    };
  }
  
  if (user.sheikhExpiresAt < Date.now()) {
    return {
      allowed: false,
      error: {
        code: 'PREMIUM_EXPIRED',
        message: 'Статус Шейх истёк'
      },
      renewUrl: '/premium/renew'
    };
  }
  
  return { allowed: true };
}
```

---

## 💰 МОДЕЛЬ МОНЕТИЗАЦИИ

### Тарифы Шейх:

| Тариф | Срок | Стоимость | Выгода |
|-------|------|-----------|--------|
| Monthly | 30 дней | $9.99/мес | — |
| Yearly | 365 дней | $99.99/год | 17% |
| Lifetime | Навсегда | $299.99 | Единоразово |
| Partner | 365 дней | Бесплатно | Для партнёров |

### Прогноз доходов:

```
┌─────────────────────────────────────────────────────────┐
│  ПРОГНОЗ ДОХОДОВ (в месяц)                              │
├─────────────────────────────────────────────────────────┤
│  Подписки:                                              │
│  ├── Monthly (1000 × $9.99)    = $9,990                │
│  ├── Yearly (500 × $99.99/12)  = $4,166                │
│  └── Lifetime (50 × $299.99/24)= $625                  │
│                                                         │
│  Комиссии с переводов:                                  │
│  └── 1.5% × $100,000           = $1,500                │
│                                                         │
│  ИТОГО: $16,281/мес                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 МЕТРИКИ

### Ключевые метрики:

```typescript
interface AttachmentsMetrics {
  // Общие
  totalAttachments: number;
  uploadsPerDay: number;
  storageUsed: number;
  
  // По типам
  byType: Record<AttachmentType, number>;
  byCategory: Record<AttachmentCategory, number>;
  
  // Premium
  premiumUsers: number;
  premiumConversion: number;
  premiumRevenue: number;
  
  // Лимиты
  averageFileSize: number;
  maxFileSize: number;
  limitExceededCount: number;
}
```

---

## 🎯 ROADMAP

### Q3 2026:
- ✅ Все 26 типов вложений реализованы
- ✅ Документация завершена
- ✅ Система проверки доступа

### Q4 2026:
- ⏳ AI-расшифровка голосовых сообщений
- ⏳ Интеграция платёжных систем (СБП, Яндекс, Тинькофф)
- ⏳ 10+ игр для premium пользователей

### Q1 2027:
- ⏳ AR/VR вложения
- ⏳ Голограммы (experimental)
- ⏳ NFT вложения

---

## 🔗 ССЫЛКИ

### Внутренние:
- [`SUMMARY_DOCS/README.md`](../README.md) — Главная документация
- [`messenger/README.md`](../../messenger/README.md) — Мессенджер
- [`core-types/README.md`](../../core-types/README.md) — Типы

### Внешние:
- [Balloo Website](https://balloo.com)
- [API Documentation](https://api.balloo.com/docs)
- [Premium Portal](https://premium.balloo.com)

---

## 📞 ПОДДЕРЖКА

### Для разработчиков:
- Email: dev@balloo.com
- Slack: #attachments-help
- GitHub: github.com/balloo/monorepo

### Для пользователей:
- Email: support@balloo.com
- Telegram: @balloo_support
- Premium: premium@balloo.com (приоритетная поддержка)

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 2.0.0  
**Статус:** Complete  
**Автор:** NLP-Core-Team

---
title: Бесплатные Вложения Balloo Messenger
description: Полная документация по 21 типу бесплатных вложений
version: 2.0.0
date: 2026-06-14
author: NLP-Core-Team
status: complete
audience: both
tags:
  - attachments
  - free
  - documentation
related_docs:
  - SUMMARY_DOCS/attachments/ATTACHMENTS_OVERVIEW.md
  - SUMMARY_DOCS/attachments/PREMIUM_ATTACHMENTS.md
  - messenger/src/types/attachments.ts
---

# 🆓 БЕСПЛАТНЫЕ ВЛОЖЕНИЯ BALLOO MESSENGER

**Версия:** 2.0.0  
**Дата:** 2026-06-14  
**Автор:** NLP-Core-Team  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР

```
┌─────────────────────────────────────────────────────────┐
│           БЕСПЛАТНЫЕ ВЛОЖЕНИЯ (21 тип)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 МЕДИА (6)           📦 КОНТЕНТ (6)                  │
│  ├── image                ├── gif                       │
│  ├── video                ├── sticker                   │
│  ├── audio                ├── link_preview              │
│  ├── file/document        ├── note                      │
│  ├── voice_message        ├── chart                     │
│  └── video_note           └── music                     │
│                                                         │
│  🎯 ИНТЕРАКТИВНЫЕ (4)     💬 КОММУНИКАЦИЯ (5)           │
│  ├── poll                 ├── location                  │
│  ├── list                 ├── contact                   │
│  ├── survey               ├── event                     │
│  └── quiz                 ├── mention                   │
│                           └── call_recording            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Доступ:** ✅ Все пользователи Balloo Messenger (без ограничений)

---

## 📁 1. МЕДИА-ВЛОЖЕНИЯ (6 типов)

### 1.1 🖼️ ИЗОБРАЖЕНИЯ (`image`)

**Описание:** Фотографии, скриншоты, изображения любого формата

**Тип:** `AttachmentType = 'image'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface ImageAttachment {
  type: 'image';
  attachmentId: string;
  url: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  caption?: string;
  compressed?: boolean;
  optimized?: boolean;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}
```

**Характеристики:**
| Параметр | Значение |
|----------|----------|
| Макс размер | 100 MB |
| Форматы | JPG, PNG, GIF, WebP |
| Сжатие | Автоматическое (85%) |
| Превью | 256x256 |
| Макс разрешение | 16384 x 16384 px |

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │      [Изображение]        │  │
│  └───────────────────────────┘  │
│  Подпись к фото                 │
│  📷 1920x1080 • 2.5 MB          │
└─────────────────────────────────┘
```

**API:**
```
POST /api/attachments/upload/image
GET  /api/attachments/:id
DELETE /api/attachments/:id
```

---

### 1.2 🎬 ВИДЕО (`video`)

**Описание:** Видеоролики, записи экрана, анимации

**Тип:** `AttachmentType = 'video'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface VideoAttachment {
  type: 'video';
  attachmentId: string;
  url: string;
  streamingUrl?: string;
  thumbnailUrl: string;
  previewGifUrl?: string;
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  mimeType: 'video/mp4' | 'video/webm' | 'video/quicktime';
  codec?: string;
  caption?: string;
  transcoded?: boolean;
  resolutions?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}
```

**Характеристики:**
| Параметр | Значение |
|----------|----------|
| Макс размер | 100 MB |
| Макс длительность | 10 минут |
| Форматы | MP4 (H.264), WebM (VP9) |
| Транскодинг | Автоматический |
| Стриминг | HLS/DASH |

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │  ▶️                       │  │
│  │      [Превью кадр]        │  │
│  │  ━━━━━━━━━━━━━━━━ 3:45   │  │
│  └───────────────────────────┘  │
│  🎬 1920x1080 • 3:45 • 15 MB    │
└─────────────────────────────────┘
```

---

### 1.3 🎵 АУДИО (`audio`)

**Описание:** Музыка, подкасты, звуковые записи

**Тип:** `AttachmentType = 'audio'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface AudioAttachment {
  type: 'audio';
  attachmentId: string;
  url: string;
  waveformUrl?: string;
  duration: number;
  fileSize: number;
  mimeType: 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac';
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    coverArtUrl?: string;
  };
  caption?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}
```

**Характеристики:**
| Параметр | Значение |
|----------|----------|
| Макс размер | 100 MB |
| Форматы | MP3, WAV, OGG, AAC |
| Битрейт | До 320 kbps |
| ID3 теги | Поддерживаются |

---

### 1.4 📄 ДОКУМЕНТЫ (`file` / `document`)

**Описание:** Файлы любого типа

**Тип:** `AttachmentType = 'file' | 'document'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface FileAttachment {
  type: 'file' | 'document';
  attachmentId: string;
  url: string;
  previewUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  extension: string;
  category: 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'ebook' | 'other';
  pageCount?: number;
  virusScanStatus?: 'pending' | 'clean' | 'infected';
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
  updatedAt: number;
}
```

**Поддерживаемые форматы:**
- **Документы:** PDF, DOC, DOCX, ODT, RTF, TXT
- **Таблицы:** XLS, XLSX, ODS, CSV
- **Презентации:** PPT, PPTX, ODP
- **Архивы:** ZIP, RAR, 7Z, TAR, GZ

---

### 1.5 🎤 ГОЛОСОВЫЕ СООБЩЕНИЯ (`voice_message`)

**Описание:** Быстрые голосовые заметки

**Тип:** `AttachmentType = 'voice_message'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface VoiceMessageAttachment {
  type: 'voice_message';
  attachmentId: string;
  url: string;
  waveformUrl?: string;
  duration: number;
  fileSize: number;
  mimeType: 'audio/ogg' | 'audio/mp3' | 'audio/webm';
  codec: 'opus' | 'aac' | 'mp3';
  bitrate: number;
  isPlayed: boolean;
  playbackSpeed: 0.5 | 1.0 | 1.5 | 2.0;
  waveform: number[];
  transcript?: string;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  ▶️  ▂▃▅▇▆▅▃▂  0:15/1:23  🎧  │
│      [волна звука]  ⚡1.5x      │
└─────────────────────────────────┘
```

---

### 1.6 🎥 ВИДЕО-СООБЩЕНИЯ (`video_note`)

**Описание:** Короткие видео-кружочки

**Тип:** `AttachmentType = 'video_note'`  
**Категория:** `media`  
**Доступ:** `free`

**TypeScript интерфейс:**
```typescript
interface VideoNoteAttachment {
  type: 'video_note';
  attachmentId: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  size: number;
  fileSize: number;
  mimeType: 'video/mp4' | 'video/webm';
  codec: 'H.264' | 'VP9';
  fps: number;
  isPlayed: boolean;
  loop: boolean;
  hasAudio: boolean;
  accessInfo: AttachmentAccessInfo;
  createdAt: number;
}
```

**Характеристики:**
| Параметр | Значение |
|----------|----------|
| Макс длительность | 60 секунд |
| Формат | Круг (1:1 aspect ratio) |
| Макс размер | 10 MB |

---

## 🎯 2. ИНТЕРАКТИВНЫЕ ВЛОЖЕНИЯ (4 типа)

### 2.1 🗳️ ОПРОСЫ (`poll`)

**Описание:** Быстрое голосование в чате

**Тип:** `AttachmentType = 'poll'`  
**Категория:** `interactive`  
**Доступ:** `free`

**Возможности:**
- ✅ Один или несколько вариантов
- ✅ Анонимное голосование
- ✅ Текстовый ответ
- ✅ Срок действия
- ✅ Результаты в реальном времени

**UI/UX:**
```
┌─────────────────────────────────┐
│  🗳️ Где проводим встречу?      │
│  ─────────────────────────────  │
│  ☐ Кафе "Пушкин"       45% ████│
│  ☑️ Парк Горького       35% ███ │
│  ☐ Кинотеатр           20% ██  │
│  ─────────────────────────────  │
│  👥 100 голосов • Завершится через 2ч │
└─────────────────────────────────┘
```

---

### 2.2 📝 СПИСКИ (`list`)

**Описание:** Совместные TODO-листы, планы

**Тип:** `AttachmentType = 'list'`  
**Категория:** `interactive`  
**Доступ:** `free`

**Возможности:**
- ✅ Создание элементов
- ✅ Отметка выполнения
- ✅ Прогресс бар (0-100%)
- ✅ Назначение исполнителей
- ✅ Пересортировка

**UI/UX:**
```
┌─────────────────────────────────┐
│  📝 Продукты на ужин           │
│  ─────────────────────────────  │
│  ☑️ Хлеб              (Мария)  │
│  ☐ Молоко           (Иван)    │
│  ☐ Сыр            (Мария)    │
│  ─────────────────────────────  │
│  📊 33% выполнено (1/3)        │
└─────────────────────────────────┘
```

---

### 2.3 📊 АНКЕТЫ (`survey`)

**Описание:** Подробные опросы с разными типами вопросов

**Тип:** `AttachmentType = 'survey'`  
**Категория:** `interactive`  
**Доступ:** `free`

**Типы вопросов:**
- `text` — Короткий текст
- `textarea` — Длинный текст
- `select` — Выпадающий список
- `radio` — Один вариант
- `checkbox` — Несколько вариантов
- `rating` — 1-5 звёзд
- `scale` — 1-10 шкала
- `date` — Дата
- `email` — Email
- `phone` — Телефон

---

### 2.4 🧩 ТЕСТЫ (`quiz`)

**Описание:** Обучающие тесты с оценкой знаний

**Тип:** `AttachmentType = 'quiz'`  
**Категория:** `interactive`  
**Доступ:** `free`

**Возможности:**
- ✅ 6 типов вопросов
- ✅ Баллы за вопрос
- ✅ Таймер
- ✅ Лидерборд
- ✅ Сертификаты

**Типы вопросов:**
- `single-choice` — Один правильный
- `multiple-choice` — Несколько правильных
- `true-false` — Правда/ложь
- `matching` — Соотнесение
- `ordering` — Правильный порядок
- `fill-blank` — Вставить пропуск

---

## 📦 3. КОНТЕНТ-ВЛОЖЕНИЯ (6 типов)

### 3.1 🎬 GIF (`gif`)

**Описание:** GIF-анимации

**Интеграции:** Giphy API, Tenor API, Yandex GIF

---

### 3.2 🏷️ СТИКЕРЫ (`sticker`)

**Описание:** Стикеры и стикерпаки

**Возможности:**
- ✅ Библиотека стикеров
- ✅ Установка паков
- ✅ Премиум стикеры (монетизация)
- ✅ Создание своих стикеров

---

### 3.3 🔗 ПРЕДПРОСМОТР ССЫЛОК (`link_preview`)

**Описание:** Красивые превью ссылок

**Данные:** Open Graph мета-теги (title, description, image)

---

### 3.4 📝 ЗАМЕТКИ (`note`)

**Описание:** Длинные текстовые сообщения

**Форматирование:** Plain text, Markdown, HTML

---

### 3.5 📊 ДИАГРАММЫ (`chart`)

**Описание:** Визуализация данных

**Типы:** pie, bar, line, area, radar, polar, scatter, bubble, gauge, funnel

---

### 3.6 🎵 МУЗЫКА (`music`)

**Описание:** Полноценные музыкальные треки

**Особенности:** ID3 теги, обложки альбомов, текст песни

---

## 💬 4. КОММУНИКАЦИЯ-ВЛОЖЕНИЯ (5 типов)

### 4.1 📍 ГЕОЛОКАЦИЯ (`location`)

**Описание:** Координаты, места, маршруты

**Возможности:**
- ✅ Текущая позиция (GPS)
- ✅ Выбор на карте
- ✅ Поиск мест (POI)
- ✅ Live Location (обновление в реальном времени)

---

### 4.2 👤 КОНТАКТЫ (`contact`)

**Описание:** Визитки, контакты из телефонной книги

**Формат:** vCard 3.0 (.vcf)

---

### 4.3 📅 СОБЫТИЯ (`event`)

**Описание:** Встречи, события, напоминания

**Возможности:**
- ✅ Приглашения
- ✅ RSVP (accepted/declined/maybe)
- ✅ Напоминания
- ✅ Повторяющиеся события
- ✅ .ics экспорт

---

### 4.4 🏷️ УПОМИНАНИЯ (`mention`)

**Описание:** Упоминания пользователей и хэштеги

**Типы:** `user`, `group`, `channel`, `hashtag`

---

### 4.5 📹 ЗАПИСИ ЗВОНКОВ (`call_recording`)

**Описание:** Записи голосовых/видео звонков

**Возможности:**
- ✅ Автоматическая запись
- ✅ Расшифровка (speech-to-text)
- ✅ Поиск по записи

---

## 📊 СРАВНЕНИЕ ВСЕХ БЕСПЛАТНЫХ ВЛОЖЕНИЙ

| # | Тип | Категория | Макс размер | Статус |
|---|-----|-----------|-------------|--------|
| 1 | image | media | 100 MB | ✅ |
| 2 | video | media | 100 MB | ✅ |
| 3 | audio | media | 100 MB | ✅ |
| 4 | file/document | media | 100 MB | ✅ |
| 5 | voice_message | media | 10 MB | ✅ |
| 6 | video_note | media | 10 MB | ✅ |
| 7 | poll | interactive | — | ✅ |
| 8 | list | interactive | — | ✅ |
| 9 | survey | interactive | — | ✅ |
| 10 | quiz | interactive | — | ✅ |
| 11 | gif | content | 10 MB | ✅ |
| 12 | sticker | content | 1 MB | ✅ |
| 13 | link_preview | content | — | ✅ |
| 14 | note | content | 100 KB | ✅ |
| 15 | chart | content | — | ✅ |
| 16 | music | content | 100 MB | ✅ |
| 17 | location | communication | — | ✅ |
| 18 | contact | communication | — | ✅ |
| 19 | event | communication | — | ✅ |
| 20 | mention | communication | — | ✅ |
| 21 | call_recording | communication | 100 MB | ✅ |

---

## 🔧 ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### Загрузка вложения:

```typescript
async function uploadAttachment(
  userId: string,
  file: File,
  type: AttachmentType
): Promise<AttachmentData> {
  
  // 1. Проверяем тип вложения
  const accessInfo = ATTACHMENT_ACCESS_INFO[type];
  
  if (accessInfo.level === 'premium') {
    const user = await getUserById(userId);
    if (!user.isSheikh) {
      throw new PremiumRequiredError(type);
    }
  }
  
  // 2. Проверяем лимиты
  const limits = await getUserLimits(userId);
  if (file.size > limits.free.maxSize) {
    throw new LimitExceededError('maxSize');
  }
  
  // 3. Загружаем файл
  const uploadUrl = await getUploadUrl(type);
  const result = await uploadToStorage(file, uploadUrl);
  
  // 4. Создаём запись вложения
  const attachment = await createAttachment({
    type,
    url: result.url,
    fileSize: file.size,
    mimeType: file.type,
    createdBy: userId,
  });
  
  return attachment;
}
```

---

## 📈 МЕТРИКИ ИСПОЛЬЗОВАНИЯ

```typescript
interface FreeAttachmentsMetrics {
  totalUploads: number;
  uploadsByType: Record<AttachmentType, number>;
  storageUsed: number;
  averageFileSize: number;
  popularTypes: AttachmentType[];
  dailyActiveUsers: number;
}
```

---

## 📄 СВЯЗАННАЯ ДОКУМЕНТАЦИЯ

- [`ATTACHMENTS_OVERVIEW.md`](./ATTACHMENTS_OVERVIEW.md) — Общий обзор
- [`PREMIUM_ATTACHMENTS.md`](./PREMIUM_ATTACHMENTS.md) — Premium вложения
- [`messenger/src/types/attachments.ts`](../../messenger/src/types/attachments.ts) — TypeScript типы

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 2.0.0  
**Статус:** Complete  
**Автор:** NLP-Core-Team

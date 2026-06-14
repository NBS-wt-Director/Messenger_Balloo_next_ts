
---
title: Полный Каталог Вложений Balloo Messenger
description: Исчерпывающее руководство по всем типам вложений — реализованным и планируемым
version: 2.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: complete
audience: both
tags:
  - attachments
  - complete-catalog
  - specification
  - recommendations
related_docs:
  - messenger/src/types/attachments.ts
  - SUMMARY_DOCS/analysis/ATTACHMENTS_ANALYSIS_AND_RECOMMENDATIONS.md
  - SUMMARY_DOCS/analysis/MESSENGER_MAIN_PAGE_ANALYSIS.md
---

# 📎 ПОЛНЫЙ КАТАЛОГ ВЛОЖЕНИЙ BALLOO MESSENGER

**Версия:** 2.0.0  
**Дата:** 2026-06-14  
**Автор:** Koda (NLP-Core-Team)  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР ВСЕХ ТИПОВ ВЛОЖЕНИЙ

```
┌──────────────────────────────────────────────────────────────────┐
│                    ВСЕ ВЛОЖЕНИЯ BALLOO                           │
├──────────────────────────────────────────────────────────────────┤
│  ✅ РЕАЛИЗОВАНО (8 типов)                                        │
│  ├── 📁 МЕДИА (4)                                                │
│  │   ├── 🖼️ Изображения (image)                                 │
│  │   ├── 🎬 Видео (video)                                       │
│  │   ├── 🎵 Аудиофайлы (audio)                                  │
│  │   └── 📄 Документы (file)                                    │
│  ├── 🎯 ИНТЕРАКТИВНЫЕ (4)                                        │
│  │   ├── 🗳️ Опросы (poll)                                       │
│  │   ├── 📝 Списки (list)                                       │
│  │   ├── 📊 Анкеты (survey)                                     │
│  │   └── 🧩 Тесты (quiz)                                        │
├──────────────────────────────────────────────────────────────────┤
│  🚀 РЕКОМЕНДОВАНО (15 типов)                                     │
│  ├── 🔥 КРИТИЧЕСКИЕ (5)                                          │
│  │   ├── 🎤 Голосовые сообщения (voice_message)                 │
│  │   ├── 🎥 Видео-сообщения (video_note)                        │
│  │   ├── 📍 Геолокация (location)                               │
│  │   ├── 👤 Контакты (contact)                                  │
│  │   └── 📅 События (event)                                     │
│  ├── 🟠 ВАЖНЫЕ (5)                                               │
│  │   ├── 🎬 GIF (gif)                                           │
│  │   ├── 🏷️ Стикеры (sticker)                                   │
│  │   ├── 🔗 Предпросмотр ссылок (link_preview)                  │
│  │   ├── 📝 Заметки (note)                                      │
│  │   └── 💰 Переводы (payment)                                  │
│  ├── 🟡 ДОПОЛНИТЕЛЬНЫЕ (5)                                       │
│  │   ├── 📊 Диаграммы (chart)                                   │
│  │   ├── 🎵 Музыка (music)                                      │
│  │   ├── 🎮 Игры (game)                                         │
│  │   ├── 📹 Видеозвонки (call_recording)                        │
│  │   └── 🏷️ Хэштеги/Упоминания (mention)                        │
├──────────────────────────────────────────────────────────────────┤
│  💡 УНИКАЛЬНЫЕ (3 типа)                                          │
│  ├── 🔄 Комбинированные (combined)                               │
│  ├── 👥 Совместные (collaborative)                               │
│  └── ⏰ Исчезающие (expiring)                                    │
├──────────────────────────────────────────────────────────────────┤
│  ИТОГО: 26 типов вложений                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## ЧАСТЬ 1: ✅ РЕАЛИЗОВАННЫЕ ВЛОЖЕНИЯ

### 1.1 📁 МЕДИА-ВЛОЖЕНИЯ

---

#### 1.1.1 🖼️ **ИЗОБРАЖЕНИЯ** (`image`)

**Статус:** ✅ Реализовано

**Тип:** Медиа

**Описание:** Фотографии, скриншоты, изображения

**TypeScript интерфейс:**
```typescript
interface ImageAttachment {
  type: 'image';
  attachmentId: string;
  
  // URLs
  url: string;                    // Полный размер
  thumbnailUrl?: string;          // Превью
  previewUrl?: string;            // Средний размер
  
  // Размеры
  width?: number;
  height?: number;
  fileSize?: number;
  
  // Метаданные
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  caption?: string;               // Подпись
  exif?: {
    camera?: string;
    date?: number;
    location?: { lat: number; lng: number };
  };
  
  // Обработка
  compressed?: boolean;
  optimized?: boolean;
  
  createdAt: number;
  updatedAt: number;
}
```

**Поддерживаемые форматы:**
| Формат | Расширение | Поддержка | Примечание |
|--------|------------|-----------|------------|
| JPEG | .jpg, .jpeg | ✅ | С сжатием |
| PNG | .png | ✅ | Прозрачность |
| GIF | .gif | ✅ | Анимация |
| WebP | .webp | ✅ | Современный |
| BMP | .bmp | ⚠️ | Конвертация |
| TIFF | .tiff | ❌ | Не поддерживается |

**Ограничения:**
- Макс размер файла: **100 MB**
- Макс разрешение: **16384 x 16384 px**
- Авто-сжатие: **Включено** (качество 85%)
- Превью: **Генерируется** (256x256)

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │      [Изображение]        │  │
│  │                           │  │
│  └───────────────────────────┘  │
│  Подпись к фото (если есть)     │
│  📷 1920x1080 • 2.5 MB          │
│  [Скачать] [Открыть] [Вперёд]   │
└─────────────────────────────────┘
```

**Функции:**
- ✅ Загрузка с устройства
- ✅ Съёмка камерой
- ✅ Мульти-выбор (до 10 фото)
- ✅ Обрезка перед отправкой
- ✅ Рисование на фото
- ✅ Текст на фото
- ✅ Сжатие/оптимизация
- ✅ Галерея в чате
- ✅ Зум (pinch-to-zoom)
- ⏸️ Редактор (crop, filters)
- ⏸️ AI-теги (распознавание)

**API:**
```
POST /api/attachments/upload/image
GET  /api/attachments/:id
DELETE /api/attachments/:id
```

---

#### 1.1.2 🎬 **ВИДЕО** (`video`)

**Статус:** ✅ Реализовано

**Тип:** Медиа

**Описание:** Видеоролики, записи экрана, анимации

**TypeScript интерфейс:**
```typescript
interface VideoAttachment {
  type: 'video';
  attachmentId: string;
  
  // URLs
  url: string;                    // Полный файл
  streamingUrl?: string;          // HLS/DASH стриминг
  thumbnailUrl: string;           // Превью кадр
  previewGifUrl?: string;         // GIF превью
  
  // Длительность
  duration: number;               // секунды
  
  // Размеры
  width: number;
  height: number;
  fileSize: number;
  bitrate?: number;               // kbps
  
  // Метаданные
  mimeType: 'video/mp4' | 'video/webm' | 'video/quicktime';
  codec?: string;                 // H.264, VP9
  caption?: string;
  
  // Обработка
  transcoded?: boolean;
  resolutions?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  
  createdAt: number;
  updatedAt: number;
}
```

**Поддерживаемые форматы:**
| Формат | Расширение | Кодек | Поддержка |
|--------|------------|-------|-----------|
| MP4 | .mp4 | H.264 | ✅ Лучший |
| WebM | .webm | VP9 | ✅ |
| MOV | .mov | H.264 | ⚠️ Конвертация |
| AVI | .avi | Разные | ⚠️ Конвертация |
| MKV | .mkv | Разные | ❌ |

**Ограничения:**
- Макс размер файла: **100 MB**
- Макс длительность: **10 минут**
- Макс разрешение: **4K (3840x2160)**
- Авто-транскодинг: **Включен**

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │  ▶️                       │  │
│  │      [Превью кадр]        │  │
│  │  ━━━━━━━━━━━━━━━━ 3:45   │  │
│  └───────────────────────────┘  │
│  Подпись (если есть)            │
│  🎬 1920x1080 • 3:45 • 15 MB    │
│  [Скачать] [Открыть]            │
└─────────────────────────────────┘
```

**Функции:**
- ✅ Загрузка файла
- ✅ Запись камерой
- ✅ Выбор из галереи
- ✅ Превью кадр
- ✅ Видеоплеер (play/pause)
- ✅ Прогресс бар
- ✅ Полноэкранный режим
- ✅ Перемотка
- ⏸️ Стриминг (HLS)
- ⏸️ Адаптивное качество
- ⏸️ Субтитры
- ⏸️ Скорость воспроизведения (0.5x-2x)
- ⏸️ Picture-in-Picture

**API:**
```
POST /api/attachments/upload/video
GET  /api/attachments/:id/stream
POST /api/attachments/:id/transcode
```

---

#### 1.1.3 🎵 **АУДИОФАЙЛЫ** (`audio`)

**Статус:** ✅ Реализовано

**Тип:** Медиа

**Описание:** Музыка, подкасты, звуковые записи

**TypeScript интерфейс:**
```typescript
interface AudioAttachment {
  type: 'audio';
  attachmentId: string;
  
  // URLs
  url: string;
  waveformUrl?: string;           // Визуализация
  
  // Длительность
  duration: number;               // секунды
  
  // Метаданные
  fileSize: number;
  mimeType: 'audio/mpeg' | 'audio/wav' | 'audio/ogg' | 'audio/aac';
  
  // ID3 теги (для музыки)
  metadata?: {
    title?: string;
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    coverArtUrl?: string;
    trackNumber?: number;
  };
  
  caption?: string;
  
  createdAt: number;
  updatedAt: number;
}
```

**Поддерживаемые форматы:**
| Формат | Расширение | Качество | Поддержка |
|--------|------------|----------|-----------|
| MP3 | .mp3 | 128-320 kbps | ✅ |
| WAV | .wav | Lossless | ✅ |
| OGG | .ogg | Variable | ✅ |
| AAC | .aac | 256 kbps | ⚠️ |
| FLAC | .flac | Lossless | ❌ |

**Ограничения:**
- Макс размер файла: **100 MB**
- Макс длительность: **Не ограничено**
- Битрейт: **До 320 kbps**

**UI/UX:**
```
┌─────────────────────────────────┐
│  🎵 Название трека              │
│  👤 Исполнитель                 │
│  ┌───────────────────────────┐  │
│  │  ⏮️  ▶️/⏸️  ⏭️  🔁  🔀   │  │
│  │  ━━━━━━━━━━━━━━━ 2:35/3:45│  │
│  └───────────────────────────┘  │
│  🎵 3:45 • 8 MB                 │
│  [Скачать] [Текст песни]        │
└─────────────────────────────────┘
```

**Функции:**
- ✅ Загрузка файла
- ✅ Аудиоплеер
- ✅ Play/Pause
- ✅ Перемотка
- ✅ Прогресс
- ⏸️ Визуализация (waveform)
- ⏸️ Эквалайзер
- ⏸️ Плейлисты
- ⏸️ Фоновое воспроизведение
- ⏸️ Текст песни (синхронизированный)

**API:**
```
POST /api/attachments/upload/audio
GET  /api/attachments/:id/stream
GET  /api/attachments/:id/metadata
```

---

#### 1.1.4 📄 **ДОКУМЕНТЫ** (`file`)

**Статус:** ✅ Реализовано

**Тип:** Медиа

**Описание:** Файлы любого типа

**TypeScript интерфейс:**
```typescript
interface FileAttachment {
  type: 'file' | 'document';
  attachmentId: string;
  
  // URLs
  url: string;
  previewUrl?: string;            // Для PDF
  
  // Метаданные
  fileName: string;
  fileSize: number;
  mimeType: string;               // Полный MIME type
  extension: string;              // .pdf, .docx
  
  // Категория
  category: 'document' | 'spreadsheet' | 'presentation' | 
            'archive' | 'ebook' | 'other';
  
  // Для PDF
  pageCount?: number;
  
  caption?: string;
  
  // Безопасность
  virusScanStatus?: 'pending' | 'clean' | 'infected';
  scannedAt?: number;
  
  createdAt: number;
  updatedAt: number;
}
```

**Поддерживаемые форматы:**
| Категория | Форматы | Поддержка |
|-----------|---------|-----------|
| **Документы** | PDF, DOC, DOCX, ODT, RTF, TXT | ✅ |
| **Таблицы** | XLS, XLSX, ODS, CSV | ✅ |
| **Презентации** | PPT, PPTX, ODP, KEY | ✅ |
| **Архивы** | ZIP, RAR, 7Z, TAR, GZ | ✅ |
| **E-books** | EPUB, FB2, MOBI | ⚠️ |
| **Код** | JS, TS, PY, Java, C++, etc | ✅ |
| **Другие** | Любые файлы | ✅ |

**Ограничения:**
- Макс размер файла: **100 MB**
- Антивирусная проверка: **Рекомендуется**

**UI/UX:**
```
┌─────────────────────────────────┐
│  📄 Отчёт_2026.pdf              │
│  ┌───────────────────────────┐  │
│  │  [Превью первой страницы] │  │
│  └───────────────────────────┘  │
│  📄 PDF • 2.3 MB • 15 страниц   │
│  [Скачать] [Открыть] [Предпросмотр] │
└─────────────────────────────────┘
```

**Функции:**
- ✅ Загрузка файла
- ✅ Определение типа по MIME
- ✅ Иконки по типу
- ✅ Предпросмотр PDF
- ✅ Скачивание
- ✅ Переименование
- ⏸️ Предпросмотр Office
- ⏸️ Конвертация форматов
- ⏸️ Антивирус
- ⏸️ OCR (распознавание текста)

**API:**
```
POST /api/attachments/upload/file
GET  /api/attachments/:id/download
GET  /api/attachments/:id/preview
POST /api/attachments/:id/scan
```

---

### 1.2 🎯 ИНТЕРАКТИВНЫЕ ВЛОЖЕНИЯ

---

#### 1.2.1 🗳️ **ОПРОСЫ** (`poll`)

**Статус:** ✅ Реализовано

**Тип:** Интерактивное

**Описание:** Быстрое голосование в чате

**Полный TypeScript интерфейс:**
```typescript
interface PollAttachment {
  type: 'poll';
  pollId: string;
  
  // Контент
  question: string;               // Вопрос
  description?: string;           // Описание
  options: PollOption[];          // Варианты
  
  // Настройки
  settings: PollSettings;
  
  // Результаты
  results: PollResults;
  
  // Ответ пользователя
  userResponse?: UserPollResponse;
  
  // Метаданные
  createdBy: string;              // userId
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  closedAt?: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  userVoted?: boolean;
  color?: string;                 // Цвет для визуализации
  order: number;
}

interface PollSettings {
  allowTextResponse: boolean;     // Текстовый ответ
  multipleChoice: boolean;        // Несколько вариантов
  isAnonymous: boolean;           // Анонимность
  expiresAt?: number;             // Срок действия
  maxVotes?: number;              // Максимум выборов
  showResultsBeforeVote: boolean; // Показывать до голосования
  allowChangeVote: boolean;       // Можно изменить голос
}

interface PollResults {
  totalVotes: number;
  uniqueVoters: string[];
  voteDistribution: Record<string, number>;
  completedAt?: number;
  topOption?: string;
}

interface UserPollResponse {
  optionIds: string[];
  textResponse?: string;
  votedAt: number;
  canChange: boolean;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Один вариант | ✅ | Классический poll |
| Несколько вариантов | ✅ | multipleChoice |
| Анонимность | ✅ | isAnonymous |
| Текстовый ответ | ✅ | allowTextResponse |
| Срок действия | ✅ | expiresAt |
| Результаты real-time | ✅ | WebSocket |
| Изменение голоса | ✅ | allowChangeVote |
| Экспорт результатов | ❌ | Не реализовано |
| Графики | ⏸️ | Визуализация |

**UI/UX:**
```
┌─────────────────────────────────┐
│  🗳️ Где проводим встречу?      │
│  ─────────────────────────────  │
│  ☐ Кафе "Пушкин"       45% ████│
│  ☑️ Парк Горького       35% ███ │
│  ☐ Кинотеатр           20% ██  │
│  ─────────────────────────────  │
│  💬 Ваш вариант: [_______]     │
│  [Голосовать]                  │
│  👥 100 голосов • Завершится через 2ч │
└─────────────────────────────────┘
```

**Use Cases:**
- Выбор места/времени встречи
- Голосование за идею
- Мнение сообщества
- Быстрые решения

**API:**
```
POST /api/polls/create
POST /api/polls/:id/vote
GET  /api/polls/:id/results
DELETE /api/polls/:id
```

---

#### 1.2.2 📝 **СПИСКИ** (`list`)

**Статус:** ✅ Реализовано

**Тип:** Интерактивное

**Описание:** Совместные TODO-листы, планы

**Полный TypeScript интерфейс:**
```typescript
interface ListAttachment {
  type: 'list';
  listId: string;
  
  // Контент
  title: string;
  description?: string;
  items: ListItem[];
  
  // Настройки
  settings: ListSettings;
  
  // Прогресс
  progress: ListProgress;
  
  // Метаданные
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
}

interface ListItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  completedBy?: string[];       // Кто выполнил
  completedAt?: number;
  assignedTo?: string;          // Назначено
  dueDate?: number;             // Дедлайн
  priority: 'low' | 'medium' | 'high';
  order: number;
  parentId?: string;            // Подзадача
  tags?: string[];
}

interface ListSettings {
  allowMultipleCompletion: boolean;
  requireAllItems: boolean;
  allowReordering: boolean;
  notifyOnComplete: boolean;
  allowComments: boolean;
  showProgress: boolean;
}

interface ListProgress {
  totalItems: number;
  completedItems: number;
  progress: number;             // 0-100%
  completedBy: Record<string, number>;
  lastCompletedAt?: number;
  estimatedCompletion?: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Создание элементов | ✅ | Добавление задач |
| Отметка выполнения | ✅ | Checkbox |
| Прогресс бар | ✅ | 0-100% |
| Назначение | ✅ | assignedTo |
| Кто выполнил | ✅ | completedBy[] |
| Пересортировка | ✅ | Drag & drop |
| Уведомления | ✅ | notifyOnComplete |
| Дедлайны | ❌ | dueDate |
| Подзадачи | ❌ | parentId |
| Приоритеты | ⏸️ | priority |
| Комментарии | ⏸️ | allowComments |

**UI/UX:**
```
┌─────────────────────────────────┐
│  📝 Продукты на ужин           │
│  ─────────────────────────────  │
│  ☑️ Хлеб              (Мария)  │
│  ☐ Молоко           (Иван)    │
│  ☐ Сыр            (Мария)    │
│  ☐ Фрукты                      │
│  ─────────────────────────────  │
│  📊 25% выполнено (1/4)        │
│  [+ Добавить] [Редактировать]  │
└─────────────────────────────────┘
```

**Use Cases:**
- Совместные покупки
- План поездки
- Задачи на неделю
- План мероприятия

**API:**
```
POST /api/lists/create
POST /api/lists/:id/items
PATCH /api/lists/:id/items/:itemId
DELETE /api/lists/:id/items/:itemId
GET  /api/lists/:id/progress
```

---

#### 1.2.3 📊 **АНКЕТЫ** (`survey`)

**Статус:** ✅ Реализовано

**Тип:** Интерактивное

**Описание:** Подробные опросы с разными типами вопросов

**Полный TypeScript интерфейс:**
```typescript
interface SurveyAttachment {
  type: 'survey';
  surveyId: string;
  
  // Контент
  title: string;
  description?: string;
  sections: SurveySection[];
  
  // Настройки
  settings: SurveySettings;
  
  // Результаты
  results?: SurveyResults;
  
  // Ответ пользователя
  userSubmission?: UserSurveySubmission;
  
  // Метаданные
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
}

interface SurveySection {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  order: number;
}

interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  placeholder?: string;
  options?: SurveyOption[];
  required: boolean;
  order: number;
  validation?: QuestionValidation;
  otherOption?: boolean;       // Вариант "Другое"
}

type SurveyQuestionType = 
  | 'text'        // Короткий текст
  | 'textarea'    // Длинный текст
  | 'select'      // Выпадающий список
  | 'radio'       // Один вариант
  | 'checkbox'    // Несколько вариантов
  | 'rating'      // 1-5 звёзд
  | 'scale'       // 1-10 шкала
  | 'date'        // Дата
  | 'email'       // Email
  | 'phone';      // Телефон

interface SurveyOption {
  id: string;
  text: string;
  value?: string;
  image?: string;
  order: number;
}

interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;         // Regex
  min?: number;
  max?: number;
  customError?: string;
}

interface SurveySettings {
  allowMultipleSubmissions: boolean;
  showResultsAfterSubmit: boolean;
  requireAllQuestions: boolean;
  anonymous: boolean;
  expiresAt?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showProgressBar: boolean;
  allowSaveDraft: boolean;
}

interface SurveyResults {
  totalSubmissions: number;
  uniqueRespondents: string[];
  completedAt?: number;
  questionResults: QuestionResults[];
  averageCompletionTime: number;
}

interface QuestionResults {
  questionId: string;
  responses: number;
  averageRating?: number;
  optionBreakdown?: Record<string, number>;
  textResponses?: string[];
}

interface UserSurveySubmission {
  answers: SurveyAnswer[];
  submittedAt: number;
  duration?: number;      // Время заполнения
  deviceId?: string;
}

interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
  text?: string;          // Для "Другое"
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| 9 типов вопросов | ✅ | text, textarea, select, radio, checkbox, rating, scale, date, email |
| Секции | ✅ | Группировка |
| Валидация | ✅ | min/max, regex |
| Обязательные | ✅ | required |
| Анонимность | ✅ | anonymous |
| Несколько попыток | ✅ | allowMultipleSubmissions |
| Перемешивание | ✅ | shuffle |
| Прогресс бар | ✅ | showProgressBar |
| Сохранение черновика | ⏸️ | allowSaveDraft |
| Логика (if-then) | ❌ | Не реализовано |
| Файлы в ответах | ❌ | Не реализовано |

**UI/UX:**
```
┌─────────────────────────────────┐
│  📊 Обратная связь о продукте  │
│  ─────────────────────────────  │
│  Раздел 1/3: Общее впечатление │
│  ─────────────────────────────  │
│  1. Оцените качество (1-5)     │
│     ⭐⭐⭐⭐☆                    │
│  2. Что понравилось?           │
│     [Текстовое поле...]        │
│  3. Рекомендуете друзьям?      │
│     ☐ Да  ☐ Нет  ☐ Не уверен  │
│  ─────────────────────────────  │
│  [← Назад] [Далее →]           │
│  ⏱️ ~5 минут • 3 вопроса       │
└─────────────────────────────────┘
```

**Use Cases:**
- Обратная связь о продукте
- Регистрация на события
- Опросы удовлетворённости (NPS)
- Исследования рынка

**API:**
```
POST /api/surveys/create
POST /api/surveys/:id/submit
GET  /api/surveys/:id/results
GET  /api/surveys/:id/export
```

---

#### 1.2.4 🧩 **ТЕСТЫ** (`quiz`)

**Статус:** ✅ Реализовано

**Тип:** Интерактивное

**Описание:** Обучающие тесты с оценкой знаний

**Полный TypeScript интерфейс:**
```typescript
interface QuizAttachment {
  type: 'quiz';
  quizId: string;
  
  // Контент
  title: string;
  description?: string;
  questions: QuizQuestion[];
  
  // Настройки
  settings: QuizSettings;
  
  // Результаты
  results: QuizResults;
  
  // Попытка пользователя
  userAttempt?: UserQuizAttempt;
  
  // Метаданные
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  publishedAt?: number;
}

interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptions: string[];     // Правильные ответы
  explanation?: string;         // Пояснение
  points: number;               // Баллы за вопрос
  order: number;
  mediaUrl?: string;            // Картинка/аудио к вопросу
  mediaType?: 'image' | 'audio' | 'video';
}

type QuizQuestionType = 
  | 'single-choice'     // Один правильный
  | 'multiple-choice'   // Несколько правильных
  | 'true-false'        // Правда/ложь
  | 'matching'          // Соотнесение
  | 'ordering'          // Правильный порядок
  | 'fill-blank';       // Вставить пропуск

interface QuizOption {
  id: string;
  text: string;
  image?: string;
  order: number;
}

interface QuizSettings {
  passingScore: number;         // Проходной балл (%)
  maxAttempts: number;          // Максимум попыток
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer?: number;               // Таймер (секунды)
  randomizeCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  allowReview: boolean;         // Просмотр после теста
  certificateEnabled: boolean;  // Сертификат
}

interface QuizResults {
  totalAttempts: number;
  uniqueTakers: string[];
  averageScore: number;
  passRate: number;             // % сдавших
  averageTime: number;          // Среднее время
  completedAt?: number;
  leaderboard?: QuizLeaderboardEntry[];
}

interface UserQuizAttempt {
  attemptId: string;
  answers: QuizAnswer[];
  score: number;                // Набранные баллы
  maxScore: number;             // Максимум баллов
  percentage: number;           // %
  correctCount: number;
  totalCount: number;
  passed: boolean;
  attemptedAt: number;
  duration?: number;            // Время прохождения
  attemptNumber: number;
  reviewAvailable: boolean;
  certificateUrl?: string;
}

interface QuizAnswer {
  questionId: string;
  optionIds: string[];
  isCorrect: boolean;
  points: number;
  userExplanation?: string;
}

interface QuizLeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  duration: number;
  attemptDate: number;
  rank: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| 6 типов вопросов | ✅ | single, multiple, true-false, matching, ordering, fill-blank |
| Баллы | ✅ | points за вопрос |
| Проходной балл | ✅ | passingScore % |
| Таймер | ✅ | timer секунды |
| Попытки | ✅ | maxAttempts |
| Пояснения | ✅ | explanation |
| Перемешивание | ✅ | questions, options |
| Лидерборд | ⏸️ | leaderboard |
| Сертификаты | ❌ | certificateEnabled |
| Медиа в вопросах | ⏸️ | image/audio/video |

**UI/UX:**
```
┌─────────────────────────────────┐
│  🧩 Проверка знаний ПДД        │
│  ─────────────────────────────  │
│  Вопрос 5/20 • ⏱️ 15:30        │
│  ─────────────────────────────  │
│  Что означает этот знак?       │
│  ┌───────────────────────────┐  │
│  │     [Изображение знака]   │  │
│  └───────────────────────────┘  │
│  ☐ Главная дорога              │
│  ☑️ Пересечение с круговым    │
│  ☐ Въезд запрещён             │
│  ─────────────────────────────  │
│  [← Назад] [Далее →]           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  ✅ Тест завершён!              │
│  ─────────────────────────────  │
│  Ваш результат: 18/20 (90%)    │
│  ✅ ПРОЙДЕНО (порог 80%)       │
│  ─────────────────────────────  │
│  ⏱️ Время: 12:34               │
│  🏆 Топ-10: Вы на 3 месте      │
│  [Посмотреть ошибки]           │
│  [Поделиться результатом]      │
│  [📜 Получить сертификат]      │
└─────────────────────────────────┘
```

**Use Cases:**
- Обучение сотрудников
- Проверка знаний
- Викторины в чате
- Сертификаты

**API:**
```
POST /api/quizzes/create
POST /api/quizzes/:id/attempt
GET  /api/quizzes/:id/results
GET  /api/quizzes/:id/leaderboard
POST /api/quizzes/:id/certificate
```

---

## ЧАСТЬ 2: 🚀 РЕКОМЕНДОВАННЫЕ ВЛОЖЕНИЯ

### 2.1 🔥 КРИТИЧЕСКИЕ (добавить в первую очередь)

---

#### 2.1.1 🎤 **ГОЛОСОВЫЕ СООБЩЕНИЯ** (`voice_message`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🔴 КРИТИЧЕСКИЙ

**Тип:** Медиа

**Описание:** Быстрые голосовые заметки

**TypeScript интерфейс:**
```typescript
interface VoiceMessageAttachment {
  type: 'voice_message';
  attachmentId: string;
  
  // URLs
  url: string;
  waveformUrl?: string;         // Визуализация волны
  
  // Длительность
  duration: number;             // секунды
  
  // Метаданные
  fileSize: number;
  mimeType: 'audio/ogg' | 'audio/mp3' | 'audio/webm';
  codec: 'opus' | 'aac' | 'mp3';
  bitrate: number;              // kbps
  
  // Воспроизведение
  isPlayed: boolean;
  playbackSpeed: 0.5 | 1.0 | 1.5 | 2.0;
  listenedUntil?: number;       // До какой секунды прослушано
  
  // Расшифровка
  transcript?: string;          // Speech-to-text
  transcriptLanguage?: string;
  transcriptConfidence?: number;
  
  // Визуализация
  waveform: number[];           // 50-100 точек амплитуды
  
  caption?: string;
  
  createdAt: number;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  ▶️  ▂▃▅▇▆▅▃▂  0:15/1:23  🎧  │
│      [волна звука]  ⚡1.5x      │
│  [1x] [⏮️] [▶️/⏸️] [⏭️] [1.5x] │
└─────────────────────────────────┘
```

**Функции:**
| Функция | Приоритет | Описание |
|---------|-----------|----------|
| Запись кнопкой | 🔴 | Удержание для записи |
| Визуализация волны | 🔴 | Real-time waveform |
| Отмена свайпом | 🔴 | Свайп вверх для отмены |
| Регулировка скорости | 🟠 | 0.5x - 2x |
| Автовоспроизведение | 🟠 | Следующее после текущего |
| Фон. воспроизведение | 🟠 | В фоне приложения |
| Расшифровка AI | 🟡 | Speech-to-text |
| Избранное | 🟡 | Сохранение важных |
| Экспорт | 🟡 | Поделиться файлом |

**Техническая реализация:**
```typescript
// Запись
const mediaRecorder = new MediaRecorder(
  await navigator.mediaDevices.getUserMedia({ audio: true }),
  { mimeType: 'audio/webm;codecs=opus' }
);

// Визуализация
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
// Рисование на canvas
```

**Оценка сложности:** 🟠 Средняя (2-3 дня)

**Почему критично:** 
- 40% пользователей предпочитают голосовые тексту
- Быстрее набора
- Эмоциональнее
- Hands-free

---

#### 2.1.2 🎥 **ВИДЕО-СООБЩЕНИЯ** (`video_note`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🔴 КРИТИЧЕСКИЙ

**Тип:** Медиа

**Описание:** Короткие видео-кружочки (как в Telegram)

**TypeScript интерфейс:**
```typescript
interface VideoNoteAttachment {
  type: 'video_note';
  attachmentId: string;
  
  // URLs
  url: string;
  thumbnailUrl: string;
  gifPreviewUrl?: string;
  
  // Длительность
  duration: number;             // секунды (макс 60)
  
  // Размеры
  size: number;                 // Всегда квадрат
  fileSize: number;
  
  // Метаданные
  mimeType: 'video/mp4' | 'video/webm';
  codec: 'H.264' | 'VP9';
  fps: number;                  // 30
  
  // Воспроизведение
  isPlayed: boolean;
  watchedUntil?: number;
  loop: boolean;                // Зацикливание
  
  // Аудио
  hasAudio: boolean;
  muted?: boolean;
  
  createdAt: number;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │  ┌─────────────────┐      │  │
│  │  │                 │      │  │
│  │  │   [Кружочек]    │  ▶️  │  │
│  │  │                 │      │  │
│  │  └─────────────────┘      │  │
│  │         0:15              │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Функции:**
| Функция | Приоритет | Описание |
|---------|-----------|----------|
| Запись камерой | 🔴 | Фронтальная камера |
| Круглый формат | 🔴 | 1:1 aspect ratio |
| Макс 60 секунд | 🔴 | Ограничение |
| Зацикливание | 🟠 | Loop playback |
| Без звука | 🟠 | Muted option |
| Превью GIF | 🟡 | Для быстрого просмотра |

**Оценка сложности:** 🟠 Средняя (3-4 дня)

---

#### 2.1.3 📍 **ГЕОЛОКАЦИЯ** (`location`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🔴 КРИТИЧЕСКИЙ

**Тип:** Медиа

**Описание:** Координаты, места, маршруты

**TypeScript интерфейс:**
```typescript
interface LocationAttachment {
  type: 'location';
  attachmentId: string;
  
  // Координаты
  latitude: number;
  longitude: number;
  accuracy?: number;            // метры
  
  // Информация о месте
  name?: string;                // Название
  address?: string;             // Полный адрес
  venue?: string;               // Заведение
  category?: string;            // "restaurant", "park", etc.
  
  // Карта
  staticMapUrl?: string;        // Превью
  zoomLevel?: number;
  
  // provider
  provider: 'google' | 'yandex' | 'osm' | '2gis';
  placeId?: string;
  
  // Дополнительно
  rating?: number;              // ⭐ 4.5
  priceLevel?: 1 | 2 | 3 | 4;   // $ - $$$$
  openingHours?: string;        // "Открыто до 23:00"
  phoneNumber?: string;
  website?: string;
  
  // Для live location
  isLive?: boolean;
  expiresAt?: number;
  updateInterval?: number;
  
  caption?: string;
  
  createdAt: number;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  📍 Кафе "Пушкин"               │
│  ┌───────────────────────────┐  │
│  │  [Статичная карта]        │  │
│  │        📍                 │  │
│  └───────────────────────────┘  │
│  ул. Тверская, 12, Москва       │
│  ⭐ 4.5  🕐 Открыто до 23:00    │
│  ☎️ +7 495 123-45-67           │
│  [Маршрут] [Позвонить] [Сайт]  │
└─────────────────────────────────┘
```

**Функции:**
| Функция | Приоритет | Описание |
|---------|-----------|----------|
| Текущая позиция | 🔴 | GPS координаты |
| Выбор на карте | 🔴 | Pin drop |
| Поиск мест | 🔴 | POI search |
| Превью карты | 🟠 | Static map |
| Адрес | 🟠 | Гекодинг |
| Live Location | 🟡 | Обновление в реальном времени |
| Маршрут | 🟡 | Интеграция с навигатором |
| Поделиться ETA | 🟡 | "Буду через 15 мин" |

**Оценка сложности:** 🟠 Средняя (2-3 дня)

---

#### 2.1.4 👤 **КОНТАКТЫ** (`contact`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🔴 КРИТИЧЕСКИЙ

**Тип:** Медиа

**Описание:** Визитки, контакты из телефонной книги

**TypeScript интерфейс:**
```typescript
interface ContactAttachment {
  type: 'contact';
  attachmentId: string;
  
  // Основная информация
  firstName: string;
  lastName?: string;
  displayName: string;
  middleName?: string;
  
  // Контакты
  phoneNumbers: ContactPhone[];
  emails: ContactEmail[];
  
  // Дополнительно
  avatar?: string;
  organization?: string;
  jobTitle?: string;
  department?: string;
  
  // Адреса
  addresses: ContactAddress[];
  
  // Соцсети
  socialProfiles: ContactSocial[];
  
  // URLs
  websites: string[];
  
  // Заметки
  notes?: string;
  
  // vCard
  vcard?: string;               // Полный vCard 3.0
  
  // Источник
  source: 'phonebook' | 'manual' | 'import';
  
  createdAt: number;
}

interface ContactPhone {
  number: string;
  type: 'mobile' | 'home' | 'work' | 'main' | 'other';
  label?: string;
  isPrimary?: boolean;
}

interface ContactEmail {
  email: string;
  type: 'personal' | 'work' | 'other';
  label?: string;
  isPrimary?: boolean;
}

interface ContactAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  type: 'home' | 'work' | 'other';
}

interface ContactSocial {
  platform: 'telegram' | 'whatsapp' | 'vk' | 'facebook' | 'instagram' | 'linkedin';
  username?: string;
  url?: string;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  👤 Иван Петров                 │
│  ┌───────────────────────────┐  │
│  │     [Фото контакта]       │  │
│  └───────────────────────────┘  │
│  📱 +7 999 123-45-67 (моб.)    │
│  📧 ivan@example.com           │
│  🏢 ООО "Ромашка" • Менеджер   │
│  ─────────────────────────────  │
│  [Сохранить] [Позвонить]       │
│  [Написать] [Поделиться]       │
└─────────────────────────────────┘
```

**Функции:**
| Функция | Приоритет | Описание |
|---------|-----------|----------|
| Экспорт из книги | 🔴 | Phonebook access |
| Импорт в книгу | 🔴 | Save to contacts |
| vCard формат | 🔴 | .vcf экспорт/импорт |
| Несколько номеров | 🟠 | mobile, work, home |
| Фото контакта | 🟠 | Avatar |
| Организация | 🟠 | Company info |
| Соцсети | 🟡 | Profiles links |
| QR-код контакта | 🟡 | Share via QR |

**Оценка сложности:** 🟢 Низкая (1-2 дня)

---

#### 2.1.5 📅 **СОБЫТИЯ КАЛЕНДАРЯ** (`event`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🔴 КРИТИЧЕСКИЙ

**Тип:** Интерактивное

**Описание:** Встречи, события, напоминания

**Полный TypeScript интерфейс:**
```typescript
interface EventAttachment {
  type: 'event';
  attachmentId: string;
  
  // Основная информация
  eventId: string;
  title: string;
  description?: string;
  
  // Время
  startTime: number;            // timestamp
  endTime: number;
  timezone: string;             // "Europe/Moscow"
  allDay: boolean;
  
  // Место
  location?: string;
  locationAddress?: string;
  locationCoords?: { lat: number; lng: number };
  onlineMeetingUrl?: string;    // Zoom/Skype link
  
  // Организатор и участники
  organizer: string;            // userId
  attendees: EventAttendee[];
  
  // Напоминания
  reminders: EventReminder[];
  
  // Повторение
  recurrence?: EventRecurrence;
  
  // Статус
  status: 'confirmed' | 'tentative' | 'cancelled';
  visibility: 'public' | 'private' | 'default';
  
  // Вложения
  attachments?: string[];       // attachmentIds
  
  // URL
  icsUrl?: string;              // iCalendar файл
  calendarUrl?: string;         // Google/Yandex Calendar link
  
  // Метаданные
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface EventAttendee {
  userId: string;
  email?: string;
  name?: string;
  status: 'pending' | 'accepted' | 'declined' | 'maybe';
  respondedAt?: number;
  isOrganizer: boolean;
  canEdit?: boolean;
}

interface EventReminder {
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
  customMessage?: string;
}

interface EventRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;             // Каждые N дней/недель
  count?: number;               // Количество повторений
  until?: number;               // До даты
  byDay?: string[];             // ['MO', 'WE', 'FR']
  byMonthDay?: number[];        // [1, 15]
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  📅 Командная встреча           │
│  ─────────────────────────────  │
│  🗓️ Пн, 25 июня 2026           │
│  🕐 15:00 - 16:00 (MSK)        │
│  📍 Переговорная №3 / Zoom     │
│  ─────────────────────────────  │
│  👥 Организатор: Иван          │
│  ✅ Вы • ⏳ Мария • ❌ Петр    │
│  🔔 Напоминание: за 15 минут   │
│  🔁 Повтор: каждый Пн          │
│  ─────────────────────────────  │
│  [Принять] [Отклонить] [Maybe] │
│  [Добавить в календарь]        │
└─────────────────────────────────┘
```

**Функции:**
| Функция | Приоритет | Описание |
|---------|-----------|----------|
| Создание события | 🔴 | Event creation |
| Приглашения | 🔴 | Invite attendees |
| RSVP | 🔴 | accepted/declined/maybe |
| Напоминания | 🔴 | Notifications |
| Повторения | 🟠 | Recurring events |
| .ics экспорт | 🟠 | iCalendar формат |
| Онлайн-встречи | 🟠 | Auto Zoom link |
| Синхронизация | 🟡 | Google/Yandex Calendar |
| Групповые события | 🟡 | Для всего чата |

**Оценка сложности:** 🟡 Высокая (4-5 дней)

---

### 2.2 🟠 ВАЖНЫЕ ВЛОЖЕНИЯ

---

#### 2.2.1 🎬 **GIF-АНИМАЦИИ** (`gif`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟠 Высокий

**TypeScript интерфейс:**
```typescript
interface GifAttachment {
  type: 'gif';
  attachmentId: string;
  
  // URLs
  url: string;                  // Original
  previewUrl: string;           // Low-res
  stillUrl?: string;            // Static frame
  
  // Размеры
  width: number;
  height: number;
  fileSize: number;
  
  // Метаданные
  frames?: number;
  duration?: number;            // секунды
  fps?: number;
  
  // Источник
  provider: 'giphy' | 'tenor' | 'yandex';
  gifId: string;
  
  // Контент
  title?: string;
  tags: string[];
  rating: 'g' | 'pg' | 'pg-13' | 'r';
  
  createdAt: number;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  [GIF: Смешной кот]             │
│  ┌───────────────────────────┐  │
│  │  ┌─────────────────┐      │  │
│  │  │  [GIF playing]  │      │  │
│  │  └─────────────────┘      │  │
│  └───────────────────────────┘  │
│  🔖 #кот #смешно #реакция       │
└─────────────────────────────────┘
```

**Интеграции:**
- Giphy API
- Tenor API
- Yandex GIF search

**Оценка сложности:** 🟢 Низкая (1 день)

---

#### 2.2.2 🏷️ **СТИКЕРЫ** (`sticker`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟠 Высокий

**TypeScript интерфейс:**
```typescript
interface StickerAttachment {
  type: 'sticker';
  attachmentId: string;
  
  // Стикеры
  stickerId: string;
  packId: string;
  
  // URLs
  url: string;                  // WebP/APNG
  thumbnailUrl?: string;
  
  // Размеры
  width: number;
  height: number;
  fileSize: number;
  
  // Метаданные
  emoji?: string;               // Ассоциированный emoji
  isAnimated: boolean;
  isPremium: boolean;
  tags?: string[];
  
  // Пак
  pack: StickerPack;
  
  createdAt: number;
}

interface StickerPack {
  id: string;
  name: string;
  author: string;
  stickers: Sticker[];
  coverUrl: string;
  isInstalled: boolean;
  isFree: boolean;
  price?: number;
  stickerCount: number;
}
```

**Функции:**
- ✅ Библиотека стикеров
- ✅ Установка паков
- ✅ Премиум стикеры (монетизация!)
- ✅ Создание своих стикеров
- ⏸️ Анимированные стикеры
- ⏸️ Звуковые стикеры

**Оценка сложности:** 🟡 Высокая (5-7 дней)

---

#### 2.2.3 🔗 **ПРЕДПРОСМОТР ССЫЛОК** (`link_preview`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟠 Высокий

**TypeScript интерфейс:**
```typescript
interface LinkPreviewAttachment {
  type: 'link_preview';
  attachmentId: string;
  
  // URL
  url: string;
  canonicalUrl?: string;
  
  // Meta tags (Open Graph)
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName?: string;
  type: 'article' | 'video' | 'music' | 'product' | 'website';
  
  // Favicon
  favicon?: string;
  
  // Для видео
  videoUrl?: string;
  videoDuration?: number;
  videoThumbnail?: string;
  
  // Для музыки
  audioUrl?: string;
  artist?: string;
  album?: string;
  
  // Для товаров
  price?: number;
  currency?: string;
  inStock?: boolean;
  rating?: number;
  
  // Scraping
  fetchedAt: number;
  expiresAt: number;
  cacheKey: string;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │  [Картинка статьи]        │  │
│  │                           │  │
│  │  Заголовок статьи         │  │
│  │  Краткое описание...      │  │
│  │  🌐 example.com           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Оценка сложности:** 🟠 Средняя (2-3 дня, нужен scraper)

---

#### 2.2.4 📝 **ЗАМЕТКИ** (`note`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟠 Высокий

**TypeScript интерфейс:**
```typescript
interface NoteAttachment {
  type: 'note';
  attachmentId: string;
  
  // Контент
  noteId: string;
  title: string;
  content: string;              // Markdown
  preview: string;              // Первые 200 символов
  
  // Форматирование
  formatting: 'plain' | 'markdown' | 'html';
  
  // Статистика
  wordCount: number;
  charCount: number;
  readTime: number;             // минут
  
  // Вложения в заметке
  attachments?: string[];
  
  // Метаданные
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
  
  // Версии
  version: number;
  history?: NoteVersion[];
}

interface NoteVersion {
  version: number;
  content: string;
  editedAt: number;
  editedBy: string;
  changes?: string;
}
```

**UI/UX:**
```
┌─────────────────────────────────┐
│  📝 Как организовать работу     │
│  ─────────────────────────────  │
│  1. Используйте списки задач... │
│  2. Проводите ежедневные...    │
│  3. ...                         │
│  ─────────────────────────────  │
│  ⏱️ 5 мин • ✍️ 1200 слов       │
│  [Читать полностью]             │
└─────────────────────────────────┘
```

**Оценка сложности:** 🟢 Низкая (1-2 дня)

---

#### 2.2.5 💰 **ПЕРЕВОДЫ** (`payment`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟠 Высокий

**TypeScript интерфейс:**
```typescript
interface PaymentAttachment {
  type: 'payment';
  attachmentId: string;
  
  // Платёж
  paymentId: string;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR' | 'KZT';
  
  // Стороны
  sender: string;               // userId
  recipient: string;            // userId
  
  // Статус
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Метод
  paymentMethod: 'card' | 'balance' | 'sbp' | 'yandex';
  
  // Детали
  message?: string;             // Комментарий
  transactionId?: string;       // ID транзакции
  
  // Комиссия
  fee?: number;
  feePayer: 'sender' | 'recipient';
  
  // Временные метки
  createdAt: number;
  completedAt?: number;
  
  // Чек
  receiptUrl?: string;
}
```

**Интеграции:**
- СБП (Система Быстрых Платежей)
- Яндекс.Деньги
- Тинькофф Касса
- Внутренний баланс Balloo

**Оценка сложности:** 🔴 Очень высокая (юридические требования)

---

### 2.3 🟡 ДОПОЛНИТЕЛЬНЫЕ ВЛОЖЕНИЯ

---

#### 2.3.1 📊 **ДИАГРАММЫ** (`chart`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**TypeScript интерфейс:**
```typescript
interface ChartAttachment {
  type: 'chart';
  attachmentId: string;
  
  // Контент
  chartId: string;
  chartType: ChartType;
  title: string;
  description?: string;
  
  // Данные
  data: ChartData;
  
  // Настройки
  options: ChartOptions;
  
  // Визуализация
  imageUrl?: string;            // Превью
  interactiveUrl?: string;      // HTML для интерактива
  
  // Метаданные
  createdBy: string;
  createdAt: number;
}

type ChartType = 
  | 'pie' | 'doughnut'      // Круговые
  | 'bar' | 'column'        // Столбчатые
  | 'line' | 'area'         // Линейные
  | 'radar' | 'polar'       // Радиальные
  | 'scatter' | 'bubble'    // Точечные
  | 'gauge'                 // Спидометр
  | 'funnel';               // Воронка

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    values: number[];
    color?: string;
    colors?: string[];
  }[];
}

interface ChartOptions {
  showLegend: boolean;
  showValues: boolean;
  showPercentage: boolean;
  showGrid: boolean;
  smooth: boolean;
  stacked: boolean;
}
```

**Оценка сложности:** 🟠 Средняя (3-4 дня)

---

#### 2.3.2 🎵 **МУЗЫКА** (`music`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Полноценные музыкальные треки с метаданными

**Особенности:**
- ID3 теги
- Обложки альбомов
- Текст песни (синхронизированный)
- Плейлисты
- Рекомендации

**Оценка сложности:** 🟠 Средняя (3-4 дня)

---

#### 2.3.3 🎮 **ИГРЫ** (`game`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Мини-игры в чате

**Примеры:**
- Шахматы
- Крестики-нолики
- Викторины
- Карточные игры

**Оценка сложности:** 🔴 Высокая (5-10 дней на игру)

---

#### 2.3.4 📹 **ЗАПИСИ ЗВОНКОВ** (`call_recording`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Записи голосовых/видео звонков

**Особенности:**
- Автоматическая запись
- Расшифровка
- Поиск по записи
- Sharing

**Оценка сложности:** 🟡 Высокая (4-5 дней)

---

#### 2.3.5 🏷️ **УПОМИНАНИЯ** (`mention`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Упоминания пользователей, хэштеги

**TypeScript интерфейс:**
```typescript
interface MentionAttachment {
  type: 'mention';
  attachmentId: string;
  
  // Тип
  mentionType: 'user' | 'group' | 'channel' | 'hashtag';
  
  // Данные
  targetId: string;
  targetName: string;
  targetAvatar?: string;
  
  // Контекст
  context?: string;             // Предложение с упоминанием
  
  createdAt: number;
}
```

**Оценка сложности:** 🟢 Низкая (1 день)

---

## ЧАСТЬ 3: 💡 УНИКАЛЬНЫЕ ВЛОЖЕНИЯ BALLOO

### 3.1 🔄 **КОМБИНИРОВАННЫЕ ВЛОЖЕНИЯ** (`combined`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Комбинация нескольких типов вложений

**Примеры:**

#### a) Опрос + Список = "План с голосованием"
```typescript
interface PollListAttachment {
  type: 'combined_poll_list';
  
  list: ListItem[];
  vote: {
    question: string;
    shouldExecute: boolean;
    priority: number;
  };
  
  results: {
    listProgress: number;
    voteResults: PollResults;
  };
}
```

#### b) Событие + Опрос = "Выбор времени встречи"
```typescript
interface EventPollAttachment {
  type: 'combined_event_poll';
  
  event: {
    title: string;
    description: string;
  };
  
  timeOptions: {
    datetime: number;
    votes: number;
  }[];
}
```

---

### 3.2 👥 **СОВМЕСТНЫЕ ВЛОЖЕНИЯ** (`collaborative`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Вложения, которые редактируют все участники

**TypeScript интерфейс:**
```typescript
interface CollaborativeAttachment {
  type: 'collaborative_list' | 'collaborative_note' | 'collaborative_chart';
  
  // Редакторы
  editors: string[];            // userIds
  currentEditors: string[];     // Сейчас редактируют
  
  // Синхронизация
  realTimeSync: boolean;        // WebSocket
  lastSyncAt: number;
  
  // История
  editHistory: Edit[];
  
  // Блокировки
  locks: Record<string, string>;  // section -> userId
}

interface Edit {
  userId: string;
  timestamp: number;
  section: string;
  oldContent: string;
  newContent: string;
}
```

---

### 3.3 ⏰ **ИСЧЕЗАЮЩИЕ ВЛОЖЕНИЯ** (`expiring`)

**Статус:** ❌ Не реализовано  
**Приоритет:** 🟡 Средний

**Описание:** Вложения, которые удаляются автоматически

**TypeScript интерфейс:**
```typescript
interface ExpiringAttachment {
  type: AttachmentType;
  
  // Исчезновение
  expiresAt: number;
  destroyOnRead: boolean;       // Удалить после прочтения
  destroyOnScreenshot: boolean; // Удалить после скриншота
  
  // Уведомления
  notifyBeforeExpire: number;   // минут до удаления
  
  // Метаданные
  originalAttachmentId: string;
  
  createdAt: number;
}
```

---

## 📊 ИТОГОВАЯ ТАБЛИЦА ВСЕХ ВЛОЖЕНИЙ

| # | Тип | Название | Статус | Приоритет | Сложность |
|---|-----|----------|--------|-----------|-----------|
| 1 | `image` | Изображения | ✅ | — | — |
| 2 | `video` | Видео | ✅ | — | — |
| 3 | `audio` | Аудиофайлы | ✅ | — | — |
| 4 | `file` | Документы | ✅ | — | — |
| 5 | `poll` | Опросы | ✅ | — | — |
| 6 | `list` | Списки | ✅ | — | — |
| 7 | `survey` | Анкеты | ✅ | — | — |
| 8 | `quiz` | Тесты | ✅ | — | — |
| 9 | `voice_message` | Голосовые | ❌ | 🔴 | 🟠 |
| 10 | `video_note` | Видео-сообщения | ❌ | 🔴 | 🟠 |
| 11 | `location` | Геолокация | ❌ | 🔴 | 🟠 |
| 12 | `contact` | Контакты | ❌ | 🔴 | 🟢 |
| 13 | `event` | События | ❌ | 🔴 | 🟡 |
| 14 | `gif` | GIF | ❌ | 🟠 | 🟢 |
| 15 | `sticker` | Стикеры | ❌ | 🟠 | 🟡 |
| 16 | `link_preview` | Предпросмотр ссылок | ❌ | 🟠 | 🟠 |
| 17 | `note` | Заметки | ❌ | 🟠 | 🟢 |
| 18 | `payment` | Переводы | ❌ | 🟠 | 🔴 |
| 19 | `chart` | Диаграммы | ❌ | 🟡 | 🟠 |
| 20 | `music` | Музыка | ❌ | 🟡 | 🟠 |
| 21 | `game` | Игры | ❌ | 🟡 | 🔴 |
| 22 | `call_recording` | Записи звонков | ❌ | 🟡 | 🟡 |
| 23 | `mention` | Упоминания | ❌ | 🟡 | 🟢 |
| 24 | `combined` | Комбинированные | ❌ | 💡 | 🟡 |
| 25 | `collaborative` | Совместные | ❌ | 💡 | 🟡 |
| 26 | `expiring` | Исчезающие | ❌ | 💡 | 🟠 |

**Легенда:**
- ✅ Реализовано
- ❌ Не реализовано
- 🔴 Критический приоритет
- 🟠 Высокий приоритет
- 🟡 Средний приоритет
- 💡 Уникальные
- 🟢 Низкая сложность (1-2 дня)
- 🟠 Средняя сложность (2-4 дня)
- 🟡 Высокая сложность (4-7 дней)
- 🔴 Очень высокая (7+ дней)

---

## 🎯 РЕКОМЕНДУЕМЫЙ ПЛАН ВНЕДРЕНИЯ

### Спринт 1 (1 неделя) — "Базовые функции":
1. 🎤 **Голосовые сообщения** (2-3 дня)
2. 🎬 **GIF** (1 день)
3. 👤 **Контакты** (1-2 дня)

### Спринт 2 (1 неделя) — "Локация и события":
4. 📍 **Геолокация** (2-3 дня)
5. 📅 **События календаря** (3-4 дня, параллельно)

### Спринт 3 (1 неделя) — "Медиа и контент":
6. 🎥 **Видео-сообщения** (3-4 дня)
7. 🔗 **Link Preview** (2-3 дня)
8. 📝 **Заметки** (1-2 дня)

### Спринт 4 (2 недели) — "Монетизация":
9. 🏷️ **Стикеры** (5-7 дней)
10. 💰 **Переводы** (юридическая подготовка + 5 дней)

### Спринт 5 (2 недели) — "Продвинутые функции":
11. 📊 **Диаграммы** (3-4 дня)
12. 🎵 **Музыка** (3-4 дня)
13. 🏷️ **Упоминания** (1 день)
14. 💡 **Уникальные вложения** (5-7 дней)

---

## 📈 ОЖИДАЕМЫЙ ЭФФЕКТ

| Категория | Вложений | Влияние на UX | Влияние на Engagement |
|-----------|----------|---------------|----------------------|
| **Медиа (4)** | ✅ | 🔴 Высокое | 🔴 Высокое |
| **Интерактивные (4)** | ✅ | 🔴 Высокое | 🔴 Высокое |
| **Критические (5)** | 🚀 | 🔴 Критичное | 🔴 Высокое |
| **Важные (5)** | 🚀 | 🟠 Среднее | 🟠 Среднее |
| **Дополнительные (5)** | 🚀 | 🟡 Низкое | 🟡 Низкое |
| **Уникальные (3)** | 💡 | 🔴 Высокое | 🔴 Высокое |

---

## 💡 ВЫВОДЫ

### ✅ Текущее состояние:
- **8 реализованных вложений** — хорошая база
- **4 интерактивных** — уникальность Balloo
- **Отличная типизация** — легко расширять

### 🚀 План развития:
- **18 новых типов** — полный охват
- **5 критических** — закрыть пробелы
- **3 уникальных** — конкурентное преимущество

### 🎯 Итог:
После внедрения всех 26 типов вложений Balloo станет **полнофункциональным мессенджером** с уникальными возможностями для совместной работы.

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 2.0.0  
**Статус:** Complete  
**Автор:** Koda (NLP-Core-Team)

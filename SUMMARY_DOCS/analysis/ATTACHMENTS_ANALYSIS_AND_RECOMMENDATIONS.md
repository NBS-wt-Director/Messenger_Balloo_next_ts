
---
title: Анализ и Рекомендации по Вложениям Balloo Messenger
description: Полный обзор типов вложений, реализованных и планируемых
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: complete
audience: both
tags:
  - attachments
  - analysis
  - features
  - recommendations
related_docs:
  - messenger/src/types/attachments.ts
  - SUMMARY_DOCS/analysis/MESSENGER_MAIN_PAGE_ANALYSIS.md
  - SUMMARY_DOCS/modules/summary/MODULE_SUMMARY_messenger.md
---

# 📎 ВЛОЖЕНИЯ BALLOO MESSENGER — АНАЛИЗ И РЕКОМЕНДАЦИИ

**Дата:** 2026-06-14  
**Автор:** Koda (NLP-Core-Team)  
**Статус:** ✅ Complete

---

## 📊 ОБЗОР ТЕКУЩИХ ВЛОЖЕНИЙ

### Категории вложений:

```
┌─────────────────────────────────────────────────────┐
│              ВЛОЖЕНИЯ BALLOO                        │
├─────────────────────────────────────────────────────┤
│  📁 МЕДИА (4 типа)                                  │
│  ├── 🖼️ Изображения (image)                         │
│  ├── 🎬 Видео (video)                               │
│  ├── 🎵 Аудио (audio)                               │
│  └── 📄 Документы (file/document)                   │
├─────────────────────────────────────────────────────┤
│  🎯 ИНТЕРАКТИВНЫЕ (4 типа) ✅ ЗАДОКУМЕНТИРОВАНЫ     │
│  ├── 🗳️ Опросы (poll)                               │
│  ├── 📝 Списки (list)                               │
│  ├── 📊 Анкеты (survey)                             │
│  └── 🧩 Тесты (quiz)                                │
├─────────────────────────────────────────────────────┤
│  💡 ПРЕДЛОЖЕНО (10 типов) 🚀                        │
│  └── (см. рекомендации ниже)                        │
└─────────────────────────────────────────────────────┘
```

---

## ✅ РЕАЛИЗОВАННЫЕ ВЛОЖЕНИЯ

### 1. 📁 МЕДИА-ВЛОЖЕНИЯ

#### a) **Изображения** (`image`)
```typescript
// Базовый тип
{
  type: 'image';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}
```

**Поддерживаемые форматы:**
- ✅ JPG/JPEG
- ✅ PNG
- ✅ GIF (анимированные)
- ✅ WebP

**Ограничения:**
- Макс размер: 100 MB
- Авто-сжатие: включено
- Превью: генерируется

---

#### b) **Видео** (`video`)
```typescript
{
  type: 'video';
  url: string;
  thumbnailUrl: string;
  duration?: number;      // секунды
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType: 'video/mp4' | 'video/webm';
}
```

**Поддерживаемые форматы:**
- ✅ MP4 (H.264)
- ✅ WebM

**Ограничения:**
- Макс размер: 100 MB
- Макс длительность: не ограничено
- Превью: 1 кадр

---

#### c) **Аудио** (`audio`)
```typescript
{
  type: 'audio';
  url: string;
  duration?: number;      // секунды
  fileSize?: number;
  mimeType: 'audio/mp3' | 'audio/wav' | 'audio/ogg';
  title?: string;
  artist?: string;
}
```

**Поддерживаемые форматы:**
- ✅ MP3
- ✅ WAV
- ✅ OGG

**Ограничения:**
- Макс размер: 100 MB
- Плеер: базовый (play/pause, прогресс)

---

#### d) **Документы** (`file` / `document`)
```typescript
{
  type: 'file' | 'document';
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  icon?: string;
}
```

**Поддерживаемые форматы:**
- ✅ PDF
- ✅ DOC, DOCX (Word)
- ✅ XLS, XLSX (Excel)
- ✅ PPT, PPTX (PowerPoint)
- ✅ TXT
- ✅ ZIP, RAR (архивы)

**Ограничения:**
- Макс размер: 100 MB
- Предпросмотр: только для PDF

---

### 2. 🎯 ИНТЕРАКТИВНЫЕ ВЛОЖЕНИЯ (УНИКАЛЬНОСТЬ BALLOO!)

#### a) **Опросы** (`poll`) — ✅ РЕАЛИЗОВАНО

**Назначение:** Быстрое голосование в чате

**Структура:**
```typescript
interface PollAttachment {
  type: 'poll';
  pollId: string;
  question: string;           // Вопрос
  options: PollOption[];      // Варианты ответов
  settings: PollSettings;
  results: PollResults;
  userResponse?: UserPollResponse;
  createdAt: number;
  updatedAt: number;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  userVoted?: boolean;
}

interface PollSettings {
  allowTextResponse: boolean;    // Текстовый ответ
  multipleChoice: boolean;       // Несколько вариантов
  expiresAt?: number;            // Срок действия
  isAnonymous: boolean;          // Анонимность
  maxVotes?: number;             // Максимум выборов
}

interface PollResults {
  totalVotes: number;
  uniqueVoters: string[];
  completedAt?: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Один вариант выбора | ✅ | Классический poll |
| Несколько вариантов | ✅ | multipleChoice: true |
| Анонимное голосование | ✅ | isAnonymous: true |
| Текстовый ответ | ✅ | allowTextResponse: true |
| Срок действия | ✅ | expiresAt timestamp |
| Результаты в реальном времени | ✅ | Обновляются у всех |
| Экспорт результатов | ❌ | Не реализовано |

**Use Cases:**
- "Где встречаемся?" — Кафе / Парк / Кино
- "Кто идёт на митап?" — Да / Нет / Может быть
- "Оцените идею" — 1-5 звёзд (через text response)

---

#### b) **Списки** (`list`) — ✅ РЕАЛИЗОВАНО

**Назначение:** Совместные TODO-листы, планы, задачи

**Структура:**
```typescript
interface ListAttachment {
  type: 'list';
  listId: string;
  title: string;
  description?: string;
  items: ListItem[];
  settings: ListSettings;
  progress: ListProgress;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

interface ListItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  completedBy?: string[];      // Кто выполнил
  completedAt?: number;
  assignedTo?: string;         // Назначено
  order: number;
}

interface ListSettings {
  allowMultipleCompletion: boolean;  // Несколько исполнителей
  requireAllItems: boolean;          // Требовать все
  allowReordering: boolean;          // Пересортировка
  notifyOnComplete: boolean;         // Уведомления
}

interface ListProgress {
  totalItems: number;
  completedItems: number;
  progress: number;          // 0-100%
  completedBy: Record<string, number>;  // По пользователям
  lastCompletedAt?: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Создание элементов | ✅ | Добавление задач |
| Отметка выполнения | ✅ | Checkbox |
| Прогресс бар | ✅ | 0-100% |
| Назначение исполнителя | ✅ | assignedTo |
| Кто выполнил | ✅ | completedBy[] |
| Пересортировка | ✅ | allowReordering |
| Уведомления | ✅ | notifyOnComplete |
| Дедлайны | ❌ | Не реализовано |
| Подзадачи | ❌ | Не реализовано |

**Use Cases:**
- "Продукты на ужин" — хлеб, молоко, сыр (отмечают кто что купил)
- "План поездки" — билеты, отель, экскурсия
- "Задачи на неделю" — распределение между семьёй

---

#### c) **Анкеты** (`survey`) — ✅ РЕАЛИЗОВАНО

**Назначение:** Подробные опросы с разными типами вопросов

**Структура:**
```typescript
interface SurveyAttachment {
  type: 'survey';
  surveyId: string;
  title: string;
  description?: string;
  sections: SurveySection[];     // Секции
  settings: SurveySettings;
  createdAt: number;
  updatedAt: number;
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
}

type SurveyQuestionType = 
  | 'text'        // Короткий ответ
  | 'textarea'    // Длинный ответ
  | 'select'      // Выпадающий список
  | 'radio'       // Один вариант
  | 'checkbox'    // Несколько вариантов
  | 'rating';     // 1-5 звёзд

interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;      // Regex
  min?: number;
  max?: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Текстовые вопросы | ✅ | text, textarea |
| Выбор вариантов | ✅ | select, radio, checkbox |
| Рейтинг | ✅ | 1-5 звёзд |
| Валидация | ✅ | min/max, regex |
| Секции | ✅ | Группировка вопросов |
| Обязательные вопросы | ✅ | required: true |
| Анонимность | ✅ | anonymous: true |
| Несколько попыток | ✅ | allowMultipleSubmissions |
| Перемешивание | ✅ | shuffleQuestions, shuffleOptions |
| Логика (if-then) | ❌ | Не реализовано |
| Файлы в ответах | ❌ | Не реализовано |

**Use Cases:**
- "Обратная связь о продукте" — оценка, комментарии
- "Регистрация на событие" — имя, контакты, предпочтения
- "Опрос удовлетворённости" — NPS, детальные отзывы

---

#### d) **Тесты** (`quiz`) — ✅ РЕАЛИЗОВАНО

**Назначение:** Обучающие тесты с оценкой знаний

**Структура:**
```typescript
interface QuizAttachment {
  type: 'quiz';
  quizId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  results: QuizResults;
  userAttempt?: UserQuizAttempt;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

interface QuizQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptions: string[];    // Правильные ответы
  explanation?: string;        // Пояснение
  points?: number;             // Баллы за вопрос
  order: number;
}

interface QuizSettings {
  passingScore: number;        // Проходной балл (%)
  maxAttempts: number;         // Максимум попыток
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer?: number;              // Таймер (сек)
  randomizeCorrectAnswers: boolean;
}

interface QuizResults {
  totalAttempts: number;
  uniqueTakers: string[];
  averageScore: number;
  passRate: number;            // % сдавших
  completedAt?: number;
}

interface UserQuizAttempt {
  answers: QuizAnswer[];
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  attemptedAt: number;
  duration?: number;
  attemptNumber: number;
}
```

**Возможности:**
| Функция | Статус | Описание |
|---------|--------|----------|
| Одиночный выбор | ✅ | single-choice |
| Множественный выбор | ✅ | multiple-choice |
| True/False | ✅ | true-false |
| Баллы за вопрос | ✅ | points |
| Проходной балл | ✅ | passingScore % |
| Таймер | ✅ | timer секунды |
| Попытки | ✅ | maxAttempts |
| Пояснения | ✅ | explanation |
| Перемешивание | ✅ | questions, options |
| Сертификаты | ❌ | Не реализовано |
| Лидерборд | ❌ | Не реализовано |

**Use Cases:**
- "Проверка знаний ПДД" — тест с баллами
- "Викторина в чате" — развлекательные квизы
- "Обучение сотрудников" — обязательные тесты

---

## 📋 СРАВНЕНИЕ С КОНКУРЕНТАМИ

| Вложение | Balloo | Telegram | WhatsApp | Slack | Discord |
|----------|--------|----------|----------|-------|---------|
| **Фото/Видео** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Документы** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Аудио** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Опросы (Poll)** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Списки (TODO)** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Анкеты (Survey)** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Тесты (Quiz)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Календарь** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Файлы из облака** | ✅ (Yandex) | ✅ | ✅ | ✅ | ✅ |
| **GIF** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Стикеры** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Локация** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Контакт** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Голосовое** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Видео-кружочек** | ❌ | ✅ | ❌ | ❌ | ❌ |

**Вывод:** Balloo **лидирует** по интерактивным вложениям (Quiz, Survey), но **отстаёт** по базовым (голосовые, стикеры, локация).

---

## 🚀 РЕКОМЕНДАЦИИ — НОВЫЕ ТИПЫ ВЛОЖЕНИЙ

### 🔴 КРИТИЧЕСКИЕ (добавить в первую очередь)

#### 1. **🎤 Голосовые сообщения** (`voice_message`)

**Почему критично:** Самый востребованный тип после текста

**Структура:**
```typescript
interface VoiceMessageAttachment {
  type: 'voice_message';
  audioId: string;
  url: string;
  duration: number;           // секунды
  waveform: number[];         // 50 точек для визуализации
  mimeType: 'audio/ogg' | 'audio/mp3';
  fileSize: number;
  isPlayed: boolean;
  playbackSpeed: 0.5 | 1.0 | 1.5 | 2.0;
  transcript?: string;        // Расшифровка (AI)
  createdAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│ ▶️  ▂▃▅▆▇▆▅▃▂  0:15  🎧  ⚡1.5x       │
│    [волна звука]  длительность  скорость
└────────────────────────────────────────┘
```

**Функции:**
- ✅ Запись кнопкой (удержание)
- ✅ Визуализация волны
- ✅ Регулировка скорости (0.5x - 2x)
- ✅ Автовоспроизведение следующего
- ✅ Пауза/продолжение
- ⏸️ Расшифровка (speech-to-text AI)
- ⏸️ Отмена свайпом

**Техническая реализация:**
```typescript
// Запись
const mediaRecorder = new MediaRecorder(navigator.mediaDevices.getUserMedia({ audio: true }));
const chunks: Blob[] = [];

mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'audio/ogg' });
  // Отправка на сервер
};

// Визуализация
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
// Рисование волны на canvas
```

**Оценка сложности:** 🟠 Средняя (2-3 дня)

---

#### 2. **📍 Геолокация** (`location`)

**Почему важно:** Быстрая отправка координат

**Структура:**
```typescript
interface LocationAttachment {
  type: 'location';
  latitude: number;
  longitude: number;
  accuracy?: number;          // метры
  name?: string;              // Название места
  address?: string;           // Адрес
  venue?: string;             // Заведение
  provider?: 'google' | 'yandex' | 'osm';
  staticMapUrl?: string;      // Превью карты
  createdAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│  📍 Кафе "Пушкин"                      │
│  ┌──────────────────────────────────┐  │
│  │     [Статичная карта]            │  │
│  │         📍                       │  │
│  └──────────────────────────────────┘  │
│  ул. Тверская, 12                      │
│  ⭐ 4.5  🕐 Открыто до 23:00           │
│  [Маршрут]  [Поделиться]               │
└────────────────────────────────────────┘
```

**Функции:**
- ✅ Отправка текущей позиции
- ✅ Выбор на карте
- ✅ Поиск мест
- ✅ Превью карты (static map)
- ✅ Название + адрес
- ⏸️ Маршрут (интеграция с навигатором)
- ⏸️ "Где друзья" (live location)

**Live Location (расширение):**
```typescript
interface LiveLocationAttachment {
  type: 'live_location';
  ...LocationAttachment,
  expiresAt: number;          // Когда перестать обновлять
  updateInterval: number;     // Секунды между обновлениями
  participants: string[];     // Кто видит
}
```

**Оценка сложности:** 🟠 Средняя (2-3 дня)

---

#### 3. **👤 Контакты** (`contact`)

**Почему важно:** Быстрый обмен контактами

**Структура:**
```typescript
interface ContactAttachment {
  type: 'contact';
  contactId: string;
  firstName: string;
  lastName?: string;
  displayName: string;
  phoneNumbers: {
    number: string;
    type: 'mobile' | 'home' | 'work' | 'other';
    label?: string;
  }[];
  emails: {
    email: string;
    type: 'personal' | 'work';
    label?: string;
  }[];
  avatar?: string;
  organization?: string;
  jobTitle?: string;
  vcard?: string;             // vCard формат
  createdAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│  👤 Иван Петров                        │
│  📱 +7 999 123-45-67 (мобильный)      │
│  📧 ivan@example.com                  │
│  🏢 ООО "Ромашка" • Менеджер          │
│  [Сохранить]  [Позвонить]  [Написать] │
└────────────────────────────────────────┘
```

**Функции:**
- ✅ Экспорт из телефонной книги
- ✅ Импорт в телефонную книгу
- ✅ vCard (.vcf) формат
- ✅ Несколько номеров/emails
- ✅ Фото контакта
- ✅ Организация + должность

**Оценка сложности:** 🟢 Низкая (1-2 дня)

---

#### 4. **📅 События календаря** (`event`)

**Почему важно:** Планирование встреч в чате

**Структура:**
```typescript
interface EventAttachment {
  type: 'event';
  eventId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: number;          // timestamp
  endTime: number;
  timezone: string;           // "Europe/Moscow"
  allDay: boolean;
  organizer: string;          // userId
  attendees: {
    userId: string;
    status: 'pending' | 'accepted' | 'declined';
    respondedAt?: number;
  }[];
  reminders: {
    type: 'notification' | 'email';
    minutesBefore: number;
  }[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    count?: number;
    until?: number;
  };
  ics?: string;               // iCalendar формат
  createdAt: number;
  updatedAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│  📅 Командная встреча                  │
│  🗓️ Пн, 25 июня 2026 • 15:00-16:00   │
│  📍 Переговорная №3 / Zoom            │
│  👥 Организатор: Иван                  │
│  ✅ Вы • ⏳ Мария • ❌ Петр            │
│  🔔 Напоминание: за 15 минут          │
│  [Принять] [Отклонить] [Maybe]        │
└────────────────────────────────────────┘
```

**Функции:**
- ✅ Создание события
- ✅ Приглашение участников
- ✅ RSVP (accepted/declined/maybe)
- ✅ Напоминания
- ✅ Повторяющиеся события
- ✅ Экспорт в .ics
- ⏸️ Синхронизация с Google/Yandex Calendar
- ⏸️ Онлайн-встречи (auto-generate Zoom link)

**Оценка сложности:** 🟡 Высокая (4-5 дней)

---

### 🟠 ВЫСОКИЙ ПРИОРИТЕТ

#### 5. **💰 Переводы/Донаты** (`payment`)

**Назначение:** Быстрые переводы между пользователями

**Структура:**
```typescript
interface PaymentAttachment {
  type: 'payment';
  paymentId: string;
  amount: number;
  currency: 'RUB' | 'USD' | 'EUR';
  recipient: string;          // userId
  sender: string;
  message?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'balance' | 'sbp';
  transactionId?: string;
  createdAt: number;
  completedAt?: number;
}
```

**Интеграции:**
- СБП (Система Быстрых Платежей)
- Яндекс.Деньги
- Тинькофф
- Внутренний баланс Balloo

**Оценка сложности:** 🔴 Очень высокая (юридические требования)

---

#### 6. **🎬 GIF-анимации** (`gif`)

**Назначение:** Эмоциональные реакции

**Структура:**
```typescript
interface GifAttachment {
  type: 'gif';
  gifId: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
  provider: 'giphy' | 'tenor' | 'yandex';
  tags: string[];
  createdAt: number;
}
```

**Интеграции:**
- Giphy API
- Tenor API
- Yandex GIF search

**Оценка сложности:** 🟢 Низкая (1 день)

---

#### 7. **🏷️ Стикеры** (`sticker`)

**Назначение:** Персонализация общения

**Структура:**
```typescript
interface StickerAttachment {
  type: 'sticker';
  stickerId: string;
  packId: string;
  packName: string;
  url: string;              // WebP или APNG
  emoji?: string;           // Ассоциированный emoji
  isAnimated: boolean;
  isPremium: boolean;
  createdAt: number;
}

interface StickerPack {
  id: string;
  name: string;
  author: string;
  stickers: Sticker[];
  coverUrl: string;
  isInstalled: boolean;
  price?: number;           // Для премиум
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

#### 8. **📊 Диаграммы/Графики** (`chart`)

**Назначение:** Визуализация данных

**Структура:**
```typescript
interface ChartAttachment {
  type: 'chart';
  chartId: string;
  chartType: 'pie' | 'bar' | 'line' | 'doughnut' | 'radar';
  title: string;
  data: {
    labels: string[];
    values: number[];
    colors?: string[];
  };
  options: {
    showLegend: boolean;
    showValues: boolean;
    showPercentage: boolean;
  };
  imageUrl?: string;        // Превью
  createdAt: number;
}
```

**Use Cases:**
- "Распределение бюджета" — pie chart
- "Прогресс проекта" — bar chart
- "Динамика продаж" — line chart

**Оценка сложности:** 🟠 Средняя (3-4 дня)

---

### 🟡 СРЕДНИЙ ПРИОРИТЕТ

#### 9. **🔗 Предпросмотр ссылок** (`link_preview`)

**Назначение:** Красивые превью ссылок

**Структура:**
```typescript
interface LinkPreviewAttachment {
  type: 'link_preview';
  url: string;
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  type: 'article' | 'video' | 'music' | 'product';
  
  // Для видео
  videoUrl?: string;
  videoDuration?: number;
  
  // Для музыки
  audioUrl?: string;
  artist?: string;
  
  // Для товаров
  price?: number;
  currency?: string;
  inStock?: boolean;
  
  fetchedAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│  [Картинка]  Заголовок статьи         │
│              Краткое описание...       │
│              🌐 example.com           │
└────────────────────────────────────────┘
```

**Оценка сложности:** 🟠 Средняя (2-3 дня, нужен scraper)

---

#### 10. **📝 Заметки** (`note`)

**Назначение:** Длинные текстовые сообщения

**Структура:**
```typescript
interface NoteAttachment {
  type: 'note';
  noteId: string;
  title: string;
  content: string;          // Markdown
  preview: string;          // Первые 200 символов
  wordCount: number;
  readTime: number;         // минут
  formatting: 'plain' | 'markdown' | 'html';
  createdAt: number;
  updatedAt: number;
}
```

**UI/UX:**
```
┌────────────────────────────────────────┐
│  📝 Как организовать работу команды   │
│  ────────────────────────────────────  │
│  1. Используйте списки задач...       │
│  2. Проводите ежедневные митапы...    │
│  3. ...                                │
│  ────────────────────────────────────  │
│  ⏱️ 5 мин чтения  ✍️ 1200 слов        │
│  [Читать полностью]                    │
└────────────────────────────────────────┘
```

**Оценка сложности:** 🟢 Низкая (1-2 дня)

---

## 📊 ПРИОРИТИЗАЦИЯ

### Матрица приоритетов:

```
                    Высокая ценность
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        │  🎤 Голосовые   │  📍 Локация     │
        │  👤 Контакты    │  📅 События     │
        │                 │                 │
Низкая  │─────────────────┼─────────────────│  Высокая
сложность               │                 сложность
        │                 │                 │
        │  🎬 GIF         │  💰 Переводы    │
        │  📝 Заметки     │  🏷️ Стикеры    │
        │  🔗 Link Preview│  📊 Диаграммы   │
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    Низкая ценность
```

---

## 🎯 РЕКОМЕНДУЕМЫЙ ПЛАН ВНЕДРЕНИЯ

### Спринт 1 (1 неделя):
1. 🎤 **Голосовые сообщения** — критично для UX
2. 🎬 **GIF** — быстро, улучшает engagement

### Спринт 2 (1 неделя):
3. 📍 **Локация** — средняя сложность
4. 👤 **Контакты** — быстро

### Спринт 3 (2 недели):
5. 📅 **События календаря** — высокая ценность
6. 🔗 **Link Preview** — улучшает UX ссылок

### Спринт 4 (2 недели):
7. 🏷️ **Стикеры** — монетизация
8. 📝 **Заметки** — длинные тексты

### Спринт 5 (2 недели):
9. 📊 **Диаграммы** — нишевая фича
10. 💰 **Переводы** — юридическая подготовка

---

## 📈 ОЖИДАЕМЫЙ ЭФФЕКТ

| Вложение | Влияние на UX | Влияние на Engagement | Сложность |
|----------|---------------|----------------------|-----------|
| **Голосовые** | 🔴 Высокое | 🔴 Высокое | 🟠 Средняя |
| **Локация** | 🟠 Среднее | 🟠 Среднее | 🟠 Средняя |
| **Контакты** | 🟠 Среднее | 🟢 Низкое | 🟢 Низкая |
| **События** | 🔴 Высокое | 🔴 Высокое | 🟡 Высокая |
| **GIF** | 🟢 Низкое | 🟠 Среднее | 🟢 Низкая |
| **Стикеры** | 🟠 Среднее | 🔴 Высокое | 🟡 Высокая |
| **Link Preview** | 🟠 Среднее | 🟢 Низкое | 🟠 Средняя |
| **Заметки** | 🟢 Низкое | 🟢 Низкое | 🟢 Низкая |

---

## 💡 УНИКАЛЬНЫЕ ВОЗМОЖНОСТИ BALLOO

### Что выделит Balloo среди конкурентов:

#### 1. **Комбинированные вложения**
```typescript
// Опрос + Список = "План с голосованием"
interface PollListAttachment {
  type: 'poll_list';
  list: ListItem[];
  vote: {
    shouldExecute: boolean;
    priority: number;
  };
}
```

#### 2. **Совместные вложения**
```typescript
// Список редактируют все участники чата
interface CollaborativeAttachment {
  type: 'collaborative_list' | 'collaborative_note';
  editors: string[];
  editHistory: Edit[];
  realTimeSync: boolean;    // WebSocket sync
}
```

#### 3. **Вложения с дедлайном**
```typescript
// Исчезающие вложения
interface ExpiringAttachment {
  type: AttachmentType;
  expiresAt: number;
  destroyOnRead: boolean;   // Удалить после прочтения
}
```

---

## 🎯 ВЫВОДЫ

### ✅ Текущее состояние:
- **4 медиа-вложения** — стандартный набор
- **4 интерактивных** — уникальность Balloo (Poll, List, Survey, Quiz)
- **Отличная типизация** — TypeScript, подробные интерфейсы
- **Готово к расширению** — архитектура позволяет добавлять типы

### ⚠️ Пробелы:
- ❌ **Голосовые сообщения** — критично
- ❌ **Локация** — ожидаемая функция
- ❌ **Контакты** — базовая функция
- ❌ **Стикеры/GIF** — engagement
- ❌ **Link Preview** — улучшает UX

### 🚀 Рекомендации:
1. **Спринт 1:** Голосовые + GIF (быстрая победа)
2. **Спринт 2:** Локация + Контакты
3. **Спринт 3:** События + Link Preview
4. **Спринт 4:** Стикеры (монетизация!)

**После внедрения:** Balloo будет **конкурентоспособен** с Telegram/WhatsApp по базовым функциям + **уникален** по интерактивным вложениям.

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0  
**Статус:** Complete  
**Автор:** Koda (NLP-Core-Team)

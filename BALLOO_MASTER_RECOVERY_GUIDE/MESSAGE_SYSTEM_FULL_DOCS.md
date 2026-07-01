# 📨 BALLOO PLATFORM — Система Сообщений (Полное Описание)

**Версия:** v5.0  
**Дата:** 2026-06-29  
**Статус:** ✅ Полная документация  

---

## 📋 ОГЛАВЛЕНИЕ

1. [Общая архитектура](#1-общая-архитектура)
2. [Типы чатов](#2-типы-чатов)
3. [Типы сообщений](#3-типы-сообщений)
4. [Система вложений](#4-система-вложений)
5. [Интерактив сообщений](#5-интерактив-сообщений)
6. [Статусы доставки](#6-статусы-доставки)
7. [E2E шифрование](#7-e2e-шифрование)
8. [Premium функции](#8-premium-функции)
9. [V2 функции (отложенные)](#9-v2-функции-отложенные)
10. [API Endpoints](#10-api-endpoints)
11. [База данных](#11-база-данных)

---

## 1. ОБЩАЯ АРХИТЕКТУРА

### 1.1 Узлы системы (Inside Node Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                     BALLOO NETWORK                           │
│                      balloo_net                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │  Web Client  │────▶│  API Gateway │────▶│  Messenger   │ │
│  │  (Next.js)   │◀────│  (Node 3001) │◀────│  (WS 3002)   │ │
│  └──────────────┘     └──────────────┘     └──────────────┘ │
│         │                    │                      │        │
│         │                    ▼                      ▼        │
│         │            ┌──────────────┐     ┌──────────────┐   │
│         │            │  PostgreSQL  │     │    Redis     │   │
│         │            │  (Node 3006) │     │  (Node 3007) │   │
│         │            └──────────────┘     └──────────────┘   │
│         │                    │                                │
│         ▼                    ▼                                │
│  ┌──────────────┐     ┌──────────────┐                       │
│  │ File Storage │◀────│ Mobile API   │                       │
│  │ (Node 3008)  │     │ (Node 3005)  │                       │
│  └──────────────┘     └──────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Поток сообщений

```
Отправитель                          Получатель
    │                                    │
    │  1. Сообщение (WebSocket)          │
    ├───────────────────────────────────▶│
    │                                    │
    │  2. Сохранение в PostgreSQL        │
    │◀───────┐                           │
    │        │                           │
    │  3. Push-уведомление (если офлайн) │
    ├───────────────────────────────────▶│
    │                                    │
    │  4. Статус "Доставлено"            │
    ├───────────────────────────────────▶│
    │                                    │
    │  5. Прочтение (WebSocket)          │
    │◀───────────────────────────────────┤
    │                                    │
    │  6. Статус "Прочитано"             │
    ├───────────────────────────────────▶│
    │                                    │
```

### 1.3 Технические характеристики

| Параметр | Значение |
|----------|----------|
| **Протокол** | WebSocket (Socket.IO) |
| **Формат данных** | JSON |
| **Шифрование** | TLS 1.3 + E2E (Signal Protocol V2) |
| **Макс. размер сообщения** | 4096 символов (текст) |
| **Макс. размер вложений** | 20MB (Free), 1GB (Premium) |
| **Скорость доставки** | < 100ms (онлайн), < 5s (офлайн) |
| **Хранение** | PostgreSQL + Yandex Disk (файлы) |

---

## 2. ТИПЫ ЧАТОВ

### 2.1 Личные чаты (Direct Messages)

**Описание:** Один на один между двумя пользователями.

| Параметр | Значение |
|----------|----------|
| **Участников** | 2 |
| **E2E шифрование** | ✅ По умолчанию |
| **Secret Chat** | ✅ Premium |
| **Звонки** | ✅ Аудио/Видео |
| **Вложения** | ✅ Все типы |

**Особенности:**
- Автоматическое создание при первом сообщении
- Индексация по `user1_id + user2_id` (уникальный chat_id)
- Поддержка временных чатов (self-destruct)

**База данных:**
```sql
chats: {
  id: UUID,
  type: 'direct',
  participant_ids: [UUID, UUID],
  encryption_enabled: true,
  created_at: TIMESTAMP
}
```

---

### 2.2 Групповые чаты (Groups)

**Описание:** Группы до 200 участников (Free) / 5000 (Premium).

| Параметр | Free | Premium |
|----------|------|---------|
| **Участников** | до 200 | до 5000 |
| **Администраторов** | до 10 | до 50 |
| **Вложения** | 20MB | 1GB |
| **Голосовые чаты** | ❌ | ✅ |
| **Каналы** | ❌ | ✅ |

**Роли в группе:**
```
┌─────────────┬──────────────────────────────────────────┐
│ Роль        │ Права                                    │
├─────────────┼──────────────────────────────────────────┤
│ Creator     │ Все права, включая удаление группы       │
│ Moderator   │ Бан/кик, редактирование настроек         │
│ Member      │ Отправка сообщений, вложений             │
│ Reader      │ Только чтение (read-only)                │
└─────────────┴──────────────────────────────────────────┘
```

**База данных:**
```sql
chats: {
  id: UUID,
  type: 'group',
  name: STRING,
  avatar: STRING,
  description: TEXT,
  creator_id: UUID,
  max_members: 200 | 5000,
  encryption_enabled: false
}

chat_members: {
  id: UUID,
  chat_id: UUID,
  user_id: UUID,
  role: 'creator' | 'moderator' | 'member' | 'reader',
  joined_at: TIMESTAMP,
  last_read_at: TIMESTAMP
}
```

---

### 2.3 Каналы (Channels) — Premium

**Описание:** Односторонняя рассылка от администраторов подписчикам.

| Параметр | Значение |
|----------|----------|
| **Подписчиков** | до 100,000 |
| **Администраторов** | до 20 |
| **Комментарии** | ✅ (отдельный чат) |
| **Статистика** | ✅ Просмотры, охват |

**Особенности:**
- Только админы могут публиковать
- Подписчики только читают
- Возможность включения комментариев

---

### 2.4 Secret Chats — Premium

**Описание:** Зашифрованные чаты с дополнительными функциями безопасности.

| Функция | Описание |
|---------|----------|
| **E2E шифрование** | Signal Protocol V2 (AES-256) |
| **Self-destruct** | Автоудаление через заданное время |
| **Запрет пересылки** | Блокировка forward |
| **Запрет скриншотов** | Уведомление о скриншоте (mobile) |
| **Запись звонков** | Шифрованная запись на устройство |

**База данных:**
```sql
chats: {
  id: UUID,
  type: 'direct' | 'group',
  is_secret: true,
  encryption_key: ENCRYPTED_STRING,
  self_destruct_ttl: INTEGER (секунды),
  allow_screenshots: false,
  allow_forward: false
}
```

---

### 2.5 Временные чаты (Ephemeral Chats)

**Описание:** Чаты с автоматическим удалением по таймеру.

| Параметр | Значение |
|----------|----------|
| **TTL** | 1 час / 24 часа / 7 дней |
| **Удаление** | Автоматическое (Cron job) |
| **Уведомление** | ✅ При создании |

---

### 2.6 Сравнительная таблица типов чатов

| Функция | Direct | Group | Channel | Secret |
|---------|--------|-------|---------|--------|
| **Участников** | 2 | 200-5000 | 100k | 2 |
| **E2E** | ✅ | ❌ | ❌ | ✅ |
| **Вложения** | ✅ | ✅ | ✅ | ⚠️ |
| **Звонки** | ✅ | ✅ (Premium) | ❌ | ✅ |
| **Редактирование** | ✅ | ✅ | ✅ (admin) | ✅ |
| **Удаление** | ✅ | ✅ | ✅ (admin) | ✅ |
| **Пересылка** | ✅ | ✅ | ✅ | ❌ |
| **Self-destruct** | ❌ | ❌ | ❌ | ✅ |
| **Реакции** | ✅ | ✅ | ✅ | ✅ |

---

## 3. ТИПЫ СООБЩЕНИЙ

### 3.1 Текстовые сообщения (Text)

**Описание:** Базовый тип сообщения с поддержкой форматирования.

```typescript
interface TextMessage {
  id: UUID;
  chat_id: UUID;
  sender_id: UUID;
  type: 'text';
  content: string;           // до 4096 символов
  formatting?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    pre: boolean;
  };
  reply_to_id?: UUID;
  forward_from_id?: UUID;
  is_edited: boolean;
  edited_at?: TIMESTAMP;
  created_at: TIMESTAMP;
}
```

**Markdown-поддержка:**
```
**жирный**      →  **жирный**
*курсив*        →  *курсив*
__подчёркнутый__ →  __подчёркнутый__
~~зачёркнутый~~  →  ~~зачёркнутый__
`код`           →  `код`
```

---

### 3.2 Голосовые сообщения (Voice)

**Описание:** Аудиозаписи до 5 минут.

| Параметр | Значение |
|----------|----------|
| **Формат** | WebM Audio (Opus) |
| **Макс. длительность** | 5 минут |
| **Макс. размер** | 10MB |
| **Waveform** | ✅ Генерируется при загрузке |
| **Транскрипция** | ✅ Premium (AI) |

**База данных:**
```sql
messages: {
  type: 'voice',
  content: '',  // пусто
  duration: INTEGER  // секунды
}

attachments: {
  file_type: 'voice',
  waveform: JSON,  // [0.5, 0.8, 0.3, ...]
  transcript: TEXT  // Premium
}
```

---

### 3.3 Видеосообщения (Video Circle)

**Описание:** Короткие видео до 60 секунд (как в Telegram).

| Параметр | Значение |
|----------|----------|
| **Формат** | MP4 / WebM |
| **Длительность** | до 60 сек |
| **Размер** | до 50MB |
| **Соотношение** | 1:1 (круглое) |
| **Звук** | ✅ |

---

### 3.4 Аудиозвонки (Audio Call)

**Описание:** Информация о состоявшемся аудиозвонке.

```sql
messages: {
  type: 'call_log',
  call_info: {
    call_id: UUID,
    type: 'audio',
    duration: INTEGER,  // секунды
    status: 'completed' | 'missed' | 'declined',
    recording_path: STRING  // Premium
  }
}
```

---

### 3.5 Видеозвонки (Video Call)

**Описание:** Информация о состоявшемся видеозвонке.

```sql
messages: {
  type: 'call_log',
  call_info: {
    call_id: UUID,
    type: 'video',
    duration: INTEGER,
    status: 'completed' | 'missed' | 'declined',
    participants: [UUID],
    recording_path: STRING  // Premium
  }
}
```

---

### 3.6 Системные сообщения (System)

**Описание:** Автоматические сообщения о событиях в чате.

| Тип | Пример |
|-----|--------|
| `user_joined` | "Алексей присоединился к группе" |
| `user_left` | "Мария покинула группу" |
| `user_kicked` | "Дмитрий удалён из группы" |
| `role_changed` | "Назначен администратором" |
| `chat_renamed` | "Чат переименован в 'Рабочая группа'" |
| `avatar_changed` | "Аватар чата обновлён" |
| `encryption_enabled` | "Включено E2E шифрование" |

---

### 3.7 Сообщения с вложениями (Attachment)

**Описание:** Сообщения с файлами (фото, видео, документы).

```sql
messages: {
  type: 'attachment',
  content: 'Описание (caption)',  // опционально
  attachment_count: INTEGER
}
```

---

### 3.8 Опросы (Poll)

**Описание:** Интерактивные опросы с выбором вариантов.

```typescript
interface PollMessage {
  type: 'poll';
  question: string;
  options: {
    id: number;
    text: string;
    votes: number;
  }[];
  multiple_choice: boolean;  // можно выбрать несколько
  anonymous: boolean;        // анонимное голосование
  close_date?: TIMESTAMP;    // автозакрытие
  total_votes: number;
  user_vote?: number[];      // выбор текущего пользователя
}
```

---

### 3.9 Викторины (Quiz)

**Описание:** Опросы с правильным ответом.

```typescript
interface QuizMessage {
  type: 'quiz';
  question: string;
  options: {
    id: number;
    text: string;
    is_correct: boolean;
    explanation: string;  // объяснение ответа
  }[];
  correct_option: number;
  user_answer?: number;
  is_correct?: boolean;
}
```

---

### 3.10 Отмечаемые списки (Checklist)

**Описание:** Списки с отмечаемыми элементами.

```typescript
interface ChecklistMessage {
  type: 'checklist';
  title: string;
  items: {
    id: number;
    text: string;
    checked: boolean;
    checked_by?: UUID;
    checked_at?: TIMESTAMP;
  }[];
  completion_percentage: number;
}
```

---

### 3.11 Пересланные сообщения (Forwarded)

**Описание:** Сообщения, пересланные из другого чата.

```sql
messages: {
  type: 'text' | 'attachment' | ...,
  forward_from: {
    message_id: UUID,
    chat_id: UUID,
    chat_name: STRING,
    sender_id: UUID,
    sender_name: STRING,
    forwarded_at: TIMESTAMP
  }
}
```

---

### 3.12 Ответы (Reply)

**Описание:** Сообщения в ответ на другое сообщение.

```sql
messages: {
  type: 'text' | 'attachment' | ...,
  reply_to: {
    message_id: UUID,
    sender_id: UUID,
    sender_name: STRING,
    preview_text: STRING,  // первые 50 символов
    preview_attachment?: STRING  // тип вложения
  }
}
```

---

### 3.13 Редактированные сообщения (Edited)

**Описание:** Сообщения, которые были изменены.

```sql
messages: {
  is_edited: true,
  edited_at: TIMESTAMP,
  edit_history: [  // Premium: хранение истории
    {
      content: STRING,
      edited_at: TIMESTAMP
    }
  ]
}
```

---

### 3.14 Удалённые сообщения (Deleted)

**Описание:** Плейсхолдеры удалённых сообщений.

```sql
messages: {
  is_deleted: true,
  deleted_at: TIMESTAMP,
  deleted_by: UUID,
  delete_for: 'self' | 'all'
}
```

**Отображение:**
- Для себя: сообщение скрыто
- Для всех: "Сообщение удалено"

---

### 3.15 Сообщения с реакциями (With Reactions)

**Описание:** Сообщения с эмодзи-реакциями.

```sql
messages: {
  reactions: [
    {
      emoji: '👍',
      user_ids: [UUID, UUID, ...],
      count: INTEGER
    }
  ],
  max_reactions: 5  // лимит на сообщение
}
```

---

## 4. СИСТЕМА ВЛОЖЕНИЙ

### 4.1 Обзор

Balloo поддерживает 6 основных типов вложений с автоматической обработкой и оптимизацией.

```
┌────────────────────────────────────────────────────────────┐
│                    ATTACHMENT SYSTEM                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Image  │  │  Video  │  │  Audio  ││Document │       │
│  │  20MB   │  │  100MB  │  │  20MB   ││ 50MB/1GB│       │
│  │ JPEG    │  │  MP4    │  │  MP3    ││  PDF    │       │
│  │ PNG     │  │  WebM   │  │  OGG    ││  DOCX   │       │
│  │ WebP    │  │  MOV    │  │  WAV    ││  XLSX   │       │
│  │ GIF     │  │         │  │  M4A    ││  ZIP    │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│  ┌─────────┐  ┌─────────┐                                  │
│  │  Voice  │  │ Sticker │                                  │
│  │  10MB   │  │ 512KB   │                                  │
│  │ 5 мин   │  │ 512×512 │                                  │
│  │ WebM    │  │  WebP   │                                  │
│  │ OGG     │  │  PNG    │                                  │
│  └─────────┘  └─────────┘                                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

### 4.2 Фото (Image)

**Поддерживаемые форматы:** JPEG, PNG, WebP, GIF

| Параметр | Free | Premium |
|----------|------|---------|
| **Макс. размер** | 20MB | 1GB |
| **Обработка** | Sharp (оптимизация) | Sharp + AI-теги |
| **Thumbnail** | ✅ 256×256 | ✅ 512×512 |
| **EXIF** | ❌ Удаляется | ✅ Сохраняется |
| **Геометки** | ❌ Удаляются | ✅ Сохраняются |

**Обработка:**
```javascript
// Sharp pipeline
sharp(input)
  .resize(2048, 2048, { fit: 'inside' })
  .webp({ quality: 85 })
  .toFile(output_path);
```

**База данных:**
```sql
attachments: {
  file_type: 'image',
  width: INTEGER,
  height: INTEGER,
  thumbnail_path: STRING,
  public_url: STRING
}
```

---

### 4.3 Видео (Video)

**Поддерживаемые форматы:** MP4, WebM, MOV

| Параметр | Free | Premium |
|----------|------|---------|
| **Макс. размер** | 100MB | 1GB |
| **Макс. длительность** | 10 мин | 60 мин |
| **Транскодинг** | ✅ H.264 | ✅ H.265 (HEVC) |
| **Thumbnail** | ✅ 3 кадра | ✅ GIF-превью |
| **Субтитры** | ❌ | ✅ (SRT) |

**Обработка FFmpeg:**
```bash
# Транскодинг в H.264
ffmpeg -i input.mov \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -vf "scale=1280:720" \
  output.mp4

# Генерация thumbnail
ffmpeg -i input.mp4 \
  -vf "thumbnail,scale=320:180" \
  -frames:v 1 thumbnail.jpg
```

**База данных:**
```sql
attachments: {
  file_type: 'video',
  width: INTEGER,
  height: INTEGER,
  duration: INTEGER,  // секунды
  thumbnail_path: STRING,
  has_audio: BOOLEAN
}
```

---

### 4.4 Аудио (Audio)

**Поддерживаемые форматы:** MP3, OGG, WAV, M4A

| Параметр | Free | Premium |
|----------|------|---------|
| **Макс. размер** | 20MB | 1GB |
| **Транскодинг** | ✅ 128kbps | ✅ 320kbps |
| **Waveform** | ❌ | ✅ |
| **Метаданные** | ✅ ID3 | ✅ ID3 + Lyrics |

**Обработка FFmpeg:**
```bash
# Транскодинг в MP3 128kbps
ffmpeg -i input.wav \
  -c:a libmp3lame -b:a 128k \
  -ar 44100 \
  output.mp3
```

---

### 4.5 Документы (Document)

**Поддерживаемые форматы:** PDF, DOC, DOCX, XLS, XLSX, TXT, ZIP, RAR

| Параметр | Free | Premium |
|----------|------|---------|
| **Макс. размер** | 50MB | 1GB |
| **Предпросмотр** | ❌ | ✅ (PDF, DOCX) |
| **Антивирус** | ✅ | ✅ |
| **OCR** | ❌ | ✅ (PDF → текст) |

**База данных:**
```sql
attachments: {
  file_type: 'document',
  file_name: STRING,
  mime_type: STRING,
  file_size: INTEGER,
  preview_available: BOOLEAN
}
```

---

### 4.6 Голосовые сообщения (Voice)

**Формат:** WebM Audio (Opus codec)

| Параметр | Значение |
|----------|----------|
| **Макс. длительность** | 5 минут |
| **Макс. размер** | 10MB |
| **Bitrate** | 16kbps |
| **Sample rate** | 48kHz |
| **Waveform** | ✅ Генерируется |
| **Транскрипция** | ✅ Premium (AI) |

**Обработка:**
```javascript
// Генерация waveform
function generateWaveform(audioBuffer) {
  const samples = audioBuffer.getChannelData(0);
  const waveform = [];
  const blockSize = Math.floor(samples.length / 100);
  
  for (let i = 0; i < 100; i++) {
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(samples[i * blockSize + j]);
    }
    waveform.push(sum / blockSize);
  }
  
  return waveform;  // [0.5, 0.8, 0.3, ...]
}
```

---

### 4.7 Стикеры (Sticker)

**Формат:** WebP / PNG

| Параметр | Значение |
|----------|----------|
| **Размер** | 512×512px |
| **Макс. размер файла** | 512KB |
| **Прозрачность** | ✅ |
| **Анимация** | ❌ (V2: ✅ APNG) |
| **Пакеты** | ✅ Стикербук |

**Требования:**
- Равносторонний восьмиугольник (брутализм)
- Белый контур 4px
- Тень для объёма

---

### 4.8 Панель вложений (Attachment Panel)

**Описание:** Двухуровневая навигация по всем вложениям чата.

```
┌────────────────────────────────────────────┐
│  📷 Фото  │  📄 Документы  │  🎵 Аудио    │
│  🎬 Видео │  🎤 Голосовые  │  📦 Другое   │
├────────────────────────────────────────────┤
│                                            │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │        │  │        │  │        │       │
│  │  IMG   │  │  IMG   │  │  IMG   │  ...  │
│  │ 15.01  │  │ 14.01  │  │ 13.01  │       │
│  │ 2.4MB  │  │ 4.1MB  │  │ 1.8MB  │       │
│  └────────┘  └────────┘  └────────┘       │
│                                            │
│  🔍 Поиск  │  📅 Сортировка  │  ☑ Выбор   │
└────────────────────────────────────────────┘
```

**Функции:**
- Поиск по имени файла
- Сортировка (дата/размер/имя)
- Множественный выбор
- Пакетное скачивание (ZIP)
- Пакетное удаление

**API:**
```
GET /api/v1/chats/:id/attachments
  ?type=image|video|audio|document
  &limit=50
  &offset=0
  &sortBy=date|size|name
  &order=asc|desc
```

---

### 4.9 Просмотрщик вложений (Attachment Viewer)

**Описание:** Полноэкранный просмотр с зумом и навигацией.

**Для фото:**
- Zoom (pinch / scroll)
- Pan (drag)
- Swipe между медиа
- EXIF информация

**Для видео:**
- Плеер с controls
- Fullscreen
- Speed control (0.5x - 2x)
- Subtitles (Premium)

**Для документов:**
- Preview (PDF, DOCX)
- Скачать
- Открыть в приложении

**Для аудио:**
- Плеер с waveform
- Speed control
- Download

---

### 4.10 Хранение файлов

**Структура Yandex Disk:**
```
/balloo-storage/
├── users/
│   └── {user_id}/
│       └── attachments/
│           └── {attachment_id}.{ext}
├── chats/
│   └── {chat_id}/
│       └── attachments/
│           └── {attachment_id}.{ext}
└── temp/
    └── {session_id}/
        └── {file}.{ext}
```

**Политики:**
- Free: 30 дней хранения для непрочитанных
- Premium: Бессрочное хранение
- Secret Chats: Только на устройстве (не загружаются)

---

## 5. ИНТЕРАКТИВ СООБЩЕНИЙ

### 5.1 Реакции (Reactions)

**Описание:** Эмодзи-реакции на сообщения.

**Стандартные реакции (Free):**
```
👍 ❤️ 🔥 😂 😢 🎉 👏 🤔 😎 🤯 🥳 💯
```

**Premium реакции:**
- Анимированные эмодзи
- Кастомные стикеры
- Неограниченно на сообщение

**Лимиты:**
- Free: 5 реакций на сообщение
- Premium: 10 реакций на сообщение

**API:**
```
POST /api/v1/messages/:id/reactions
  { "emoji": "👍" }

DELETE /api/v1/messages/:id/reactions/:emoji

GET /api/v1/messages/:id/reactions
```

---

### 5.2 Ответы (Reply/Thread)

**Описание:** Ответ на конкретное сообщение.

**Отображение:**
```
┌────────────────────────────────────┐
│ ╭─ Алексей Иванов                 │
│ │ Привет! Как дела?               │
│ ╰──────────────────────────────   │
│                                    │
│ ╭─ Вы в ответ на "Привет!..."     │
│ │ Отлично, спасибо!               │
│ ╰──────────────────────────────   │
└────────────────────────────────────┘
```

**Функции:**
- Цитирование текста (первые 50 символов)
- Предпросмотр вложения
- Переход к исходному сообщению
- Удаление связи при удалении оригинала

---

### 5.3 Пересылка (Forward)

**Описание:** Пересылка сообщений в другие чаты.

**Ограничения:**
- Secret Chats: ❌ Запрещено
- Обычные чаты: ✅ Без ограничений
- Массовая пересылка: до 5 чатов за раз

**Отображение:**
```
┌────────────────────────────────────┐
│ ↪️ Переслано от Алексей Иванов    │
│                                    │
│ Привет! Как дела?                 │
└────────────────────────────────────┘
```

---

### 5.4 Редактирование (Edit)

**Описание:** Изменение отправленных сообщений.

**Лимиты:**
- Количество правок: до 3 раз
- Время: без ограничений
- История: Premium (хранение всех версий)

**Отображение:**
```
Привет! Как дела? (изменено)
```

**API:**
```
PATCH /api/v1/messages/:id
  { "content": "новый текст" }
```

---

### 5.5 Удаление (Delete)

**Описание:** Удаление сообщений.

**Типы удаления:**
- `for_self`: Только у себя
- `for_all`: У всех участников (до 48 часов)

**Поведение:**
```
┌────────────────────────────────────┐
│   Сообщение удалено               │
└────────────────────────────────────┘
```

**API:**
```
DELETE /api/v1/messages/:id
  ?for=all  // или for=self (по умолчанию)
```

---

### 5.6 Закрепление (Pin)

**Описание:** Закрепление важных сообщений вверху чата.

**Лимиты:**
- Free: 1 закреплённое сообщение
- Premium: 5 закреплённых сообщений

**Отображение:**
```
┌────────────────────────────────────┐
│ 📌 Закреплено: Встреча в 15:00    │
├────────────────────────────────────┤
│ ... обычные сообщения ...         │
└────────────────────────────────────┘
```

---

### 5.7 Избранное (Favorite/Star)

**Описание:** Сохранение сообщений в избранное.

**Доступ:**
- Отдельная вкладка в настройках
- Поиск по избранным
- Экспорт (Premium)

---

### 5.8 Самоуничтожение (Self-Destruct)

**Описание:** Автоматическое удаление сообщений через заданное время.

**Таймеры:**
- 5 секунд
- 1 минута
- 1 час
- 24 часа
- 7 дней

**Применение:**
- Secret Chats (по умолчанию)
- Обычные чаты (опционально)

**Реализация:**
```sql
messages: {
  self_destruct_ttl: INTEGER,  // секунды
  expires_at: TIMESTAMP
}

// Cron job каждую минуту
DELETE FROM messages 
WHERE expires_at IS NOT NULL 
  AND expires_at < NOW();
```

---

### 5.9 Перевод сообщений (Translate) — Premium

**Описание:** AI-перевод сообщений на лету.

**Поддерживаемые языки:** 50+

**Интеграция:**
- Yandex Translate API
- Google Translate API
- DeepL API

**Отображение:**
```
┌────────────────────────────────────┐
│ Hello! How are you?               │
│ ────────────────────────────────  │
│ Перевод: Привет! Как дела? 🌐     │
└────────────────────────────────────┘
```

---

### 5.10 Цитирование (Quote/Select Text)

**Описание:** Выделение и цитирование части сообщения.

**Функции:**
- Выделение текста
- Копирование
- Цитирование в ответе
- Поиск выделенного

---

### 5.11 Упоминания (Mentions)

**Описание:** Упоминание пользователей через @.

**Синтаксис:**
```
@username → ссылка на профиль
```

**Уведомления:**
- Push-уведомление при упоминании
- Выделение в чате (цвет)
- Отдельная вкладка "Упоминания"

---

### 5.12 Hashtags

**Описание:** Тегирование сообщений.

**Синтаксис:**
```
#важное #работа #проект
```

**Функции:**
- Клик → поиск по тегу
- Автодополнение
- Популярные теги в чате

---

## 6. СТАТУСЫ ДОСТАВКИ

### 6.1 Индикаторы статусов

```
⏱  Отправлено (на сервер)
✓  Доставлено (получателю)
✓✓ Прочитано (открыто получателем)
👁  Просмотрено (в списке чатов)
```

### 6.2 Поток статусов

```
┌─────────────────────────────────────────────────────────┐
│  ОТПРАВИТЕЛЬ                    ПОЛУЧАТЕЛЬ              │
│                                                         │
│  1. Сообщение отправлено                                │
│     ⏱                                                   │
│     │                                                   │
│     ▼                                                   │
│  2. Сервер получил                                      │
│     ⏱ → ✓ (у себя)                                      │
│     │                                                   │
│     ├─▶ Push-уведомление                                │
│     │                                                   │
│     ▼                                                   │
│  3. Получатель онлайн                                   │
│     ✓ → ✓✓                                              │
│     │                                                   │
│     ▼                                                   │
│  4. Получатель открыл                                   │
│     ✓✓ (отправителю)                                    │
└─────────────────────────────────────────────────────────┘
```

### 6.3 База данных

```sql
messages: {
  sent_at: TIMESTAMP,      // ⏱
  delivered_at: TIMESTAMP, // ✓
  read_at: TIMESTAMP,      // ✓✓
  viewed_at: TIMESTAMP     // 👁
}

read_receipts: {
  message_id: UUID,
  user_id: UUID,
  read_at: TIMESTAMP
}
```

### 6.4 API события (WebSocket)

```javascript
// Отправитель → Сервер
socket.emit('message:sent', { message_id, chat_id });

// Сервер → Получатель
socket.on('message:received', { message_id, chat_id });

// Получатель → Сервер (прочитано)
socket.emit('message:read', { message_id, chat_id });

// Сервер → Отправитель
socket.on('message:read-receipt', { message_id, read_by: [user_ids] });
```

### 6.5 Скрытие статусов (Privacy)

**Настройки приватности:**
```
Показывать статус прочтения: [Все / Контакты / Никто]
Показывать онлайн: [Все / Контакты / Никто]
```

**При отключении:**
- Вы не видите статусы других
- Другие не видят ваши статусы

---

## 7. E2E ШИФРОВАНИЕ

### 7.1 Signal Protocol V2

**Описание:** End-to-End шифрование на базе Signal Protocol.

**Компоненты:**
- **X3DH** — Extended Triple Diffie-Hellman (установка сессии)
- **Double Ratchet** — постоянная смена ключей
- **AES-256-GCM** — шифрование сообщений
- **HMAC-SHA256** — аутентификация

### 7.2 Генерация ключей

```javascript
// При регистрации
const keyPair = nacl.box.keyPair();
const publicKey = keyPair.publicKey;  // сохраняется на сервере
const secretKey = keyPair.secretKey;  // только на устройстве

// Сохранение
localStorage.setItem('balloo_secret_key', encrypt(secretKey, password));
```

### 7.3 Установка сессии

```
┌─────────────┐                           ┌─────────────┐
│  Алиса      │                           │  Боб        │
│             │                           │             │
│  PreKeys    │───▶ Сервер (публичные) ───▶│  PreKeys    │
│  (100 шт)   │                           │  (100 шт)   │
│             │                           │             │
│  Session    │◀─── X3DH Key Exchange ───▶│  Session    │
│  Established│                           │  Established│
└─────────────┘                           └─────────────┘
```

### 7.4 Double Ratchet

**Принцип работы:**
```
Сообщение 1: SK = KDF(SK_prev, DH_out1)
Сообщение 2: SK = KDF(SK_prev, DH_out2)
Сообщение 3: SK = KDF(SK_prev, DH_out3)
...
```

**Преимущества:**
- Forward secrecy (прошлые сообщения не расшифровать)
- Future secrecy (будущие сообщения не расшифровать при компрометации)

### 7.5 Групповое E2E (MLS — Messaging Layer Security)

**Для групп до 50 участников:**
- Sender Keys
- Distribution Tree
- Key Rotation при входе/выходе

### 7.6 Верификация ключей

**QR-код:**
```
┌─────────────────────────┐
│  🔐 Безопасность        │
│                         │
│  [QR-код]               │
│                         │
│  Ключи совпадают ✅     │
│                         │
│  1234 5678 9012 3456    │
└─────────────────────────┘
```

---

## 8. PREMIUM ФУНКЦИИ

### 8.1 Сравнение Free vs Premium

| Функция | Free | Premium |
|---------|------|---------|
| **Вложения** | 20MB | 1GB |
| **Группы** | 200 чел | 5000 чел |
| **Каналы** | ❌ | ✅ |
| **Secret Chats** | ❌ | ✅ |
| **Запись звонков** | ❌ | ✅ |
| **Транскрипция** | ❌ | ✅ |
| **Перевод** | ❌ | ✅ (50 языков) |
| **Редактирование** | 3 раза | Безлимит |
| **История правок** | ❌ | ✅ |
| **Закреплённые** | 1 | 5 |
| **Реакции** | 5 на сообщение | 10 + анимированные |
| **Голосовые чаты** | ❌ | ✅ |
| **Приоритет поддержки** | Обычный | VIP |

### 8.2 Secret Chats (Premium)

**Функции:**
- E2E шифрование Signal Protocol
- Self-destruct таймер
- Запрет пересылки
- Запрет скриншотов (уведомление)
- Запись звонков (шифрованная)

### 8.3 Запись звонков (Premium)

**Формат:** M4A (Audio), MP4 (Video)

**Хранение:**
- Шифрование на устройстве
- Yandex Disk (приватная папка)
- Доступ только у владельца

### 8.4 Транскрипция (Premium)

**AI-распознавание речи:**
- Голосовые сообщения → текст
- Звонки → стенограмма
- Точность: 95% (русский), 90% (английский)

---

## 9. V2 ФУНКЦИИ (ОТЛОЖЕННЫЕ)

### 9.1 Балунишка (AI Assistant)

**Функции:**
- Smart Reply (автоответы)
- Суммаризация чатов
- Перевод в реальном времени
- Поиск по смыслу (semantic search)

### 9.2 Маркетплейс

**Описание:** Покупка и продажа цифровых товаров.

**Категории:**
- Дизайн (логотипы, баннеры)
- Разработка (боты, скрипты)
- Тексты (копирайтинг)
- Аудио (джинглы, подкасты)

**Escrow-защита:**
- Деньги замораживаются
- Выплата после подтверждения

### 9.3 Кошелёк (Wallet)

**Функции:**
- Баланс в рублях
- Привязка карт
- P2P-переводы
- Оплата Premium

### 9.4 Каналы с монетизацией

**Для авторов:**
- Платные подписки
- Донаты
- Реклама

### 9.5 Треды (Threads)

**Описание:** Ветвящиеся обсуждения в группах.

```
Основное сообщение
├─ Ответ 1
│  └─ Ответ 1.1
├─ Ответ 2
└─ Ответ 3
```

### 9.6 White Label

**Описание:** Кастомизация мессенджера для компаний.

**Возможности:**
- Своё лого
- Свои цвета
- Свой домен
- Отдельный сервер

---

## 10. API ENDPOINTS

### 10.1 Сообщения

```
POST   /api/v1/messages              # Отправить сообщение
GET    /api/v1/chats/:id/messages    # Получить сообщения
PATCH  /api/v1/messages/:id          # Редактировать
DELETE /api/v1/messages/:id          # Удалить
POST   /api/v1/messages/:id/reactions # Добавить реакцию
DELETE /api/v1/messages/:id/reactions/:emoji

POST   /api/v1/messages/:id/forward   # Переслать
POST   /api/v1/messages/:id/reply     # Ответить
POST   /api/v1/messages/:id/pin       # Закрепить
POST   /api/v1/messages/:id/favorite  # В избранное
```

### 10.2 Вложения

```
POST   /api/v1/attachments/upload     # Загрузить файл
GET    /api/v1/attachments/:id        # Получить файл
DELETE /api/v1/attachments/:id        # Удалить файл
GET    /api/v1/chats/:id/attachments  # Список вложений
```

### 10.3 Чаты

```
POST   /api/v1/chats                  # Создать чат
GET    /api/v1/chats                  # Список чатов
GET    /api/v1/chats/:id              # Детали чата
PATCH  /api/v1/chats/:id              # Обновить чат
DELETE /api/v1/chats/:id              # Удалить чат
POST   /api/v1/chats/:id/members      # Добавить участника
DELETE /api/v1/chats/:id/members/:uid # Удалить участника
```

### 10.4 WebSocket события

```javascript
// Клиент → Сервер
socket.emit('message:send', data);
socket.emit('message:read', { message_id });
socket.emit('typing:start', { chat_id });
socket.emit('typing:stop', { chat_id });
socket.emit('call:start', { chat_id, type });

// Сервер → Клиент
socket.on('message:new', data);
socket.on('message:delivered', { message_id });
socket.on('message:read', { message_id, user_id });
socket.on('typing:update', { chat_id, users });
socket.on('call:incoming', data);
socket.on('user:online', { user_id });
socket.on('user:offline', { user_id });
```

---

## 11. БАЗА ДАННЫХ

### 11.1 Таблица `messages`

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  
  type VARCHAR(50) NOT NULL,  -- text, voice, video, attachment, poll, etc.
  content TEXT,
  
  -- E2E
  encrypted_content BYTEA,
  encryption_key_id UUID,
  
  -- Связи
  reply_to_id UUID REFERENCES messages(id),
  forward_from_id UUID REFERENCES messages(id),
  
  -- Статусы
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deleted_by UUID REFERENCES users(id),
  
  -- Self-destruct
  self_destruct_ttl INTEGER,  -- секунды
  expires_at TIMESTAMP,
  
  -- Метаданные
  duration INTEGER,  -- для voice/video
  views_count INTEGER DEFAULT 0,
  forwar
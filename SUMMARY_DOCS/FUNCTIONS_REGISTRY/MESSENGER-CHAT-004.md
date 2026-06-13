---
function_id: MESSENGER-CHAT-004
name: Отправка сообщений
module: messenger
category: chat
status: implemented
priority: high
completion: 100%
created: 2026-06-13
updated: 2026-06-13
---

# 📝 Функция: Отправка сообщений

**ID:** `MESSENGER-CHAT-004`  
**Модуль:** Messenger (Web)  
**Категория:** Чаты  
**Статус:** ✅ Реализовано  
**Приоритет:** 🔴 Высокий

---

## 📖 Описание

### Короткое (для пользователей)
Отправляйте текстовые сообщения с форматированием, эмодзи, изображениями, видео и файлами в реальном времени.

### Длинное (для сотрудников)
Полноценная система отправки сообщений с поддержкой форматирования текста (bold, italic, code, links), вставкой эмодзи, прикреплением файлов различных типов (изображения, видео, аудио, документы), отображением статуса отправки и доставки. Сообщения отправляются через WebSocket в реальном времени.

### Техническое (для разработчиков)
REST API `POST /api/v1/chats/:id/messages` + WebSocket event `message:new`. Поддержка multipart/form-data для файлов. Шифрование E2E через crypto-js. Сообщения сохраняются в SQLite с последующей синхронизацией через WebSocket.

---

## 🎯 Компоненты

### React компоненты
```json
[
  "src/components/Chat/MessageInput.tsx",
  "src/components/Chat/MessageList.tsx",
  "src/components/Chat/MessageBubble.tsx",
  "src/components/Chat/EmojiPicker.tsx",
  "src/components/Chat/FileUploader.tsx",
  "src/components/Chat/VoiceRecorder.tsx",
  "src/components/Chat/TypingIndicator.tsx",
  "src/components/Chat/MessageStatus.tsx",
  "src/components/Chat/FormattingToolbar.tsx"
]
```

### Хуки
```json
[
  "useSendMessage()",
  "useChatMessages(chatId)",
  "useWebSocket()",
  "useTyping(chatId)",
  "useMessageStatus(messageId)"
]
```

---

## 🔌 API Endpoints

### Отправка сообщения
```
POST /api/v1/chats/:chatId/messages
Content-Type: application/json или multipart/form-data

Request (JSON):
{
  "content": "string (текст сообщения)",
  "messageType": "text | image | video | file | audio",
  "mediaUrl": "string (опционально, URL медиа)",
  "replyTo": "number (опционально, ID сообщения для ответа)",
  "encrypted": true
}

Request (multipart/form-data):
{
  "content": "string",
  "file": File
}

Response (200):
{
  "success": true,
  "data": {
    "message": {
      "id": 123,
      "chatId": 456,
      "senderId": 1,
      "content": "Привет!",
      "messageType": "text",
      "encrypted": true,
      "status": "sent",
      "created_at": "2026-06-13T10:00:00Z"
    }
  }
}
```

### WebSocket событие
```javascript
// Клиент отправляет
ws.send(JSON.stringify({
  type: 'message:new',
  payload: {
    chatId: 456,
    content: 'Привет!',
    messageType: 'text'
  }
}));

// Сервер рассылает всем в чате
{
  type: 'message:new',
  data: {
    id: 123,
    chatId: 456,
    senderId: 1,
    content: 'Привет!',
    messageType: 'text',
    created_at: '2026-06-13T10:00:00Z'
  }
}
```

---

## 🗄️ Таблицы БД

### messages
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT,
    message_type TEXT DEFAULT 'text',  -- text, image, video, file, audio
    media_url TEXT,
    encrypted BOOLEAN DEFAULT TRUE,
    signature TEXT,
    reply_to INTEGER,
    status TEXT DEFAULT 'sent',  -- sent, delivered, read, failed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    edited_at DATETIME,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

## 🎨 UI Элементы

### Страницы
```json
[
  "/chat/[id]"
]
```

### Вкладки
```json
[
  { "name": "Сообщения", "active": true },
  { "name": "Медиа", "link": "/chat/[id]/media" },
  { "name": "Файлы", "link": "/chat/[id]/files" },
  { "name": "Инфо", "link": "/chat/[id]/info" }
]
```

### Кнопки
```json
[
  { "name": "SendButton", "icon": "send", "action": "sendMessage" },
  { "name": "EmojiButton", "icon": "smile", "action": "toggleEmojiPicker" },
  { "name": "AttachButton", "icon": "paperclip", "action": "openFilePicker" },
  { "name": "VoiceButton", "icon": "mic", "action": "toggleVoiceRecording" },
  { "name": "FormatButton", "icon": "bold", "action": "toggleFormatting" }
]
```

### Формы
```json
[
  {
    "name": "MessageInputForm",
    "fields": [
      { "name": "content", "type": "textarea", "placeholder": "Введите сообщение...", "maxLength": 4096 },
      { "name": "file", "type": "file", "accept": "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx", "multiple": true }
    ],
    "buttons": [
      { "type": "submit", "icon": "send", "tooltip": "Отправить" },
      { "type": "button", "icon": "smile", "tooltip": "Эмодзи" },
      { "type": "button", "icon": "paperclip", "tooltip": "Прикрепить файл" },
      { "type": "button", "icon": "mic", "tooltip": "Голосовое сообщение" }
    ]
  }
]
```

---

## 🔐 Авторизация

### Методы
```json
[
  "jwt"
]
```

### Разрешения
```json
[
  "chat:send_message",
  "chat:read_messages"
]
```

### Роли
```json
[
  "user",
  "admin",
  "moderator"
]
```

---

## 📎 Вложения

### Типы вложений
```json
[
  "image",
  "video",
  "file",
  "audio",
  "document"
]
```

### Поддерживаемые форматы
```json
{
  "image": ["image/jpeg", "image/png", "image/gif", "image/webp"],
  "video": ["video/mp4", "video/webm", "video/quicktime"],
  "audio": ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm"],
  "document": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
}
```

### Максимальный размер
```
50 MB (настраивается в system_settings: files.max_size)
```

---

## 🖼️ Медиа

### Иконка
```
/icons/chat/send-message.svg
```

### Скриншот
```
/screenshots/chat/message-input.png
```

### Демо
```
https://balloo.demo/chat/send-message
```

---

## 📊 Метрики

| Метрика | Значение |
|---------|----------|
| Среднее время отправки | < 100 мс |
| Сообщений в день | ~50 на пользователя |
| Файлов в день | ~5 на пользователя |
| Ошибок отправки | < 1% |

---

## 📝 История изменений

| Дата | Версия | Изменения | Кто |
|------|--------|-----------|-----|
| 2026-06-13 | 1.0.0 | Initial implementation | Koda |
| 2026-06-13 | 1.0.1 | Added file attachments | Koda |
| 2026-06-13 | 1.0.2 | Added emoji picker | Koda |

---

## 🔗 Связанные функции

- MESSENGER-CHAT-001 (Список чатов)
- MESSENGER-CHAT-003 (Открытие чата)
- MESSENGER-CHAT-005 (Удаление сообщений)
- MESSENGER-FILE-001 (Загрузка файлов)
- MESSENGER-CALL-001 (Аудио звонки)

---

## 🏷️ Теги

```
messaging, chat, send-message, attachments, emoji, real-time, websocket, e2e-encryption
```

---

**Документ создан:** 2026-06-13  
**Последнее обновление:** 2026-06-13  
**Статус:** Актуально

---

**🎈 Balloo - Share your moments safely!**

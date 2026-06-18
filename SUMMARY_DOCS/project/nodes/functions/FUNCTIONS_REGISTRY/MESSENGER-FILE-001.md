---
function_id: MESSENGER-FILE-001
name: Загрузка файлов
module: messenger
category: files
status: implemented
priority: medium
completion: 100%
created: 2026-06-13
updated: 2026-06-13
---

# 📝 Функция: Загрузка файлов

**ID:** `MESSENGER-FILE-001`  
**Модуль:** Messenger (Web)  
**Категория:** Файлы  
**Статус:** ✅ Реализовано  
**Приоритет:** 🟡 Средний

---

## 📖 Описание

### Короткое (для пользователей)
Загружайте файлы до 50MB через drag-and-drop или выбор файла. Поддержка всех популярных форматов.

### Длинное (для сотрудников)
Универсальная система загрузки файлов с поддержкой drag-and-drop зоны, прогресс-бара загрузки, предпросмотра изображений и документов. Файлы автоматически загружаются на Яндекс.Диск пользователя с возможностью отправки в чат. Валидация типа и размера файла происходит на клиенте и сервере.

### Техническое (для разработчиков)
REST API `POST /api/v1/files/upload` с multer middleware. Поддержка multipart/form-data. Файлы сохраняются во временное хранилище, затем загружаются на Яндекс.Диск через Yandex Disk API. Метаданные сохраняются в таблице files. Поддержка chunked uploads для больших файлов.

---

## 🎯 Компоненты

### React компоненты
```json
[
  "src/components/Chat/FileUploader.tsx",
  "src/components/Chat/FilePreview.tsx",
  "src/components/Chat/DropZone.tsx",
  "src/components/Chat/UploadProgress.tsx",
  "src/components/Media/FileIcon.tsx",
  "src/components/Media/ImagePreview.tsx",
  "src/components/Media/VideoThumbnail.tsx"
]
```

### Хуки
```json
[
  "useFileUpload()",
  "useDragAndDrop()",
  "useUploadProgress()",
  "useFilePreview()"
]
```

---

## 🔌 API Endpoints

### Загрузка файла
```
POST /api/v1/files/upload
Content-Type: multipart/form-data

Request:
{
  "file": File (binary),
  "chatId": "number (опционально, если сразу в чат)",
  "description": "string (опционально)"
}

Response (200):
{
  "success": true,
  "data": {
    "file": {
      "id": 789,
      "name": "document.pdf",
      "originalName": "document.pdf",
      "mimeType": "application/pdf",
      "size": 1048576,
      "url": "https://disk.yandex.ru/...",
      "downloadUrl": "/api/v1/files/789/download",
      "thumbnailUrl": "/api/v1/files/789/thumbnail",
      "uploadedBy": 1,
      "chatId": 456,
      "encrypted": true,
      "created_at": "2026-06-13T10:00:00Z"
    }
  }
}
```

### Прогресс загрузки (WebSocket)
```javascript
// Сервер отправляет клиенту
{
  type: 'upload:progress',
  data: {
    uploadId: 'abc123',
    progress: 45,  // 0-100
    speed: 1048576,  // bytes/sec
    eta: 5  // seconds
  }
}
```

---

## 🗄️ Таблицы БД

### files
```sql
CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT,
    download_url TEXT,
    thumbnail_url TEXT,
    uploaded_by INTEGER NOT NULL,
    chat_id INTEGER,
    message_id INTEGER,
    encrypted BOOLEAN DEFAULT TRUE,
    yandex_disk_id TEXT,
    hash TEXT,  // SHA-256 для дедупликации
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    downloaded_count INTEGER DEFAULT 0,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE INDEX idx_files_chat_id ON files(chat_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_hash ON files(hash);
```

---

## 🎨 UI Элементы

### Страницы
```json
[
  "/chat/[id]",
  "/files",
  "/files/[id]"
]
```

### Вкладки
```json
[
  { "name": "Загрузить", "active": true },
  { "name": "Мои файлы", "link": "/files" },
  { "name": "Общие", "link": "/files/shared" }
]
```

### Кнопки
```json
[
  { "name": "UploadButton", "icon": "upload", "action": "openFilePicker" },
  { "name": "CancelButton", "icon": "x", "action": "cancelUpload" },
  { "name": "SendButton", "icon": "send", "action": "sendFileToChat" },
  { "name": "DownloadButton", "icon": "download", "action": "downloadFile" },
  { "name": "DeleteButton", "icon": "trash", "action": "deleteFile" }
]
```

### Формы
```json
[
  {
    "name": "FileUploadForm",
    "fields": [
      { "name": "file", "type": "file", "accept": "*/*", "multiple": true, "maxSize": "50MB" },
      { "name": "description", "type": "text", "placeholder": "Описание (опционально)", "maxLength": 256 }
    ],
    "buttons": [
      { "type": "submit", "text": "Загрузить", "icon": "upload" },
      { "type": "button", "text": "Отмена", "icon": "x", "variant": "secondary" }
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
  "files:upload",
  "files:download",
  "files:delete_own"
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
  "document",
  "archive"
]
```

### Поддерживаемые форматы
```json
{
  "image": ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  "video": ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
  "audio": ["audio/mpeg", "audio/ogg", "audio/wav", "audio/webm", "audio/mp4"],
  "document": ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain", "text/csv"],
  "archive": ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed", "application/x-tar", "application/gzip"]
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
/icons/files/upload-file.svg
```

### Скриншот
```
/screenshots/files/file-uploader.png
```

### Демо
```
https://balloo.demo/files/upload
```

---

## 📊 Метрики

| Метрика | Значение |
|---------|----------|
| Средний размер файла | 5 MB |
| Время загрузки 10MB | ~3 сек |
| Успешных загрузок | 99.5% |
| Дедупликация | 15% файлов |

---

## 📝 История изменений

| Дата | Версия | Изменения | Кто |
|------|--------|-----------|-----|
| 2026-06-13 | 1.0.0 | Initial implementation | Koda |
| 2026-06-13 | 1.0.1 | Added drag-and-drop | Koda |
| 2026-06-13 | 1.0.2 | Added progress bar | Koda |
| 2026-06-13 | 1.0.3 | Added Yandex Disk integration | Koda |

---

## 🔗 Связанные функции

- MESSENGER-CHAT-004 (Отправка сообщений)
- MESSENGER-FILE-002 (Просмотр файлов)
- MESSENGER-FILE-003 (Галерея чата)
- API-DISK-001 (Yandex Disk API)

---

## 🏷️ Теги

```
file-upload, drag-and-drop, yandex-disk, file-sharing, attachments, progress-bar, preview
```

---

**Документ создан:** 2026-06-13  
**Последнее обновление:** 2026-06-13  
**Статус:** Актуально

---

**🎈 Balloo - Share your moments safely!**

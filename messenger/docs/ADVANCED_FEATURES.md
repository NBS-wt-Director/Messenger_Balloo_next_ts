# Balloo Messenger - Продвинутые Функции

## 📋 Содержание

1. [Яндекс.Диск Интеграция](#яндексдиск-интеграция)
2. [End-to-End Шифрование](#endtoend-шифрование)
3. [Демонстрация Экрана](#демонстрация-экрана)
4. [Синхронизация Устройств](#синхронизация-устройств)
5. [Бэкап и Восстановление](#бэкап-и-восстановление)

---

## 🗂️ Яндекс.Диск Интеграция

### Обзор

Полная интеграция с Яндекс.Диском для хранения файлов. Все вложения загружаются на Яндекс.Диск с возможностью E2E шифрования.

### API Endpoints

#### Загрузка файла
**POST** `/api/yandex-disk/upload`

Загружает файл на Яндекс.Диск с поддержкой шифрования.

**Request (multipart/form-data):**
```
file: File
messageId: string
chatId: string
uploaderId: string
encrypt: boolean (опционально)
```

**Response:**
```json
{
  "success": true,
  "attachment": {
    "id": "att_123",
    "fileName": "document.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1048576,
    "url": "https://downloader.disk.yandex.ru/...",
    "yandexDiskPath": "/balloo/user123/chat456/file.pdf",
    "yandexDiskId": "file_id",
    "type": "pdf",
    "encrypted": false,
    "embedUrl": "https://view.officeapps.live.com/op/embed.aspx?src=...",
    "previewUrl": "https://...",
    "width": null,
    "height": null,
    "duration": null
  },
  "uploadTime": 1234567890000
}
```

#### Получение информации о файле
**GET** `/api/yandex-disk?path=PATH`

**Response:**
```json
{
  "success": true,
  "file": {
    "name": "document.pdf",
    "size": 1048576,
    "type": "application/pdf",
    "created": "2024-01-01T12:00:00Z",
    "modified": "2024-01-01T12:00:00Z",
    "url": "https://downloader.disk.yandex.ru/..."
  }
}
```

#### Удаление файла
**DELETE** `/api/yandex-disk?path=PATH`

**Response:**
```json
{
  "success": true,
  "message": "Файл удален"
}
```

### Встраивание Файлов

#### PDF Документы
Автоматически отображаются через Google Docs Viewer:
```
https://docs.google.com/viewer?url=<URL>&embedded=true
```

#### Office Документы (Word, Excel, PowerPoint)
Отображаются через Office Online:
```
https://view.officeapps.live.com/op/embed.aspx?src=<URL>
```

#### Изображения
Отображаются напрямую с поддержкой превью:
```html
<img src="<URL>?size=400x400" alt="Preview" />
```

#### Видео
Встраиваются через HTML5 video:
```html
<video controls src="<URL>" />
```

### Настройка

1. Получите OAuth2 токен Яндекс.Диска:
   - https://oauth.yandex.ru/
   - Создайте приложение
   - Получите токен с правами на диск

2. Добавьте в `.env.local`:
```env
YANDEX_DISK_OAUTH_TOKEN=ваш_токен
```

### Типы Вложений

| Тип | MIME | Встраивание | Превью |
|-----|------|-------------|--------|
| Изображения | image/* | Да | Да |
| PDF | application/pdf | Google Viewer | Да |
| Word | application/msword | Office Online | Нет |
| Excel | application/vnd.ms-excel | Office Online | Нет |
| PowerPoint | application/vnd.ms-powerpoint | Office Online | Нет |
| Видео | video/* | HTML5 Video | Да |
| Аудио | audio/* | HTML5 Audio | Нет |
| Документы | application/* | Нет | Нет |

---

## 🔐 End-to-End Шифрование

### Обзор

Полное сквозное шифрование всех сообщений и файлов. Ключи хранятся только на устройствах пользователей.

### Алгоритмы

- **RSA-OAEP 2048** - Обмен ключами
- **AES-GCM 256** - Шифрование сообщений
- **ECDH** - Генерация общих ключей

### API Шифрования

#### Генерация пары ключей
```typescript
import { generateKeyPair } from '@/lib/e2e';

const keyPair = await generateKeyPair();
// { publicKey, privateKey, keyId, createdAt }
```

#### Шифрование сообщения
```typescript
import { encryptMessage } from '@/lib/e2e';

const encrypted = await encryptMessage('Secret message', aesKey);
// { ciphertext, iv, authTag, keyId, timestamp }
```

#### Расшифровка сообщения
```typescript
import { decryptMessage } from '@/lib/e2e';

const decrypted = await decryptMessage(encryptedData, aesKey);
// 'Secret message'
```

#### Шифрование файла
```typescript
import { encryptFile } from '@/lib/e2e';

const { encryptedData, encryptionInfo, key } = await encryptFile(file);
```

### Хранение Ключей

#### IndexedDB Storage
```typescript
import { KeyStorage } from '@/lib/e2e';

const storage = new KeyStorage();
await storage.init();
await storage.saveKey(keyId, keyData);
const key = await storage.getKey(keyId);
```

### Обмен Ключами

1. **Генерация ключей** на устройстве отправителя
2. **Шифрование AES ключа** публичным ключом получателя (RSA-OAEP)
3. **Отправка** зашифрованного ключа через сервер
4. **Расшифровка** приватным ключом получателя
5. **Использование** общего AES ключа для сообщений

### Синхронизация Ключей

**POST** `/api/sync/keys`

Сохранение ключей для синхронизации между устройствами.

**Request:**
```json
{
  "userId": "user_123",
  "deviceId": "device_456",
  "keys": [
    {
      "keyId": "key_abc",
      "publicKey": "...",
      "encryptedPrivateKey": "..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Saved 3 keys",
  "syncedAt": 1234567890000
}
```

**GET** `/api/sync/keys?userId=USER_ID`

Получение синхронизированных ключей.

**Response:**
```json
{
  "success": true,
  "keys": [
    {
      "keyId": "key_abc",
      "publicKey": "...",
      "encryptedPrivateKey": "...",
      "createdAt": 1234567890000
    }
  ],
  "count": 3
}
```

---

## 🖥️ Демонстрация Экрана

### Обзор

Демонстрация экрана, окон или вкладок браузера через WebRTC GetDisplayMedia API.

### Библиотека

```typescript
import {
  startScreenShare,
  stopScreenShare,
  toggleCamera,
  changeQuality,
  isScreenShareSupported
} from '@/lib/screen-share';
```

### Начало Демонстрации

```typescript
const session = await startScreenShare({
  withAudio: true,
  quality: 'high',
  frameRate: 30
});

console.log('Session:', session);
// { stream, track, sessionId, startedAt, viewers }
```

### Остановка Демонстрации

```typescript
stopScreenShare(session);
```

### Переключение Камеры

```typescript
// Включить камеру поверх демонстрации
const cameraStream = await toggleCamera(session, true);

// Выключить камеру
await toggleCamera(session, false);
```

### Изменение Качества

```typescript
await changeQuality(session, 'medium');
// 'low' (640x480, 15fps)
// 'medium' (1280x720, 24fps)
// 'high' (1920x1080, 30fps)
```

### Статистика

```typescript
const stats = getScreenShareStats(session);
// {
//   duration: 120000,
//   resolution: { width: 1920, height: 1080 },
//   frameRate: 30,
//   viewers: 5
// }
```

### Проверка Поддержки

```typescript
if (isScreenShareSupported()) {
  console.log('Screen sharing is supported');
}

const sources = await getAvailableSources();
// { monitors: true, windows: true, tabs: true, audio: false }
```

### WebRTC Signaling

**POST** `/api/webrtc/signal`

Отправка SDP offer/answer или ICE candidate.

**Request:**
```json
{
  "type": "offer",
  "from": "user_1",
  "to": "user_2",
  "chatId": "chat_123",
  "data": {
    "sdp": "v=0\r\no=- ..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "offer_1234567890",
  "timestamp": 1234567890000
}
```

**GET** `/api/webrtc/signal?userId=USER_ID&chatId=CHAT_ID`

Получение сигнальных сообщений.

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "type": "offer",
      "from": "user_1",
      "to": "user_2",
      "chatId": "chat_123",
      "data": { "sdp": "..." },
      "timestamp": 1234567890000
    }
  ]
}
```

---

## 🔄 Синхронизация Устройств

### Обзор

Автоматическая синхронизация данных между всеми устройствами пользователя через IndexedDB и сервер.

### Компоненты

1. **Ключи шифрования** - синхронизация E2E ключей
2. **Сообщения** - доставка на все устройства
3. **Настройки** - тема, язык, уведомления
4. **Контакты** - список контактов
5. **Чаты** - состояние чатов

### Синхронизация Ключей

```typescript
import { syncKeysToDevice, getKeysFromSync } from '@/lib/e2e';

// Сохранение ключей на сервер
await syncKeysToDevice(userId, deviceId, keyPairs);

// Получение ключей с сервера
const keys = await getKeysFromSync(userId);
```

### Конфликт Разрешение

При одновременном изменении с разных устройств:
- **Последняя запись побеждает** (по timestamp)
- **Сообщения** - объединяются все
- **Настройки** - последняя версия
- **Ключи** - добавляются новые

### Статус Синхронизации

```typescript
interface SyncStatus {
  lastSync: number;
  pendingChanges: number;
  devices: {
    deviceId: string;
    lastSeen: number;
    status: 'online' | 'offline'
  }[];
}
```

---

## 💾 Бэкап и Восстановление

### Обзор

Полный бэкап базы данных через админ-панель с возможностью восстановления.

### API Endpoints

#### Создание Бэкапа

**POST** `/api/admin/backup`

**Request:**
```json
{
  "adminId": "admin_123",
  "includeMessages": true,
  "includeAttachments": false
}
```

**Response:**
```json
{
  "success": true,
  "backup": {
    "version": "1.0",
    "timestamp": 1234567890000,
    "size": 5242880,
    "records": {
      "users": 100,
      "chats": 50,
      "messages": 10000,
      "invitations": 25,
      "attachments": 500,
      "contacts": 200,
      "notifications": 1000
    }
  },
  "data": { ... },
  "downloadUrl": "/api/admin/backup/download?timestamp=1234567890000",
  "message": "Бэкап создан успешно"
}
```

#### Получение Списка Бэкапов

**GET** `/api/admin/backup?adminId=ADMIN_ID`

**Response:**
```json
{
  "success": true,
  "backups": [
    {
      "id": "backup_1",
      "timestamp": 1234567890000,
      "size": 5242880,
      "records": {
        "users": 100,
        "chats": 50,
        "messages": 10000
      }
    }
  ],
  "count": 2
}
```

#### Восстановление из Бэкапа

**POST** `/api/admin/backup/restore`

**Request:**
```json
{
  "adminId": "admin_123",
  "backupData": { ... },
  "options": {
    "restoreUsers": true,
    "restoreChats": true,
    "restoreMessages": true,
    "restoreContacts": true,
    "restoreInvitations": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": 100,
    "chats": 50,
    "messages": 10000,
    "invitations": 25,
    "attachments": 500,
    "contacts": 200,
    "notifications": 1000
  },
  "message": "Восстановление завершено",
  "restoredAt": 1234567890000
}
```

#### Удаление Бэкапа

**DELETE** `/api/admin/backup`

**Request:**
```json
{
  "adminId": "admin_123",
  "backupId": "backup_1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Бэкап удален"
}
```

### Формат Бэкапа

```json
{
  "version": "1.0",
  "timestamp": 1234567890000,
  "users": [...],
  "chats": [...],
  "messages": [...],
  "invitations": [...],
  "attachments": [...],
  "contacts": [...],
  "notifications": [...],
  "settings": {
    "backupCreated": "2024-01-01T12:00:00Z",
    "includeMessages": true,
    "includeAttachments": false,
    "totalRecords": {...}
  }
}
```

### Админ-панель

В разделе **Настройки** → **Бэкап и Восстановление**:

- Кнопка "Создать бэкап"
- Список бэкапов с датами и размерами
- Кнопка "Восстановить" для каждого бэкапа
- Опции восстановления (выбор типов данных)
- Кнопка "Удалить" для старых бэкапов
- Статистика использования хранилища

---

## 📊 Статистика Реализации

| Функция | Файлов | Строк кода | API Endpoints |
|---------|--------|------------|---------------|
| Яндекс.Диск | 1 | 300+ | 3 |
| E2E Шифрование | 1 | 400+ | 2 |
| Демонстрация экрана | 1 | 250+ | 3 |
| Синхронизация | 1 | 150+ | 2 |
| Бэкап/Восстановление | 2 | 300+ | 4 |
| **Итого** | **6** | **1400+** | **14** |

---

## 🔧 Настройка

### Переменные окружения

```env
# Яндекс.Диск
YANDEX_DISK_OAUTH_TOKEN=ваш_токен

# E2E Шифрование
E2E_KEY_PREFIX=balloo_e2e_

# WebRTC
WEBRTC_ICE_SERVERS=[{"urls":"stun:stun.l.google.com:19302"}]
```

### Требования

- **Браузеры**: Chrome 70+, Firefox 65+, Safari 13+, Edge 79+
- **HTTPS**: Обязательно для production
- **IndexedDB**: Поддержка во всех современных браузерах
- **WebRTC**: Для звонков и демонстрации экрана

---

## ✅ Готово!

Все продвинутые функции полностью реализованы и готовы к использованию:

- ✅ Яндекс.Диск интеграция с встраиванием файлов
- ✅ End-to-End шифрование сообщений и файлов
- ✅ Демонстрация экрана с камерой
- ✅ Синхронизация между устройствами
- ✅ Бэкап и восстановление через админку

**Balloo Messenger - полностью независимый мессенджер!** 🚀

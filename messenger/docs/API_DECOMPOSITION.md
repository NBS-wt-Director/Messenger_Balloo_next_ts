# 📡 Декомпозиция API проекта Balloo Messenger

## 📑 Содержание
1. [Аутентификация](#auth)
2. [Чаты](#chats)
3. [Сообщения](#messages)
4. [Пользователи](#users)
5. [Уведомления](#notifications)
6. [Администрирование](#admin)
7. [Файлы и медиа](#files)
8. [Интеграции](#integrations)
9. [Системные](#system)
10. [Инсталлер](#installer)

---

## <a name="auth"></a>🔐 Аутентификация

### `/api/auth/login` (POST)
**Структура данных:** User (SQLite)

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Уникальный ID пользователя |
| email | string | Email для входа |
| passwordHash | string | Bcrypt/SHA256 хеш пароля |
| displayName | string | Отображаемое имя |
| fullName | string | Полное имя |
| avatar | string | URL аватара |
| status | string | Статус (online/offline/banned) |
| adminRoles | string[] | Роли администратора |
| userNumber | number | Номер пользователя |
| points | number | Баланс баллов |

**Что делает:**
- Проверка email и пароля (поддержка миграции SHA256 → bcrypt)
- Обновление статуса на 'online'
- Генерация session token
- Возвращает данные пользователя и токен

**Ошибки:**
- `401` - Неверный email или пароль
- `500` - Ошибка сервера

---

### `/api/auth/register` (POST)
**Структура данных:** User

**Что делает:**
- Регистрация нового пользователя
- Генерация уникального userNumber
- Первые 10000 получают 5000 баллов, остальные -55
- Первый пользователь автоматически получает superadmin
- Создание системных чатов (Избранное, Техподдержка, Новости)

**Ошибки:**
- `400` - Ошибка валидации
- `500` - Ошибка регистрации

---

### `/api/auth/yandex` (GET)
**Структура данных:** User

**Что делает:**
- OAuth2 авторизация через Яндекс
- Обмен code на access_token
- Получение данных пользователя из Яндекс
- Регистрация/логин пользователя
- Создание системных чатов

**Ошибки:**
- `400` - Нет кода авторизации
- `401` - Ошибка получения токена
- `500` - Ошибка авторизации

---

### `/api/auth/password/recovery` (POST/PUT)
**Структура данных:** User.settings

**Что делает:**
- POST: Генерация токена сброса пароля (SHA256)
- PUT: Сброс пароля по токену с проверкой срока действия (1 час)
- Валидация сложности пароля (8+ символов, цифры, заглавные/строчные)

**Ошибки:**
- `400` - Неверный токен или слабый пароль
- `401` - Истёкший токен

---

### `/api/auth/email/verify` (POST/PUT)
**Структура данных:** User.settings

**Что делает:**
- POST: Генерация 6-значного кода (срок 10 минут)
- PUT: Подтверждение email по коду

**Ошибки:**
- `400` - Неверный или истёкший код
- `404` - Пользователь не найден

---

### `/api/auth/verification/send` (POST)
**Структура данных:** User, VerificationCode

**Что делает:**
- Генерация кода верификации
- Сохранение в таблицу VerificationCode
- Отправка email (через SMTP)
- Срок действия 15 минут

**Ошибки:**
- `400` - Нет email у пользователя
- `404` - Пользователь не найден

---

### `/api/auth/verification/verify` (POST)
**Структура данных:** VerificationCode

**Что делает:**
- Проверка кода из VerificationCode
- Проверка срока действия (15 минут)
- Пометка кода как использованного
- Обновление статуса пользователя

**Ошибки:**
- `400` - Неверный код
- `404` - Код не найден
- `410` - Код истёк

---

### `/api/auth/profile` (GET/PATCH/POST)
**Структура данных:** User

**Что делает:**
- GET: Получение данных профиля (с avatarHistory)
- PATCH: Обновление полей (displayName, fullName, avatar, bio, phone)
- POST: Выход (обновление статуса на offline)

**Ошибки:**
- `400` - Нет userId
- `404` - Пользователь не найден

---

### `/api/auth/profile/password` (POST)
**Структура данных:** User

**Что делает:**
- Смена пароля с проверкой текущего
- Поддержка миграции SHA256 → bcrypt
- Валидация сложности нового пароля
- Хеширование через bcrypt

**Ошибки:**
- `400` - Слабый пароль
- `401` - Неверный текущий пароль

---

## <a name="chats"></a>💬 Чаты

### `/api/chats` (GET/POST)
**Структура данных:** Chat, ChatMember

| Поле Chat | Тип | Описание |
|-----------|-----|----------|
| id | string | ID чата |
| type | string | private/group/channel |
| name | string | Название |
| description | string | Описание |
| avatar | string | URL аватара |
| createdBy | string | ID создателя |
| members | object | Участники с ролями |
| adminIds | string[] | ID администраторов |
| settings | object | Настройки чата |

**Что делает:**
- GET: Список чатов с пагинацией и фильтрацией по типу
- POST: Создание чата

**Ошибки:**
- `400` - Ошибка валидации
- `403` - Нет прав доступа

---

### `/api/chats/group` (POST/PUT/DELETE)
**Структура данных:** Chat

**Что делает:**
- POST: Создание группы с участниками и ролями
- PUT: Обновление (name, description, avatar)
- DELETE: Удаление группы

**Роли участников:**
- `creator` - Создатель (полный контроль)
- `moderator` - Модератор (управление участниками)
- `author` - Автор (может писать)
- `reader` - Читатель (только просмотр)

**Ошибки:**
- `400` - Ошибка валидации
- `404` - Чат не найден

---

### `/api/chats/group/create` (POST)
**Структура данных:** Chat

**Что делает:**
- Создание группы с расширенными настройками
- Настройка defaultRole для участников
- Настройка onlyAdminsCanPost
- Настройка editGroupInfo

**Ошибки:**
- `400` - Нет name или creatorId
- `404` - Создатель не найден

---

### `/api/chats/group/members` (GET/POST/DELETE)
**Структура данных:** Chat, User

**Что делает:**
- GET: Список участников с пагинацией
- POST: Добавление участников
- DELETE: Удаление участника (с правами creator/moderator)

**Ошибки:**
- `400` - Нельзя удалить создателя
- `403` - Нет прав на удаление

---

### `/api/chats/group/role` (PUT/POST/DELETE)
**Структура данных:** Chat.members

**Что делает:**
- PUT: Назначение роли участнику
- POST: Добавление участника с ролью
- DELETE: Удаление участника

**Ограничения:**
- Только creator может назначать роли
- Нельзя изменить роль creator

**Ошибки:**
- `400` - Недопустимая роль
- `403` - Нет прав

---

### `/api/chats/group/role/update` (PUT/GET)
**Структура данных:** Chat.members

**Что делает:**
- PUT: Назначение роли с проверкой operatedBy
- GET: Список ролей и их прав

**Права по ролям:**
```
creator: canWrite, canRead, canManageMembers, canManageRoles, canDelete, canEditGroup, canDeleteMessages, canPinMessages
moderator: canWrite, canRead, canManageMembers, canDeleteMessages
author: canWrite, canRead
reader: canRead
```

**Ошибки:**
- `400` - Пользователь не участник
- `403` - Только creator может назначать

---

### `/api/chats/search` (GET)
**Структура данных:** Chat, Message

**Что делает:**
- Поиск по чатам пользователя (по name/description)
- Включает lastMessage для каждого чата
- Фильтрация по чатам, где пользователь участник

**Ошибки:**
- `400` - Нет userId или query

---

### `/api/chats/[id]/pin` (POST)
**Структура данных:** Chat.pinned

**Что делает:**
- Закрепление/открепление чата
- Лимит 15 закреплённых чатов

**Ошибки:**
- `400` - Превышен лимит 15
- `404` - Чат не найден

---

### `/api/chats/[id]/clear` (POST)
**Структура данных:** Message

**Что делает:**
- Удаление всех сообщений в чате
- Обновление lastMessage на 'Чат очищен'

**Ошибки:**
- `404` - Чат не найден

---

### `/api/chats/[id]/favorite` (POST)
**Структура данных:** Chat.isFavorite

**Что делает:**
- Добавление/удаление из избранного

**Ошибки:**
- `404` - Чат не найден

---

## <a name="messages"></a>📝 Сообщения

### `/api/messages` (GET/POST/PATCH/DELETE)
**Структура данных:** Message, Chat, User

| Поле Message | Тип | Описание |
|--------------|-----|----------|
| id | string | ID сообщения |
| chatId | string | ID чата |
| userId | string | ID отправителя |
| text | string | Текст |
| type | string | text/image/video/audio/document |
| replyToId | string | ID ответа |
| attachmentId | string | ID вложения |
| createdAt | string | Timestamp |

**Что делает:**
- GET: Получение сообщений чата с пагинацией (before timestamp)
- POST: Создание сообщения (авто-создание чата если нет)
- PATCH: Редактирование сообщения
- DELETE: Удаление сообщения

**Ошибки:**
- `400` - Нет обязательных полей
- `403` - Нет доступа к чату
- `404` - Сообщение/чат не найден

---

### `/api/messages/forward` (POST)
**Структура данных:** Message

**Что делает:**
- Пересылка сообщения в другой чат
- Проверка участия в целевом чате

**Ошибки:**
- `400` - Нет messageId/targetChatId/senderId
- `403` - Нет доступа к чату
- `404` - Сообщение не найдено

---

### `/api/messages/search` (GET)
**Структура данных:** Message, Chat, User

**Что делает:**
- Поиск по сообщениям (LIKE %query%)
- Поиск только в чатах пользователя
- Включает информацию о чате и отправителе

**Ошибки:**
- `400` - Нет query или userId
- `403` - Нет доступа к чату

---

### `/api/messages/typing` (POST/GET)
**Структура данных:** В памяти (Map)

**Что делает:**
- POST: Установка индикатора 'печатает' (5 секунд)
- GET: Получение списка печатающих пользователей

**Ошибки:**
- `400` - Нет chatId или userId

---

### `/api/messages/link-preview` (POST)
**Структура данных:** В памяти (mock)

**Что делает:**
- Генерация превью ссылки
- Валидация URL (http/https)
- Возвращает Open Graph данные (mock)

**Ошибки:**
- `400` - Неверный URL

---

## <a name="users"></a>👤 Пользователи

### `/api/users/search` (GET)
**Структура данных:** User

**Что делает:**
- Поиск по displayName/email
- Сортировка по userNumber ASC
- Лимит 50 результатов

**Ошибки:**
- `400` - Нет query

---

### `/api/users/[id]` (GET/PUT)
**Структура данных:** User

**Что делает:**
- GET: Информация о пользователе (без points!)
- PUT: Обновление профиля (displayName, fullName, phone, status, avatar)

**Ошибки:**
- `400` - Нет данных для обновления
- `404` - Пользователь не найден

---

### `/api/users/[id]/block` (POST/DELETE)
**Структура данных:** User.blockedUsers

**Что делает:**
- POST: Блокировка пользователя
- DELETE: Разблокировка

**Ошибки:**
- `400` - Нельзя заблокировать себя
- `404` - Пользователь не найден

---

### `/api/users/[id]/online` (POST)
**Структура данных:** User

**Что делает:**
- Обновление статуса онлайн (isOnline, online = 0/1)
- Возвращает lastSeen

**Ошибки:**
- `400` - Нет isOnline

---

### `/api/user-id/change` (GET/POST)
**Структура данных:** User

**Что делает:**
- GET: Проверка возможности смены ID (нужно 4444 балла)
- POST: Смена user ID с транзакцией (списание баллов, обновление во всех таблицах)
- Валидация: 3-32 символа, латиница, цифры, _, -

**Ошибки:**
- `400` - Неверный формат ID
- `402` - Недостаточно баллов
- `409` - ID занят

---

### `/api/balance` (GET/POST)
**Структура данных:** User

**Что делает:**
- GET: Получение баланса (points, userNumber)
- POST: Обновление баланса (add/set/remove)

**Возвращает:**
- canSpend (если points >= 0)
- changeUserIdCost: 4444

**Ошибки:**
- `400` - Нет userId/points
- `404` - Пользователь не найден

---

## <a name="notifications"></a>🔔 Уведомления

### `/api/notifications` (GET/PATCH/DELETE)
**Структура данных:** Notification

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID уведомления |
| userId | string | Получатель |
| type | string | message/invitation/system/call |
| title | string | Заголовок |
| body | string | Текст |
| url | string | Ссылка |
| data | object | Дополнительные данные |
| read | boolean | Прочитано |

**Что делает:**
- GET: Список уведомлений с пагинацией
- PATCH: Отметка как прочитанное (markAll для всех)
- DELETE: Удаление уведомления

**Ошибки:**
- `400` - Нет userId
- `404` - Уведомление не найдено

---

### `/api/notifications/create` (POST)
**Структура данных:** Notification

**Что делает:**
- Создание уведомления
- Автоматическая генерация ID

**Ошибки:**
- `400` - Нет обязательных полей

---

### `/api/notifications/send` (POST)
**Структура данных:** User.pushTokens

**Что делает:**
- Отправка push-уведомления через Web Push API
- Обработка expired токенов (410/404)
- Удаление истёкших токенов из базы

**Ошибки:**
- `400` - Нет userId/title/body
- `404` - Пользователь не найден

---

### `/api/notifications/subscribe` (POST/DELETE/GET)
**Структура данных:** User.pushTokens

**Что делает:**
- POST: Подписка на push-уведомления (VAPID)
- DELETE: Отписка
- GET: Статус подписки

**Хранение:**
- До 5 последних токенов
- Срок действия 30 дней

**Ошибки:**
- `400` - Нет userId
- `404` - Пользователь не найден

---

### `/api/notifications/token` (POST/DELETE)
**Структура данных:** User.pushTokens

**Что делает:**
- POST: Сохранение push-токена
- DELETE: Удаление токена

**Ошибки:**
- `400` - Нет token
- `404` - Пользователь не найден

---

### `/api/notifications/vapid-key` (GET)
**Структура данных:** Config

**Что делает:**
- Возвращает публичный VAPID ключ

---

## <a name="admin"></a>⚙️ Администрирование

### `/api/admin/users` (GET/POST)
**Структура данных:** User

**Что делает:**
- GET: Список пользователей с пагинацией и фильтрацией по роли
- POST: Управление пользователями (ban/unban/makeAdmin/removeAdmin)

**Ограничения:**
- Только superadmin может управлять ролями

**Ошибки:**
- `400` - Нет adminId/targetUserId/action
- `403` - Нет прав
- `404` - Администратор/пользователь не найден

---

### `/api/admin/chats` (GET/DELETE)
**Структура данных:** Chat, ChatMember, Message

**Что делает:**
- GET: Список чатов с пагинацией и подсчётом участников
- DELETE: Удаление чата (сообщения, участники, чат)

**Ошибки:**
- `400` - Нет adminId/chatId
- `404` - Чат не найден

---

### `/api/admin/messages` (GET/DELETE)
**Структура данных:** Message

**Что делает:**
- GET: Модерация сообщений (по chatId/userId)
- DELETE: Удаление сообщения

**Ошибки:**
- `400` - Нет adminId/messageId
- `404` - Сообщение не найдено

---

### `/api/admin/bans` (GET/POST/DELETE)
**Структура данных:** Ban, User

| Поле Ban | Тип | Описание |
|----------|-----|----------|
| id | string | ID бана |
| userId | string | Заблокированный |
| chatId | string | Чат (null = глобально) |
| bannedBy | string | Кто заблокировал |
| reason | string | Причина |
| expiresAt | string | Срок действия |

**Что делает:**
- GET: Список банов
- POST: Создание бана (обновление статуса user, удаление из участников)
- DELETE: Разблокировка

**Ошибки:**
- `400` - Нет adminId/userId/reason
- `403` - Нет прав администратора
- `404` - Бан/пользователь не найден

---

### `/api/admin/stats` (GET)
**Структура данных:** User, Chat, Message, Ban

**Что делает:**
- Получение статистики (количество пользователей, чатов, сообщений, банов)

---

### `/api/admin/settings` (GET/POST)
**Структура данных:** В памяти (AdminSettings)

**Что делает:**
- GET: Текущие настройки
- POST: Обновление настроек

**Настройки:**
- registrationEnabled
- emailVerificationRequired
- maxGroupSize (1000)
- maxFileSize (100MB)
- messageRetentionDays (365)
- maintenanceMode
- allowedDomains
- defaultLanguage
- theme

**Ошибки:**
- `400` - Нет adminId/updates

---

### `/api/admin/backup` (GET/POST/DELETE)
**Структура данных:** Все коллекции (RxDB)

**Что делает:**
- GET: Список бэкапов (mock)
- POST: Создание бэкапа (выборочный: includeMessages/Attachments)
- DELETE: Удаление бэкапа (mock)

**Структура бэкапа:**
```json
{
  "version": "1.0",
  "timestamp": number,
  "users": User[],
  "chats": Chat[],
  "messages": Message[],
  "invitations": Invitation[],
  "attachments": Attachment[],
  "contacts": Contact[],
  "notifications": Notification[],
  "settings": { ... }
}
```

**Ошибки:**
- `400` - Нет adminId

---

### `/api/admin/backup/restore` (POST)
**Структура данных:** Все коллекции (RxDB)

**Что делает:**
- Восстановление из бэкапа
- Опции: restoreUsers/restoreChats/restoreMessages/restoreContacts/restoreInvitations
- Обновление существующих записей

**Ошибки:**
- `400` - Нет adminId/backupData

---

## <a name="files"></a>📁 Файлы и медиа

### `/api/attachments` (GET/POST/DELETE)
**Структура данных:** Attachment

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID вложения |
| messageId | string | ID сообщения |
| chatId | string | ID чата |
| uploaderId | string | ID загрузившего |
| fileName | string | Имя файла |
| mimeType | string | Тип MIME |
| fileSize | number | Размер |
| url | string | URL |
| thumbnailUrl | string | Превью |
| width/height | number | Размеры |
| type | string | image/video/audio/document/pdf/office |
| status | string | ready |

**Что делает:**
- GET: Вложения по messageId/chatId
- POST: Регистрация вложения (проверка доступа)
- DELETE: Удаление вложения

**Ошибки:**
- `400` - Нет обязательных полей
- `403` - Нет доступа
- `404` - Сообщение/вложение не найдено

---

### `/api/attachments/preview` (POST/GET)
**Структура данных:** Attachment

**Что делает:**
- POST: Генерация превью по типу (image/video/document/audio)
- GET: Метаданные видео (через Yandex Disk)

**Типы превью:**
- image: thumbnailUrl с размерами
- video: duration, width, height
- document: icon, label по расширению
- audio: waveform indicator

**Ошибки:**
- `400` - Нет url/type

---

### `/api/yandex-disk/upload` (POST/GET/DELETE)
**Структура данных:** Attachment

**Что делает:**
- POST: Загрузка файла на Яндекс.Диск
- Генерация encrypted версии (E2E AES-GCM)
- Получение downloadUrl
- Определение типа (image/video/audio/document/pdf/office)
- Получение размеров для изображений

**Шифрование:**
- AES-GCM 256-bit
- Ключ сохраняется в localStorage
- Хранение keyId, iv, authTag в encryptionInfo

**Ошибки:**
- `400` - Нет file/messageId/chatId/uploaderId
- `500` - Ошибка загрузки на Yandex Disk

---

### `/api/yandex-disk/link` (GET/POST/DELETE)
**Структура данных:** User

**Что делает:**
- GET: URL авторизации / статус подключения
- POST: Привязка аккаунта (OAuth code exchange)
- DELETE: Отвязка аккаунта

**Хранение:**
- yandexDiskAccessToken
- yandexDiskRefreshToken
- yandexDiskConnected

**Ошибки:**
- `400` - Нет code/userId
- `500` - Ошибка OAuth

---

### `/api/yandex-disk/upload/video` (POST/GET)
**Структура данных:** Attachment

**Что делает:**
- POST: Загрузка видео (max 100MB, .mp4)
- GET: Стриминг видео (download)

**Ошибки:**
- `400` - Нет file/userId/accessToken
- `500` - Ошибка загрузки

---

### `/api/yandex-disk/upload/document` (POST/GET)
**Структура данных:** Attachment

**Что делает:**
- POST: Загрузка документа (max 50MB)
- GET: Скачивание документа

**Ошибки:**
- `400` - Нет file/userId/accessToken
- `500` - Ошибка загрузки

---

### `/api/profile/avatar` (POST/DELETE)
**Структура данных:** User

**Что делает:**
- POST: Загрузка аватара (base64)
- DELETE: Удаление аватара

**Ограничения:**
- Типы: JPEG, PNG, GIF, WebP
- Размер: max 5MB

**Ошибки:**
- `400` - Нет avatar/userId
- `500` - Ошибка загрузки

---

### `/api/profile/avatar/upload` (POST)
**Структура данных:** User

**Что делает:**
- Оптимизация изображения (max 512x512, webp, quality 0.8)
- Создание thumbnail (100px)
- Сохранение в базу

**Ошибки:**
- `400` - Нет avatar/userId
- `404` - Пользователь не найден

---

## <a name="integrations"></a>🔗 Интеграции

### `/api/invitations` (GET/POST/DELETE/PUT)
**Структура данных:** Invitation, Chat, ChatMember

| Поле Invitation | Тип | Описание |
|-----------------|-----|----------|
| id | string | ID приглашения |
| code | string | Код |
| chatId | string | Чат |
| fromUserId | string | Кто создал |
| maxUses | number | Лимит (0 = без лимита) |
| usedCount | number | Использовано |
| expiresAt | string | Срок |
| isActive | boolean | Активно |
| isOneTime | boolean | Одноразовое |

**Что делает:**
- GET: Проверка кода приглашения (проверка срока/лимита)
- POST: Создание приглашения
- DELETE: Деактивация
- PUT: Принятие приглашения (добавление в ChatMember)

**Ошибки:**
- `400` - Нет chatId/invitedBy
- `403` - Нет прав на создание
- `404` - Чат/приглашение не найдено

---

### `/api/invitations/my` (GET/POST/DELETE)
**Структура данных:** Invitation, Chat

**Что делает:**
- GET: Мои приглашения с информацией о чате
- POST: Создание приглашения (с isOneTime)
- DELETE: Деактивация

**Ошибки:**
- `400` - Нет userId/chatId
- `404` - Чат/приглашение не найдено

---

### `/api/invitations/accept` (POST)
**Структура данных:** Invitation, ChatMember

**Что делает:**
- Принятие приглашения
- Добавление в ChatMember (role: author)
- Обновление usedCount
- Деактивация одноразовых

**Ошибки:**
- `400` - Нет code/userId
- `404` - Приглашение/чат не найдено

---

### `/api/reports` (POST/GET/PUT)
**Структура данных:** Report

| Поле Report | Тип | Описание |
|-------------|-----|----------|
| id | string | ID жалобы |
| targetType | string | chat/user/contact/invitation |
| targetId | string | ID объекта |
| reportedBy | string | Кто подал |
| reason | string | Причина |
| description | string | Описание |
| status | string | pending/reviewed/rejected |
| reviewedBy | string | Кто проверил |
| resolution | string | Решение |

**Что делает:**
- POST: Создание жалобы (проверка дубликатов)
- GET: Список жалоб (админка, фильтрация по статусу)
- PUT: Обновление статуса жалобы

**Ошибки:**
- `400` - Нет targetType/targetId/reportedBy/reason
- `404` - Жалоба не найдена

---

### `/api/contacts/search` (GET)
**Структура данных:** User, Contact

**Что делает:**
- Поиск по displayName/fullName/email/phone
- Индикация isContact/isFavorite/isBlocked

**Ошибки:**
- `400` - Нет userId
- `404` - Пользователь не найден

---

## <a name="system"></a>🔧 Системные

### `/api/health` (GET)
**Структура данных:** Health status

**Что делает:**
- Проверка работоспособности сервиса
- Проверка подключения к базе
- Возвращает timestamp, responseTime, version

**Ошибки:**
- `503` - Service unhealthy

---

### `/api/features` (GET/POST/PATCH/DELETE)
**Структура данных:** Feature

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID функции |
| title | string | Заголовок |
| description | string | Описание |
| category | string | Категория |
| status | string | pending/approved/completed |
| votes | number | Голоса |
| adminNote | string | Примечание |
| plannedAt | string | Планируемая дата |
| completedAt | string | Дата завершения |

**Что делает:**
- GET: Список функций (фильтрация по статусу)
- POST: Предложить функцию
- PATCH: Обновить функцию
- DELETE: Удалить функцию

**Ошибки:**
- `400` - Нет title/description/userId

---

### `/api/pages` (GET/POST)
**Структура данных:** Page

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | slug страницы |
| title | string | Заголовок |
| content | string | Контент |
| sections | object[] | Секции |
| metadata | object | Метаданные |
| isActive | boolean | Активна |

**Что делает:**
- GET: Контент страницы (с дефолтными для support, about-company, about-balloo)
- POST: Создать/обновить страницу (админка)

**Стандартные страницы:**
- support: СБП, QR-код для оплаты
- about-company: О разработчике, история, технологии
- about-balloo: Возможности мессенджера

**Ошибки:**
- `400` - Нет slug/title

---

### `/api/global-search` (GET)
**Структура данных:** User, Chat

**Что делает:**
- Поиск по пользователям и чатам
- Возвращает separate arrays: users, groups, communities
- Пагинация и лимит

**Ошибки:**
- `400` - Нет query (меньше 2 символов возвращает всё)

---

### `/api/versions` (GET/POST)
**Структура данных:** versions.json

**Что делает:**
- GET: Информация о версиях из файла
- POST: Добавление новой версии (админка)

**Ошибки:**
- `400` - Нет version
- `500` - Ошибка чтения/записи файла

---

### `/api/error` (POST)
**Структура данных:** Client error log

**Что делает:**
- Клиентское логирование ошибок в file-logger

**Ошибки:**
- `500` - Ошибка записи лога

---

### `/api/csrf-token` (GET)
**Структура данных:** Token

**Что делает:**
- Генерация CSRF токена для userId

**Ошибки:**
- `400` - Нет userId
- `500` - Ошибка генерации

---

### `/api/statuses` (POST/GET/DELETE/PUT)
**Структура данных:** Status

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | ID статуса |
| userId | string | Владелец |
| type | string | text/image/video |
| content | string | Текст/ссылка |
| mediaUrl | string | URL медиа |
| views | string[] | Кто смотрел |
| isActive | boolean | Активен |
| expiresAt | number | Срок (часы) |

**Что делает:**
- POST: Создание статуса (срок 24 часа по умолчанию)
- GET: Список статусов пользователя
- DELETE: Удаление статуса
- PUT: Отметка просмотра (views)

**Ошибки:**
- `400` - Нет userId/content
- `404` - Статус не найден

---

## <a name="installer"></a>🛠️ Инсталлер

### `/api/installer/config` (POST)
**Структура данных:** config.json

**Что делает:**
- Обновление push/admin настроек в config.json

**Ошибки:**
- `400` - Нет push/admin
- `500` - Ошибка записи файла

---

### `/api/installer/env` (POST)
**Структура данных:** .env.local

**Что делает:**
- Создание .env.local файла

**Ошибки:**
- `400` - Нет content
- `500` - Ошибка записи файла

---

### `/api/installer/clear` (POST)
**Структура данных:** Все коллекции

**Что делает:**
- Очистка всех коллекций базы данных

**Ошибки:**
- `500` - Ошибка очистки

---

### `/api/installer/test-accounts` (POST)
**Структура данных:** User, Chat

**Что делает:**
- Создание тестовых аккаунтов:
  - admin@balloo.ru (SuperAdmin, пароль Admin123!)
  - user1@balloo.ru (User)
  - user2@balloo.ru (User)
  - user3@balloo.ru (User)
- Создание тестовых чатов:
  - Общий чат
  - Чат разработчиков

**Ошибки:**
- `500` - Ошибка создания

---

### `/api/webrtc/signal` (POST/GET/DELETE)
**Структура данных:** В памяти (Map)

**Что делает:**
- POST: Отправка WebRTC сигнала (offer/answer/candidate)
- GET: Получение сигналов для пользователя
- DELETE: Очистка сигналов

**Ошибки:**
- `400` - Нет type/from/to/chatId

---

### `/api/calls/signal` (POST/GET/PUT/DELETE)
**Структура данных:** Call (RxDB)

| Поле Call | Тип | Описание |
|-----------|-----|----------|
| id | string | ID звонка |
| fromUserId | string | От кого |
| toUserId | string | Кому |
| type | string | offer/answer/candidate |
| signal | object | SDP/ICE |
| status | string | pending/accepted/rejected/ended/missed |

**Что делает:**
- POST: Отправка сигнала
- GET: Получение сигналов
- PUT: Обновление статуса
- DELETE: Удаление звонка

**Ошибки:**
- `400` - Нет обязательных полей
- `404` - Звонок не найден

---

### `/api/sync/keys` (POST/GET/DELETE)
**Структура данных:** В памяти (Map)

**Что делает:**
- POST: Синхронизация ключей E2E шифрования
- GET: Получение ключей пользователя
- DELETE: Удаление ключей

**Ошибки:**
- `400` - Нет userId/deviceId/keys

---

## 📊 Сводная таблица ошибок

| Код | Описание | Примеры |
|-----|----------|---------|
| 400 | Bad Request | Нет обязательных полей, неверный формат |
| 401 | Unauthorized | Неверный пароль, истёкший токен |
| 402 | Payment Required | Недостаточно баллов |
| 403 | Forbidden | Нет прав доступа |
| 404 | Not Found | Ресурс не найден |
| 409 | Conflict | Конфликт (ID занят) |
| 410 | Gone | Истёкший код/токен |
| 412 | Precondition Failed | (не используется) |
| 418 | I'm a teapot | (не используется) |
| 429 | Too Many Requests | (не используется) |
| 500 | Internal Server Error | Ошибка сервера |
| 503 | Service Unavailable | Health check failed |

---

## 🎯 Приоритеты исправлений

### 🔴 Критичные
1. **Missing exports:** `scripts/create-admin.ts` - нет экспорта `getDatabase`
2. **Missing imports:** `src/app/api/auth/register-extended.ts` - нет `getUserById`
3. **Missing imports:** `src/app/api/invitations/route.ts` - нет `isOneTime`

### 🟡 Важные
1. **any типы:** 150+ мест для типизации
2. **Duplicate implementations:** `scripts/createSystemChats.ts` vs `scripts/setup-test-data.ts`

### 🟢 Документация
1. **Prisma упоминания:** 14 файлов с устаревшими ссылками

---

## 📈 Статистика

| Категория | Количество |
|-----------|------------|
| API endpoints | ~85 |
| Структуры данных | ~20 |
| Методы (GET/POST/PUT/DELETE/PATCH) | ~200+ |
| Ошибки | 7 типов |
| Таблицы SQLite | 10+ |
| Коллекции RxDB | 7+ |

---

*Документация сгенерирована автоматически на основе анализа кода API*

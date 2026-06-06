# App Balloo API - Быстрый старт

## 🚀 Установка и запуск

### 1. Установка зависимостей

```bash
cd api
npm install
```

### 2. Настройка окружения

```bash
cp .env.example .env
```

Откройте `.env` и настройте переменные:

```env
# Обязательные переменные
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Для Яндекс.Авторизации (если используете)
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
YANDEX_REDIRECT_URI=http://localhost:3001/api/v1/auth/yandex/callback

# Для отправки кодов восстановления (если используете email)
EMAIL_HOST=smtp.yandex.ru
EMAIL_USER=your-email@yandex.ru
EMAIL_PASSWORD=your-app-password
```

### 3. Инициализация базы данных

```bash
npm run db:init
```

Это создаст файл `data/database.db` со всеми таблицами.

### 4. Запуск сервера

```bash
npm run dev
```

Сервер запустится на `http://localhost:3001`

## 📋 API Endpoints

Все эндпоинты доступны по префиксу `/api/v1/`

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/logout` - Выход
- `POST /api/v1/auth/refresh` - Обновление токена
- `POST /api/v1/auth/forgot-password` - Восстановление пароля
- `GET /api/v1/auth/me` - Данные текущего пользователя

### Яндекс.Авторизация
- `GET /api/v1/auth/yandex/authorize` - URL для авторизации
- `GET /api/v1/auth/yandex/callback` - Callback от Яндекса
- `POST /api/v1/auth/yandex/link` - Привязать Яндекс аккаунт
- `POST /api/v1/auth/yandex/unlink` - Отвязать Яндекс аккаунт
- `GET /api/v1/auth/yandex/status` - Статус подключения

### Пользователи
- `GET /api/v1/users/search?q=...` - Поиск пользователей
- `GET /api/v1/users/:userId` - Данные пользователя
- `PUT /api/v1/users/me` - Обновить профиль
- `PUT /api/v1/users/me/avatar` - Загрузить аватар
- `PUT /api/v1/users/me/status` - Обновить статус

### Чаты
- `GET /api/v1/chats` - Список чатов
- `POST /api/v1/chats` - Создать чат
- `GET /api/v1/chats/:chatId` - Информация о чате
- `PUT /api/v1/chats/:chatId` - Обновить чат
- `DELETE /api/v1/chats/:chatId` - Удалить/выйти из чата
- `GET /api/v1/chats/:chatId/members` - Участники чата
- `POST /api/v1/chats/:chatId/members` - Добавить участника
- `DELETE /api/v1/chats/:chatId/members/:userId` - Удалить участника

### Сообщения
- `GET /api/v1/chats/:chatId/messages` - История сообщений
- `POST /api/v1/chats/:chatId/messages` - Отправить сообщение
- `PUT /api/v1/messages/:messageId` - Редактировать сообщение
- `DELETE /api/v1/messages/:messageId` - Удалить сообщение
- `POST /api/v1/messages/:messageId/reactions` - Добавить реакцию
- `PUT /api/v1/messages/:messageId/read` - Подтвердить прочтение

### Контакты
- `GET /api/v1/contacts` - Список контактов
- `POST /api/v1/contacts` - Добавить контакт
- `DELETE /api/v1/contacts/:userId` - Удалить контакт
- `PUT /api/v1/contacts/:userId/favorite` - В избранное
- `PUT /api/v1/contacts/:userId/block` - Заблокировать

### Группы
- `POST /api/v1/groups` - Создать группу
- `GET /api/v1/groups/:groupId` - Информация о группе
- `PUT /api/v1/groups/:groupId` - Обновить группу
- `DELETE /api/v1/groups/:groupId` - Удалить группу
- `PUT /api/v1/groups/:groupId/permissions/:userId` - Изменить роль
- `POST /api/v1/groups/:groupId/transfer-ownership` - Передать права

### Приглашения
- `GET /api/v1/invitations` - Список приглашений
- `POST /api/v1/invitations` - Создать приглашение
- `DELETE /api/v1/invitations/:invitationId` - Удалить приглашение
- `PUT /api/v1/invitations/:invitationId/revoke` - Отозвать приглашение
- `GET /api/v1/invite/:code` - Информация о приглашении
- `POST /api/v1/invite/:code/accept` - Принять приглашение

### Яндекс.Диск
- `GET /api/v1/disk/files` - Список файлов
- `POST /api/v1/disk/files` - Загрузить файл
- `GET /api/v1/disk/files/:fileId/download` - Скачать файл
- `DELETE /api/v1/disk/files/:fileId` - Удалить файл
- `POST /api/v1/disk/files/:fileId/share` - Получить публичную ссылку
- `GET /api/v1/disk/quota` - Информация о квоте

### Уведомления
- `GET /api/v1/notifications` - Список уведомлений
- `PUT /api/v1/notifications/:notificationId/read` - Прочитано
- `PUT /api/v1/notifications/read-all` - Все прочитано
- `DELETE /api/v1/notifications/:notificationId` - Удалить
- `POST /api/v1/notifications/register-token` - Регистрация push токена

### Статусы (Сторис)
- `GET /api/v1/statuses` - Статусы контактов
- `POST /api/v1/statuses` - Создать статус
- `GET /api/v1/statuses/:statusId` - Информация о статусе
- `POST /api/v1/statuses/:statusId/view` - Просмотрено
- `DELETE /api/v1/statuses/:statusId` - Удалить статус

### Поиск
- `GET /api/v1/global-search?q=...` - Глобальный поиск

### Отчёты
- `POST /api/v1/reports` - Создать отчёт

### Администрирование
- `GET /api/v1/admin/users` - Список пользователей
- `GET /api/v1/admin/users/:userId` - Информация о пользователе
- `PUT /api/v1/admin/users/:userId/role` - Изменить роль
- `DELETE /api/v1/admin/users/:userId` - Заблокировать
- `GET /api/v1/admin/chats` - Список чатов
- `GET /api/v1/admin/analytics` - Аналитика
- `GET /api/v1/admin/versions` - Версии приложений
- `POST /api/v1/admin/versions` - Добавить версию
- `GET /api/v1/admin/reports` - Список отчётов
- `PUT /api/v1/admin/reports/:reportId` - Обработать отчёт

## 🔌 WebSocket

Подключение: `ws://localhost:3001/ws?token=<jwt_token>`

События смотрите в `TODO.md`

## 📊 База Данных

База данных автоматически создаётся в `data/database.db`

Таблицы:
- `users` - Пользователи
- `chats` - Чаты
- `messages` - Сообщения
- `attachments` - Вложения
- `contacts` - Контакты
- `notifications` - Уведомления
- `sessions` - Сессии
- `devices` - Устройства
- `invitations` - Приглашения
- `reports` - Отчёты
- `statuses` - Статусы
- `versions` - Версии

## 🧪 Тестирование

```bash
npm test
```

## 📝 Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### Вход

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Получить чаты

```bash
curl -X GET http://localhost:3001/api/v1/chats \
  -H "Authorization: Bearer <token>"
```

### Отправить сообщение

```bash
curl -X POST http://localhost:3001/api/v1/chats/:chatId/messages \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Привет!",
    "type": "text"
  }'
```

## ⚙️ Переменные окружения

Смотрите `.env.example` для полного списка.

## 🐛 Known Issues

- Email отправка кодов не настроена по умолчанию
- Яндекс.Диск требует настройки OAuth приложения
- WebSocket события требуют дополнительной настройки

## 📞 Support

Для вопросов смотрите `TODO.md` или создавайте issue в репозитории.

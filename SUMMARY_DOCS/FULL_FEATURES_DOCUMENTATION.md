---
title: Полный Функционал Проекта
description: Детальное описание КАЖДОЙ функции проекта Balloo
version: 1.0.0
date: 2026-06-13
---

# 📖 ПОЛНЫЙ ФУНКЦИОНАЛ ПРОЕКТА BALLOO

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Полная документация всех функций

---

## 📱 MESSENGER (WEB)

**Порт:** 3000  
**Технологии:** Next.js 15, React 19, TypeScript, Tailwind CSS  
**Готовность:** 95%

---

### 🔐 Аутентификация и Авторизация

#### 1. Регистрация пользователя
**ID:** MESSENGER-AUTH-001  
**Статус:** ✅ Реализовано

**Описание:**
- Форма регистрации с валидацией полей
- Проверка email на уникальность
- Проверка username на уникальность
- Проверка сложности пароля (мин. 8 символов)
- Отправка письма подтверждения на email
- Автоматический вход после регистрации

**Компоненты:**
- `src/pages/auth/register.tsx`
- `src/components/Auth/RegisterForm.tsx`

**API:**
- `POST /api/v1/auth/register`

**Валидация:**
```typescript
{
  username: string (3-20 символов, буквы и цифры)
  email: string (валидный email)
  password: string (мин. 8 символов, цифры и буквы)
  confirmPassword: string (должен совпадать с password)
}
```

---

#### 2. Вход в систему
**ID:** MESSENGER-AUTH-002  
**Статус:** ✅ Реализовано

**Описание:**
- Форма входа (email/username + пароль)
- Remember me (сохранение токена)
- 2FA поддержка (TOTP)
- Блокировка после 5 неудачных попыток
- Переадресация на последнюю страницу

**Компоненты:**
- `src/pages/auth/login.tsx`
- `src/components/Auth/LoginForm.tsx`
- `src/components/Auth/TwoFactorForm.tsx`

**API:**
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/2fa/verify`

---

#### 3. Выход из системы
**ID:** MESSENGER-AUTH-003  
**Статус:** ✅ Реализовано

**Описание:**
- Кнопка выхода в меню профиля
- Очистка локального хранилища
- Инвалидация JWT токена на сервере
- Переадресация на страницу входа

**Компоненты:**
- `src/components/Header/ProfileMenu.tsx`

**API:**
- `POST /api/v1/auth/logout`

---

#### 4. Сброс пароля
**ID:** MESSENGER-AUTH-004  
**Статус:** ✅ Реализовано

**Описание:**
- Форма "Забыли пароль?"
- Отправка email со ссылкой сброса
- Одноразовая ссылка (срок действия 1 час)
- Форма установки нового пароля
- Автоматический вход после сброса

**Компоненты:**
- `src/pages/auth/forgot-password.tsx`
- `src/pages/auth/reset-password.tsx`

**API:**
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

---

#### 5. Двухфакторная аутентификация (2FA)
**ID:** MESSENGER-AUTH-005  
**Статус:** ✅ Реализовано

**Описание:**
- Генерация QR кода для TOTP
- Поддержка Google Authenticator, Authy
- Резервные коды (10 штук)
- Включение/отключение 2FA
- Обязательная проверка при входе

**Компоненты:**
- `src/components/Auth/TwoFactorSetup.tsx`
- `src/components/Auth/TwoFactorForm.tsx`
- `src/components/Auth/BackupCodes.tsx`

**API:**
- `POST /api/v1/auth/2fa/enable`
- `POST /api/v1/auth/2fa/disable`
- `POST /api/v1/auth/2fa/verify`

---

### 👤 Профиль Пользователя

#### 6. Просмотр профиля
**ID:** MESSENGER-PROFILE-001  
**Статус:** ✅ Реализовано

**Описание:**
- Отображение аватара, username, статуса
- Дата регистрации
- Статистика (сообщений, контактов, групп)
- Настройки приватности

**Компоненты:**
- `src/pages/profile/[username].tsx`
- `src/components/Profile/ProfileHeader.tsx`
- `src/components/Profile/ProfileStats.tsx`

---

#### 7. Редактирование профиля
**ID:** MESSENGER-PROFILE-002  
**Статус:** ✅ Реализовано

**Описание:**
- Изменение avatar (загрузка файла)
- Изменение display name
- Изменение bio (о себе)
- Изменение phone number
- Изменение email (с подтверждением)

**Компоненты:**
- `src/pages/profile/edit.tsx`
- `src/components/Profile/EditProfileForm.tsx`
- `src/components/Profile/AvatarUploader.tsx`

**API:**
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/avatar`

---

#### 8. Настройки аккаунта
**ID:** MESSENGER-PROFILE-003  
**Статус:** ✅ Реализовано

**Описание:**
- Смена пароля
- Управление 2FA
- Язык интерфейса (12 языков)
- Тема оформления (светлая/тёмная/системная)
- Уведомления (email, push, sound)
- Приватность (кто видит статус, last seen)

**Компоненты:**
- `src/pages/settings/account.tsx`
- `src/components/Settings/AccountSettings.tsx`
- `src/components/Settings/PrivacySettings.tsx`
- `src/components/Settings/NotificationSettings.tsx`

**API:**
- `PUT /api/v1/users/me`
- `PUT /api/v1/users/settings`

---

#### 9. Удаление аккаунта
**ID:** MESSENGER-PROFILE-004  
**Статус:** ✅ Реализовано

**Описание:**
- Подтверждение паролем
- Предупреждение о потере данных
- 30 дней на восстановление (soft delete)
- Экспорт данных перед удалением

**Компоненты:**
- `src/pages/settings/danger.tsx`
- `src/components/Settings/DeleteAccountModal.tsx`

**API:**
- `DELETE /api/v1/users/me`

---

### 💬 Чаты

#### 10. Список чатов
**ID:** MESSENGER-CHAT-001  
**Статус:** ✅ Реализовано

**Описание:**
- Боковая панель со списком чатов
- Сортировка по последнему сообщению
- Индикатор непрочитанных
- Индикатор онлайн статуса
- Поиск по чатам
- Фильтры (все, личные, группы, каналы)

**Компоненты:**
- `src/components/Chat/ChatList.tsx`
- `src/components/Chat/ChatListItem.tsx`
- `src/components/Chat/ChatSearch.tsx`

**Хуки:**
- `useChatList()`
- `useChatSearch()`

---

#### 11. Создание чата
**ID:** MESSENGER-CHAT-002  
**Статус:** ✅ Реализовано

**Описание:**
- Кнопка "Новый чат"
- Выбор контакта из списка
- Поиск пользователя по username/email
- Создание группового чата
- Выбор аватара для группы
- Установка названия группы

**Компоненты:**
- `src/components/Chat/NewChatModal.tsx`
- `src/components/Chat/CreateGroupModal.tsx`
- `src/components/Chat/ContactSelector.tsx`

**API:**
- `POST /api/v1/chats`
- `POST /api/v1/groups`

---

#### 12. Открытие чата
**ID:** MESSENGER-CHAT-003  
**Статус:** ✅ Реализовано

**Описание:**
- Отображение истории сообщений
- Автоматическая прокрутка к последнему
- Индикатор загрузки старых сообщений
- Отображение информации о чате
- Статусы сообщений (отправлено, доставлено, прочитано)

**Компоненты:**
- `src/components/Chat/ChatWindow.tsx`
- `src/components/Chat/MessageList.tsx`
- `src/components/Chat/ChatInfo.tsx`

**Хуки:**
- `useChatMessages(chatId)`
- `useChatInfo(chatId)`

---

#### 13. Отправка сообщений
**ID:** MESSENGER-CHAT-004  
**Статус:** ✅ Реализовано

**Описание:**
- Текстовые сообщения
- Форматирование (bold, italic, code, link)
- Эмодзи picker
- Прикрепление файлов
- Прикрепление изображений
- Голосовые сообщения (⚠️ Не реализовано)
- Черновики сообщений

**Компоненты:**
- `src/components/Chat/MessageInput.tsx`
- `src/components/Chat/EmojiPicker.tsx`
- `src/components/Chat/FileUploader.tsx`
- `src/components/Chat/VoiceRecorder.tsx` (⚠️ Не реализовано)

**API:**
- `POST /api/v1/chats/:id/messages`

---

#### 14. Удаление сообщений
**ID:** MESSENGER-CHAT-005  
**Статус:** ✅ Реализовано

**Описание:**
- Удаление своих сообщений
- Удаление для всех (в течение 1 часа)
- Подтверждение удаления
- Отображение "Сообщение удалено"

**Компоненты:**
- `src/components/Chat/MessageMenu.tsx`
- `src/components/Chat/DeleteMessageModal.tsx`

**API:**
- `DELETE /api/v1/chats/:id/messages/:messageId`

---

#### 15. Статусы сообщений
**ID:** MESSENGER-CHAT-006  
**Статус:** ✅ Реализовано

**Описание:**
- ⏳ Отправлено (одна галочка)
- ✅ Доставлено (две галочки)
- 👁️ Прочитано (синие галочки)
- ⚠️ Ошибка отправки

**Компоненты:**
- `src/components/Chat/MessageStatus.tsx`

---

#### 16. Поиск в чате
**ID:** MESSENGER-CHAT-007  
**Статус:** ⚠️ Не реализовано

**Описание:**
- Поиск по тексту сообщений
- Подсветка совпадений
- Навигация между результатами
- Фильтры по дате, типу, автору

**План:** Q2 2026  
**Приоритет:** 🟡 Средний

---

### 📁 Файлы и Медиа

#### 17. Загрузка файлов
**ID:** MESSENGER-FILE-001  
**Статус:** ✅ Реализовано

**Описание:**
- Drag-and-drop зона
- Выбор через файл пикер
- Прогресс бар загрузки
- Предпросмотр изображений
- Ограничение размера (50 MB)
- Поддерживаемые форматы (все)

**Компоненты:**
- `src/components/Chat/FileUploader.tsx`
- `src/components/Chat/FilePreview.tsx`

**API:**
- `POST /api/v1/files/upload`

---

#### 18. Просмотр файлов
**ID:** MESSENGER-FILE-002  
**Статус:** ✅ Реализовано

**Описание:**
- Lightbox для изображений
- PDF viewer
- Видео плеер
- Аудио плеер
- Скачать файл
- Поделиться ссылкой

**Компоненты:**
- `src/components/Media/MediaViewer.tsx`
- `src/components/Media/ImageGallery.tsx`
- `src/components/Media/VideoPlayer.tsx`

---

#### 19. Галерея чата
**ID:** MESSENGER-FILE-003  
**Статус:** ✅ Реализовано

**Описание:**
- Вкладка "Медиа" в информации чата
- Сетка изображений
- Сортировка по дате
- Фильтры по типу (фото, видео, файлы)

**Компоненты:**
- `src/components/Chat/MediaGallery.tsx`

---

### 🔔 Уведомления

#### 20. Push уведомления
**ID:** MESSENGER-NOTIF-001  
**Статус:** ✅ Реализовано

**Описание:**
- Web Push API
- VAPID ключи
- Подписка на уведомления
- Уведомления о новых сообщениях
- Уведомления о звонках
- Клик открывает чат

**Компоненты:**
- `src/components/Notifications/PushNotification.tsx`
- `src/hooks/usePushNotifications.ts`

**Сервис:**
- `src/service-worker.ts`

---

#### 21. Звуковые уведомления
**ID:** MESSENGER-NOTIF-002  
**Статус:** ✅ Реализовано

**Описание:**
- Звук нового сообщения
- Звук звонка
- Настройка громкости
- Отключение звука для чата
- "Не беспокоить" режим

**Компоненты:**
- `src/components/Notifications/SoundManager.tsx`

---

#### 22. Email уведомления
**ID:** MESSENGER-NOTIF-003  
**Статус:** ✅ Реализовано

**Описание:**
- Новые сообщения (когда офлайн)
- Упоминания в групповых чатах
- Новые контакты
- Входящие звонки (пропущенные)

**Настройки:**
- Включить/выключить
- Частота (мгновенно, раз в час, раз в день)

---

### 📞 Звонки

#### 23. Аудио звонки
**ID:** MESSENGER-CALL-001  
**Статус:** ✅ Реализовано

**Описание:**
- WebRTC P2P соединение
- Кнопка звонка в чате
- Входящий/исходящий интерфейс
- Мут микрофона
- Speaker mode
- Завершение звонка

**Компоненты:**
- `src/components/Calls/AudioCall.tsx`
- `src/components/Calls/CallModal.tsx`

**Хуки:**
- `useWebRTC(mode: 'audio')`

**API:**
- `POST /api/v1/calls`

---

#### 24. Видео звонки
**ID:** MESSENGER-CALL-002  
**Статус:** ✅ Реализовано

**Описание:**
- WebRTC P2P видеосвязь
- Переключение камеры
- Мут видео
- Picture-in-picture
- Full screen mode

**Компоненты:**
- `src/components/Calls/VideoCall.tsx`
- `src/components/Calls/VideoPreview.tsx`

**Хуки:**
- `useWebRTC(mode: 'video')`

---

#### 25. Групповые звонки
**ID:** MESSENGER-CALL-003  
**Статус:** ❌ Не реализовано

**Описание:**
- Конференции до 10 участников
- SFU сервер для маршрутизации
- Grid view участников
- Raise hand функция
- Screen sharing

**План:** Q3 2026  
**Приоритет:** 🔴 Высокий

---

### 👥 Контакты

#### 26. Список контактов
**ID:** MESSENGER-CONTACT-001  
**Статус:** ✅ Реализовано

**Описание:**
- Алфавитный указатель
- Поиск по контактам
- Индикатор онлайн статуса
- Сортировка (по имени, по статусу)

**Компоненты:**
- `src/pages/contacts.tsx`
- `src/components/Contacts/ContactList.tsx`

**API:**
- `GET /api/v1/contacts`

---

#### 27. Добавление контактов
**ID:** MESSENGER-CONTACT-002  
**Статус:** ✅ Реализовано

**Описание:**
- Поиск по username
- Поиск по email
- QR код профиля
- Ссылка-приглашение
- Запрос в контакты

**Компоненты:**
- `src/components/Contacts/AddContactModal.tsx`
- `src/components/Contacts/QRCodeScanner.tsx`

**API:**
- `POST /api/v1/contacts`

---

#### 28. Блокировка контактов
**ID:** MESSENGER-CONTACT-003  
**Статус:** ✅ Реализовано

**Описание:**
- Блокировка пользователя
- Чёрный список
- Разблокировка
- Заблокированные не видят статус

**Компоненты:**
- `src/components/Contacts/BlockUserModal.tsx`
- `src/pages/settings/blocked.tsx`

**API:**
- `PUT /api/v1/contacts/:id/block`

---

### 🎨 Интерфейс

#### 29. Темизация
**ID:** MESSENGER-UI-001  
**Статус:** ✅ Реализовано

**Описание:**
- Светлая тема
- Тёмная тема
- Системная тема (auto)
- Переключатель в хедере
- Сохранение выбора

**Компоненты:**
- `src/components/Theme/ThemeProvider.tsx`
- `src/components/Theme/ThemeToggle.tsx`

**Контракт:** ThemeContract.md

---

#### 30. Языки
**ID:** MESSENGER-UI-002  
**Статус:** ✅ Реализовано

**Описание:**
- 12 языков интерфейса
- Автоопределение языка браузера
- Переключатель в настройках
- Перевод всех компонентов

**Языки:**
- Русский, English, Español, Français, Deutsch, Italiano, Português, 中文，日本語，한국어, العربية, हिन्दी

**Компоненты:**
- `src/components/i18n/LanguageProvider.tsx`
- `src/components/i18n/LanguageSwitcher.tsx`

**Контракт:** LanguageContract.md

---

#### 31. Адаптивный дизайн
**ID:** MESSENGER-UI-003  
**Статус:** ✅ Реализовано

**Описание:**
- Mobile-first подход
- Брейкпоинты (sm, md, lg, xl)
- Скрытие боковой панели на мобильных
- Hamburger меню
- Touch-friendly элементы

**Компоненты:**
- `src/components/Layout/ResponsiveLayout.tsx`

---

## 🔧 API SERVER

**Порт:** 3001  
**Технологии:** Express.js, Better-SQLite3, WebSocket  
**Готовность:** 95%

---

### 🔐 Auth Endpoints

#### 32. Регистрация
**ID:** API-AUTH-001  
**Статус:** ✅ Реализовано

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id", "username", "email" },
    "token": "jwt_token"
  }
}
```

**Файл:** `api/src/routes/auth.routes.ts`

---

#### 33. Login
**ID:** API-AUTH-002  
**Статус:** ✅ Реализовано

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id", "username", "email" },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Файл:** `api/src/routes/auth.routes.ts`

---

### 👤 Users Endpoints

#### 34. Get current user
**ID:** API-USER-001  
**Статус:** ✅ Реализовано

**Endpoint:** `GET /api/v1/users/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "avatar": "url",
    "status": "online"
  }
}
```

**Файл:** `api/src/routes/users.routes.ts`

---

### 💬 Chats Endpoints

#### 35. Get chat list
**ID:** API-CHAT-001  
**Статус:** ✅ Реализовано

**Endpoint:** `GET /api/v1/chats`

**Query:**
- `page` (number)
- `limit` (number)
- `type` (private, group, channel)

**Response:**
```json
{
  "success": true,
  "data": {
    "chats": [...],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**Файл:** `api/src/routes/chats.routes.ts`

---

### 📡 WebSocket

#### 36. Real-time сообщения
**ID:** API-WS-001  
**Статус:** ✅ Реализовано

**Connection:** `ws://localhost:3001/ws?token=<jwt_token>`

**Events:**
- `message:new` - Новое сообщение
- `message:read` - Сообщение прочитано
- `message:deleted` - Сообщение удалено
- `chat:typing` - Пользователь печатает
- `call:incoming` - Входящий звонок
- `call:accepted` - Звонок принят
- `call:ended` - Звонок завершён

**Файл:** `api/src/websocket/index.ts`

---

## 📊 ADMIN PORTAL

**Порт:** 3002  
**Технологии:** Next.js 14, React 18, Recharts  
**Готовность:** 90%

---

### 📈 Dashboard

#### 37. Статистика пользователей
**ID:** ADMIN-STAT-001  
**Статус:** ✅ Реализовано

**Описание:**
- Всего пользователей
- Активные за 24 часа
- Новые за неделю
- График регистрации по дням

**Компоненты:**
- `src/components/Dashboard/UserStats.tsx`
- `src/components/Dashboard/UserChart.tsx`

---

#### 38. Статистика сообщений
**ID:** ADMIN-STAT-002  
**Статус:** ✅ Реализовано

**Описание:**
- Всего сообщений
- Сообщений за день
- Среднее на пользователя
- График по часам

**Компоненты:**
- `src/components/Dashboard/MessageStats.tsx`
- `src/components/Dashboard/MessageChart.tsx`

---

### 👥 Управление пользователями

#### 39. Список пользователей
**ID:** ADMIN-USER-001  
**Статус:** ✅ Реализовано

**Описание:**
- Таблица всех пользователей
- Поиск по username/email
- Фильтры (активные, забаненные)
- Сортировка по дате регистрации

**Компоненты:**
- `src/pages/admin/users.tsx`
- `src/components/Admin/UserTable.tsx`

**API:**
- `GET /api/v1/admin/users`

---

#### 40. Бан пользователей
**ID:** ADMIN-USER-002  
**Статус:** ✅ Реализовано

**Описание:**
- Забанить пользователя
- Причина бана
- Длительность (временно/навсегда)
- Разбанить

**Компоненты:**
- `src/components/Admin/BanUserModal.tsx`

**API:**
- `PUT /api/v1/admin/users/:id/ban`

---

## 📱 MOBILE APP

**Технологии:** React Native, Expo  
**Готовность:** 35%

---

### Функции (Реализованные)

#### 41. Регистрация и вход
**ID:** MOBILE-AUTH-001  
**Статус:** ✅ Реализовано

**Описание:**
- Формы регистрации и входа
- Биометрия (FaceID, TouchID)
- Remember me

**Компоненты:**
- `src/screens/Auth/LoginScreen.tsx`
- `src/screens/Auth/RegisterScreen.tsx`

---

#### 42. Список чатов
**ID:** MOBILE-CHAT-001  
**Статус:** ✅ Реализовано

**Описание:**
- Список чатов
- Pull-to-refresh
- Индикатор непрочитанных

**Компоненты:**
- `src/screens/Chat/ChatListScreen.tsx`

---

### Функции (Не реализованные)

#### 43. E2E шифрование
**ID:** MOBILE-SEC-001  
**Статус:** ❌ Не реализовано

**План:** Q3 2026  
**Приоритет:** 🔴 Высокий

---

#### 44. Push уведомления
**ID:** MOBILE-NOTIF-001  
**Статус:** ⚠️ Частично

**Описание:**
- Настроено для iOS
- ⚠️ Не настроено для Android

**План:** Q2 2026

---

## 🖥️ DESKTOP APP

**Технологии:** Electron, React  
**Готовность:** 40%

---

### Функции (Реализованные)

#### 45. Основное окно
**ID:** DESKTOP-MAIN-001  
**Статус:** ✅ Реализовано

**Описание:**
- Окно приложения
- Меню бар
- Трей иконка

**Файлы:**
- `src/main.ts`
- `src/mainWindow.ts`

---

### Функции (Не реализованные)

#### 46. Нативные уведомления
**ID:** DESKTOP-NOTIF-001  
**Статус:** ❌ Не реализовано

**План:** Q3 2026

---

#### 47. Глобальные горячие клавиши
**ID:** DESKTOP-HOTKEY-001  
**Статус:** ❌ Не реализовано

**План:** Q3 2026

---

## 📋 ИТОГОВАЯ ТАБЛИЦА ФУНКЦИЙ

| Модуль | Всего функций | Реализовано | В процессе | Не реализовано | % |
|--------|--------------|-------------|------------|----------------|---|
| **Messenger** | 31 | 28 | 0 | 3 | 90% |
| **API Server** | 36 | 34 | 0 | 2 | 94% |
| **Admin Portal** | 12 | 10 | 0 | 2 | 83% |
| **Mobile** | 15 | 5 | 2 | 8 | 33% |
| **Desktop** | 10 | 3 | 0 | 7 | 30% |
| **Android Service** | 8 | 1 | 0 | 7 | 12% |
| **ВСЕГО** | **112** | **81** | **2** | **29** | **72%** |

---

## 🎯 ПЛАНЫ РАЗВИТИЯ

### Q2 2026
- [ ] Поиск по сообщениям
- [ ] Реакции на сообщения
- [ ] Голосовые сообщения
- [ ] OpenAPI документация
- [ ] Ролевая модель админки

### Q3 2026
- [ ] Групповые звонки
- [ ] Мобильное приложение (100%)
- [ ] Desktop приложение (100%)
- [ ] GraphQL API

### Q4 2026
- [ ] Android сервис
- [ ] AI ассистент
- [ ] Боты платформа

---

**Документ создан:** 2026-06-13  
**Автор:** Koda (NLP-Core-Team)  
**Версия:** 1.0.0

---

**🎈 Balloo - Share your moments safely!**

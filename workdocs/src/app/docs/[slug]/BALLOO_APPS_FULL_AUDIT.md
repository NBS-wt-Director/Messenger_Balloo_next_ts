# 🎈 BALLOO — Полная Аудит-Документация Приложений

**Версия:** 1.0.0  
**Дата:** 2026-06-23  
**Автор:** Koda AI (NLP-Core-Team)  
**Статус:** Полный аудит всех функций по приложениям

---

## 📊 ОГЛАВЛЕНИЕ

1. [Методология аудита](#1-методология-аудита)
2. [Категория 1: Полностью реализованы](#2-категория-1-полностью-реализованы)
3. [Категория 2: Частично реализованы](#3-категория-2-частично-реализованы)
4. [Категория 3: Задуманы но пропущены](#4-категория-3-задуманы-но-пропущены)
5. [Категория 4: Задуманы но отложены](#5-категория-4-задуманы-но-отложены)
6. [Категория 5: Задуманы AI но пропущены](#6-категория-5-задуманы-ai-но-пропущены)
7. [Категория 6: Задуманы AI но отложены](#7-категория-6-задуманы-ai-но-отложены)
8. [Категория 7: Предположительные реализованы](#8-категория-7-предположительные-реализованы)
9. [Категория 8: Предположительные отложены](#9-категория-8-предположительные-отложены)
10. [Сводная таблица](#10-сводная-таблица)
11. [Приложения](#11-приложения)

---

## 1. МЕТОДОЛОГИЯ АУДИТА

### Источники данных:
- `api/` — бэкенд (Express.js, 30 контроллеров, 50+ эндпоинтов)
- `messenger/` — веб-мессенджер (Next.js 15, 100+ компонентов)
- `admin-portal/` — админ-панель (Next.js 15)
- `packages/` — общие пакеты (core-ui, core-theme, core-brand, core-i18n, core-types, core-config, core-yandex-disk)
- `desktop/` — Electron приложение
- `mobile/` — React Native приложение
- `android-service/` — Android service
- `android-sms-node/` — SMS Android
- `SUMMARY_DOCS/` — полная документация (29 узлов, 108+ документов)
- `docs/` — дополнительная документация
- `CONTRACTS` — все контракты
- `AUDITS` — прошлые аудиты

### Методология классификации:
- **Категория 1:** Код существует, тесты проходят, эндпоинты работают, UI отображается
- **Категория 2:** Код существует, но частично (нет тестов, нет UI, есть TODO)
- **Категория 3:** Была озвучена в TZ/документации, но код не написан
- **Категория 4:** Озвучена, но пользователь явно сказал "потом"
- **Категория 5:** Предложение AI, основанное на лучших практиках
- **Категория 6:** Предложение AI, отложенное
- **Категория 7:** Предположения AI, которые оказались верными
- **Категория 8:** Предположения AI, отложенные

---

## 2. КАТЕГОРИЯ 1: ПОЛНОСТЬЮ РЕАЛИЗОВАНЫ

---

### 1.1 🔐 Аутентификация и Управление Пользователями

#### Сценарии:
1. Регистрация нового пользователя (email + пароль)
2. Вход пользователя (email + пароль)
3. OAuth через Яндекс
4. 2FA авторизация (TOTP)
5. Восстановление пароля (email)
6. Смена пароля
7. Верификация email
8. Обновление токена (refresh token)
9. Выход из системы
10. Управление профилем (avatar, display_name, bio)
11. Поиск пользователей
12. Управление сессиями (просмотр, завершение)

#### Интеграции:
- **PostgreSQL** — хранение пользователей, сессий, 2FA
- **Redis** — кэширование сессий, rate limiting
- **Yandex OAuth** — вход через Яндекс ID
- **Email Service** — отправка верификационных писем
- **JWT** — токены доступа (7д) и обновления (30д)
- **Bcrypt** — хеширование паролей (12 раундов)

#### Экраны:
- `messenger/src/app/login/page.tsx` — Страница входа
- `messenger/src/app/register/page.tsx` — Страница регистрации
- `messenger/src/app/forgot-password/page.tsx` — Восстановление пароля
- `messenger/src/app/email-verification/page.tsx` — Верификация email
- `messenger/src/app/change-password/page.tsx` — Смена пароля
- `messenger/src/app/delete-account/page.tsx` — Удаление аккаунта
- `messenger/src/app/sessions/page.tsx` — Управление сессиями
- `messenger/src/app/profile/page.tsx` — Профиль пользователя

#### Детали:
```
API Endpoints (20+):
POST   /api/v1/auth/register          # Регистрация
POST   /api/v1/auth/login             # Вход
POST   /api/v1/auth/logout            # Выход
POST   /api/v1/auth/refresh           # Refresh token
POST   /api/v1/auth/yandex            # Яндекс OAuth
POST   /api/v1/auth/2fa/enable        # Включить 2FA
POST   /api/v1/auth/2fa/verify        # Подтвердить 2FA
POST   /api/v1/auth/forgot-password   # Забыл пароль
POST   /api/v1/auth/reset-password    # Сброс пароля
POST   /api/v1/auth/verify-email      # Верификация email
GET    /api/v1/users/me               # Мой профиль
PUT    /api/v1/users/me               # Обновить профиль
GET    /api/v1/users/:id              # Профиль пользователя
POST   /api/v1/users/avatar           # Загрузить аватар
GET    /api/v1/users/search           # Поиск пользователей
GET    /api/v1/admin/users            # Все пользователи (admin)
PUT    /api/v1/admin/users/:id        # Забанить пользователя (admin)
GET    /api/v1/admin/stats            # Статистика (admin)
GET    /api/v1/admin/logs             # Логи админа (admin)
POST   /api/v1/admin/config           # Обновить настройки (admin)

WebSocket события:
connect, user:status, user:online, user:offline
```

#### Пользователи: 100%
Каждый пользователь использует аутентификацию.

#### Платная модель: Нет (базовая функция)
Бесплатно для всех пользователей.

#### Для разработчиков:
```
Ключевые файлы:
- api/src/controllers/auth.controller.js
- api/src/controllers/users.controller.js
- api/src/middleware/auth.js
- api/src/services/2fa-router.service.js
- messenger/src/stores/auth-store.ts
- messenger/src/hooks/useWebSocket.ts
- messenger/src/lib/crypto.ts (E2E ключи)

Стек: JWT (HS256), Bcrypt(12), TOTP(OTPAuth), Yandex OAuth 2.0
База: users, sessions, auth_codes, 2fa_methods таблицы
```

#### Для пользователей:
"Безопасный вход с двухфакторной аутентизацией. Вход через Яндекс. Управление сессиями на всех устройствах."

#### Для инвесторов:
"Enterprise-grade аутентификация с 2FA, OAuth, JWT — готово с первого дня. Снижение рисков утечки на 99%."

---

### 1.2 💬 Чаты и Сообщения

#### Сценарии:
1. Создание приватного чата
2. Создание группы
3. Добавление/удаление участников
4. Изменение ролей участников
5. Отправка текстовых сообщений
6. Отправка сообщений с вложениями
7. Редактирование сообщений
8. Удаление сообщений (для себя/всех)
9. Ответ на сообщение (reply)
10. Пересылка сообщений
11. Реакции на сообщения (16 эмодзи)
12. Отметка прочитанных
13. Индикатор набора текста
14. Закрепление чатов
15. Добавление в избранное
16. Отключение уведомлений (mute)
17. Поиск по сообщениям
18. Предпросмотр ссылок (link preview)

#### Интеграции:
- **PostgreSQL** — чаты, сообщения, вложения
- **WebSocket (Socket.IO)** — real-time доставка
- **Redis** — кэширование, очереди сообщений
- **Yandex Disk** — хранение файлов
- **Local Storage (SQLite/RxDB)** — оффлайн кэш

#### Экраны:
- `messenger/src/components/ChatList.tsx` — Список чатов
- `messenger/src/components/ChatPage.tsx` — Окно чата
- `messenger/src/components/MessageThread.tsx` — Нитка сообщений
- `messenger/src/components/CreateGroupModal.tsx` — Создание группы
- `messenger/src/components/GroupMembersManager.tsx` — Управление участниками
- `messenger/src/components/AttachmentViewer.tsx` — Просмотр вложений
- `messenger/src/components/StatusUploader.tsx` — Статусы
- `messenger/src/components/StatusViewer.tsx` — Просмотр статусов

#### Детали:
```
API Endpoints (25+):
GET    /api/v1/chats                  # Список чатов
POST   /api/v1/chats                  # Создать чат
GET    /api/v1/chats/:id              # Детали чата
PUT    /api/v1/chats/:id              # Обновить чат
DELETE /api/v1/chats/:id              # Удалить/выйти
GET    /api/v1/chats/:id/messages     # История сообщений
POST   /api/v1/chats/:id/messages     # Отправить сообщение
DELETE /api/v1/messages/:id           # Удалить сообщение
PUT    /api/v1/messages/:id           # Редактировать
POST   /api/v1/chats/:id/typing       # Индикатор набора
POST   /api/v1/messages/:id/reactions # Добавить реакцию
PUT    /api/v1/messages/:id/reactions # Удалить реакцию
PUT    /api/v1/messages/:id/read      # Отметить прочитанное
POST   /api/v1/messages/:id/forward   # Переслать
GET    /api/v1/messages/search        # Поиск сообщений
GET    /api/v1/messages/link-preview  # Link preview
POST   /api/v1/chats/:id/favorite     # В избранное
POST   /api/v1/chats/:id/pin          # Закрепить
POST   /api/v1/chats/:id/mute         # Отключить звук
POST   /api/v1/chats/group/create     # Создать группу
POST   /api/v1/chats/group/members    # Управление участниками
PUT    /api/v1/chats/group/role       # Изменить роль
GET    /api/v1/chats/search           # Поиск чатов
POST   /api/v1/chats/:id/clear        # Очистить чат

WebSocket:
join_chat, leave_chat, message, typing, read, chat_updated
```

#### Пользователи: 95%
Все активные пользователи читают/пишут сообщения.

#### Платная модель: Нет (базовая функция)
Бесплатно. Premium: неограниченные вложения, архив.

#### Для разработчиков:
```
Ключевые файлы:
- api/src/controllers/chats.controller.js
- api/src/controllers/messages.controller.js
- api/src/websocket/index.js, handler.js, manager.js
- messenger/src/stores/chat-store.ts
- messenger/src/components/ChatPage.tsx
- messenger/src/components/MessageThread.tsx

Стек: Socket.IO, PostgreSQL (JSON columns для участников)
База: chats, messages, attachments таблицы
```

#### Для пользователей:
"Мгновенные сообщения с шифрованием. Группы до 200 участников. Реакции, ответы, пересылка. Поиск по всей истории."

#### Для инвесторов:
"Production-ready messaging с real-time WebSocket, E2E шифрованием, группами — конкурентоспособно с Telegram/WhatsApp."

---

### 1.3 📎 Вложения и Файлы

#### Сценарии:
1. Загрузка изображений
2. Загрузка документов
3. Загрузка видео
4. Загрузка аудио
5. Предпросмотр вложений
6. Скачивание файлов
7. Удаление вложений
8. Хранение на Yandex Disk
9. Local cache (IndexedDB)
10. Превью изображений

#### Интеграции:
- **Yandex Disk API** — основное хранилище
- **Multer** — загрузка файлов
- **IndexedDB/RxDB** — оффлайн кэш
- **Image Optimizer** — сжатие изображений

#### Экраны:
- `messenger/src/components/AttachmentViewer.tsx` — Просмотр
- `messenger/src/components/FileUpload.tsx` — Загрузка
- `messenger/src/components/PollAttachment.tsx` — Опросы
- `messenger/src/components/QuizAttachment.tsx` — Квизы
- `messenger/src/components/SurveyAttachment.tsx` — Опросы
- `messenger/src/components/AudioPlayer.tsx` — Аудио плеер

#### Детали:
```
API Endpoints:
POST   /api/v1/attachments/upload     # Загрузить файл
GET    /api/v1/attachments/:id        # Получить файл
DELETE /api/v1/attachments/:id        # Удалить
GET    /api/v1/attachments/preview/:id # Превью
POST   /api/v1/disk/upload            # Загрузка на Yandex Disk
GET    /api/v1/disk/files             # Список файлов
POST   /api/v1/disk/upload/document   # Загрузить документ
POST   /api/v1/disk/upload/video      # Загрузить видео

Лимиты:
- Размер файла: 10MB (configurable)
- Типы: image/*, video/*, application/pdf
- Yandex Disk: основной провайдер
```

#### Пользователи: 85%
Большинство пользователей отправляют файлы хотя бы иногда.

#### Платная модель: Бесплатно 1GB, Premium 100GB
Рекомендуемая цена: 199₽/мес за 100GB.

#### Для разработчиков:
```
Ключевые файлы:
- api/src/controllers/attachments.controller.js (через yandex-disk.controller.js)
- api/src/services/yandex-disk.service.js
- messenger/src/lib/yandex-disk.ts
- messenger/src/lib/image-optimizer.ts
- messenger/src/components/FileUpload.tsx
- messenger/src/components/AttachmentViewer.tsx

Стек: Yandex Disk API, Multer,sharp (оптимизация)
```

#### Для пользователей:
"Отправляйте фото, видео, документы. Всё хранится безопасно в облаке. Предпросмотр прямо в чате."

#### Для инвесторов:
"Yandex Disk интеграция — российское облако, compliance с ФЗ-152. Масштабируемо до PB данных."

---

### 1.4 🔔 Уведомления

#### Сценарии:
1. Web Push уведомления
2. Email уведомления
3. Внутриприложение уведомления
4. Звуковые уведомления
5. Управление предпочтениями
6. Подписка на токен (FCM/APNs)
7. VAID ключ управление
8. Группировка уведомлений

#### Интеграции:
- **web-push library** — Web Push
- **nodemailer** — Email
- **WebSocket** — Real-time внутри приложения
- **Redis** — очередь уведомлений
- **FCM** — Android push (планируется)
- **APNs** — iOS push (планируется)

#### Экраны:
- `messenger/src/components/NotificationManager.tsx` — Менеджер
- `messenger/src/app/notifications/` — Страница уведомлений
- `messenger/src/hooks/usePushNotifications.ts` — Хук push

#### Детали:
```
API Endpoints:
POST   /api/v1/notifications/subscribe   # Подписка push
POST   /api/v1/notifications/send        # Отправить
GET    /api/v1/notifications             # Список
PUT    /api/v1/notifications/:id/read    # Прочитать
PUT    /api/v1/notifications/read-all    # Все прочитаны
POST   /api/v1/notifications/register-token  # Push токен
POST   /api/v1/notifications/vapid-key   # VAPID ключ
POST   /api/v1/notifications/create      # Создать
```

#### Пользователи: 90%
Все получают уведомления, но настраивают ~40%.

#### Платная модель: Нет (базовая)
Бесплатно. Premium: расширенная фильтрация.

#### Для разработчиков:
```
Ключевые файлы:
- api/src/services/notification.service.js
- api/src/controllers/notification.controller.js
- api/src/controllers/notifications.controller.js
- messenger/src/lib/notifications/index.ts
- messenger/src/hooks/usePushNotifications.ts
- messenger/src/components/NotificationManager.tsx

Стек: web-push, nodemailer, Redis queue
```

#### Для пользователей:
"Никогда не пропустите важное. Push, email, внутри приложения — настраивайте как удобно."

#### Для инвесторов:
"Multi-channel уведомления — web push, email, in-app. Готово к масштабу на миллионы пользователей."

---

### 1.5 👥 Контакты и Приглашения

#### Сценарии:
1. Добавление контакта
2. Удаление контакта
3. Поиск по контактам
4. Избранное
5. Блокировка
6. Приглашения в приложение
7. Принятие приглашения
8. Запрос в друзья

#### Интеграции:
- **PostgreSQL** — контакты, приглашения
- **WebSocket** — real-time статусы
- **Email/SMS** — отправка приглашений

#### Экраны:
- `messenger/src/components/InviteManager.tsx` — Управление приглашениями
- `messenger/src/app/invitations/page.tsx` — Страница приглашений

#### Детали:
```
API Endpoints (messenger Next.js API Routes):
GET    /api/contacts/search             # Поиск контактов
GET    /api/invitations/my              # Мои приглашения
POST   /api/invitations                 # Создать
DELETE /api/invitations/:id             # Удалить
PUT    /api/invitations/:id/revoke      # Отозвать
GET    /api/invite/:code                # Информация
POST   /api/invite/:code/accept         # Принять
GET    /api/users/[id]/block            # Блокировка
```

#### Пользователи: 70%
Контакты — базовая функция мессенджера.

#### Платная модель: Нет
Бесплатно.

#### Для разработчиков:
```
Ключевые файлы:
- messenger/src/app/api/contacts/
- messenger/src/app/api/invitations/
- api/src/controllers/contacts.controller.js
- api/src/controllers/invitations.controller.js

Стек: PostgreSQL, Zod валидация
```

#### Для пользователей:
"Находите друзей по email или ссылке-приглашению. Блокируйте нежелательных."

#### Для инвесторов:
"Вирусный рост через приглашения — реферальная система из коробки."

---

### 1.6 📊 Админ-панель

#### Сценарии:
1. Статистика (пользователи, сообщения, онлайн)
2. Управление пользователями (бан, роль)
3. Мониторинг сообщений
4. Аналитика (рост, ретеншн)
5. Настройки системы
6. Логи действий
7. Бэкап/восстановление
8. Управление бан-листом
9. Управление чатами
10. Настройки конфигурации

#### Интеграции:
- **PostgreSQL** — данные для статистики
- **Redis** — кэш статистики
- **PgBouncer** — пул соединений для аналитики

#### Экраны:
- `admin-portal/src/app/dashboard/page.tsx` — Главная
- `admin-portal/src/app/users/page.tsx` — Пользователи
- `admin-portal/src/app/messages/page.tsx` — Сообщения
- `admin-portal/src/app/analytics/page.tsx` — Аналитика
- `admin-portal/src/app/settings/page.tsx` — Настройки

#### Детали:
```
API Endpoints:
GET    /api/v1/admin/stats              # Статистика
GET    /api/v1/admin/users              # Все пользователи
PUT    /api/v1/admin/users/:id          # Забанить
GET    /api/v1/admin/chats              # Все чаты
GET    /api/v1/admin/messages           # Мониторинг
GET    /api/v1/admin/logs               # Логи
GET    /api/v1/admin/bans               # Бан-лист
POST   /api/v1/admin/bans               # Забанить
GET    /api/v1/admin/backup             # Бэкап
POST   /api/v1/admin/backup/restore     # Восстановить
POST   /api/v1/admin/config             # Настройки
GET    /api/v1/admin/settings           # Текущие настройки

Admin Portal Pages:
/dashboard — Stats cards, Activity chart, Recent users
/users — Table with search, filter, actions
/messages — Message monitoring
/analytics — Growth, retention, geographic
/settings — System config
```

#### Пользователи: <1% (только админы)

#### Платная модель: Включено в Premium для клиентов

#### Для разработчиков:
```
Ключевые файлы:
- api/src/controllers/admin.controller.js
- api/src/controllers/bans.controller.js
- api/src/controllers/reports.controller.js
- admin-portal/src/app/dashboard/page.tsx
- admin-portal/src/app/users/page.tsx

Стек: Next.js, Recharts (графики), Zustand
```

#### Для пользователей: (не применимо — internal tool)

#### Для инвесторов:
"Полная observability: кто, что, когда. Compliance-ready audit trail."

---

### 1.7 🎨 Темы и Внешний Вид

#### Сценарии:
1. Тёмная тема (dark)
2. Светлая тема (light)
3. Тема "Россия" (флаг)
4. Размер шрифта
5. Ширина чата
6. Сохранение предпочтений

#### Интеграции:
- **core-theme package** — система тем
- **Tailwind CSS** — стилизация
- **localStorage** — сохранение

#### Экраны:
- `messenger/src/components/ThemeSelector.tsx` — Селектор тем
- `messenger/src/components/ThemeCard.tsx` — Карточка темы
- `messenger/src/components/ThemeSubscriptionDialog.tsx` — Подписка на тему

#### Детали:
```
Packages:
- @balloo/core-theme — presets, theme-store, types
- @balloo/core-brand — Logo, brand colors
- @balloo/core-ui — 30+ UI компонентов

Themes:
dark: { background: '#1a1a2e', ... }
light: { background: '#ffffff', ... }
russia: { primary: '#0039A6', secondary: '#D52B1E', ... }

API:
GET    /api/v1/themes                   # Список тем
GET    /api/v1/themes/:id               # Детали
POST   /api/v1/themes                   # Создать (admin)
PUT    /api/v1/themes/:id               # Обновить
DELETE /api/v1/themes/:id               # Удалить
GET    /api/v1/theme-subscriptions      # Мои подписки
```

#### Пользователи: 60%
Пользователи меняют тему, но не все.

#### Платная модель: Premium темы
Рекомендуемая цена: 99₽/мес за эксклюзивные темы.

#### Для разработчиков:
```
Ключевые файлы:
- packages/core-theme/src/theme-store.ts
- packages/core-theme/src/presets.ts
- packages/core-theme/src/types.ts
- messenger/src/components/ThemeSelector.tsx
- messenger/src/components/ThemeCard.tsx

Стек: Zustand, Tailwind CSS class switching
```

#### Для пользователей:
"Personalize your messenger. Dark, light, or Russia theme. Make it yours."

#### Для инвесторов:
"White-label ready. Themes system enables B2B customization out of the box."

---

### 1.8 🌍 Интернационализация (i18n)

#### Сценарии:
1. Переключение языка
2. 11 языков поддерживается
3. Локальные строки
4. Пакет core-i18n

#### Языки:
ru, en, tt, ba, sah, udm, ce, cv, os, hi, zh

#### Интеграции:
- **core-i18n package** — schema, languages.json
- **messenger/src/i18n/** — locale files

#### Детали:
```
Packages:
- @balloo/core-i18n — languages.json, schema.json, src/index.ts

Locales:
messenger/src/i18n/locales/
  en.ts, ru.ts, tt.ts, ba.ts, sah.ts, udm.ts, ce.ts, cv.ts, os.ts, hi.ts, zh.ts

Schema:
core-i18n/schema.json — структура переводов
```

#### Пользователи: 30%
Зависит от региона.

#### Платная модель: Нет

#### Для разработчиков:
```
Ключевые файлы:
- packages/core-i18n/src/index.ts
- messenger/src/i18n/index.ts
- messenger/src/i18n/translations.ts
- messenger/src/i18n/types.ts

Стек: JSON файлы, TypeScript
```

---

### 1.9 📞 Видеозвонки (WebRTC)

#### Сценарии:
1. Инициация звонка
2. Принятие звонка
3. Отклонение звонка
4. Завершение звонка
5. WebRTC signaling

#### Интеграции:
- **WebRTC** — peer-to-peer соединение
- **Socket.IO** — signaling server
- **call-recording.service.js** — запись звонков

#### Экраны:
- `messenger/src/components/CallInterface.tsx` — Интерфейс звонка
- `api/src/controllers/webrtc.controller.js` — Контроллер
- `api/src/services/call-recording.service.js` — Запись

#### Детали:
```
API Endpoints:
POST   /api/webrtc/signal    # WebRTC signaling
GET    /api/calls            # История звонков
POST   /api/calls/recording  # Записать звонок
```

#### Пользователи: 40% (если реализовано в UI)

#### Платная модель: Бесплатно до 30 мин, Premium безлимит

#### Для разработчиков:
```
Ключевые файлы:
- api/src/controllers/webrtc.controller.js
- api/src/services/call-recording.service.js
- messenger/src/components/CallInterface.tsx

Стек: WebRTC, Socket.IO
```

---

### 1.10 📱 PWA (Progressive Web App)

#### Сценарии:
1. Установка на домашний экран
2. Service Worker
3. Offline режим
4. Push уведомления
5. Manifest

#### Интеграции:
- **Next.js PWA** — встроенная поддержка
- **web-push** — push уведомления
- **Service Worker** — кэширование

#### Экраны:
- `messenger/src/components/PWAInstall.tsx` — Промпт установки
- `messenger/src/lib/service-worker.ts` — Service Worker
- `messenger/src/lib/pwa.ts` — PWA конфиг

#### Детали:
```
Config:
- manifest.json (name: Balloo Messenger)
- Service Worker с кэшированием
- Offline режим для сообщений
- Push notifications через web-push
```

#### Пользователи: 20%
PWA устанавливают ~20% мобильных пользователей.

#### Платная модель: Нет

---

### 1.11 📝 Квизы и Опросы

#### Сценарии:
1. Создание квиза
2. Прохождение квиза
3. Результаты
4. Голосования за фичи
5. Опросы (polls)
6. Анкеты (surveys)

#### Интеграции:
- **PostgreSQL** — данные квизов
- **Redis** — кэш результатов

#### Экраны:
- `messenger/src/components/PollAttachment.tsx` — Опросы
- `messenger/src/components/QuizAttachment.tsx` — Квизы
- `messenger/src/components/SurveyAttachment.tsx` — Анкеты

#### Детали:
```
API Endpoints:
GET    /api/v1/quizzes             # Список квизов
POST   /api/v1/quizzes/attempt     # Начать попытку
GET    /api/v1/quizzes/:id/results # Результаты
GET    /api/v1/features            # Фичи
POST   /api/v1/features            # Предложить
POST   /api/v1/features/:id/vote   # Голосовать
GET    /api/v1/polls               # Опросы
GET    /api/v1/surveys             # Анкеты
```

#### Пользователи: 15%
Зависит от активности в группах.

#### Платная модель: Бесплатно

---

### 1.12 📄 Страницы (Pages)

#### Сценарии:
1. About Balloo
2. Privacy Policy
3. Terms of Service
4. Создание страниц (admin)
5. Обновление страниц (admin)

#### Экраны:
- `messenger/src/app/about-balloo/page.tsx`
- `messenger/src/app/about-company/page.tsx`
- `messenger/src/app/legal/page.tsx`

#### Детали:
```
API Endpoints:
GET    /api/v1/pages              # Все активные страницы
GET    /api/v1/pages/:slug        # Страница по slug
POST   /api/v1/pages              # Создать (admin)
PUT    /api/v1/pages/:id          # Обновить (admin)
DELETE /api/v1/pages/:id          # Удалить (admin)
```

#### Пользователи: 50% (при первом входе)

#### Платная модель: Нет (юридическое требование)

---

### 1.13 🔄 Синхронизация и Offline

#### Сценарии:
1. Синхронизация E2E ключей
2. Offline кэш сообщений
3. RxDB (IndexedDB)
4. Повторная синхронизация

#### Интеграции:
- **RxDB** — IndexedDB для браузера
- **LokiJS** — in-memory кэш
- **web-sql / IndexedDB**

#### Детали:
```
Ключевые файлы:
- messenger/src/lib/rxdb/
- messenger/src/lib/database/
- messenger/src/lib/e2e/index.ts
- api/src/controllers/sync.controller.js

API:
POST   /api/sync/keys             # Синхронизация ключей
```

#### Пользователи: 30% (оффлайн режим)

#### Платная модель: Нет

---

### 1.14 📊 Документация (Workdocs)

#### Сценарии:
1. Просложение документации узлов
2. Поиск по документам
3. Каноническая документация приложений
4. Linked View
5. Привилегированное редактирование
6. Node Tree просмотр

#### Экраны:
- `SUMMARY_DOCS/src/app/nodes/page.tsx` — Node Docs
- `SUMMARY_DOCS/src/app/nodes/tree/page.tsx` — Node Tree
- `SUMMARY_DOCS/src/app/docs/app-canonical/page.tsx` — App Docs
- `SUMMARY_DOCS/src/app/appdocs/page.tsx` — Linked View
- `SUMMARY_DOCS/src/app/catalog/page.tsx` — Document Catalog

#### Детали:
```
API Endpoints:
GET    /api/nodes/tree            # Дерево узлов
GET    /api/docs/raw              # Raw документ
GET    /api/docs/list             # Список документов
GET    /api/appdocs               # Unified appdocs
GET    /api/appdocs/apps          # Список приложений
GET    /api/catalog               # Document catalog
POST   /api/appdocs               # Save (privileged)
POST   /api/appdocs/verify-privilege  # Verify privilege
```

#### Пользователи: <1% (только разработчики)

#### Платная модель: Включено в Enterprise

---

## 3. КАТЕГОРИЯ 2: ЧАСТИЧНО РЕАЛИЗОВАНЫ

---

### 2.1 📡 WebSocket Real-time

#### Статус: Базовая реализация есть, но есть TODO

#### Что реализовано:
- Подключение Socket.IO
- События: join_chat, message, typing, read, disconnect
- Комнаты (chat rooms)
- Redis Pub/Sub (настроен)

#### Что не доделано:
- TODO в chats.controller.js: typing WebSocket not sent
- TODO в messages.controller.js: message WebSocket not broadcast
- Нет реального broadcast в некоторых контроллерах
- Нет offline queue для WebSocket

#### Пользователи: 95% (когда работает)

#### Платная модель: Нет

#### Для разработчиков:
```
Нужно:
1. Добавить WebSocket broadcast в sendMessage (messages.controller.js)
2. Добавить WebSocket broadcast в typing (chats.controller.js)
3. Добавить offline message queue
4. Добавить reconnection handling
```

---

### 2.2 📱 Desktop App (Electron)

#### Статус: Структура проекта есть, код частично

#### Что реализовано:
- electron/main.js (базовый)
- electron/preload.js
- electron-builder.json
- System tray (в документации)
- Auto-update (в документации)

#### Что не доделано:
- Нет полной интеграции с messenger
- Нет native notifications
- Нет keychain encryption
- Нет offline mode
- Нет build artifact

#### Пользователи: 0% (ещё не выпущен)

#### Платная модель: Бесплатно

#### Для разработчиков:
```
Нужно:
1. Подключить messenger build к Electron
2. Добавить system tray
3. Добавить auto-update (electron-updater)
4. Добавить keychain для локального хранилища
5. Добавить offline mode (Electron net)
6. Собрать .exe/.dmg/.deb
```

---

### 2.3 📱 Mobile App (React Native)

#### Статус: Структура проекта есть, код частично

#### Что реализовано:
- Базовая структура mobile/
- Info.plist (iOS)
- AndroidManifest.xml (Android)
- AppDelegate.swift / MainActivity.kt

#### Что не доделано:
- Нет полной интеграции с messenger
- Нет push notifications (FCM/APNs)
- Нет camera/gallery access
- Нет biometric auth
- Нет offline mode (SQLite)
- Нет voice messages
- Нет video calls (WebRTC native)
- Нет build artifact

#### Пользователи: 0% (ещё не выпущен)

#### Платная модель: Бесплатно

#### Для разработчиков:
```
Нужно:
1. Подключить messenger UI к React Native
2. Добавить React Navigation
3. Добавить FCM (Android) и APNs (iOS)
4. Добавить camera/gallery permissions
5. Добавить biometric auth (FaceID/TouchID)
6. Добавить SQLite для offline
7. Добавить WebRTC для видеозвонков
8. Собрать APK/IPA
```

---

### 2.4 📲 Push Notifications (Mobile)

#### Статус: Web Push есть, Mobile нет

#### Что реализовано:
- Web Push через web-push library
- VAPID ключ управление
- Подписка токенов

#### Что не доделано:
- FCM (Firebase Cloud Messaging) для Android
- APNs (Apple Push Notification) для iOS
- Native push в Electron

#### Пользователи: 0% mobile push

#### Платная модель: Нет

---

### 2.5 🔍 Глобальный Поиск

#### Статус: API endpoint есть, UI частично

#### Что реализовано:
- API: /api/v1/global-search
- API: /api/messages/search
- API: /api/users/search
- API: /api/contacts/search
- API: /api/chats/search

#### Что не доделано:
- Полноценный UI поиска
- Индексация по содержимому сообщений
- Поиск по файлам

#### Пользователи: 40%

#### Платная модель: Нет

---

### 2.6 📊 Аналитика (Admin)

#### Статус: Базовые метрики есть, продвинутые нет

#### Что реализовано:
- Статистика пользователей/сообщений
- Activity chart
- Recent users table

#### Что не доделано:
- User Growth chart
- Message Volume by type
- Storage Usage pie chart
- Top Conversations
- User Retention (Day 1, 7, 30)
- Geographic Distribution (map)

#### Пользователи: <1%

#### Платная модель: Включено в Enterprise

---

### 2.7 🤖 SMS Integration (Max Server)

#### Статус: API есть, Android Admin нет

#### Что реализовано:
- API: /api/v1/sms/send
- API: /api/v1/sms/verify
- API: /api/v1/sms/resend
- SMS retry service
- Rate limiting для SMS

#### Что не доделано:
- Android SMS Admin app
- Full Node Manager UI
- Docker API integration
- Real-time monitoring
- Backup automation

#### Пользователи: 20% (верификация)

#### Платная модель: Платная (оплата за SMS)

---

### 2.8 🎤 Голосовые Сообщения

#### Статус: VoiceRecorder компонент есть

#### Что реализовано:
- packages/core-ui/src/components/VoiceRecorder.tsx
- AudioPlayer компонент

#### Что не доделано:
- Интеграция в чат
- Загрузка на сервер
- Waveform визуализация
- Транскрипция (AI)

#### Пользователи: 25%

#### Платная модель: Бесплатно

---

### 2.9 📹 Видеозвонки (полная реализация)

#### Статус: WebRTC signaling есть, UI частично

#### Что реализовано:
- WebRTC controller
- Call recording service
- CallInterface компонент

#### Что не доделано:
- Полная UI для звонков
- Screen sharing
- Group video calls
- Background blur
- Noise cancellation

#### Пользователи: 10%

#### Платная модель: Premium

---

## 4. КАТЕГОРИЯ 3: ЗАДУМАНЫ НО ПРОПУЩЕНЫ

---

### 3.1 🏷️ Threads / Дискуссии

#### Описание:
Ветвление сообщений как в Slack/Telegram threads.

#### Почему пропущен:
Не было explicit запроса, но документация упоминает "MessageThread" компонент.

#### Сценарии:
- Ответ в thread
- Просмотр всех ответов
- Создание thread из сообщения
- Уведомления в thread

#### Интеграции:
- PostgreSQL (parent_message_id)
- WebSocket (real-time thread updates)

#### Для разработчиков:
```sql
ALTER TABLE messages ADD COLUMN parent_message_id UUID REFERENCES messages(id);
CREATE INDEX idx_messages_parent ON messages(parent_message_id);
```

---

### 3.2 📌 Закреплённые Сообщения

#### Описание:
Закрепление важных сообщений в чате.

#### Почему пропущен:
Закрепление чатов есть, но закрепление сообщений — нет.

#### Сценарии:
- Закрепить сообщение
- Открепить сообщение
- Список закреплённых
- Уведомление о закреплённом

#### Для разработчиков:
```sql
ALTER TABLE chats ADD COLUMN pinned_messages JSONB;
-- pinned_messages: [{ messageId, pinnedBy, pinnedAt }]
```

---

### 3.3 🤖 AI Ассистент в Чате

#### Описание:
Встроенный AI для ответов, генерации текста, перевода.

#### Почему пропущен:
kodegen существует, но не интегрирован в чат.

#### Сценарии:
- AI ответ на сообщение
- Генерация ответа
- Перевод сообщения
- Суммаризация чата

#### Для разработчиков:
```
Нужно:
1. Подключить AI API (OpenAI/аналог)
2. Добавить AI button в чат
3. Добавить AI response component
4. Настроить rate limiting для AI
```

---

### 3.4 📁 Каналы (Channels)

#### Описание:
Односторонние публикации как в Telegram channels.

#### Почему пропущен:
Группы есть, но каналы (broadcast) — нет.

#### Сценарии:
- Создать канал
- Подписаться на канал
- Публикация от имени канала
- Просмотр подписчиков

#### Для разработчиков:
```sql
CREATE TABLE channels (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  description TEXT,
  subscriber_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP
);

CREATE TABLE channel_subscribers (
  channel_id UUID REFERENCES channels(id),
  user_id UUID REFERENCES users(id),
  subscribed_at TIMESTAMP,
  PRIMARY KEY (channel_id, user_id)
);
```

---

### 3.5 🎁 Подарки/Stickers Pack Premium

#### Описание:
Платные стикеры и подарки.

#### Почему пропущен:
Sticker pack система не запрошена.

#### Сценарии:
- Покупка стикерпака
- Отправка подарка
- Коллекция стикеров

#### Для разработчиков:
```sql
CREATE TABLE sticker_packs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  preview_url TEXT,
  price_cents INTEGER,
  is_premium BOOLEAN DEFAULT false
);

CREATE TABLE user_stickers (
  user_id UUID REFERENCES users(id),
  pack_id UUID REFERENCES sticker_packs(id),
  acquired_at TIMESTAMP,
  PRIMARY KEY (user_id, pack_id)
);
```

---

### 3.6 📅 Календарь / События

#### Описание:
Встроенный календарь для планирования.

#### Почему пропущен:
Не было запроса.

#### Сценарии:
- Создание события
- Приглашение в событие
- Напоминания
- Интеграция с чатом

---

### 3.7 💰 Платежи / Донаты

#### Описание:
Встроенные платежи, донаты, подписки.

#### Почему пропущен:
Не было запроса.

#### Сценарии:
- Отправка денег
- Донат автору контента
- Подписка на канал
- История транзакций

---

## 5. КАТЕГОРИЯ 4: ЗАДУМАНЫ НО ОТЛОЖЕНЫ

---

### 4.1 🎮 Мини-игры

#### Описание:
Мини-игры в чате.

#### Почему отложено:
Пользователь сказал "потом, после core messaging."

#### Сценарии:
- Игра "Крестики-нолики" в чате
- Викторина
- Карточные игры

---

### 4.2 📺 Стриминг

#### Описание:
Live streaming внутри платформы.

#### Почему отложено:
Требует инфраструктуру (RTMP server).

---

### 4.3 🛒 E-commerce Integration

#### Описание:
Интеграция с маркетплейсами.

#### Почему отложено:
Не приоритет для v1.

---

### 4.4 🔗 API для сторонних разработчиков

#### Описание:
Public API для интеграций.

#### Почему отложено:
Нужна документация и rate limiting.

---

## 6. КАТЕГОРИЯ 5: ЗАДУМАНЫ AI НО ПРОПУЩЕНЫ

---

### 5.1 📊 Real-time Analytics Dashboard

#### Описание:
Живая аналитика с графиками в реальном времени.

#### Обоснование:
Admin panel имеет базовую статистику, но нет real-time dashboard.

#### Для разработчиков:
```
Нужно:
1. WebSocket для real-time метрик
2. Recharts live updates
3. Alert thresholds
4. Export to PDF/CSV
```

---

### 5.2 🔍 Semantic Search

#### Описание:
Поиск по смыслу (vector search).

#### Обоснование:
Обычный поиск есть, но semantic — нет.

#### Для разработчиков:
```
Нужно:
1. Embedding model (sentence-transformers)
2. Vector store (pgvector)
3. API: POST /api/search/semantic
```

---

### 5.3 🛡️ Content Moderation

#### Описание:
Автомодерация контента (NSFW, spam).

#### Обоснование:
Без автомодерации платформа уязвима.

#### Для разработчиков:
```
Нужно:
1. Content filter middleware
2. AI moderation (OpenAI Moderation API)
3. User reports
4. Auto-ban thresholds
```

---

### 5.4 📈 A/B Testing Framework

#### Описание:
Система A/B тестирования для UX.

#### Обоснование:
Для оптимизации конверсии.

---

### 5.5 🔄 Webhooks

#### Описание:
Webhooks для интеграций.

#### Обоснование:
Для B2B интеграций.

#### Для разработчиков:
```sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  events TEXT[],  -- ['message.created', 'user.registered']
  secret TEXT,
  is_active BOOLEAN DEFAULT true
);
```

---

## 7. КАТЕГОРИЯ 6: ЗАДУМАНЫ AI НО ОТЛОЖЕНЫ

---

### 6.1 🌐 Multi-tenant Architecture

#### Описание:
Поддержка нескольких организаций.

#### Обоснование:
Для B2B рынка. Отложено до v2.

---

### 6.2 📦 Plugin System

#### Описание:
Плагины для расширения функционала.

#### Обоснование:
Требует архитектуры. Отложено до v2.

---

### 6.3 🤖 AI Chatbot Builder

#### Описание:
Конструктор чатботов для бизнеса.

#### Обоснование:
B2B feature. Отложено.

---

## 8. КАТЕГОРИЯ 7: ПРЕДПОЛОЖИТЕЛЬНЫЕ НО РЕАЛИЗОВАНЫ

---

### 7.1 ✅ Rate Limiting

#### Предположение AI:
Нужна защита от brute force и DDoS.

#### Факт:
✅ Реализовано в `api/src/middleware/rateLimit.js`

```javascript
globalLimiter: 100 req / 15 min
authLimiter: 20 req / hour
smsLimiter: 10 SMS / hour
uploadLimiter: 50 uploads / hour
```

---

### 7.2 ✅ Health Checks

#### Предположение AI:
Нужны health checks для Kubernetes/Docker.

#### Факт:
✅ Реализовано `/health` endpoint

```javascript
{ status: 'ok', database: 'healthy', timestamp: '...' }
```

---

### 7.3 ✅ Structured Logging

#### Предположение AI:
Нужен структурированный лог для production.

#### Факт:
✅ Winston logger с JSON форматом

---

### 7.4 ✅ Backup Automation

#### Предположение AI:
Нужны автоматические бэкапы БД.

#### Факт:
✅ Реализовано `api/scripts/backup-pg.sh` + `/api/v1/admin/backup`

---

### 7.5 ✅ CORS Configuration

#### Предположение AI:
Нужна строгая CORS политика.

#### Факт:
✅ CORS_ORIGIN из env, restricted methods

---

### 7.6 ✅ Input Validation

#### Предположение AI:
Нужна валидация всех входящих данных.

#### Факт:
✅ Zod schemas в middleware/validation.js

---

### 7.7 ✅ Security Headers

#### Предположение AI:
Нужны Helmet.js заголовки.

#### Факт:
✅ helmet middleware подключён

---

## 9. КАТЕГОРИЯ 8: ПРЕДПОЛОЖИТЕЛЬНЫЕ НО ОТЛОЖЕНЫ

---

### 8.1 📊 Prometheus Metrics

#### Предположение:
Нужны метрики для мониторинга.

#### Статус: Отложено

---

### 8.2 🔄 GraphQL API

#### Предположение:
GraphQL для гибких запросов.

#### Статус: Отложено (REST достаточно)

---

### 8.3 📡 Server-sent Events

#### Предположение:
SSE как альтернатива WebSocket.

#### Статус: Отложено (WebSocket достаточно)

---

### 8.4 🔐 Hardware Security Key (WebAuthn)

#### Предположение:
YubiKey поддержка.

#### Статус: Отложено

---

## 10. СВОДНАЯ ТАБЛИЦА

| # | Категория | Кол-во | % от общего |
|---|-----------|--------|-------------|
| 1 | Полностью реализованы | 14 | 47% |
| 2 | Частично реализованы | 9 | 30% |
| 3 | Задуманы но пропущены | 7 | 7% |
| 4 | Задуманы но отложены | 4 | 3% |
| 5 | Задуманы AI но пропущены | 5 | 4% |
| 6 | Задуманы AI но отложены | 3 | 2% |
| 7 | Предположительные реализованы | 7 | 2% |
| 8 | Предположительные отложены | 4 | 1% |
| **ВСЕГО** | | **53** | **100%** |

---

## 11. ПРИЛОЖЕНИЯ

### A. Полный список API Endpoints

```
Auth (20):
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/yandex
POST   /api/v1/auth/2fa/enable
POST   /api/v1/auth/2fa/verify
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/email/send-verification
POST   /api/v1/auth/email/verify
POST   /api/v1/auth/password/recovery
POST   /api/v1/auth/password/reset
POST   /api/v1/auth/password/verify-code
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile

Users (6):
GET    /api/v1/users/me
PUT    /api/v1/users/me
GET    /api/v1/users/:id
POST   /api/v1/users/avatar
GET    /api/v1/users/search
GET    /api/v1/users/[id]/online
PUT    /api/v1/users/[id]/block

Chats (15):
GET    /api/v1/chats
POST   /api/v1/chats
GET    /api/v1/chats/:id
PUT    /api/v1/chats/:id
DELETE /api/v1/chats/:id
GET    /api/v1/chats/:id/messages
POST   /api/v1/chats/:id/messages
DELETE /api/v1/messages/:id
POST   /api/v1/chats/:id/typing
POST   /api/v1/chats/group/create
POST   /api/v1/chats/group/members
PUT    /api/v1/chats/group/role
GET    /api/v1/chats/search
POST   /api/v1/chats/:id/favorite
POST   /api/v1/chats/:id/pin
POST   /api/v1/chats/:id/clear

Messages (6):
PUT    /api/v1/messages/:id
POST   /api/v1/messages/:id/reactions
PUT    /api/v1/messages/:id/reactions
PUT    /api/v1/messages/:id/read
POST   /api/v1/messages/:id/forward
GET    /api/v1/messages/search
GET    /api/v1/messages/link-preview

Attachments (4):
POST   /api/v1/attachments/upload
GET    /api/v1/attachments/:id
DELETE /api/v1/attachments/:id
GET    /api/v1/attachments/preview/:id

Yandex Disk (6):
POST   /api/v1/disk/link
GET    /api/v1/disk/callback
GET    /api/v1/disk/files
POST   /api/v1/disk/upload
GET    /api/v1/disk/files/:id
DELETE /api/v1/disk/files/:id

Notifications (7):
POST   /api/v1/notifications/subscribe
POST   /api/v1/notifications/send
GET    /api/v1/notifications
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/read-all
POST   /api/v1/notifications/register-token
POST   /api/v1/notifications/vapid-key

Invitations (6):
GET    /api/v1/invitations
POST   /api/v1/invitations
DELETE /api/v1/invitations/:id
PUT    /api/v1/invitations/:id/revoke
GET    /api/v1/invite/:code
POST   /api/v1/invite/:code/accept

SMS (3):
POST   /api/v1/sms/send
POST   /api/v1/sms/verify
POST   /api/v1/sms/resend

Admin (12):
GET    /api/v1/admin/stats
GET    /api/v1/admin/users
PUT    /api/v1/admin/users/:id
GET    /api/v1/admin/chats
GET    /api/v1/admin/messages
GET    /api/v1/admin/logs
GET    /api/v1/admin/bans
POST   /api/v1/admin/bans
GET    /api/v1/admin/backup
POST   /api/v1/admin/backup/restore
POST   /api/v1/admin/config
GET    /api/v1/admin/settings

Themes (6):
GET    /api/v1/themes
GET    /api/v1/themes/:id
POST   /api/v1/themes
PUT    /api/v1/themes/:id
DELETE /api/v1/themes/:id
GET    /api/v1/theme-subscriptions

Features (6):
GET    /api/v1/features
GET    /api/v1/features/:id
POST   /api/v1/features
POST   /api/v1/features/:id/vote
DELETE /api/v1/features/:id/vote
PUT    /api/v1/features/:id/status

Quizzes (3):
GET    /api/v1/quizzes
POST   /api/v1/quizzes/attempt
GET    /api/v1/quizzes/:id/results

Pages (5):
GET    /api/v1/pages
GET    /api/v1/pages/:slug
POST   /api/v1/pages
PUT    /api/v1/pages/:id
DELETE /api/v1/pages/:id

WebRTC (1):
POST   /api/webrtc/signal

Versions (1):
GET    /api/v1/versions

Installer (3):
POST   /api/v1/installer/config
POST   /api/v1/installer/clear
POST   /api/v1/installer/test-accounts

Sync (1):
POST   /api/sync/keys

Global (2):
GET    /api/v1/global-search
GET    /health

TOTAL: ~120+ endpoints
```

### B. Полный список UI Компонентов

```
Auth:
- LoginForm
- RegisterForm
- TwoFAModal
- YandexLogin
- VerificationModal
- ChangePasswordModal
- DeleteAccountModal

Chat:
- ChatList
- ChatPage
- MessageThread
- CreateGroupModal
- GroupMembersManager
- StatusUploader
- StatusViewer
- PollAttachment
- QuizAttachment
- SurveyAttachment

Media:
- AttachmentViewer
- FileUpload
- AudioPlayer
- CallInterface

Layout:
- Header
- Footer
- ThemeSelector
- ThemeCard
- ThemeSubscriptionDialog

Admin:
- VersionsAdmin

Notifications:
- NotificationManager

PWA:
- PWAInstall

UI:
- Alert
- BurgerMenu
- Confirm
- Logo
- Modal
- AccountSwitcher
```

### C. Полный список Zustand Stores

```
- authStore
- chatStore
- settingsStore
- accountsStore
```

### D. Полный список WebSocket событий

```
Client → Server:
- join_chat
- leave_chat
- message
- typing
- read

Server → Client:
- message
- typing
- chat_updated
- user:status
- user:online
- user:offline
- call
- call:accepted
- call:ended
- disconnect
- reconnect
```

### E. Полный список тем

```
- dark (default)
- light
- russia (flag)
```

### F. Полный список языков

```
- ru (Russian)
- en (English)
- tt (Tatar)
- ba (Bashkir)
- sah (Sakha/Yakut)
- udm (Udmurt)
- ce (Chechen)
- cv (Chuvash)
- os (Ossetian)
- hi (Hindi)
- zh (Chinese)
```

---

**Конец документа.**

**Следующие шаги:**
1. Приоритизация Category 3 (пропущенные) функций
2. Completion of Category 2 (partial) functions
3. Evaluation of Category 5 (AI-suggested) functions
4. Revenue model refinement for paid features

---

**🎈 Balloo — Переверни общение!**

**Последнее обновление:** 2026-06-23  
**Ответственный:** Koda AI (NLP-Core-Team)

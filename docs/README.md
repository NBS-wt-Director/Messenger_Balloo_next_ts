# 📚 Balloo Messenger - Документация

**Добро пожаловать в документацию проекта App Balloo!**

---

## 📖 Быстрый старт

### Новому пользователю

1. **[Главная документация монорепозитория](MONOREPO_DOCUMENTATION.md)** - Обзор архитектуры, стек технологий, запуск
2. **[Продуктовая спецификация](SPECIFICATION.md)** - Полное описание функциональности  
3. **[Быстрый старт](../README.md)** - Как запустить проект локально

### Разработчику

1. **[Архитектура](MONOREPO_DOCUMENTATION.md#архитектура)** - Как устроен проект
2. **[API Документация](api/API_READINESS_REPORT.md)** - Все API endpoints
3. **[Вклад в проект](../CONTRIBUTING.md)** - Как добавить функцию

### Операционная документация

1. **[Деплой](DEPLOYMENT.md)** - Инструкция по деплою
2. **[Тестирование](TESTING.md)** - Как запустить тесты
3. **[Частые проблемы](TROUBLESHOOTING.md)** - Решение проблем

---

## 📁 Структура документации

### Основные документы

| Документ | Описание |
|----------|----------|
| [MONOREPO_DOCUMENTATION.md](MONOREPO_DOCUMENTATION.md) | **Главная документация монорепозитория** |
| [SPECIFICATION.md](SPECIFICATION.md) | Продуктовая спецификация |
| [STATISTICS.md](STATISTICS.md) | Статистика проекта |

### Документация по компонентам

| Компонент | Документация |
|-----------|--------------|
| **API Server** | [docs/api/](api/) |
| **Messenger** | [messenger/README.md](../messenger/README.md) |
| **Admin Portal** | [admin-portal/README.md](../admin-portal/README.md) |
| **Mobile** | [docs/mobile/](mobile/) |
| **Desktop** | [docs/desktop/](desktop/) |
| **Android Service** | [docs/android-service/](android-service/) |
| **Settings** | [settings/README.md](../settings/README.md) |
| **Shared** | [docs/shared/](shared/) |

### История изменений

| Документ | Описание |
|----------|----------|
| [MIGRATION_FINAL_SUMMARY.md](MIGRATION_FINAL_SUMMARY.md) | Миграция на внешний API |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Обзор проекта |
| [API_EXPANSION_SUMMARY.md](API_EXPANSION_SUMMARY.md) | Расширение API |

---

## 🚀 Быстрые ссылки

### Для новых разработчиков

1. Прочитать [MONOREPO_DOCUMENTATION.md](MONOREPO_DOCUMENTATION.md)
2. Запустить проект: [Quick Start](../README.md#быстрый-старт)
3. Изучить [API Documentation](api/API_READINESS_REPORT.md)
4. Создать первую задачу: [Contributing Guide](../CONTRIBUTING.md)

### Для продакшена

1. Настроить окружение: [Environment Setup](MONOREPO_DOCUMENTATION.md#настройка-окружения)
2. Деплой: [Deployment Guide](DEPLOYMENT.md)
3. Мониторинг: [Operations Guide](OPERATIONS.md)

---

## 📊 Статус проекта

| Компонент | Готовность | Статус |
|-----------|------------|--------|
| **API Server** | 100% | ✅ Production |
| **Messenger** | 95% | ✅ Production |
| **Admin Portal** | 90% | ✅ Production |
| **Mobile** | 60% | ⚠️ Beta |
| **Desktop** | 40% | ⚠️ Alpha |
| **Android Service** | 70% | ⚠️ Beta |

**Общая готовность:** ~80%

---

## 📞 Поддержка

- **GitHub Issues** - [Создать issue](https://github.com/your-org/app-balloo/issues)
- **Email** - admin@balloo.ru
- **Telegram** - @balloo_support

---

**🎈 Balloo - Share your moments safely!**

**NLP-Core-Team** - App Balloo Project

## 🏗️ Архитектура

### Backend (API)
- **База данных**: SQLite (встроенная, на том же процессе)
- **НЕ отдельный PostgreSQL сервер**
- Все данные на одном сервере с API
- **E2E шифрование**: Сообщения шифруются на клиенте
- **Яндекс.Интеграции**: OAuth авторизация и Яндекс.Диск для файлов

### Frontend (Web)
- **Next.js** - SSR/SSG фреймворк
- **React** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **RxDB** - Локальная база данных (IndexedDB)
- **Web Crypto API** - E2E шифрование

## 📁 Структура проекта

```
app_balloo/
├── api/                    # Backend API сервер (Node.js + Express)
│   ├── src/
│   │   ├── config/         # Конфигурация (БД, Яндекс, шифрование)
│   │   ├── controllers/    # Контроллеры маршрутов
│   │   ├── middleware/     # Middleware (auth, validation, rate-limit)
│   │   ├── routes/         # API маршруты
│   │   ├── services/       # Бизнес-логика
│   │   ├── database/       # SQLite схемы и миграции
│   │   └── websocket/      # WebSocket обработчик
│   ├── data/               # SQLite база данных (database.db)
│   ├── uploads/            # Временные загрузки файлов
│   ├── logs/               # Логи
│   ├── .env.example        # Переменные окружения
│   ├── package.json
│   ├── README.md
│   └── TODO.md            # Полное ТЗ API (50+ эндпоинтов)
│
├── messenger/              # Web приложение (Next.js)
│   ├── src/
│   │   ├── app/           # Next.js App Router страницы
│   │   ├── components/    # React компоненты
│   │   ├── lib/           # Утилиты (crypto, yandex-disk, e2e)
│   │   ├── stores/        # State management
│   │   ├── types/         # TypeScript типы
│   │   └── i18n/          # Интернационализация
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── mobile/                 # Мобильное приложение (React Native)
├── desktop/                # Desktop приложение (Electron)
├── android-service/        # Android сервис
├── shared/                 # Общие библиотеки и типы
└── docs/                   # Документация
```

## 🚀 Быстрый старт

### API Сервер

```bash
cd api

# Установить зависимости
npm install

# Создать .env из примера
cp .env.example .env

# Настроить переменные окружения:
# - JWT_SECRET
# - YANDEX_CLIENT_ID / YANDEX_CLIENT_SECRET
# - EMAIL настройки
# - ENCRYPTION_KEY

# Инициализировать SQLite базу данных
npm run db:init

# Запустить сервер
npm run dev
```

API будет доступен по адресу: `http://localhost:3001`

### Web Приложение

```bash
cd messenger

# Установить зависимости
npm install

# Создать .env.local из примера
cp .env.local.example .env.local

# Запустить dev сервер
npm run dev
```

Web приложение будет доступно по адресу: `http://localhost:3000`

## 🔑 Ключевые особенности

### E2E Шифрование
- Все сообщения шифруются **на клиенте** перед отправкой
- Сервер передаёт только зашифрованные данные
- Ключи шифрования хранятся **только на устройствах пользователя**
- AES-256-GCM для сообщений, RSA-2048 для обмена ключами

### Яндекс.Интеграции
- **Яндекс.Авторизация**: Вход через Яндекс аккаунт (OAuth 2.0)
- **Яндекс.Диск**: Хранение файлов и медиа
- Токены шифруются перед сохранением в БД
- Автоматическое обновление токенов

### База Данных
- **SQLite** (better-sqlite3) - встроенная, не требует отдельного сервера
- Все данные на том же сервере, что и API
- Автоматические миграции при старте
- Простое резервное копирование (один файл)

## 📚 Документация

- [API Документация](./api/TODO.md) - Полное описание API эндпоинтов
- [Web Приложение](./messenger/README.md) - Документация фронтенда
- [API README](./api/README.md) - Настройка и запуск API

## 🛠️ Технологии

### Backend (API)
| Компонент | Технология |
|-----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | Better-SQLite3 (embedded) |
| Auth | JWT (jsonwebtoken) |
| Encryption | AES-256-GCM, RSA-2048 (crypto-js) |
| Real-time | WebSocket (ws) |
| File Upload | Multer |
| Logging | Winston |
| Rate Limiting | express-rate-limit |

### Frontend (Web)
| Компонент | Технология |
|-----------|------------|
| Framework | Next.js 14+ |
| Language | TypeScript |
| State | Zustand / Context API |
| DB (client) | RxDB (IndexedDB) |
| Encryption | Web Crypto API |
| Styling | Tailwind CSS |
| i18n | i18next |

## 📝 Разработка

### Предварительные требования
- Node.js >= 18
- npm >= 9

### Запуск в разработке

```bash
# Terminal 1 - API Server
cd api
npm run dev

# Terminal 2 - Web App
cd messenger
npm run dev
```

### Структура БД

База данных автоматически создаётся в `api/data/database.db`:

- `users` - Пользователи
- `chats` - Чаты
- `messages` - Сообщения
- `attachments` - Вложения (Яндекс.Диск)
- `invitations` - Пригласительные
- `contacts` - Контакты
- `notifications` - Уведомления
- `sessions` - Сессии
- `devices` - Устройства
- `reports` - Отчёты
- `versions` - Версии

## 🔧 Сборка и деплой

Смотрите скрипты деплоя:
- `deploy.sh` - основной скрипт деплоя
- `deploy-and-fix.sh` - деплой с исправлениями
- `SAFE_DEPLOY.sh` - безопасный деплой

### Production

**API:**
```bash
cd api
npm install --production
npm run db:init
npm start
```

**Web:**
```bash
cd messenger
npm run build
npm start
```

## 📄 Лицензия

MIT

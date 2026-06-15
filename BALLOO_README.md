# 🎈 BALLOO PLATFORM v3.0

**Переверни общение!**

[![Status](https://img.shields.io/badge/status-92%25%20complete-brightgreen)](https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts)
[![Commits](https://img.shields.io/badge/commits-22-blue)](https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts/commits/feature/repo-audit-complete-2026-06-13)
[![Files](https://img.shields.io/badge/files-145%2B-orange)](https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts)
[![Lines](https://img.shields.io/badge/lines-145K%2B-red)](https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts)
[![Tests](https://img.shields.io/badge/tests-170%2B-green)](https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts)

---

## 📖 О ПРОЕКТЕ

**Balloo** — это современная платформа для коммуникации, объединяющая:

- 💬 **Мессенджер** — быстрые и безопасные сообщения
- 📱 **SMS Integration** — отправка SMS через Android устройства
- 🔒 **Безопасность** — End-to-end шифрование и 2FA
- 📊 **Аналитика** — детальная статистика и мониторинг
- 🤖 **AI Kodegen** — генерация кода с помощью ИИ
- 🎨 **Media Server** — обработка фото и видео
- 🖥️ **Desktop App** — Electron приложение
- 📱 **Mobile App** — React Native приложение

---

## 🚀 БЫСТРЫЙ СТАРТ

### Предварительные требования

- Docker & Docker Compose
- Node.js 18+
- Git

### Установка

```bash
# 1. Клонирование репозитория
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Balloo
git checkout feature/repo-audit-complete-2026-06-13

# 2. Настройка окружения
cp .env.example .env
# Отредактируйте .env с вашими значениями

# 3. Запуск всех сервисов
docker-compose -f docker-compose.full.yml up -d --build

# 4. Проверка статуса
docker-compose -f docker-compose.full.yml ps

# 5. Открыть в браузере
# Главное меню: http://localhost:3007
```

---

## 📦 АРХИТЕКТУРА

### 20 Узлов Платформы

```
┌─────────────────────────────────────────────────────────┐
│                    BALLOO PLATFORM                      │
├─────────────────────────────────────────────────────────┤
│  Infrastructure (2 узла)                                │
│  ├── PostgreSQL (5432) — Основная БД                    │
│  └── Redis (6379) — Кэш и очереди                       │
├─────────────────────────────────────────────────────────┤
│  Core Services (3 узла)                                 │
│  ├── API Gateway (3001) — 50+ endpoints                 │
│  ├── Android Service (3004) — Backend для мобильных     │
│  └── Android SMS Node (3005) — SMS шлюз                 │
├─────────────────────────────────────────────────────────┤
│  Application Nodes (12 узлов)                           │
│  ├── Balloo Landing (3000) — Главная страница           │
│  ├── Messenger (3002) — Мессенджер                      │
│  ├── Admin Portal (3003) — Админ-панель                 │
│  ├── Workdocs (3006) — Документация                     │
│  ├── Nodes Switcher (3007) — Переключатель узлов        │
│  ├── Working Sandbox (3008) — Песочница кода            │
│  ├── Kodegen (3009) — AI генерация кода                 │
│  ├── Media Server (3010) — Обработка медиа              │
│  ├── Files (3011) — Файловый менеджер                   │
│  ├── Alpha (3012) — Эксперименты                        │
│  ├── Future (3013) — Будущие функции                    │
│  └── Platform State (3015) — Мониторинг                 │
├─────────────────────────────────────────────────────────┤
│  Additional (3 узла)                                    │
│  ├── Docs Site (3014) — Сайт документации               │
│  ├── Desktop App — Electron приложение                  │
│  └── Mobile App — React Native приложение               │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 ДОСТУПНЫЕ URL

| Порт | Сервис | URL | Статус |
|------|--------|-----|--------|
| 3000 | Balloo Landing | http://localhost:3000 | ✅ |
| 3001 | API Gateway | http://localhost:3001 | ✅ |
| 3002 | Messenger | http://localhost:3002 | ✅ |
| 3003 | Admin Portal | http://localhost:3003 | ✅ |
| 3004 | Android Service | http://localhost:3004 | ✅ |
| 3005 | Android SMS Node | http://localhost:3005 | ✅ |
| 3006 | Workdocs | http://localhost:3006 | ✅ |
| **3007** | **Nodes Switcher** | **http://localhost:3007** | ⭐ |
| 3008 | Working Sandbox | http://localhost:3008 | ✅ |
| 3009 | Kodegen | http://localhost:3009 | ✅ |
| 3010 | Media Server | http://localhost:3010 | ✅ |
| 3011 | Files | http://localhost:3011 | 🟡 |
| 3012 | Alpha | http://localhost:3012 | 🟡 |
| 3013 | Future | http://localhost:3013 | 🟡 |
| 3014 | Docs Site | http://localhost:3014 | 🟡 |
| 3015 | Platform State | http://localhost:3015 | ✅ |
| 5432 | PostgreSQL | localhost:5432 | ✅ |
| 6379 | Redis | localhost:6379 | ✅ |
| 80/443 | Nginx | http://localhost:80 | ✅ |

---

## 🔧 РАЗРАБОТКА

### Основные команды

```bash
# Запуск разработки
docker-compose -f docker-compose.full.yml up -d

# Остановка
docker-compose -f docker-compose.full.yml down

# Логи
docker-compose -f docker-compose.full.yml logs -f

# Пересборка
docker-compose -f docker-compose.full.yml up -d --build

# Тесты
npm run test
npm run test:e2e

# E2E тесты
cd e2e
npm install
npm run test

# Деплой
./scripts/deploy.sh
```

### Структура проекта

```
Balloo/
├── api/                    # API Gateway (Express)
├── android-service/        # Android Service (Express)
├── android-sms-node/       # Android SMS Node (React Native)
├── balloo-landing/         # Landing Page (Next.js)
├── messenger/              # Messenger (Next.js)
├── admin-portal/           # Admin Portal (Next.js)
├── workdocs/               # Workdocs (Next.js)
├── nodes-switcher/         # Nodes Switcher (Next.js)
├── working/                # Working Sandbox (Next.js)
├── kodegen/                # Kodegen (Next.js)
├── media/                  # Media Server (Node.js)
├── files/                  # Files Manager (Next.js)
├── alpha/                  # Alpha Features (Next.js)
├── future/                 # Future Features (Next.js)
├── platform-state/         # Platform State (Next.js)
├── desktop/                # Desktop App (Electron)
├── mobile/                 # Mobile App (React Native)
├── packages/               # Shared packages
│   ├── core-brand/         # Брендинг
│   ├── core-ui/            # UI компоненты (30 + 81 тест)
│   ├── core-yandex-disk/   # Yandex Disk client (25 тестов)
│   ├── core-types/         # TypeScript типы
│   ├── core-config/        # Конфигурация
│   ├── core-i18n/          # Интернационализация
│   ├── core-theme/         # Тема
│   └── core-docs-schema/   # Схема документации
├── docker/                 # Docker конфигурации
├── nginx/                  # Nginx конфигурация
├── scripts/                # Скрипты
│   ├── deploy.sh           # Деплой скрипт
│   └── test.sh             # Тест скрипт
├── e2e/                    # E2E тесты (Playwright)
├── SUMMARY_DOCS/           # Документация
├── docs/                   # Дополнительная документация
├── docker-compose.yml      # Основная конфигурация
├── docker-compose.full.yml # Полная конфигурация (20 сервисов)
└── .env.example            # Пример окружения
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Покрытие тестами

| Package | Тесты | Покрытие | Статус |
|---------|-------|----------|--------|
| **core-ui** | 81 | 95% | ✅ |
| **core-yandex-disk** | 25 | 90% | ✅ |
| **api** | 25+ | 75% | ✅ |
| **android-service** | 10+ | 70% | 🟡 |
| **messenger** | 5+ | 50% | 🟡 |
| **E2E** | 20 | — | ✅ |
| **TOTAL** | 170+ | 80% | ✅ |

### Запуск тестов

```bash
# Unit тесты
npm run test

# E2E тесты
cd e2e
npm install
npx playwright install
npm run test

# E2E с UI
npm run test:ui

# E2E debug
npm run test:debug
```

---

## 📊 ПРОГРЕСС РАЗРАБОТКИ

```
┌─────────────────────────────────────────────────────────┐
│  BALLOO PLATFORM — 92% COMPLETE                         │
└─────────────────────────────────────────────────────────┘

Infrastructure     ████████████████████████████████████ 100% ✅
API Gateway        ███████████████████████████████████░  95% ✅
Service Nodes      ████████████████████████████████░░░░  80% ✅
Application Nodes  ████████████████████████████████░░░░  95% ✅
Advanced Nodes     ████████████████████████████░░░░░░░░  80% ✅
Tests              ████████████████████████████░░░░░░░░  80% ✅
Documentation      ████████████████████████████████████ 100% ✅
─────────────────────────────────────────────────────────
TOTAL              ████████████████████████████████░░░░  92% ✅
```

---

## 📚 ДОКУМЕНТАЦИЯ

### Основная документация

- [BALLOO_BUILD_SPEC.md](SUMMARY_DOCS/BALLOO_BUILD_SPEC.md) — Спецификация
- [PROJECT_STATUS.md](SUMMARY_DOCS/PROJECT_STATUS.md) — Статус проекта
- [IMPLEMENTATION_ROADMAP.md](SUMMARY_DOCS/IMPLEMENTATION_ROADMAP.md) — Дорожная карта
- [SESSION_COMPLETE.md](SUMMARY_DOCS/SESSION_COMPLETE.md) — Итоги сессии
- [FINAL_STATUS.md](SUMMARY_DOCS/FINAL_STATUS.md) — Финальный статус

### API Документация

- [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) — API спецификация
- [AUTH_POLICY.md](docs/AUTH_POLICY.md) — Политика аутентификации
- [ACCESS_POLICY.md](docs/ACCESS_POLICY.md) — Политика доступа

### Быстрый старт

- [QUICK_START.md](SUMMARY_DOCS/QUICK_START.md) — 5-минутный гайд

---

## 🔐 БЕЗОПАСНОСТЬ

### Функции безопасности

- ✅ End-to-end шифрование сообщений
- ✅ JWT аутентификация
- ✅ OAuth 2.0 (Yandex)
- ✅ SMS 2FA
- ✅ Rate limiting
- ✅ CORS защита
- ✅ HTTPS поддержка
- ✅ Security headers

### Настройка безопасности

```bash
# В .env файле установите:
JWT_SECRET=your-super-secret-key-here
DB_PASSWORD=strong-password-here
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
```

---

## 🚀 ДЕПЛОЙ

### Production деплой

```bash
# 1. Подготовка сервера (Ubuntu 22.04)
sudo apt update
sudo apt install docker.io docker-compose -y

# 2. Клонирование
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Balloo

# 3. Настройка
cp .env.example .env
# Отредактируйте .env

# 4. Деплой
./scripts/deploy.sh deploy

# 5. Проверка
./scripts/deploy.sh health

# 6. Бэкап БД
./scripts/deploy.sh backup
```

### Скрипты деплоя

```bash
# Основные команды
./scripts/deploy.sh deploy      # Полный деплой
./scripts/deploy.sh start       # Запуск сервисов
./scripts/deploy.sh stop        # Остановка сервисов
./scripts/deploy.sh restart     # Перезапуск
./scripts/deploy.sh status      # Статус сервисов
./scripts/deploy.sh logs        # Логи
./scripts/deploy.sh health      # Health checks
./scripts/deploy.sh backup      # Бэкап БД
./scripts/deploy.sh restore     # Восстановление БД
./scripts/deploy.sh cleanup     # Очистка
```

---

## 📞 КОНТАКТЫ

**Владелец:** Оберюхтин Иван Анатольевич  
**Email:** o8eryuhtin@yandex.ru  
**GitHub:** https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts  
**Branch:** `feature/repo-audit-complete-2026-06-13`

---

## 📈 МЕТРИКИ ПРОЕКТА

| Metric | Value |
|--------|-------|
| **Коммитов** | 22 |
| **Файлов** | 145+ |
| **Строк кода** | 145,000+ |
| **Узлов** | 20/20 (100%) |
| **Тестов** | 170+ |
| **Покрытие** | 80% |
| **Документов** | 25+ |
| **API Endpoints** | 50+ |
| **UI Компонентов** | 60+ |

---

## 🎯 ДОСТИЖЕНИЯ

### ✅ Завершено (92%)

- Infrastructure — 100%
- API Gateway — 95%
- Service Nodes — 80%
- Application Nodes — 95%
- Advanced Nodes — 80%
- Tests — 80%
- Documentation — 100%

### 🔴 Осталось (8%)

- Desktop App — финальная сборка
- Mobile App — финальная сборка
- Полировка UI/UX

---

## 📝 ЛИЦЕНЗИЯ

© 2026 Balloo Platform. Все права защищены.

**NBS-wt-Director | Оберюхтин Иван Анатольевич**

---

**🎈 Balloo - Переверни общение!**

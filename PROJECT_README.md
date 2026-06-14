# 🎈 Balloo Messenger

**Кроссплатформенный мессенджер с E2E шифрованием**

---

## 📖 О проекте

Balloo - современный мессенджер с сквозным шифрованием, аудио/видео звонками и интеграцией с облачным хранилищем.

### Особенности

- 🔐 **E2E Шифрование** - AES-256-GCM для сообщений, RSA-2048 для ключей
- 📹 **WebRTC звонки** - Аудио и видео P2P соединения
- 💾 **Offline-first** - RxDB с синхронизацией
- 🌐 **Real-time** - WebSocket для мгновенных сообщений
- 📁 **Яндекс.Диск** - Хранение файлов и медиа
- 🎯 **Admin Portal** - Панель администратора

---

## 🏗️ Архитектура

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Messenger  │  │ Admin Portal │  │   Mobile     │
│  (Next.js)   │  │   (Next.js)  │  │(React Native)│
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                ┌────────▼────────┐
                │   API Server    │
                │  (Express.js)   │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   SQLite DB     │
                │  (Embedded)     │
                └─────────────────┘
```

---

## 📁 Структура репозитория

```
app-balloo/
├── 📁 api/                    # Backend API сервер
├── 📁 messenger/              # Web приложение
├── 📁 admin-portal/           # Панель администратора
├── 📁 mobile/                 # Мобильные приложения
├── 📁 desktop/                # Desktop приложение
├── 📁 android-service/        # Android сервисы
├── 📁 settings/               # Общие настройки
├── 📁 shared/                 # Общие утилиты
├── 📁 docs/                   # 📚 Документация
├── README.md                  # Этот файл
└── package.json               # Root package.json
```

---

## 🛠️ Технологический стек

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **RxDB** - Offline-first database
- **WebSocket** - Real-time messaging
- **WebRTC** - Audio/Video calls

### Backend
- **Express.js** - REST API server
- **Better-SQLite3** - Embedded database
- **ws** - WebSocket server
- **JWT** - Authentication
- **crypto-js** - E2E encryption

---

## 🚀 Быстрый старт

### Предварительные требования

- Node.js >= 18
- npm >= 9

### Запуск в разработке

```bash
# 1. API Server
cd api
npm install
npm run dev
# http://localhost:3001

# 2. Messenger (отдельное окно)
cd messenger
npm install
npm run dev
# http://localhost:3000

# 3. Admin Portal (отдельное окно)
cd admin-portal
npm install
npm run dev
# http://localhost:3002
```

---

## 📚 Документация

Вся документация находится в папке [`docs/`](docs/):

| Документация | Описание |
|--------------|----------|
| [docs/README.md](docs/README.md) | **Индекс документации** |
| [docs/MONOREPO_DOCUMENTATION.md](docs/MONOREPO_DOCUMENTATION.md) | Архитектура и стек |
| [docs/SPECIFICATION.md](docs/SPECIFICATION.md) | Продуктовая спецификация |
| [docs/api/](docs/api/) | API документация |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Деплой |
| [docs/TESTING.md](docs/TESTING.md) | Тестирование |

---

## 📊 Статус проекта

| Компонент | Готовность | Статус |
|-----------|------------|--------|
| **API Server** | 100% | ✅ Production |
| **Messenger** | 95% | ✅ Production |
| **Admin Portal** | 90% | ✅ Production |
| **Mobile** | 60% | ⚠️ Beta |
| **Desktop** | 40% | ⚠️ Alpha |

**Общая готовность:** ~80%

---

## 🤝 Вклад

Смотрите [CONTRIBUTING.md](CONTRIBUTING.md) для руководства по вкладу в проект.

---

## 📄 Лицензия

MIT License - see [LICENSE](LICENSE) for details.

---

## 👥 Команда

**NLP-Core-Team** - App Balloo Project

---

**🎈 Balloo - Переверни общение!**

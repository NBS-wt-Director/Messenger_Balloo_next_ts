# 💻 Balloo Desktop App

Electron десктопное приложение для Balloo Messenger.

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- npm или yarn

### Установка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для продакшена
npm run build

# Сборка установщика
npm run dist
```

## 📁 Структура проекта

```
desktop/
├── src/
│   ├── main/           # Main процесс (Electron)
│   │   ├── main.ts     # Entry point
│   │   ├── menu.ts     # Меню приложения
│   │   └── tray.ts     # System tray
│   ├── renderer/       # Renderer процесс (React)
│   │   ├── components/ # React компоненты
│   │   ├── pages/      # Страницы приложения
│   │   ├── store/      # State management
│   │   └── styles/     # CSS стили
│   └── preload/        # Preload скрипты
├── resources/          # Иконки, ассеты
├── electron-builder.yml # Конфигурация сборки
└── package.json
```

## 🎨 Функции

- ✅ Системные уведомления
- ✅ Запуск при старте системы
- ✅ System tray (скрытие в трей)
- ✅ Горячие клавиши
- ✅ Автозагрузка
- ✅ Native look & feel

## 🔧 Сборка

### Windows
```bash
npm run dist:win
```

### macOS
```bash
npm run dist:mac
```

### Linux
```bash
npm run dist:linux
```

## 📦 Основные библиотеки

| Библиотека | Назначение |
|------------|------------|
| Electron | Десктоп фреймворк |
| React | UI библиотека |
| React Router | Навигация |
| Zustand | State management |
| electron-builder | Сборка приложения |
| electron-updater | Автообновления |

## 🔐 Безопасность

- Context Isolation включён
- Node Integration отключён
- Preload скрипты для IPC
- CSP заголовки

## 📝 Конфигурация

### API URL
Отредактируйте `src/renderer/config.ts`:
```typescript
export const API_URL = 'https://api.balloo.ru/api/v1';
```

### App Settings
`electron-builder.yml` - настройки сборки

## 🐛 Debugging

### Открыть DevTools
```
Ctrl + Shift + I (Windows/Linux)
Cmd + Option + I (macOS)
```

### Log file
`~/.config/balloo/logs/main.log`

## 📚 Ресурсы

- [Electron Docs](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [React Docs](https://react.dev/)

---

**NLP-Core-Team** - Balloo Desktop

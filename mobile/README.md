# 📱 Balloo Mobile App

React Native мобильное приложение для Balloo Messenger.

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- Android SDK 28+ (для Android)
- Xcode 14+ (для iOS)
- Watchman (для macOS)

### Установка

```bash
# Установка зависимостей
npm install

# iOS Pods (macOS only)
cd ios && pod install && cd ..

# Запуск Metro bundler
npm start

# Запуск на Android
npm run android

# Запуск на iOS (macOS only)
npm run ios
```

## 📁 Структура проекта

```
mobile/
├── src/
│   ├── components/     # Переиспользуемые компоненты
│   ├── screens/        # Экраны приложения
│   ├── navigation/     # React Navigation конфигурация
│   ├── services/       # API и другие сервисы
│   ├── store/          # Zustand state management
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Утилиты и помощники
│   ├── assets/         # Картинки, шрифты, иконки
│   └── types/          # TypeScript типы
├── App.tsx             # Root компонент
└── index.js            # Entry point
```

## 🎨 Экраны

- **Auth** - Вход и регистрация
- **Chats** - Список чатов
- **Chat** - Отдельный чат
- **Contacts** - Контакты
- **Profile** - Профиль пользователя
- **Settings** - Настройки
- **Calls** - История звонков

## 🔧 Разработка

### Hot Reload
- Android: `Cmd + M` (iOS) / `Ctrl + M` (Android)
- iOS: `Cmd + D`

### Debugging
- React DevTools
- Chrome DevTools
- Flipper (рекомендуется)

### Linting
```bash
npm run lint
npm run typecheck
```

## 📦 Основные библиотеки

| Библиотека | Назначение |
|------------|------------|
| React Navigation | Навигация |
| Zustand | State management |
| Axios | HTTP запросы |
| React Native WebView | WebView компоненты |
| React Native Push Notification | Push уведомления |
| Encrypted Storage | Безопасное хранение |

## 🏗️ Сборка

### Android

```bash
# Debug build
npm run android

# Release build
npm run build:android
```

### iOS

```bash
# Debug build
npm run ios

# Release build
npm run build:ios
```

## 📝 Конфигурация

### API URL
Отредактируйте `src/config/api.ts`:
```typescript
export const API_URL = 'https://api.balloo.ru/api/v1';
```

### Push Notifications
Настройте в `src/services/notifications.ts`

## 🐛 Troubleshooting

### Clear cache
```bash
npm start -- --reset-cache
```

### Clean build
```bash
npm run clean
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install
cd ios && pod install
```

## 📚 Ресурсы

- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**NLP-Core-Team** - Balloo Mobile

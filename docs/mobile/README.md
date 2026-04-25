# 📱 Balloo Mobile

**React Native + Expo приложение**

---

## 📑 Содержание

1. [Обзор](#обзор)
2. [Быстрый Старт](#быстрый-старт)
3. [Структура](#структура)
4. [Фичи](#фичи)
5. [Разработка](#разработка)
6. [Сборка](#сборка)
7. [Деплой](#деплой)

---

## Обзор

Мобильное приложение Balloo для iOS и Android на React Native + Expo.

### Статус: 🚧 В разработке (60%)

---

## Быстрый Старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить разработку
npm start
# iOS: npx expo run:ios
# Android: npx expo run:android
```

---

## Структура

```
mobile/
├── src/
│   ├── components/      # React Native компоненты
│   ├── screens/         # Экраны приложения
│   ├── navigation/      # React Navigation
│   ├── stores/          # Zustand state
│   ├── services/        # API, Notifications
│   └── utils/           # Утилиты
├── assets/              # Изображения, шрифты
├── app.json             # Expo config
├── eas.json             # EAS Build config
└── package.json
```

---

## Фичи

### Готово ✅

- [x] Аутентификация
- [x] Список чатов
- [x] Просмотр сообщений
- [x] Push-уведомления
- [x] PWA-подобный опыт

### В разработке 🚧

- [ ] Групповые чаты
- [ ] Вложения
- [ ] Звонки

### План 📋

- [ ] Offline-first архитектура
- [ ] Background sync
- [ ] Biometric auth

---

## Разработка

### Команды

```bash
# Запуск в браузере
npm start

# iOS симулятор
npx expo run:ios

# Android эмулятор
npx expo run:android

# Build для устройства
eas build --platform android
```

### Структура Экранов

```
screens/
├── AuthScreen/          # Вход/Регистрация
├── ChatsScreen/         # Список чатов
├── ChatScreen/          # Чат
├── ProfileScreen/       # Профиль
├── SettingsScreen/      # Настройки
└── AdminScreen/         # Админка
```

---

## Сборка

### Android APK

```bash
eas build --platform android --profile preview
```

### Android App Bundle (Google Play)

```bash
eas build --platform android --profile production
```

### iOS IPA

```bash
eas build --platform ios --profile production
```

---

## Деплой

### Google Play

```bash
# Build
eas build --platform android --profile production

# Submit
eas submit --platform android

# Publish
eas submit --platform android --release-channel production
```

### App Store

```bash
# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios

# Upload to App Store Connect
xcrun altool --upload-app -f dist/*.ipa -u apple-id -p app-password
```

---

## Конфигурация

**app.json:**
```json
{
  "expo": {
    "name": "Balloo",
    "slug": "balloo",
    "version": "1.0.0",
    "android": {
      "package": "ru.balloo.app"
    },
    "ios": {
      "bundleIdentifier": "ru.balloo.app"
    }
  }
}
```

**eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

---

## Известные Проблемы

- [ ] iOS звонки не работают
- [ ] Android background notifications
- [ ] Offline sync не завершена

---

**Balloo Mobile - Мессенджер в твоем кармане!** 📱

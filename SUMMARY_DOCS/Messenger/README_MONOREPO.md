# 🎈 Balloo Messenger - Monorepo

## 📁 Структура Проекта

```
app_balloo/
├── messenger/              # Web приложение (Next.js)
├── mobile/                 # Mobile приложение (React Native + Expo)
├── desktop/                # Desktop приложение (Electron)
├── android-service/        # Android сервис (Node.js + SMS/Admin)
├── shared/                 # Общие типы и утилиты
├── package.json            # Root package (monorepo)
└── README_MONOREPO.md      # Этот файл
```

---

## 🚀 Быстрый Старт

### 1. Установка

```bash
# Клонируйте репозиторий
git clone <repo-url>
cd app_balloo

# Установите зависимости для всех пакетов
npm install

# Или по отдельности:
npm install --prefix messenger
npm install --prefix mobile
npm install --prefix desktop
npm install --prefix android-service
npm install --prefix shared
```

### 2. Настройка

```bash
# Скопируйте .env.example в .env.local
cp messenger/.env.example messenger/.env.local

# Отредактируйте .env.local
# JWT_SECRET: RnTytYjfV1Np5dEi4J8vroMHG2uPFKUCZx9DQ3eqbLOX0hSI6zWkgscmAlBa7w
```

### 3. Запуск

```bash
# Web (основное)
npm run dev:web
# Открыть: http://localhost:3000

# Mobile
npm run dev:mobile
# iOS: npx expo run:ios
# Android: npx expo run:android

# Desktop
npm run dev:desktop

# Android Service
npm run dev:android-service
```

---

## 📱 Платформы

### 1. Web (messenger/)

**Технологии:** Next.js 15, React 19, RxDB, Tailwind CSS

**Запуск:**
```bash
cd messenger
npm run dev
```

**Сборка:**
```bash
npm run build
npm start
```

**Деплой:**
- Vercel: `vercel --prod`
- Railway: подключите GitHub
- VPS: `npm run build && pm2 start npm --name balloo -- start`

---

### 2. Mobile (mobile/)

**Технологии:** React Native, Expo, Zustand, React Query

**Запуск:**
```bash
cd mobile
npm start
# iOS: npx expo run:ios
# Android: npx expo run:android
```

**Сборка APK (Android):**
```bash
eas build --platform android --profile preview
```

**Сборка IPA (iOS):**
```bash
eas build --platform ios --profile production
```

**Публикация:**
- Android: Google Play Console
- iOS: App Store Connect

---

### 3. Desktop (desktop/)

**Технологии:** Electron, React, TypeScript

**Запуск:**
```bash
cd desktop
npm run dev
```

**Сборка:**

**Windows:**
```bash
npm run build:win
# Вывод: dist/Balloo Setup x.x.x.exe
```

**macOS:**
```bash
npm run build:mac
# Вывод: dist/Balloo-x.x.x.dmg
```

**Linux:**
```bash
npm run build:linux
# Вывод: dist/Balloo-x.x.x.AppImage, .deb, .rpm
```

**Публикация:**
- Windows: Microsoft Store, сайт
- macOS: Mac App Store, сайт
- Linux: Snap, AUR, сайт

---

### 4. Android Service (android-service/)

**Назначение:** SMS рассылки, админка, push-уведомления

**Технологии:** Node.js, Express, Firebase Admin, Twilio

**Запуск:**
```bash
cd android-service
npm run dev
```

**Сборка:**
```bash
npm run build
npm start
```

**API Endpoints:**
- `POST /api/sms/send` - отправка SMS
- `POST /api/admin/users` - управление пользователями
- `POST /api/push/send` - push-уведомления
- `GET /api/stats` - статистика

**Сборка Android App (дополнительно):**
```bash
cd android-service/android
./gradlew assembleRelease
```

---

## 🔄 Общие Зависимости (shared/)

**Пакет:** `@balloo/shared`

**Содержит:**
- Типы TypeScript (User, Chat, Message, etc.)
- Auth утилиты (JWT)
- API клиент
- Общие утилиты (форматирование, валидация)
- Конфигурация

**Использование:**
```typescript
import { User, apiGet, generateToken } from '@balloo/shared';
```

---

## 🔐 Безопасность

### JWT Secret
```
RnTytYjfV1Np5dEi4J8vroMHG2uPFKUCZx9DQ3eqbLOX0hSI6zWkgscmAlBa7w
```

### Пароль Админа
```
BallooAdmin2024!SecurePass#XyZ
```

**Места для изменения:**
- `messenger/config.json`
- `messenger/.env.local`
- `android-service/.env`

---

## 📦 Scripts (Root)

```bash
# Development
npm run dev:web          # Web
npm run dev:mobile       # Mobile
npm run dev:desktop      # Desktop
npm run dev:android-service  # Android Service

# Build
npm run build:web        # Build Web
npm run build:mobile     # Build Mobile
npm run build:desktop    # Build Desktop
npm run build:android-service  # Build Android Service
npm run build:all        # Build всё

# Lint & Test
npm run lint             # Lint всё
npm run test             # Test всё
```

---

## 🗂 Файловая Структура

### Messenger (Web)
```
messenger/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React компоненты
│   ├── lib/              # Утилиты (DB, Auth, Crypto)
│   ├── stores/           # Zustand stores
│   └── i18n/             # Локализации (12 языков)
├── public/
│   ├── icons/            # PWA иконки
│   ├── logo.png          # Логотип
│   └── mascot.png        # Маскот
├── config.json
└── .env.local
```

### Mobile
```
mobile/
├── src/
│   ├── components/       # RN компоненты
│   ├── screens/          # Экраны
│   ├── navigation/       # React Navigation
│   ├── stores/           # Zustand
│   └── services/         # API, Notifications
├── assets/               # Изображения
├── app.json              # Expo config
└── eas.json              # EAS Build config
```

### Desktop
```
desktop/
├── electron/             # Electron main process
│   ├── main.js
│   ├── preload.js
│   └── tray.js
├── renderer/             # React приложение
│   └── src/
├── assets/               # Icons
└── package.json          # Electron builder config
```

### Android Service
```
android-service/
├── src/
│   ├── routes/           # Express routes
│   ├── services/         # SMS, Push, Admin
│   ├── models/           # Data models
│   └── middleware/       # Auth, validation
├── android/              # Android app (опционально)
│   └── app/
└── config/               # Конфиги
```

---

## 🚀 Деплой

### Web (Vercel)
```bash
npm i -g vercel
vercel --prod
```

### Mobile (EAS)
```bash
npm i -g eas-cli
eas login
eas build --platform android
eas submit --platform ios
```

### Desktop (GitHub Releases)
```bash
# Build
npm run build:win
npm run build:mac
npm run build:linux

# Upload to GitHub Releases
gh release upload v1.0.0 dist/*.exe dist/*.dmg dist/*.AppImage
```

### Android Service (VPS)
```bash
# На сервере
cd /var/www/balloo/android-service
npm install --production
npm run build
pm2 start npm --name balloo-service -- start
```

---

## 📊 Статистика

| Платформа | Фреймворк | Язык | Размер |
|-----------|-----------|------|--------|
| Web | Next.js 15 | TypeScript | ~234 MB |
| Mobile | React Native | TypeScript | ~450 MB |
| Desktop | Electron | TypeScript | ~150 MB |
| Android Service | Express | TypeScript | ~120 MB |
| Shared | - | TypeScript | ~5 MB |

**Всего:** ~959 MB (без node_modules в git)

---

## 🛠 Разработка

### Предварительные Требования

- Node.js >= 20.0.0
- npm >= 10.0.0
- Xcode (для iOS)
- Android Studio (для Android)
- VS Code (рекомендуется)

### VS Code Extensions

- ESLint
- Prettier
- React Native Tools
- Expo Sniffer
- Electron Native Tools

### Git Hooks

```bash
# Husky настроен автоматически
npm install -g husky
npx husky init
```

---

## 📝 Лицензия

MIT © Balloo Team

---

## 📞 Поддержка

- Email: support@balloo.ru
- Telegram: @balloo_support
- Сайт: https://balloo.ru

---

**Готово!** Теперь у вас есть полная кроссплатформенная структура для разработки и сборки приложений под все платформы. 🎉

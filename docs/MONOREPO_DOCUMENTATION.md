# 🎈 Balloo - Monorepo Документация

**Версия:** 1.0.0  
**Последнее обновление:** 2026-04-25

---

## 📑 Содержание

1. [Обзор Monorepo](#обзор-monorepo)
2. [Структура Проекта](#структура-проекта)
3. [Платформы](#платформы)
4. [Общие Зависимости](#общие-зависимости)
5. [Скрипты](#скрипты)
6. [Разработка](#разработка)
7. [Деплой](#деплой)
8. [CI/CD](#cicd)
9. [Безопасность](#безопасность)
10. [Вклад](#вклад)

---

## Обзор Monorepo

**Balloo** - кроссплатформенный мессенджер с поддержкой:
- 🌐 Web (Next.js)
- 📱 Mobile (React Native + Expo)
- 💻 Desktop (Electron)
- ⚙️ Android Service (Node.js)
- 🔧 Shared (общие типы и утилиты)

### Архитектура

```
┌──────────────────────────────────────────────────────┐
│                    Balloo Ecosystem                  │
├────────────┬────────────┬────────────┬──────────────┤
│   Web      │   Mobile   │  Desktop   │ Android Svc  │
│  (Next.js) │ (React Nat.)│ (Electron)│  (Express)   │
├────────────┴────────────┴────────────┴──────────────┤
│              @balloo/shared (Types)                  │
└──────────────────────────────────────────────────────┘
```

---

## Структура Проекта

```
app_balloo/
├── 📁 messenger/              # 🌐 Web приложение (Next.js 15)
│   ├── src/
│   ├── public/
│   ├── prisma/
│   ├── docs/
│   ├── config.json
│   └── package.json
│
├── 📁 mobile/                 # 📱 Mobile приложение (React Native + Expo)
│   ├── src/
│   ├── assets/
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── 📁 desktop/                # 💻 Desktop приложение (Electron)
│   ├── electron/
│   ├── renderer/
│   ├── assets/
│   └── package.json
│
├── 📁 android-service/        # ⚙️ Android Service (Node.js + Express)
│   ├── src/
│   ├── android/               # Опционально: Android app
│   ├── config/
│   └── package.json
│
├── 📁 shared/                 # 🔧 Общие типы и утилиты
│   ├── src/
│   │   ├── types/             # TypeScript типы
│   │   ├── auth/              # JWT утилиты
│   │   ├── api/               # API клиент
│   │   └── utils/             # Общие функции
│   └── package.json
│
├── 📁 docs/                   # 📚 Документация
│   ├── MONOREPO_DOCUMENTATION.md    # Этот файл
│   ├── STATISTICS.md          # 📊 Статистика проекта
│   ├── SPECIFICATION.md       # 📋 Полное ТЗ
│   └── ...
│
├── 📄 package.json            # Root package (scripts)
├── 📄 README_MONOREPO.md      # Monorepo README
└── 📄 .gitignore
```

---

## Платформы

### 1. Web (messenger/)

**Технологии:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7
- RxDB (IndexedDB)
- Tailwind CSS
- Zustand

**Запуск:**
```bash
cd messenger
npm run dev
# http://localhost:3000
```

**Сборка:**
```bash
npm run build
npm start
```

**Деплой:**
- Vercel (рекомендуется)
- Railway
- VPS + PM2

---

### 2. Mobile (mobile/)

**Технологии:**
- React Native
- Expo SDK 50
- TypeScript
- Zustand
- React Query

**Запуск:**
```bash
cd mobile
npm start
# iOS: npx expo run:ios
# Android: npx expo run:android
```

**Сборка:**
```bash
# Android APK
eas build --platform android --profile preview

# iOS IPA
eas build --platform ios --profile production
```

**Публикация:**
- Android: Google Play Console
- iOS: App Store Connect

---

### 3. Desktop (desktop/)

**Технологии:**
- Electron 28
- React 19
- TypeScript
- Electron Builder

**Запуск:**
```bash
cd desktop
npm run dev
```

**Сборка:**
```bash
# Windows
npm run build:win
# dist/Balloo Setup x.x.x.exe

# macOS
npm run build:mac
# dist/Balloo-x.x.x.dmg

# Linux
npm run build:linux
# dist/*.AppImage, .deb, .rpm
```

**Публикация:**
- Windows: Microsoft Store, сайт
- macOS: Mac App Store, сайт
- Linux: Snap, AUR, сайт

---

### 4. Android Service (android-service/)

**Назначение:**
- SMS рассылки (Twilio)
- Admin API
- Push-уведомления (Firebase)

**Технологии:**
- Node.js 20
- Express 4
- TypeScript
- Firebase Admin SDK

**Запуск:**
```bash
cd android-service
npm run dev
# http://localhost:4000
```

**API Endpoints:**
- `POST /api/sms/send` - отправка SMS
- `POST /api/admin/users` - управление пользователями
- `POST /api/push/send` - push-уведомления
- `GET /api/stats` - статистика

**Деплой:**
```bash
npm run build
pm2 start npm --name balloo-service -- start
```

---

### 5. Shared (shared/)

**Назначение:** Общие типы и утилиты для всех платформ

**Содержит:**
```typescript
// Types
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Chat {
  id: string;
  name?: string;
  type: 'private' | 'group';
}

// Auth
export function generateToken(user: User): string;
export function verifyToken(token: string): User | null;

// API Client
export const api = {
  get: (url: string) => fetch(url).then(r => r.json()),
  post: (url: string, data: any) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(r => r.json())
};

// Utils
export function formatTime(date: Date): string;
export function validateEmail(email: string): boolean;
```

**Использование:**
```bash
cd shared
npm publish
```

```typescript
// В других пакетах
import { User, api, generateToken } from '@balloo/shared';
```

---

## Общие Зависимости

### Root package.json Scripts

```json
{
  "scripts": {
    "dev:web": "npm run dev --prefix messenger",
    "dev:mobile": "npm run start --prefix mobile",
    "dev:desktop": "npm run dev --prefix desktop",
    "dev:android-service": "npm run dev --prefix android-service",
    
    "build:web": "npm run build --prefix messenger",
    "build:mobile": "npm run build --prefix mobile",
    "build:desktop": "npm run build --prefix desktop",
    "build:android-service": "npm run build --prefix android-service",
    "build:all": "npm run build:web && npm run build:mobile && npm run build:desktop",
    
    "lint": "npm run lint --prefix messenger && npm run lint --prefix mobile",
    "test": "npm run test --prefix messenger && npm run test --prefix mobile",
    
    "install:all": "npm install && npm install --prefix messenger && npm install --prefix mobile && npm install --prefix desktop && npm install --prefix android-service && npm install --prefix shared"
  }
}
```

---

## Скрипты

### Установка

```bash
# Установить зависимости для всех пакетов
npm run install:all

# Или по отдельности
npm install --prefix messenger
npm install --prefix mobile
npm install --prefix desktop
npm install --prefix android-service
npm install --prefix shared
```

### Разработка

```bash
# Запустить Web
npm run dev:web

# Запустить Mobile
npm run dev:mobile

# Запустить Desktop
npm run dev:desktop

# Запустить Android Service
npm run dev:android-service

# Запустить всё одновременно (конфликты портов!)
npm run dev:all
```

### Сборка

```bash
# Build Web
npm run build:web

# Build Mobile
npm run build:mobile

# Build Desktop
npm run build:desktop

# Build Android Service
npm run build:android-service

# Build всё
npm run build:all
```

### Lint & Test

```bash
# Проверить код
npm run lint

# Запустить тесты
npm run test
```

---

## Разработка

### Предварительные Требования

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Git** >= 2.x
- **Xcode** (для iOS, только macOS)
- **Android Studio** (для Android)
- **VS Code** (рекомендуется)

### VS Code Extensions

```json
{
  "recommendExtensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "expo.expo-sniffer",
    "react-native-tools",
    "electron-native-tools",
    "tailwindcss.vscode-tailwindcss"
  ]
}
```

### Git Hooks (Husky)

```bash
# Инициализировать Husky
npx husky init

# Добавить pre-commit hook
npx husky add .husky/pre-commit "npm run lint"

# Добавить commit-msg hook
npx husky add .husky/commit-msg "npx commitlint --edit"
```

### Конвенции Commit

```
feat: Новая функция
fix: Исправление бага
docs: Документация
style: Форматирование
refactor: Рефакторинг
test: Тесты
chore: Инструменты/конфиг
```

---

## Деплой

### Web (Vercel)

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

**Конфиг:** `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev"
}
```

### Mobile (EAS)

```bash
# Установить EAS CLI
npm i -g eas-cli

# Войти
eas login

# Настроить проект
eas build:configure

# Build Android
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

**Конфиг:** `eas.json`
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "releaseChannel": "production"
      }
    }
  }
}
```

### Desktop (GitHub Releases)

```bash
# Build для всех платформ
npm run build:win
npm run build:mac
npm run build:linux

# Загрузить на GitHub Releases
gh release upload v1.0.0 \
  dist/Balloo-Setup-1.0.0.exe \
  dist/Balloo-1.0.0.dmg \
  dist/Balloo-1.0.0.AppImage
```

### Android Service (VPS)

```bash
# На сервере
cd /var/www/balloo/android-service
npm install --production
npm run build

# PM2
pm2 start npm --name balloo-service -- start
pm2 save
pm2 startup

# Nginx reverse proxy
server {
  listen 80;
  server_name api.balloo.ru;
  
  location / {
    proxy_pass http://localhost:4000;
  }
}
```

---

## CI/CD

### GitHub Actions

**.github/workflows/ci.yml**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm run install:all
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm run test
      
      - name: Build
        run: npm run build:all
```

### Vercel CI/CD

- Автоматический деплой при push в main
- Preview деплой при PR

### EAS CI

```yaml
# eas.yaml
build:
  preview:
    developmentClient: true
  production:
    production: true
```

---

## Безопасность

### Секреты

**НИКОГДА не коммитьте:**
- `.env` файлы
- `config.json` с реальными ключами
- Приватные ключи (JWT, VAPID, Firebase)
- Пароли

**Храните секреты:**
- Vercel: Settings → Environment Variables
- Railway: Variables
- VPS: `.env` файл (в `.gitignore`)

### JWT

```json
{
  "algorithm": "HS256",
  "expiresIn": "7d",
  "secret": "измените-в-production"
}
```

### Рекомендации

1. Используйте httpOnly cookies для токенов (TODO)
2. Включите rate limiting (TODO)
3. Настройте CORS
4. Добавьте CSRF защиту
5. Регулярно обновляйте зависимости

---

## Вклад

### Как добавить функцию

1. **Создать ветку:**
```bash
git checkout -b feature/my-feature
```

2. **Разработать:**
- Изменить `shared/` если нужны новые типы
- Изменить `messenger/` для web
- Изменить `mobile/` для mobile

3. **Протестировать:**
```bash
npm run test
npm run lint
```

4. **Сделать commit:**
```bash
git commit -m "feat: описание функции"
```

5. **Push и Pull Request:**
```bash
git push origin feature/my-feature
# Создать PR на GitHub
```

### Code Review

- Минимум 1 reviewer
- Все тесты должны проходить
- Код должен быть отформатирован

### Release

```bash
# Создать релиз
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions создаст релиз автоматически
```

---

## Статус Проекта

| Платформа | Готовность | Последнее обновление |
|-----------|------------|---------------------|
| **Web** | 92% | 2026-04-25 |
| **Mobile** | 60% | 2026-03-15 |
| **Desktop** | 40% | 2026-02-20 |
| **Android Service** | 70% | 2026-04-01 |
| **Shared** | 85% | 2026-04-20 |

**Общая готовность:** ~70%

---

## Контакты

- **Email:** admin@balloo.ru
- **Telegram:** @balloo_support
- **Сайт:** https://balloo.ru

---

**Balloo - Кроссплатформенный мессенджер будущего!** 🎈

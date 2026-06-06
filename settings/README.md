# App Balloo - Shared Settings

Централизованный модуль настроек для всех саб-репозиториев проекта App Balloo.

## 📦 Установка

```bash
cd settings
npm install
npm run build
```

## 🚀 Использование

### Инициализация

```typescript
import { initSettings, getSettings, isDev, isProd } from '@app-balloo/settings';

// Инициализация (вызвать один раз при старте приложения)
initSettings('web'); // или 'api', 'mobile', 'desktop'

// Получение настроек
const settings = getSettings();

console.log(settings.app.appName);
console.log(settings.security.jwtSecret);
console.log(settings.database.path);
```

### Проверка окружения

```typescript
import { isDev, isProd, getEnvironment } from '@app-balloo/settings';

if (isDev()) {
  console.log('Development mode');
}

if (isProd()) {
  console.log('Production mode');
}

const env = getEnvironment(); // 'development' | 'production' | 'test'
```

### Получение API URL

```typescript
import { getApiUrl } from '@app-balloo/settings';

const apiUrl = getApiUrl('web'); // Возвращает URL API для текущего окружения
```

### Настройки по функциям

```typescript
import { getSettings, isRegistrationEnabled, isMaintenanceMode } from '@app-balloo/settings';

const settings = getSettings();

if (isRegistrationEnabled()) {
  // Разрешить регистрацию
}

if (isMaintenanceMode()) {
  // Показать страницу обслуживания
}

// Feature flags
if (settings.features.videoCalls) {
  // Включить видеозвонки
}
```

## 📁 Структура

```
settings/
├── src/
│   ├── index.ts           # Экспорты
│   ├── config.ts          # Основная конфигурация
│   ├── types.ts           # TypeScript типы
│   └── environment.ts     # Определение окружения
├── .env.example.dev       # Пример dev настроек
├── .env.example.prod      # Пример prod настроек
├── .env.local             # Локальные настройки (не коммитьте!)
├── tsconfig.json
├── package.json
└── README.md
```

## 🔧 Настройки

### Переменные окружения

| Переменная | Описание | Dev | Prod |
|------------|----------|-----|------|
| `NODE_ENV` | Окружение | `development` | `production` |
| `JWT_SECRET` | Секрет для JWT | ✅ | ✅ (обязательно!) |
| `DB_PATH` | Путь к БД | `./data/database.sqlite` | `/var/lib/balloo/data.sqlite` |
| `YANDEX_CLIENT_ID` | Яндекс OAuth ID | ⚠️ | ✅ |
| `VAPID_PUBLIC_KEY` | Push уведомления | ✅ | ✅ |
| `MAX_FILE_SIZE` | Макс. размер файла | 52428800 (50MB) | 52428800 (50MB) |
| `REGISTRATION_ENABLED` | Регистрация | `true` | `false` |
| `MAINTENANCE_MODE` | Режим обслуживания | `false` | `false` |

### Группы настроек

#### App Settings
```typescript
{
  appName: string;
  appVersion: string;
  appUrl: string;
  description: string;
}
```

#### Security Settings
```typescript
{
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  encryptionKey: string;
}
```

#### Database Settings
```typescript
{
  path: string;
  name: string;
  multiInstance: boolean;
}
```

#### Feature Flags
```typescript
{
  pushNotifications: boolean;
  e2eEncryption: boolean;
  videoCalls: boolean;
  screenShare: boolean;
  fileUpload: boolean;
  invitationSystem: boolean;
  adminPanel: boolean;
  multiAccount: boolean;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
}
```

## 🔒 Безопасность

1. **Никогда не коммитьте `.env.local`** в git
2. Используйте `.env.example.dev` и `.env.example.prod` как шаблоны
3. В production обязательно смените все секреты по умолчанию
4. Используйте разные `JWT_SECRET` для dev и prod

## 📤 Интеграция с другими саб-репозиториями

### Messenger (Next.js)

```bash
cd messenger
npm install ../settings
```

```typescript
// messenger/src/lib/config.ts
import { getSettings, isDev } from '@app-balloo/settings';

const settings = getSettings('web');

export const config = {
  appUrl: settings.app.appUrl,
  apiBaseUrl: isDev() ? 'http://localhost:3000/api' : 'https://api.balloo.su/api',
  features: settings.features,
};
```

### API (Express)

```bash
cd api
npm install ../settings
```

```typescript
// api/src/config/index.ts
import { getSettings, isProd } from '@app-balloo/settings';

const settings = getSettings('api');

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: settings.security.jwtSecret,
  database: {
    path: settings.database.path,
  },
};
```

## 🔄 Обновление

При обновлении настроек:

1. Измените `settings/src/types.ts` (добавьте новые типы)
2. Измените `settings/src/config.ts` (добавьте чтение из env)
3. Обновите `.env.example.dev` и `.env.example.prod`
4. Запустите `npm run build` в settings
5. Пересоберите зависимые саб-репозитории

## 📝 Changelog

### 1.0.0 (2024-01-01)
- Initial release
- Support for web, mobile, desktop, api platforms
- Environment detection (dev/prod/test)
- Centralized configuration
- TypeScript support

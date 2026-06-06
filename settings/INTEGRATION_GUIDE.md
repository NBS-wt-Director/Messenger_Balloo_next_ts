# Интеграция Shared Settings

## 📋 Обзор

`settings` - централизованный модуль настроек для всех саб-репозиториев проекта App Balloo.

## 🎯 Что было сделано

### 1. Создан саб-репозиторий `settings/`

**Структура:**
```
settings/
├── src/
│   ├── index.ts           # Экспорты
│   ├── config.ts          # Основная конфигурация
│   ├── types.ts           # TypeScript типы
│   └── environment.ts     # Определение окружения
├── .env.example.dev       # Пример dev настроек
├── .env.example.prod      # Пример prod настроек
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── INTEGRATION_GUIDE.md
```

### 2. Обновлён `messenger/`

- `src/lib/config.ts` теперь использует `@app-balloo/settings`
- Все настройки берутся из централизованного модуля

### 3. Обновлён `api/`

- `src/config/database.js` использует общие настройки
- Fallback на .env если settings не доступны

## 🚀 Как использовать

### Установка

```bash
# В корне проекта
cd messenger
npm install ../settings

cd api
npm install ../settings
```

### Инициализация

**Messenger (Next.js):**
```typescript
// src/lib/config.ts
import { getSettings, isDev } from '@app-balloo/settings';

const settings = getSettings('web');

// Использование
export const config = {
  appUrl: settings.app.appUrl,
  jwtSecret: settings.security.jwtSecret,
};
```

**API (Express):**
```javascript
// src/config/index.js
const { getSettings } = require('@app-balloo/settings');

const settings = getSettings('api');

module.exports = {
  port: 3001,
  jwtSecret: settings.security.jwtSecret,
};
```

## 📊 Миграция настроек

### Из messenger/.env.local в settings

| Старая переменная | Новая переменная | Место |
|-------------------|------------------|-------|
| `JWT_SECRET` | `JWT_SECRET` | `settings/.env.local` |
| `DATABASE_URL` | `DB_PATH` | `settings/.env.local` |
| `YANDEX_CLIENT_ID` | `YANDEX_CLIENT_ID` | `settings/.env.local` |
| `VAPID_PUBLIC_KEY` | `VAPID_PUBLIC_KEY` | `settings/.env.local` |
| `SUPER_ADMIN_EMAIL` | `SUPER_ADMIN_EMAIL` | `settings/.env.local` |

### Из api/.env в settings

| Старая переменная | Новая переменная | Место |
|-------------------|------------------|-------|
| `DB_PATH` | `DB_PATH` | `settings/.env.local` |
| `JWT_SECRET` | `JWT_SECRET` | `settings/.env.local` |
| `MAX_FILE_SIZE` | `MAX_FILE_SIZE` | `settings/.env.local` |

## 🔒 Безопасность

1. **Не коммитьте `.env.local`** в git
2. Используйте `.env.example.dev` и `.env.example.prod` как шаблоны
3. В production используйте разные секреты для dev и prod
4. Храните `.env.local` в безопасном месте

## 📝 Обновление настроек

1. Измените `settings/src/types.ts` (добавьте новые типы)
2. Измените `settings/src/config.ts` (добавьте чтение из env)
3. Обновите `.env.example.dev` и `.env.example.prod`
4. Запустите `npm run build` в `settings/`
5. Пересоберите зависимые саб-репозитории

## 🔄 Поддерживаемые платформы

- `web` - Messenger (Next.js)
- `api` - API сервер (Express)
- `mobile` - Мобильное приложение (будет)
- `desktop` - Desktop приложение (будет)
- `android-service` - Android сервис (будет)

## 📦 Зависимости

**Требуется в каждом саб-репозитории:**
```json
{
  "dependencies": {
    "@app-balloo/settings": "file:../settings"
  }
}
```

## ⚠️ Известные проблемы

1. **Circular dependencies** - избегайте импорта settings в модулях которые импортируются settings
2. **TypeScript paths** - настройте `paths` в `tsconfig.json` для алиаса `@app-balloo/settings`

## 🐛 Troubleshooting

### "Settings not initialized"

Вызовите `initSettings(platform)` перед `getSettings()`:

```typescript
import { initSettings, getSettings } from '@app-balloo/settings';

initSettings('web');
const settings = getSettings();
```

### "Module not found: @app-balloo/settings"

Убедитесь что:
1. `settings` собрана (`npm run build` в `settings/`)
2. Путь правильный (`file:../settings` или `file:../../settings`)

## 📞 Контакты

NLP-Core-Team - App Balloo Project

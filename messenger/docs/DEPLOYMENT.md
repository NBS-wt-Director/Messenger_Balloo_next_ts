# 📦 Данные для переноса на другой домен/установки

## ⚡ Краткий чек-лист (что нужно ввести)

| # | Данные | Где | Как получить |
|---|--------|-----|--------------|
| 1 | `NEXTAUTH_SECRET` | `.env.local` | `openssl rand -base64 32` |
| 2 | `YANDEX_CLIENT_ID` | `.env.local` | https://oauth.yandex.ru/ |
| 3 | `YANDEX_CLIENT_SECRET` | `.env.local` | https://oauth.yandex.ru/ |
| 4 | `YANDEX_DISK_TOKEN` | `.env.local` | OAuth Yandex Disk |
| 5 | `VAPID_PUBLIC_KEY` | `.env.local` + `config.json` | `npx web-push generate-vapid-keys` |
| 6 | `VAPID_PRIVATE_KEY` | `.env.local` + `config.json` | `npx web-push generate-vapid-keys` |
| 7 | `VAPID_SUBJECT` | `config.json` | Ваш email (mailto:admin@домен.ru) |
| 8 | `NEXT_PUBLIC_SERVER_URL` | `.env.local` | Ваш домен (https://домен.ru) |

**Всего 8 параметров для минимальной работы!**

---

## 🔑 Обязательные данные

### 1. Переменные окружения (`.env.local`)

```bash
# ===== ОБЯЗАТЕЛЬНО ЗАМЕНИТЬ =====

# Адрес сервера (для продакшена)
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.ru

# Yandex OAuth (получить в https://oauth.yandex.ru/)
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret

# Yandex Disk API
YANDEX_DISK_API_URL=https://cloud-api.yandex.net/v1/disk
YANDEX_DISK_TOKEN=ваш_токен_диска

# Email для уведомлений (если используется)
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=ваша@почта.ru
SMTP_PASS=ваш_пароль

# Сессионные ключи (сгенерировать новые!)
NEXTAUTH_SECRET=openssl rand -base64 32
# Выполните в терминале: openssl rand -base64 32

# ===== ОПЦИОНАЛЬНО =====

# Режим (production для продакшена)
NODE_ENV=production

# Порт (по умолчанию 3000)
PORT=3000

# Логирование
LOG_LEVEL=info
```

---

### 2. Push-уведомления (`config.json`)

**Файл:** `messenger/config.json`

```json
{
  "push": {
    "vapidPublicKey": "СГЕНЕРИРОВАТЬ_НОВЫЙ",
    "vapidPrivateKey": "СГЕНЕРИРОВАТЬ_НОВЫЙ",
    "vapidSubject": "mailto:admin@ваш-домен.ru"
  }
}
```

**Команда для генерации VAPID ключей:**
```bash
cd messenger
npx web-push generate-vapid-keys
```

---

### 3. База данных (NoDB / IndexedDB)

**Автоматически создаётся при первом запуске.**

При переносе на новый сервер:
- **Новая установка:** База создаётся пустой, нужно создать первого пользователя
- **Перенос существующих данных:** Экспорт/импорт через админку или прямой доступ к IndexedDB

**Первый пользователь становится SuperAdmin автоматически.**

---

### 4. SSL/TLS сертификаты

**Для HTTPS (обязательно для продакшена):**

```bash
# Let's Encrypt (бесплатно)
certbot --nginx -d ваш-домен.ru

# Или используйте Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

---

## 📋 Чек-лист развёртывания

### Шаг 1: Подготовка окружения

```bash
# 1. Клонируйте репозиторий
git clone <repository>
cd messenger

# 2. Установите зависимости
npm install

# 3. Создайте .env.local
cp .env.example .env.local
# Отредактируйте .env.local - замените все значения
```

### Шаг 2: Генерация ключей

```bash
# 1. Сгенерируйте NEXTAUTH_SECRET
openssl rand -base64 32

# 2. Сгенерируйте VAPID ключи
npx web-push generate-vapid-keys

# 3. Вставьте значения в .env.local и config.json
```

### Шаг 3: Настройка OAuth

1. Зайдите на https://oauth.yandex.ru/
2. Создайте новое приложение
3. Укажите redirect URI: `https://ваш-домен.ru/api/auth/yandex/callback`
4. Скопируйте Client ID и Client Secret в `.env.local`

### Шаг 4: Yandex Disk

1. Зайдите в https://oauth.yandex.ru/client
2. Создайте приложение с доступом к Диску
3. Получите токен
4. Вставьте в `YANDEX_DISK_TOKEN`

### Шаг 5: Сборка и запуск

```bash
# Для продакшена
npm run build
npm start

# Или через PM2
pm2 start npm --name "balloo" -- start
```

### Шаг 6: Первый вход

1. Откройте `https://ваш-домен.ru`
2. Зарегистрируйте первого пользователя
3. Первый пользователь автоматически получает права **SuperAdmin**
4. Зайдите в `/admin` и настройте права для остальных

---

## 🗄️ Перенос существующих данных

### Вариант 1: Экспорт через API

```bash
# Экспорт пользователей
curl https://старый-сервер/api/admin/users/export \
  -H "Authorization: Bearer <token>" \
  -o users.json

# Импорт на новый сервер
curl -X POST https://новый-сервер/api/admin/users/import \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @users.json
```

### Вариант 2: Прямой доступ к IndexedDB

**На клиенте (браузере):**

```javascript
// В консоли браузера на старом сервере
const data = await localStorage.getItem('balloo');
console.log(data); // Скопировать

// На новом сервере
localStorage.setItem('balloo', '<скопированные данные>');
location.reload();
```

---

## 🔐 Критичные данные (секреты)

| Данные | Где хранить | Как сгенерировать |
|--------|-------------|-------------------|
| `NEXTAUTH_SECRET` | `.env.local` | `openssl rand -base64 32` |
| `YANDEX_CLIENT_ID` | `.env.local` | https://oauth.yandex.ru/ |
| `YANDEX_CLIENT_SECRET` | `.env.local` | https://oauth.yandex.ru/ |
| `YANDEX_DISK_TOKEN` | `.env.local` | OAuth Yandex Disk |
| `VAPID_PRIVATE_KEY` | `config.json` | `npx web-push generate-vapid-keys` |
| `VAPID_PUBLIC_KEY` | `config.json` | `npx web-push generate-vapid-keys` |
| `SMTP_PASS` | `.env.local` | Пароль от почтового ящика |

---

## ⚠️ Важно!

1. **Никогда не коммитьте `.env.local` и `config.json` в git**
2. **Сделайте резервную копию перед обновлением**
3. **VAPID ключи должны совпадать** - иначе не будут работать push-уведомления
4. **HTTPS обязателен** для работы PWA и push-уведомлений
5. **Первый пользователь = SuperAdmin** - зарегистрируйте его первым!

---

## 📁 Структура конфигов

```
messenger/
├── .env.local              # Переменные окружения (НЕ в git!)
├── config.json             # Push настройки (НЕ в git!)
├── .env.example           # Пример .env.local (можно в git)
└── scripts/
    └── init-data.mjs      # Скрипт инициализации страниц
```

---

## 🆘 Если что-то пошло не так

### Push-уведомления не работают
```bash
# Перегенерируйте VAPID ключи
npx web-push generate-vapid-keys

# Обновите config.json
# Перезапустите сервер
```

### OAuth Yandex не работает
- Проверьте redirect URI в приложении Yandex OAuth
- Убедитесь что домен совпадает с указанным в приложении
- Проверьте что Client ID и Secret без лишних пробелов

### База данных не создаётся
- Очистите `.next` папку: `rm -rf .next`
- Очистите IndexedDB в браузере
- Перезапустите сервер

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs balloo` или вывод консоли
2. Проверьте что все переменные окружения установлены
3. Убедитесь что порты открыты (3000, 443 для HTTPS)

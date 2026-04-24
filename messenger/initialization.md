# Инструкция по инициализации

## Содержание

1. [Требования](#требования)
2. [Установка зависимостей](#установка-зависимостей)
3. [Настройка Яндекс.ID](#настройка-яндексаid)
4. [Настройка Яндекс.Диска](#настройка-яндексдиска)
5. [Переменные окружения](#переменные-окружения)
6. [Запуск проекта](#запуск-проекта)

---

## Требования

- Node.js 18+ 
- npm или yarn
- Аккаунт Яндекса

---

## Установка зависимостей

```bash
cd messenger
npm install
```

---

## Настройка Яндекс.ID

### Шаг 1: Создание приложения

1. Перейдите на [Яндекс.ID для разработчиков](https://yandex.ru/dev/id/)
2. Нажмите "Создать приложение"
3. Заполните форму:

| Поле | Значение |
|------|----------|
| Название | Secure Messenger |
| Платформы | Веб-приложения |
| Callback URL | `http://localhost:3000/api/auth/yandex/callback` |

4. В разделе "Доступы" выберите:
   - `login:email` — доступ к email
   - `login:info` — доступ к информации о пользователе

5. Сохраните приложение
6. Скопируйте **Client ID** — он понадобится позже

### Шаг 2: Настройка OAuth в приложении

Добавьте в `.env.local`:

```env
YANDEX_CLIENT_ID=ваш_client_id
YANDEX_CLIENT_SECRET=ваш_client_secret
```

---

## Настройка Яндекс.Диска

### Шаг 1: Создание приложения

1. Перейдите на [Яндекс.Диск API](https://yandex.ru/dev/disk-api/)
2. Нажмите "Создать приложение"
3. Заполните форму:

| Поле | Значение |
|------|----------|
| Название | Secure Messenger |
| Платформы | Веб-приложения |
| Callback URL | `http://localhost:3000/api/disk/callback` |

4. В разделе "Доступы" выберите:
   - `disk:read` — чтение файлов
   - `disk:write` — запись файлов

5. Сохраните приложение
6. Скопируйте **Client ID** (он тот же, что и для Яндекс.ID)

### Шаг 2: Права доступа

Для работы с Яндекс.Диском приложению нужны следующие права:

- **disk.app_folder** — доступ к папке приложения
- **disk.read** — чтение файлов
- **disk.write** — запись файлов

---

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Яндекс OAuth (одинаковый Client ID для ID и Диска)
YANDEX_CLIENT_ID=ваш_client_id_яндекса
YANDEX_CLIENT_SECRET=ваш_client_secret

# URL приложения
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Секретный ключ для сессий
SESSION_SECRET=генерируйте_случайную_строку_длиной_минимум_32_символа

# (опционально) URL внешнего API сервера
# API_URL=https://your-api-server.com
```

### Генерация SESSION_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## Структура папок Яндекс.Диска

При первом запуске приложение создаст:

```
/ (корневая папка диска)
└── messengеr/
    ├── avatars/        # Аватарки пользователей
    ├── attachments/    # Вложения сообщений
    │   ├── images/
    │   ├── videos/
    │   ├── files/
    │   └── audio/
    └── statuses/       # Статусы (сторис)
```

---

## Запуск проекта

### Режим разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### Production сборка

```bash
npm run build
npm run start
```

---

## Устранение проблем

### Ошибка "Invalid client_id"

Проверьте, что:
1. Client ID в `.env.local` соответствует приложению в Яндекс.ID
2. Callback URL в приложении совпадает с `NEXT_PUBLIC_APP_URL`

### Ошибка "Redirect URI mismatch"

Добавьте точный URL в настройках приложения Яндекса:
- Для разработки: `http://localhost:3000/api/auth/yandex/callback`
- Для продакшена: `https://ваш-домен.com/api/auth/yandex/callback`

### Токен не обновляется

Убедитесь, что в настройках приложения выбраны права `offline_access` (или соответствующие опции для получения refresh token).

---

## Следующие шаги

После настройки перейдите к [README.md](./README.md) для знакомства с функциями приложения.

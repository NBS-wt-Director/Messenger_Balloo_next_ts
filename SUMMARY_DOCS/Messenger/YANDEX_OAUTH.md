# Яндекс OAuth - Интеграция

## 📋 Настройка в Яндексе

### 1. Создание приложения

1. Зайдите в [Яндекс OAuth](https://oauth.yandex.ru/)
2. Нажмите "Добавить проект"
3. Заполните данные:
   - **Название:** Balloo Messenger
   - **Модуль:** Веб-сайт
   - **Redirect URI:** `https://ваш-домен.ru/api/auth/yandex`
   - **Логин:** ваш-яндекс-аккаунт

### 2. Настройка прав доступа

В разделе "Платформы" и "Права доступа":

```
✓ Яндекс ID
  ✓ email (default_email)
  ✓ имя (real_name)
  ✓ аватар (default_avatar_id)
```

### 3. Получите credentials

После создания приложения получите:
- **Client ID:** `ваш-client-id`
- **Client Secret:** `ваш-client-secret`

---

## ⚙️ Настройка переменных окружения

### `.env.local`

```bash
# Яндекс OAuth
YANDEX_CLIENT_ID=ваш-client-id
YANDEX_CLIENT_SECRET=ваш-client-secret
FRONTEND_URL=http://localhost:3000
```

### `.env.production`

```bash
# Яндекс OAuth
YANDEX_CLIENT_ID=ваш-production-client-id
YANDEX_CLIENT_SECRET=ваш-production-client-secret
FRONTEND_URL=https://ваш-домен.ru
```

---

## 🚀 OAuth Flow

### 1. Авторизация пользователя

**Кнопка на фронтенде:**
```jsx
<a 
  href={`https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.YANDEX_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URL}/api/auth/yandex&scope=login:info:email`}
  className="yandex-button"
>
  Войти через Яндекс
</a>
```

### 2. Обработка callback

Пользователь переходит на:
```
https://oauth.yandex.ru/authorize?response_type=code&client_id=XXX&redirect_uri=YYY
```

Яндекс перенаправляет на:
```
https://ваш-домен.ru/api/auth/yandex?code=AUTH_CODE
```

### 3. Обмен кода на токен

Backend (`/api/auth/yandex`):
```typescript
// Обмен кода на токен
const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: YANDEX_CLIENT_ID,
    client_secret: YANDEX_CLIENT_SECRET,
    code: AUTH_CODE,
  }),
});

const { access_token } = await tokenResponse.json();
```

### 4. Получение данных пользователя

```typescript
const userResponse = await fetch('https://login.yandex.ru/info', {
  headers: {
    Authorization: `OAuth ${access_token}`,
  },
});

const yandexUser = await userResponse.json();
// {
//   default_email: "user@yandex.ru",
//   real_name: "Иван Иванов",
//   default_avatar_id: "1234567890abcdef",
//   ...
// }
```

---

## 🔄 Логика регистрации/входа

### Flow:

```
1. Пользователь нажимает "Войти через Яндекс"
   ↓
2. Яндекс авторизует и перенаправляет с code
   ↓
3. Обмен code на access_token
   ↓
4. Получение данных пользователя из Яндекс
   ↓
5. Проверка существования в базе
   ↓
6a. ЕСЛИ пользователь существует:
    - Обновить displayName если изменился
    - Обновить аватар из Яндекс
    - Логиним
   ↓
6b. ЕСЛИ пользователь НЕ существует:
    - Создаём нового
    - Присваиваем userNumber и points
    - Если первый → супер-админ
    - Генерируем аватар (Яндекс или свой)
    - Регистрируем
   ↓
7. Создаём системные чаты (если нет)
   ↓
8. Возвращаем токен сессии
```

---

## 📊 Данные пользователя из Яндекс

### Ответ от `https://login.yandex.ru/info`:

```json
{
  "id": "123456789",
  "default_email": "user@yandex.ru",
  "default_avatar_id": "abcdef123456",
  "real_name": "Иван Иванов",
  "first_name": "Иван",
  "last_name": "Иванов",
  "login": "yandex_login",
  "gender": "male",
  "birthday": "01.01.1990",
  "default_phone": "+79991234567"
}
```

### Используем:

| Поле | В БД | Описание |
|------|------|----------|
| `default_email` | `User.email` | Email (уникальный) |
| `real_name` | `User.displayName` | Отображаемое имя |
| `default_avatar_id` | `User.avatar` | ID аватара (конвертируем в URL) |
| `default_phone` | `User.phone` | Телефон (опционально) |

### Формирование URL аватара:

```javascript
const avatarUrl = `https://avatars.yandex.net/get-yapic/${yandexUser.default_avatar_id}/islands-200`;
```

---

## 🎨 Обработка аватаров

### При регистрации через Яндекс:

1. **Если есть аватар от Яндекса:**
   - Сохраняем URL в `User.avatar`
   - Формат: `https://avatars.yandex.net/...`

2. **Если нет аватара:**
   - Генерируем свой (восьмиугольник)
   - Используем `generateUserAvatar()`

### При обновлении:

1. Если у пользователя нет аватара → берём из Яндекс
2. Если был свой аватар → сохраняем в историю
3. Если уже был Яндекс аватар → обновляем

---

## 🧪 Тестирование

### 1. Локально

```bash
# Запустить сервер
npm run dev

# Открыть в браузере
http://localhost:3000/api/auth/yandex?code=TEST_CODE
```

### 2. На сервере

```bash
# Пересобрать
NODE_ENV=production npx next build

# Перезапустить
pm2 restart messenger-alpha --update-env

# Проверить логи
pm2 logs messenger-alpha --lines 50
```

---

## 📝 Примеры запросов

### Кнопка входа на фронтенде

```jsx
// components/auth/YandexLoginButton.tsx
export function YandexLoginButton() {
  const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/yandex&scope=login:info:email`;

  return (
    <a 
      href={yandexAuthUrl}
      className="flex items-center justify-center w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"/>
      </svg>
      Войти через Яндекс
    </a>
  );
}
```

### Обработка на фронтенде

```jsx
// pages/api/auth/yandex.ts (фронтенд)
export default async function handler(req, res) {
  const { code } = req.query;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/yandex?code=${code}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (data.success) {
    // Сохранить токен и данные пользователя
    res.cookie('token', data.token, { httpOnly: true });
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=' + data.error);
  }
}
```

---

## ⚠️ Важные замечания

### Безопасность

1. **Client Secret** никогда не передаётся на фронтенд
2. **Access Token** хранится только на бэкенде
3. **Session Token** генерируется сервером
4. Всегда проверяйте `redirect_uri` в Яндексе

### Обработка ошибок

```typescript
try {
  // OAuth flow
} catch (error) {
  console.error('[Yandex Auth] Error:', error);
  
  if (error.code === 'access_denied') {
    // Пользователь отменил авторизацию
    return NextResponse.json({ error: 'Авторизация отменена' }, { status: 401 });
  }
  
  return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 });
}
```

### Ограничения Яндекса

- Максимум 5 запросов в секунду к API
- Access Token действует 1 день
- Refresh Token действует 30 дней

---

## 📊 Мониторинг

### Проверка регистрации

```sql
-- Посмотреть пользователей через Яндекс
SELECT id, email, displayName, authProvider, userNumber, createdAt 
FROM User 
WHERE authProvider = 'yandex'
ORDER BY userNumber ASC;
```

### Статистика

```sql
-- Количество пользователей по провайдеру
SELECT 
  CASE 
    WHEN passwordHash IS NOT NULL THEN 'password'
    WHEN authProvider = 'yandex' THEN 'yandex'
    ELSE authProvider
  END as provider,
  COUNT(*) as count
FROM User
GROUP BY provider;
```

---

**Версия:** 1.0  
**Дата:** 2024  
**Статус:** ✅ Готово к деплою

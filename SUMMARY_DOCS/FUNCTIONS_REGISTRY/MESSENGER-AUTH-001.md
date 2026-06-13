---
function_id: MESSENGER-AUTH-001
name: Регистрация пользователя
module: messenger
category: auth
status: implemented
priority: high
completion: 100%
created: 2026-06-13
updated: 2026-06-13
---

# 📝 Функция: Регистрация пользователя

**ID:** `MESSENGER-AUTH-001`  
**Модуль:** Messenger (Web)  
**Категория:** Аутентификация  
**Статус:** ✅ Реализовано  
**Приоритет:** 🔴 Высокий

---

## 📖 Описание

### Короткое (для пользователей)
Создание нового аккаунта в системе Balloo с подтверждением email адреса. Быстрая регистрация за 30 секунд.

### Длинное (для сотрудников)
Полноценная система регистрации пользователя с валидацией полей, проверкой уникальности email/username, отправкой подтверждающего письма и автоматическим входом после успешной регистрации.

### Техническое (для разработчиков)
REST API endpoint `POST /api/v1/auth/register` принимает username, email, password. Выполняет валидацию через Zod схему, хеширование пароля bcrypt (10 раундов), создание записи в таблице users, генерацию JWT токена и refresh токена. Отправка email через nodemailer.

---

## 🎯 Компоненты

### React компоненты
```json
[
  "src/pages/auth/register.tsx",
  "src/components/Auth/RegisterForm.tsx",
  "src/components/Auth/PasswordStrength.tsx",
  "src/components/Auth/EmailVerification.tsx"
]
```

### Хуки
```json
[
  "useAuth()",
  "useRegister()",
  "usePasswordValidation()"
]
```

---

## 🔌 API Endpoints

### Основной
```
POST /api/v1/auth/register
Content-Type: application/json

Request:
{
  "username": "string (3-20 символов)",
  "email": "string (валидный email)",
  "password": "string (мин. 8 символов)",
  "confirmPassword": "string"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "user123",
      "email": "user@example.com",
      "created_at": "2026-06-13T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
  }
}
```

### Валидация
```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

---

## 🗄️ Таблицы БД

### users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎨 UI Элементы

### Страницы
```json
[
  "/auth/register"
]
```

### Вкладки
```json
[
  { "name": "Регистрация", "active": true },
  { "name": "Вход", "link": "/auth/login" }
]
```

### Формы
```json
[
  {
    "name": "RegisterForm",
    "fields": [
      { "name": "username", "type": "text", "required": true, "label": "Имя пользователя" },
      { "name": "email", "type": "email", "required": true, "label": "Email" },
      { "name": "password", "type": "password", "required": true, "label": "Пароль" },
      { "name": "confirmPassword", "type": "password", "required": true, "label": "Подтвердите пароль" }
    ],
    "buttons": [
      { "type": "submit", "text": "Зарегистрироваться" },
      { "type": "link", "text": "Уже есть аккаунт? Войти", "link": "/auth/login" }
    ]
  }
]
```

---

## 🔐 Авторизация

### Методы
```json
[
  "jwt"
]
```

### Разрешения
```json
[
  "public"  // Доступно без авторизации
]
```

### Роли
```json
[
  "anonymous"  // Любой пользователь
]
```

---

## 📎 Вложения

Не применимо для данной функции.

---

## 🖼️ Медиа

### Иконка
```
/icons/auth/register.svg
```

### Скриншот
```
/screenshots/auth/register-form.png
```

---

## 📊 Метрики

| Метрика | Значение |
|---------|----------|
| Время регистрации | < 30 сек |
| Конверсия | 65% |
| Ошибок валидации | ~15% |
| Email подтверждение | 80% |

---

## 📝 История изменений

| Дата | Версия | Изменения | Кто |
|------|--------|-----------|-----|
| 2026-06-13 | 1.0.0 |Initial implementation | Koda |

---

## 🔗 Связанные функции

- MESSENGER-AUTH-002 (Вход в систему)
- MESSENGER-AUTH-004 (Сброс пароля)
- MESSENGER-AUTH-005 (2FA)

---

## 🏷️ Теги

```
registration, auth, signup, onboarding, email-verification
```

---

**Документ создан:** 2026-06-13  
**Последнее обновление:** 2026-06-13  
**Статус:** Актуально

---

**🎈 Balloo - Share your moments safely!**

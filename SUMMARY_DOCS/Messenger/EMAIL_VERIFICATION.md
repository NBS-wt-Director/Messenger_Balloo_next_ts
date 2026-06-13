# Balloo Messenger - Email Верификация

## 📧 Система подтверждения email

### Как это работает

1. **При регистрации** через email:
   - Создаётся пользователь
   - Генерируется код из 7 русских слов
   - Код отправляется на email
   - Пользователь НЕ может закрыть окно ввода кода

2. **Код верификации:**
   - Состоит из 7 слов: `солнце-месяц-звезда-небо-земля-вода-огонь`
   - Действителен 15 минут
   - Каждый раз новый
   - Сохраняется в БД до использования

3. **Блокировка интерфейса:**
   - Окно нельзя закрыть до ввода кода
   - Пользователь не может взаимодействовать с приложением
   - Показывает куда пришёл код (маскированный email)

---

## 🗄️ База Данных

### Таблица: VerificationCode

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | TEXT | Primary key |
| `userId` | TEXT | ID пользователя |
| `code` | TEXT | Код из 7 слов |
| `createdAt` | TEXT | Время создания |
| `expiresAt` | TEXT | Время истечения (15 мин) |
| `used` | INTEGER | 0/1 (использован?) |
| `usedAt` | TEXT | Время использования |

### Таблица: User (дополнение)

| Поле | Тип | Описание |
|------|-----|----------|
| `emailVerified` | INTEGER | 0/1 (подтверждён?) |

---

## 🔄 Flow верификации

```
1. Регистрация через email
   ↓
2. Генерация кода из 7 слов
   ↓
3. Отправка email с кодом
   ↓
4. Показ модального окна (незакрываемое)
   ↓
5. Пользователь вводит код
   ├─ Верно → email подтверждён, доступ к приложению
   └─ Неверно → ошибка, повторяем ввод
   ↓
6. Код помечается как использованный
```

---

## 📝 API Endpoints

### POST /api/auth/verification/send

**Отправка кода на email**

```json
{
  "userId": "user-xxx"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Код верификации отправлен на email",
  "email": "usa***@balloo.su",
  "hint": "солнце-месяц-звезда..."
}
```

### POST /api/auth/verification/verify

**Проверка кода**

```json
{
  "userId": "user-xxx",
  "code": "солнце-месяц-звезда-небо-земля-вода-огонь"
}
```

**Ответ (успех):**
```json
{
  "success": true,
  "message": "Email успешно подтверждён",
  "user": {
    "id": "user-xxx",
    "email": "user@balloo.su",
    "displayName": "User Name",
    "isVerified": true
  }
}
```

**Ответ (ошибка - код истёк):**
```json
{
  "error": "Код верификации истёк. Запросите новый код",
  "status": 410
}
```

### GET /api/auth/verification/status

**Проверка статуса верификации**

```
GET /api/auth/verification/status?userId=user-xxx
```

**Ответ:**
```json
{
  "success": true,
  "hasActiveCode": true,
  "needsVerification": false
}
```

---

## 🎨 Компонент VerificationModal

### Использование

```tsx
import { VerificationModal } from '@/components/VerificationModal';

function App() {
  const [showVerification, setShowVerification] = useState(true);
  const userId = 'user-xxx';

  if (showVerification) {
    return (
      <VerificationModal
        userId={userId}
        onClose={() => setShowVerification(false)}
        onVerify={() => setShowVerification(false)}
      />
    );
  }

  return <MainApp />;
}
```

### Особенности

- ✅ **Незакрываемое окно** - нельзя закрыть до ввода кода
- ✅ **Показывает подсказку** - первые 3 слова кода
- ✅ **Таймер повторной отправки** - 60 секунд
- ✅ **Маскировка email** - usa***@balloo.su
- ✅ **Валидация** - проверка формата кода
- ✅ **Анимации** - плавное появление
- ✅ **Тёмная тема** - адаптация под тему

---

## 📧 Email Шаблон

### HTML версия

```html
<div>
  <h2>Добро пожаловать в Balloo!</h2>
  <p>Код подтверждения:</p>
  <div style="background: #f3f4f6; padding: 20px;">
    <p style="font-size: 24px; font-weight: bold;">
      солнце-месяц-звезда-небо-земля-вода-огонь
    </p>
  </div>
  <p><strong>Подсказка:</strong> солнце-месяц-звезда...</p>
  <p>Код действителен 15 минут</p>
</div>
```

### Конфигурация SMTP

```bash
# .env.local / .env.production
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=robot@balloo.su
SMTP_PASS=ваш_пароль_приложения
```

---

## 🧪 Тестирование

### 1. Локально (без SMTP)

```bash
# В консоли будет показан код:
[Email] Sending verification code to: user@example.com
[Email] CODE: солнце-месяц-звезда-небо-земля-вода-огонь
```

### 2. С SMTP

```bash
# Отправьте реальный email
node scripts/test-email.js

# Проверьте лог:
pm2 logs messenger-alpha --lines 50
```

### 3. Через API

```bash
# Отправить код
curl -X POST http://localhost:3000/api/auth/verification/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-xxx"}'

# Проверить код
curl -X POST http://localhost:3000/api/auth/verification/verify \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-xxx","code":"солнце-месяц-звезда-небо-земля-вода-огонь"}'
```

---

## ⚠️ Важные замечания

### Безопасность

1. **Коды хранятся в БД** до использования или истечения
2. **15 минут жизни** - автоматическое истечение
3. **Одноразовые** - после использования помечаются
4. **Маскировка email** - не показываем полный email

### Производительность

1. **Индексы** на userId и expiresAt
2. **Очистка** истёкших кодов (можно добавить cron)
3. **Лимит попыток** - можно добавить rate limiting

### Ошибки

| Ошибка | Код | Действие |
|--------|-----|----------|
| Код не найден | 404 | Запросить новый код |
| Код истёк | 410 | Запросить новый код |
| Неверный код | 400 | Повторить ввод |
| Ошибка сети | 500 | Повторить попытку |

---

## 📦 Файлы

| Файл | Описание |
|------|----------|
| `src/lib/verification-code.js` | Генерация кода из 7 слов |
| `src/lib/email.js` | Отправка email через SMTP |
| `src/components/VerificationModal.tsx` | Компонент модального окна |
| `src/components/VerificationModal.css` | Стили модального окна |
| `src/app/api/auth/verification/send/route.ts` | API отправки кода |
| `src/app/api/auth/verification/verify/route.ts` | API проверки кода |
| `src/lib/database.js` | Таблица VerificationCode |

---

## 🚀 Интеграция с регистрацией

### В register/route.ts

```typescript
// После создания пользователя
const userId = `user-${Date.now()}-${...}`;

// Генерируем и отправляем код
const code = generateVerificationCode();
await sendVerificationEmail(email, code);

// Сохраняем код в БД
db.prepare(`
  INSERT INTO VerificationCode (userId, code, expiresAt)
  VALUES (?, ?, ?)
`).run(userId, code, new Date(Date.now() + 15*60*1000).toISOString());

// Показываем модальное окно на фронтенде
return NextResponse.json({
  success: true,
  userId,
  requiresVerification: true,
  emailMasked: email.replace(/(.{3}).+(@.+)/, '$1***$2')
});
```

### На фронтенде

```tsx
// После регистрации
const response = await fetch('/api/auth/register', {...});
const data = await response.json();

if (data.requiresVerification) {
  setShowVerificationModal(true);
  setUserId(data.userId);
} else {
  //直接进入应用
  router.push('/chats');
}
```

---

**Версия:** 1.0  
**Дата:** 2026-06-01  
**Статус:** ✅ Готово к деплою

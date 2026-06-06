# 📱 SMS 2FA Документация

**Дата:** 2026-06-02  
**Версия:** 1.2.0  
**Статус:** ✅ Готово к production

---

## 🎯 Обзор

SMS 2FA реализована через **Samsung J3 SMS сервер** + **внутренний бот** для отправки кодов подтверждения.

### Преимущества

- ✅ **Российская инфраструктура** - нет зависимости от Google/Apple
- ✅ **Полный контроль** - ваш собственный SMS сервер
- ✅ **Безопасность** - коды хранятся только на вашем сервере
- ✅ **Отказоустойчивость** - резервный метод к TOTP

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                  SMS 2FA Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Web    │─────>│  API Server  │─────>│ SMS Service  │  │
│  │  Client  │      │  (Node.js)   │      │ (Samsung J3) │  │
│  └──────────┘      └──────────────┘      └──────────────┘  │
│                            │                    │           │
│                            ▼                    ▼           │
│                     ┌─────────────────────────────────┐    │
│                     │   SQLite Database               │    │
│                     │   verification_codes            │    │
│                     │   users (sms2FAEnabled)         │    │
│                     └─────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Настройка SMS сервера (Samsung J3)

### Переменные окружения

```bash
# api/.env
SMS_SERVER_URL=http://localhost:8080
SMS_SERVER_API_KEY=your-secret-api-key
```

### Samsung J3 API Endpoints

#### 1. Отправить SMS

```http
POST http://localhost:8080/send-sms
Authorization: Bearer your-secret-api-key
Content-Type: application/json

{
  "phone": "+79991234567",
  "message": "Balloo: Ваш код подтверждения: 123456. Не сообщайте никому.",
  "priority": "high"
}
```

**Ответ:**
```json
{
  "success": true,
  "messageId": "msg_abc123"
}
```

#### 2. Проверить статус сервера

```http
GET http://localhost:8080/status
Authorization: Bearer your-secret-api-key
```

**Ответ:**
```json
{
  "status": "online",
  "batteryLevel": 85,
  "signalStrength": "good",
  "pendingMessages": 0
}
```

---

## 📡 API Endpoints

### Включить SMS 2FA

```http
POST /api/auth/sms-2fa/enable
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Ответ:**
```json
{
  "success": true,
  "message": "Код отправлен на ваш номер телефона"
}
```

### Подтвердить SMS 2FA

```http
POST /api/auth/sms-2fa/confirm
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "code": "123456"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "SMS 2FA успешно включён"
}
```

### Отключить SMS 2FA (запрос кода)

```http
POST /api/auth/sms-2fa/disable
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Ответ:**
```json
{
  "success": true,
  "message": "Код для отключения отправлен на ваш номер"
}
```

### Подтвердить отключение SMS 2FA

```http
POST /api/auth/sms-2fa/confirm-disable
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "code": "123456"
}
```

### Отправить SMS код для входа

```http
POST /api/auth/sms-2fa/send-code
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Проверить SMS код для входа

```http
POST /api/auth/sms-2fa/verify
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "code": "123456"
}
```

---

## 🗄️ База данных

### Таблица users (новые поля)

```sql
ALTER TABLE users ADD COLUMN sms2FAEnabled INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN sms2FAEnabledAt INTEGER;
```

### Таблица verification_codes (используется)

```sql
CREATE TABLE IF NOT EXISTS verification_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,           -- номер телефона для SMS
  code_hash TEXT NOT NULL,       -- хэш кода
  type TEXT DEFAULT 'sms',       -- 'sms_2fa_enable', 'sms_2fa_disable', 'sms_login'
  expires_at INTEGER NOT NULL,   -- timestamp истечения
  created_at INTEGER NOT NULL
);
```

---

## 🧪 Тестирование

### Шаг 1: Запуск SMS сервера

```bash
# На Samsung J3
cd sms-server
python server.py
```

### Шаг 2: Проверка API

```bash
# Проверка статуса сервера
curl http://localhost:8080/status

# Отправка тестового SMS
curl -X POST http://localhost:8080/send-sms \
  -H "Authorization: Bearer your-secret-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "message": "Test message from Balloo"
  }'
```

### Шаг 3: Тестирование 2FA через UI

1. Откройте страницу профиля → Безопасность
2. Нажмите "Включить 2FA"
3. Выберите "SMS-код"
4. Нажмите "Получить SMS код"
5. Введите 6-значный код из SMS
6. Нажмите "Подтвердить и включить"

### Шаг 4: Автоматическое тестирование

```bash
# Тестовый скрипт
cd api
node test-sms-2fa.js
```

---

## 🔒 Безопасность

### Защита от перебора

- ✅ Ограничение: 3 попытки на код
- ✅ Блокировка на 15 минут после 3 неудачных попыток
- ✅ Таймаут кода: 5 минут

### Хэширование кодов

```javascript
const code = '123456';
const codeHash = hash(code); // SHA-256
```

### Валидация номера телефона

```javascript
const phoneRegex = /^\+7\d{10}$/; // Только российские номера +7XXX
```

---

## 📊 Мониторинг

### Логирование

```javascript
// api/src/services/sms.service.js
logger.info(`SMS sent to ${phone}, messageId: ${response.data.messageId}`);
logger.error(`SMS send failed: ${response.data.error}`);
```

### Метрики

- Количество отправленных SMS
- Успешные/неудачные отправки
- Время ответа SMS сервера
- Очередь сообщений

---

## 🚨 Обработка ошибок

| Ошибка | Код | Описание |
|--------|-----|----------|
| PHONE_NOT_SET | 400 | Номер телефона не указан |
| SMS_ERROR | 500 | Ошибка отправки SMS |
| INVALID_CODE | 400/401 | Неверный или истёкший код |
| SERVER_UNAVAILABLE | 503 | SMS сервер недоступен |

---

## 📝 Примеры использования

### Включение SMS 2FA из приложения

```typescript
// messenger/src/components/TwoFASetup.tsx

const handleEnableSMS = async () => {
  const response = await fetch('/api/auth/sms-2fa/enable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  if (data.success) {
    // Показать поле для ввода кода
    setStep('confirm');
  }
};
```

### Вход с SMS 2FA

```typescript
// 1. Войти с паролем
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// 2. Если требуется 2FA
if (loginResponse.requires2FA) {
  // 3. Отправить SMS код
  await fetch('/api/auth/sms-2fa/send-code', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tempToken}` }
  });
  
  // 4. Ввести код
  await fetch('/api/auth/sms-2fa/verify', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tempToken}` },
    body: JSON.stringify({ code: '123456' })
  });
}
```

---

## 🔄 Резервное копирование

### Экспорт кодов восстановления

При включении SMS 2FA предлагаются коды восстановления:

```
Ваш резервный код: ABCD-EFGH-IJKL
Используйте его если телефон недоступен
```

### Хранение

- ✅ Зашифрованы в БД
- ✅ Одноразовые
- ✅ Срок действия: бессрочно (до использования)

---

## 📞 Поддержка

**Проблемы с SMS сервером?**

1. Проверьте статус сервера: `GET /status`
2. Проверьте подключение: `ping localhost`
3. Проверьте логи: `cat /var/log/sms-server.log`

**Код не приходит?**

1. Проверьте баланс SIM-карты
2. Проверьте сигнал сети
3. Проверьте чёрный список

---

**NLP-Core-Team** - App Balloo Messenger  
*SMS 2FA через Samsung J3 - российское решение для безопасности*

# 📱 Max SMS System Documentation

**Дата:** 2026-06-02  
**Версия:** 1.3.0  
**Статус:** ✅ Готово к production

---

## 🎯 Обзор

**Max SMS** — это система отправки SMS через **Android приложение на Samsung J3** с использованием **3-значных кодов**.

### Особенности

- ✅ **3-значные коды** - быстрее ввод, проще запомнить
- ✅ **Android + Termux** - запуск через Termux на Samsung J3
- ✅ **Node.js сервер** - лёгкий и быстрый
- ✅ **Полный контроль** - ваша инфраструктура
- ✅ **Российские номера** - только +7XXX

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                     Max SMS Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Balloo API ──────> Max Server ──────> Android App ──────> SMS  │
│  (Port 3001)       (Port 8080)      (Termux/JS)              │
│                                                                  │
│  1. Запрос SMS      2. Queue        3. Poll & Send          │
│  4. Confirmation <─────────────────────────────────────>       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Установка

### 1. Max Server (Node.js)

```bash
cd max-server
npm install
```

**Переменные окружения:**
```bash
# .env
MAX_SERVER_PORT=8080
MAX_SERVER_API_KEY=your-secret-key-here
LOG_LEVEL=info
```

**Запуск:**
```bash
npm start
# или для development
npm run dev
```

### 2. Android App (Samsung J3 + Termux)

**Установка Termux:**
```bash
# Скачать из F-Droid (не Google Play!)
https://f-droid.org/en/packages/com.termux/
```

**Настройка Termux:**
```bash
# Обновить пакеты
pkg update && pkg upgrade

# Установить Node.js
pkg install nodejs

# Дать доступ к SMS
termux-setup-storage

# Установить Termux:SMS plugin
pkg install termux-api
```

**Запуск Max SMS App:**
```bash
cd ~/max-server
node android-app.js
```

**Автозапуск при загрузке:**
```bash
# Добавить в ~/.bashrc
echo "cd ~/max-server && node android-app.js &" >> ~/.bashrc
```

---

## 🔧 Конфигурация

### Max Server (.env)

```bash
MAX_SERVER_PORT=8080
MAX_SERVER_API_KEY=super-secret-key-change-me
LOG_LEVEL=info
NODE_ENV=production
```

### Android App (Environment)

```bash
export MAX_SERVER_URL=http://192.168.1.100:8080
export POLL_INTERVAL=5000
```

**Где 192.168.1.100 - IP адрес сервера в вашей сети**

---

## 📡 API Endpoints

### Max Server API

#### 1. Зарегистрировать устройство

```http
POST http://localhost:8080/device/register
Content-Type: application/json

{
  "deviceName": "Samsung J3",
  "deviceModel": "SM-J320F",
  "androidVersion": "6.0.1"
}
```

**Ответ:**
```json
{
  "success": true,
  "deviceToken": "abc-123-def-456",
  "message": "Устройство успешно зарегистрировано"
}
```

#### 2. Отправить SMS

```http
POST http://localhost:8080/send-sms
Authorization: Bearer your-secret-key
Content-Type: application/json

{
  "phone": "+79991234567",
  "code": "123",
  "message": "Balloo: Ваш код: 123",
  "priority": "high"
}
```

**Ответ:**
```json
{
  "success": true,
  "messageId": "msg-abc-123",
  "status": "queued",
  "message": "SMS поставлено в очередь"
}
```

#### 3. Получить очередь

```http
GET http://localhost:8080/queue/{deviceToken}
```

**Ответ:**
```json
{
  "success": true,
  "queue": [
    {
      "messageId": "msg-abc-123",
      "phone": "+79991234567",
      "code": "123",
      "message": "Balloo: Ваш код: 123",
      "priority": "high",
      "createdAt": 1717290000000
    }
  ],
  "count": 1
}
```

#### 4. Подтвердить отправку

```http
POST http://localhost:8080/confirm-sent
Authorization: Bearer your-secret-key
Content-Type: application/json

{
  "messageId": "msg-abc-123",
  "deviceToken": "abc-123-def-456",
  "success": true
}
```

#### 5. Статус сервера

```http
GET http://localhost:8080/status
```

**Ответ:**
```json
{
  "success": true,
  "status": "online",
  "uptime": 3600,
  "pendingMessages": 5,
  "activeDevices": 1,
  "timestamp": 1717290000000
}
```

---

## 🧪 Тестирование

### 1. Проверка сервера

```bash
# Health check
curl http://localhost:8080/health

# Статус
curl http://localhost:8080/status
```

### 2. Отправка тестового SMS

```bash
curl -X POST http://localhost:8080/send-sms \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+79991234567",
    "code": "123",
    "message": "Test code: 123"
  }'
```

### 3. Тестирование Android приложения

```bash
# На Samsung J3 в Termux
cd ~/max-server
node android-app.js

# Проверка логов
tail -f max-sms.log
```

---

## 🔒 Безопасность

### API Key

- **Храните в .env файле**
- **Не коммитьте в Git**
- **Используйте разные ключи для dev/prod**

### Валидация

```javascript
// Номер телефона
const phoneRegex = /^\+7\d{10}$/; // Только +7XXX

// Код
const codeRegex = /^\d{3}$/; // Точно 3 цифры
```

### Ограничения

- **Максимум 10 SMS в минуту** (можно добавить rate limiting)
- **Таймаут кода: 5 минут**
- **Хэширование кодов: SHA-256**

---

## 📊 Мониторинг

### Логирование

**Max Server:**
```bash
# Логи в файлы
error.log      - Ошибки
combined.log   - Все события
```

**Android App:**
```bash
# Логи в Termux
max-sms.log
```

### Метрики

- `pendingMessages` - Очередь сообщений
- `activeDevices` - Активные Android устройства
- `uptime` - Время работы сервера

---

## 🚨 Обработка ошибок

| Ошибка | Код | Описание |
|--------|-----|----------|
| PHONE_NOT_SET | 400 | Номер не указан |
| INVALID_PHONE | 400 | Неверный формат номера |
| INVALID_CODE | 400 | Код должен быть 3 цифры |
| SMS_ERROR | 500 | Ошибка отправки SMS |
| SERVER_UNAVAILABLE | 503 | Сервер недоступен |

---

## 📝 Примеры использования

### 1. Интеграция с Balloo API

```javascript
// api/src/services/sms.service.js

const result = await smsService.sendVerificationCode(
  '+79991234567',
  '123',  // 3-значный код
  'sms_2fa_enable'
);

if (result.success) {
  console.log('SMS отправлена');
} else {
  console.error('Ошибка:', result.error);
}
```

### 2. Ручная отправка

```bash
curl -X POST http://localhost:8080/send-sms \
  -H "Authorization: Bearer your-key" \
  -d '{
    "phone": "+79991234567",
    "code": "456",
    "message": "Ваш код: 456"
  }'
```

---

## 🔧 Troubleshooting

### SMS не отправляется

1. **Проверьте баланс SIM-карты**
2. **Проверьте сигнал сети** на Samsung J3
3. **Проверьте логи:**
   ```bash
   # Server
   tail -f max-server/combined.log
   
   # Android
   tail -f ~/max-server/max-sms.log
   ```

### Токен устройства не работает

```bash
# Удалить старый токен
rm .device-token

# Перерегистрировать
node android-app.js
```

### Очередь сообщений растёт

1. **Проверьте подключение Android устройства**
2. **Перезапустите приложение:**
   ```bash
   pkill -f android-app.js
   node android-app.js
   ```

---

## 📞 Поддержка

**Проблемы с настройкой?**

1. Проверьте подключение к сети
2. Убедитесь, что порт 8080 открыт
3. Проверьте CORS настройки
4. Убедитесь, что Termux:SMS установлен

**Код не приходит?**

1. Проверьте логи сервера
2. Проверьте очередь сообщений
3. Проверьте статус Android устройства

---

## 🎯 Итоги

### Что реализовано

- ✅ Max Server (Node.js) на порту 8080
- ✅ Android App для Termux
- ✅ 3-значные коды
- ✅ Polling механизм (5 сек)
- ✅ Логирование
- ✅ Валидация номеров +7XXX
- ✅ Интеграция с Balloo API

### Преимущества

- **Быстрее** - 3 цифры вместо 6
- **Проще** - меньше ошибок ввода
- **Надёжнее** - ваша инфраструктура
- **Безопаснее** - нет Google/Apple

---

**NLP-Core-Team** - App Balloo Messenger  
*Max SMS System - Российское решение для SMS 2FA*

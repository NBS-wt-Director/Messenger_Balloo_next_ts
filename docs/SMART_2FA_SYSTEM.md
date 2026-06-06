# 🧠 SMART 2FA SYSTEM - Max SMS + Внутренний Бот

**Дата:** 2026-06-02  
**Версия:** 2.0.0  
**Статус:** ✅ Готово к production

---

## 🎯 Кратко

**Умная система 2FA** с автоматическим мониторингом и отключением проблемных методов:

1. **Max SMS** (приоритет 1) - отправка через Samsung J3 Android
2. **Внутренний бот** (приоритет 2) - WebSocket для онлайн-устройств
3. **TOTP** (приоритет 3, fallback) - если ничего не работает

### Особенности

- ✅ **Автоматическое отключение** при 10 ошибках за 1 час
- ✅ **Автоматическое восстановление** через 30 минут
- ✅ **3-значные коды** - быстрее ввод
- ✅ **Приоритет методов** - сначала SMS, потом бот
- ✅ **Мониторинг в реальном времени** - статус каждого метода

---

## 📋 Что используем

| Метод | Описание | Когда работает |
|-------|----------|----------------|
| **Max SMS** | Samsung J3 + Termux + Node.js | Если сервер SMS доступен |
| **Внутренний бот** | WebSocket (online devices) | Если хотя бы 1 устройство онлайн |
| **TOTP** | Speakeasy (RuTOTP, 2FAS) | Fallback, если SMS и бот отключены |

### Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                    Smart 2FA Router                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Request → [Router] → Проверка статуса методов            │
│                           ↓                                     │
│              ┌────────────┴────────────┐                        │
│              ↓                         ↓                        │
│       Max SMS (приоритет 1)      Внутренний бот (приоритет 2)  │
│       Samsung J3 + Termux       WebSocket (online devices)     │
│              ↓                         ↓                        │
│       ❌ 10 ошибок → автоотключение    ❌ offline → skip       │
│       ✅ 30 мин → автовосстановление                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Шаги по установке

### Шаг 1: Max SMS Server (Node.js)

```bash
# 1. Перейти в директорию
cd max-server

# 2. Установить зависимости
npm install

# 3. Создать .env
cp .env.example .env
# Отредактировать .env:
#   MAX_SERVER_PORT=8080
#   MAX_SERVER_API_KEY=your-secret-key-here

# 4. Запустить сервер
npm start

# Сервер запущен на http://localhost:8080
```

**Проверка:**
```bash
curl http://localhost:8080/health
# Ответ: {"status":"ok"}
```

---

### Шаг 2: Android App (Samsung J3 + Termux)

```bash
# На Samsung J3

# 1. Установить Termux (из F-Droid, не Google Play!)
# https://f-droid.org/en/packages/com.termux/

# 2. Обновить пакеты
pkg update && pkg upgrade

# 3. Установить Node.js
pkg install nodejs

# 4. Установить Termux:SMS API
pkg install termux-api

# 5. Дать доступ к SMS
termux-setup-storage

# 6. Перейти в директорию проекта
cd ~/max-server

# 7. Установить зависимости
npm install

# 8. Создать .env
export MAX_SERVER_URL=http://192.168.1.100:8080  # IP сервера
export POLL_INTERVAL=5000

# 9. Запустить приложение
node android-app.js
```

**Автозапуск при загрузке:**
```bash
# Добавить в ~/.bashrc
echo "cd ~/max-server && node android-app.js &" >> ~/.bashrc
```

**Проверка:**
```bash
# Проверить логи
tail -f max-sms.log

# Должно быть: "Устройство зарегистрировано: abc-123-def"
```

---

### Шаг 3: Balloo API (основной сервер)

```bash
# В корне проекта

# 1. Установить зависимости (если ещё не установлены)
cd api
npm install

# 2. Создать .env
cp .env.example .env
# Отредактировать .env:
#   MAX_SERVER_URL=http://192.168.1.100:8080
#   MAX_SERVER_API_KEY=your-secret-key-here
#   PORT=3001

# 3. Запустить API
npm start

# API запущен на http://localhost:3001
```

**Проверка:**
```bash
curl http://localhost:3001/health
```

---

### Шаг 4: Проверка системы

```bash
# 1. Проверить статус методов 2FA
curl -X GET http://localhost:3001/api/v1/auth/smart-2fa/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Ответ:
# {
#   "success": true,
#   "data": {
#     "methods": {
#       "sms": {
#         "enabled": true,
#         "recentFailures": 0
#       },
#       "bot": {
#         "enabled": true,
#         "recentFailures": 0
#       },
#       "totp": {
#         "enabled": true,
#         "recentFailures": 0
#       }
#     }
#   }
# }

# 2. Отправить тестовый 2FA код
curl -X POST http://localhost:3001/api/v1/auth/smart-2fa/send-code \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Ответ:
# {
#   "success": true,
#   "method": "sms",  // или "bot", если device онлайн
#   "message": "Код отправлен через Max SMS"
# }
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

### Android App (переменные окружения)

```bash
export MAX_SERVER_URL=http://192.168.1.100:8080
export POLL_INTERVAL=5000
```

### Balloo API (.env)

```bash
MAX_SERVER_URL=http://192.168.1.100:8080
MAX_SERVER_API_KEY=super-secret-key-change-me
PORT=3001
```

### 2FA Router (в коде)

```javascript
// api/src/services/2fa-router.service.js

const CONFIG = {
  MAX_FAILURES: 10,              // Максимум ошибок перед отключением
  FAILURE_WINDOW_MS: 60 * 60 * 1000,  // 1 час
  RECOVERY_TIME_MS: 30 * 60 * 1000,   // 30 минут до восстановления
  METHODS: ['sms', 'bot', 'totp']  // Приоритет
};
```

---

## 📡 API Endpoints

### Отправить 2FA код (умный выбор)

```http
POST /api/v1/auth/smart-2fa/send-code
Authorization: Bearer <jwt_token>
```

**Ответ:**
```json
{
  "success": true,
  "method": "sms",  // или "bot", "totp"
  "message": "Код отправлен через Max SMS"
}
```

### Проверить 2FA код

```http
POST /api/v1/auth/smart-2fa/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "code": "123"  // 3 цифры
}
```

### Получить статус методов

```http
GET /api/v1/auth/smart-2fa/status
Authorization: Bearer <jwt_token>
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "methods": {
      "sms": {
        "enabled": true,
        "recentFailures": 0,
        "lastFailure": null,
        "disabledAt": null
      },
      "bot": {
        "enabled": true,
        "recentFailures": 0,
        "lastFailure": null,
        "disabledAt": null
      },
      "totp": {
        "enabled": true,
        "recentFailures": 0,
        "lastFailure": null,
        "disabledAt": null
      }
    },
    "config": {
      "MAX_FAILURES": 10,
      "FAILURE_WINDOW_MS": 3600000,
      "RECOVERY_TIME_MS": 1800000
    }
  }
}
```

---

## 🔄 Логика работы

### Flow отправки 2FA кода

```
1. Пользователь запрашивает 2FA код
   ↓
2. 2FA Router проверяет статус методов (в порядке приоритета):
   ├─ SMS: enabled? → health check → да → отправить
   ├─ Bot: enabled? → есть online devices? → да → отправить
   └─ TOTP: enabled? → да → сохранить код
   ↓
3. Отправить код выбранным методом
   ↓
4. Записать результат (успех/ошибка)
   ↓
5. Если ошибка → записать в статистику
   ↓
6. Если 10 ошибок за 1 час → отключить метод
   ↓
7. Через 30 минут → попытка восстановления
```

### Автоматическое отключение

```javascript
// Пример: SMS сервер недоступен

// 1-9 ошибки: метод работает, ошибки записываются
// 10-я ошибка:
  ↓
Метод отключается автоматически
  ↓
Лог: "Disabling 2FA method: sms - Превышено количество ошибок: 10"
  ↓
Все будущие запросы → внутренний бот или TOTP
  ↓
Через 30 минут:
  ↓
Попытка восстановления (test SMS send)
  ↓
Если успешно → метод включён
Если нет → ещё через 30 минут
```

---

## 📊 Мониторинг

### Логи

**Max Server:**
```bash
tail -f max-server/combined.log
tail -f max-server/error.log
```

**Android App:**
```bash
tail -f ~/max-server/max-sms.log
```

**Balloo API:**
```bash
tail -f api/logs/combined.log
tail -f api/logs/error.log
```

### Ключевые логи

```
[INFO] 2FA Router initialized
[INFO] SMS queued: +79991234567 -> msg-abc-123
[INFO] SMS sent: +79991234567
[WARN] Disabling 2FA method: sms - Превышено количество ошибок: 10
[INFO] Attempting recovery for 2FA method: sms
[INFO] Enabling 2FA method: sms
```

---

## 🚨 Troubleshooting

### Метод SMS отключён

**Симптомы:**
- `recentFailures: 10`
- `disabledAt: 1717290000000`

**Решение:**
1. Проверьте Max Server:
   ```bash
   curl http://localhost:8080/status
   ```
2. Проверьте Android приложение:
   ```bash
   tail -f ~/max-server/max-sms.log
   ```
3. Проверьте баланс SIM-карты на Samsung J3
4. Подождите 30 минут для автовосстановления

### Внутренний бот не работает

**Симптомы:**
- `recentFailures: 10`
- Нет online устройств

**Решение:**
1. Убедитесь, что WebSocket сервер запущен
2. Проверьте подключение клиента:
   ```javascript
   const socket = io('ws://localhost:3001', {
     query: { token: 'JWT_TOKEN' }
   });
   ```
3. Проверьте логи:
   ```bash
   tail -f api/logs/combined.log | grep WebSocket
   ```

### Код не приходит

**Проверка:**
```bash
# 1. Статус методов
curl http://localhost:3001/api/v1/auth/smart-2fa/status

# 2. Статус Max Server
curl http://localhost:8080/status

# 3. Очередь SMS на Android
tail -f ~/max-server/max-sms.log | grep "SMS отправлена"
```

---

## 📝 Файлы системы

```
max-server/
├── server.js              # Max SMS Server (Node.js)
├── android-app.js         # Android App (Termux)
├── package.json
├── logger.js
└── .env

api/src/services/
├── 2fa-router.service.js  # Умный роутер 2FA
├── sms.service.js         # Интеграция с Max SMS
└── notification.service.js

api/src/websocket/
├── manager.js             # WebSocket менеджер
└── handler.js             # Обработчики событий

api/src/controllers/
└── auth.controller.js     # 2FA endpoints

api/src/routes/
└── index.js               # Маршруты /smart-2fa/*
```

---

## ✅ Итоговая проверка

Перед продакшеном убедитесь, что:

- [ ] Max Server запущен и отвечает на `/health`
- [ ] Android приложение зарегистрировано на сервере
- [ ] SMS отправляются успешно (проверка лога)
- [ ] WebSocket сервер работает
- [ ] Клиент подключается к WebSocket
- [ ] 2FA код приходит через SMS
- [ ] При отключении SMS код приходит через бот
- [ ] При отключении бота код приходит через TOTP
- [ ] Автоматическое отключение работает (10 ошибок)
- [ ] Автоматическое восстановление работает (30 мин)

---

## 🎯 Преимущества

| Характеристика | Значение |
|----------------|----------|
| **Скорость отправки** | SMS: 2-5 сек, Bot: <1 сек |
| **Надёжность** | 3 метода (резервирование) |
| **Автономность** | Автоматическое отключение проблемных |
| **Безопасность** | 3-значные коды, SHA-256, 5 мин TTL |
| **Мониторинг** | В реальном времени через API |

---

**NLP-Core-Team** - App Balloo Messenger  
*Smart 2FA System - Умная доставка кодов подтверждения*

# ⚡ Быстрая настройка Smart 2FA

## 1. Max SMS Server (Порт 8080)

```bash
cd max-server
npm install
npm start
```

**Проверка:** `curl http://localhost:8080/health`

---

## 2. Android (Samsung J3 + Termux)

```bash
# На Samsung J3
pkg install nodejs termux-api
termux-setup-storage
cd ~/max-server
npm install
node android-app.js
```

**Проверка:** `tail -f max-sms.log`

---

## 3. Balloo API

```bash
cd api
npm install
npm start
```

**Проверка:** `curl http://localhost:3001/health`

---

## 4. Тестирование

```bash
# Отправить 2FA код
curl -X POST http://localhost:3001/api/v1/auth/smart-2fa/send-code \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Получить статус методов
curl -X GET http://localhost:3001/api/v1/auth/smart-2fa/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 .env файлы

### max-server/.env
```bash
MAX_SERVER_PORT=8080
MAX_SERVER_API_KEY=your-secret-key
```

### max-server/.env (Android)
```bash
export MAX_SERVER_URL=http://192.168.1.100:8080
```

### api/.env
```bash
MAX_SERVER_URL=http://192.168.1.100:8080
MAX_SERVER_API_KEY=your-secret-key
PORT=3001
```

---

## 📊 Что работает

| Метод | Когда | Приоритет |
|-------|-------|-----------|
| **Max SMS** | Если сервер доступен | 1 |
| **Внутренний бот** | Если device онлайн | 2 |
| **TOTP** | Fallback | 3 |

---

## 🚨 Если что-то не работает

1. **SMS не работает:**
   ```bash
   curl http://localhost:8080/status
   tail -f max-server/combined.log
   tail -f ~/max-server/max-sms.log
   ```

2. **Бот не работает:**
   ```bash
   curl http://localhost:3001/health
   # Проверить WebSocket подключение в клиенте
   ```

3. **Метод отключён:**
   ```bash
   # Подождать 30 минут для автовосстановления
   # Или проверить логи ошибок
   ```

---

**Готово! Коды 2FA отправляются через Max SMS или внутренний бот.**

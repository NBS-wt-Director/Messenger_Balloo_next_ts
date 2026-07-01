# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: SMS ADMIN ANDROID & ECOSYSTEM MANAGER

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Ecosystem Manager  
**Версия:** 1.0.0  
**Стек:** Android (Java/Kotlin) + Node.js Backend  
**Порт:** 8080 (Max Server)  
**Docker Image:** app_balloo-max-server  
**Статус:** ✅ Работает, подключено к API

## 2. АРХИТЕКТУРА

### 2.1 Компоненты системы

#### 2.1.1 Max SMS Server (Backend)
- **Язык:** Node.js
- **Фреймворк:** Express.js
- **Порт:** 8080
- **Хранение:** In-memory (Map/Set)
- **Статус:** ✅ Работает

#### 2.1.2 Android SMS App (Client)
- **Язык:** Java
- **Framework:** Android SDK
- **API Level:** 21+ (Android 5.0+)
- **Статус:** ⚠️ Требуется реализация

#### 2.1.3 Ecosystem Manager (Admin Panel)
- **Язык:** Node.js
- **Функция:** Управление узлами
- **Статус:** ⚠️ Требуется реализация

### 2.2 Структура проекта
```
max-server/
├── src/
│   ├── server.js              # Express server
│   ├── logger.js              # Winston logger
│   ├── android-app.js         # Android API wrapper
│   └── ecosystem-manager.js   # Управление узлами
├── Dockerfile
├── package.json
└── README.md

android-service/
├── src/
│   ├── MainActivity.java      # Главный activity
│   ├── SmsService.java        # Сервис SMS
│   ├── DeviceManager.java     # Управление устройством
│   └── ApiClient.java         # API клиент
├── build.gradle
└── AndroidManifest.xml

sms-admin/
├── src/
│   ├── admin-panel.js         # Панель админа
│   └── node-manager.js        # Управление узлами
└── package.json
```

## 3. MAX SMS SERVER API

### 3.1 Endpoints

#### 3.1.1 Health Check
- **GET** `/health`
- **Response:** `{"status":"ok"}`
- **Статус:** ✅ Реализовано

#### 3.1.2 Device Registration
- **POST** `/device/register`
- **Body:**
  ```json
  {
    "deviceName": "Samsung J3",
    "deviceModel": "SM-J330F",
    "androidVersion": "9"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "deviceToken": "uuid-here",
    "message": "Устройство успешно зарегистрировано"
  }
  ```
- **Статус:** ✅ Реализовано

#### 3.1.3 Send SMS
- **POST** `/send-sms`
- **Headers:** `Authorization: Bearer <API_KEY>`
- **Body:**
  ```json
  {
    "phone": "+79991234567",
    "code": "123",
    "message": "Balloo: Ваш код: 123",
    "priority": "normal"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "messageId": "uuid-here",
    "status": "queued",
    "message": "SMS поставлено в очередь"
  }
  ```
- **Статус:** ✅ Реализовано

#### 3.1.4 SMS Status
- **GET** `/status/:messageId`
- **Headers:** `Authorization: Bearer <API_KEY>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "messageId": "uuid",
      "phone": "+79991234567",
      "status": "sent",
      "createdAt": 1234567890
    }
  }
  ```
- **Статус:** ✅ Реализовано

#### 3.1.5 Confirm Sent
- **POST** `/confirm-sent`
- **Headers:** `Authorization: Bearer <API_KEY>`
- **Body:**
  ```json
  {
    "messageId": "uuid",
    "deviceToken": "device-uuid",
    "success": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "SMS отправлена"
  }
  ```
- **Статус:** ✅ Реализовано

#### 3.1.6 Get Queue
- **GET** `/queue/:deviceToken`
- **Response:**
  ```json
  {
    "success": true,
    "queue": [
      {
        "messageId": "uuid",
        "phone": "+79991234567",
        "code": "123",
        "message": "Balloo: Ваш код: 123",
        "priority": "normal",
        "createdAt": 1234567890
      }
    ],
    "count": 1
  }
  ```
- **Статус:** ✅ Реализовано

#### 3.1.7 Server Status
- **GET** `/status`
- **Response:**
  ```json
  {
    "success": true,
    "status": "online",
    "uptime": 3600,
    "pendingMessages": 5,
    "activeDevices": 3,
    "timestamp": 1234567890
  }
  ```
- **Статус:** ✅ Реализовано

### 3.2 Middleware

#### 3.2.1 Authentication
- **Header:** `Authorization: Bearer <API_KEY>`
- **API Key:** из переменной MAX_SERVER_API_KEY
- **Статус:** ✅ Реализовано

#### 3.2.2 Validation
- **Phone:** regex `^\+7\d{10}$`
- **Code:** regex `^\d{3}$`
- **Message:** optional, default "Balloo: Ваш код: {code}"
- **Priority:** "normal" | "high"
- **Статус:** ✅ Реализовано

## 4. ANDROID APP

### 4.1 MainActivity

**Файл:** `android-service/src/MainActivity.java`

**Элементы:**
- **Layout:** LinearLayout (vertical)
- **Background:** #FFFFFF
- **Padding:** 16dp

**Элементы UI:**
1. **Logo:**
   - Width: 120dp
   - Height: 120dp
   - src: @drawable/ic_balloo_logo
   - margin: 32dp auto

2. **Title:**
   - text: "Balloo SMS"
   - textSize: 24sp
   - textColor: #4F46E5
   - gravity: center

3. **Status Text:**
   - text: "Статус: Offline"
   - textSize: 16sp
   - textColor: #6B7280
   - id: tv_status

4. **Device Info:**
   - text: "Устройство: Samsung J3"
   - textSize: 14sp
   - textColor: #9CA3AF
   - id: tv_device_info

5. **Queue Count:**
   - text: "В очереди: 0"
   - textSize: 14sp
   - textColor: #9CA3AF
   - id: tv_queue_count

6. **Refresh Button:**
   - text: "Обновить"
   - textSize: 16sp
   - background: #4F46E5
   - textColor: #FFFFFF
   - padding: 12dp
   - id: btn_refresh

7. **Settings Button:**
   - text: "Настройки"
   - textSize: 16sp
   - background: #E5E7EB
   - textColor: #1F2937
   - padding: 12dp
   - id: btn_settings

**Логика:**
1. При запуске: регистрация устройства
2. Запуск Service для polling
3. Отображение очереди
4. Отправка подтверждения

### 4.2 SmsService

**Файл:** `android-service/src/SmsService.java`

**Функции:**
1. **Polling:**
   - Интервал: 5 секунд
   - URL: `http://<max-server>:8080/queue/<deviceToken>`
   - Авторизация: Bearer token
   - Parse response
   - Обновить UI

2. **Send SMS:**
   - Permission: SEND_SMS
   - Phone: из очереди
   - Message: из очереди
   - Android SmsManager
   - Confirm via API

3. **Confirm:**
   - URL: `http://<max-server>:8080/confirm-sent`
   - Body: { messageId, deviceToken, success }
   - Update local queue

### 4.3 DeviceManager

**Файл:** `android-service/src/DeviceManager.java`

**Функции:**
1. **Get Device Info:**
   - Device Name: Build.DEVICE
   - Device Model: Build.MODEL
   - Android Version: Build.VERSION.RELEASE
   - IMEI: TelephonyManager.getImei()

2. **Register Device:**
   - URL: `http://<max-server>:8080/device/register`
   - Body: { deviceName, deviceModel, androidVersion }
   - Save deviceToken

3. **Check Connection:**
   - Ping max-server
   - Update status UI

### 4.4 ApiClient

**Файл:** `android-service/src/ApiClient.java`

**Функции:**
1. **Request:**
   - Library: OkHttp
   - Base URL: из настроек
   - Timeout: 10 секунд
   - Retry: 3 раза

2. **Methods:**
   - POST /device/register
   - GET /queue/{deviceToken}
   - POST /confirm-sent

## 5. ECOSYSTEM MANAGER

### 5.1 Функции

#### 5.1.1 Управление узлами
- **Включить/Выключить:** каждый узел отдельно
- **Глобальные настройки:** для всех узлов
- **Чтение документации:** для каждого узла

#### 5.1.2 Узлы системы
1. **API:** порт 3001
2. **Messenger:** порт 3000
3. **Admin Portal:** порт 3002
4. **Max Server:** порт 8080
5. **PostgreSQL:** порт 5432
6. **PgBouncer:** порт 6432
7. **Redis:** порт 6379

### 5.2 API Endpoints

#### 5.2.1 Node Management
- **GET** `/api/v1/ecosystem/nodes` - Список узлов
- **POST** `/api/v1/ecosystem/nodes/:id/start` - Запустить
- **POST** `/api/v1/ecosystem/nodes/:id/stop` - Остановить
- **PUT** `/api/v1/ecosystem/nodes/:id/config` - Настройки
- **GET** `/api/v1/ecosystem/nodes/:id/logs` - Логи

#### 5.2.2 Global Settings
- **GET** `/api/v1/ecosystem/settings` - Глобальные настройки
- **PUT** `/api/v1/ecosystem/settings` - Обновить настройки
- **GET** `/api/v1/ecosystem/docs` - Документация

#### 5.2.3 Documentation
- **GET** `/api/v1/ecosystem/docs/:node` - Документация узла

### 5.3 UI Components

#### 5.3.1 Node Card
```
┌─────────────────────────────────────────┐
│  🟢 API (3001)                          │
│  Status: Running                        │
│  Uptime: 24h 15m                        │
│  [Start] [Stop] [Config] [Logs] [Docs] │
└─────────────────────────────────────────┘
```

**Элементы:**
- **Icon:** 🟢 (green) / 🟡 (yellow) / 🔴 (red)
- **Name:** 16px, bold
- **Port:** 14px
- **Status:** 12px
- **Uptime:** 12px
- **Buttons:**
  - Start: green background
  - Stop: red background
  - Config: blue background
  - Logs: gray background
  - Docs: purple background

#### 5.3.2 Settings Modal
- **Title:** "Настройки узла"
- **Fields:**
  - Environment variables (key-value)
  - Resource limits (CPU, RAM)
  - Restart policy
- **Buttons:**
  - Save
  - Cancel

#### 5.3.3 Logs Viewer
- **Text Area:** monospace font
- **Auto-scroll:** enabled
- **Filter:** by level (info, warn, error)
- **Export:** to file

## 6. КОНФИГУРАЦИЯ

### 6.1 Переменные окружения
```bash
MAX_SERVER_PORT=8080
MAX_SERVER_API_KEY=<ключ>
LOG_LEVEL=info
```

### 6.2 Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 7. БЕЗОПАСНОСТЬ

### 7.1 API Key
- Генерация: uuid v4
- Хранение: переменная окружения
- Передача: Authorization header

### 7.2 Rate Limiting
- Device Register: 5/hour
- Send SMS: 10/hour
- Confirm: 20/hour

## 8. МОНИТОРИНГ

### 8.1 Health Check
- **Endpoint:** /health
- **Interval:** 30 секунд
- **Timeout:** 3 секунды

### 8.2 Metrics
- Pending messages
- Active devices
- Sent messages
- Failed messages

---

**Статус:** ✅ Max Server работает, Android App требует реализации  
**Последнее обновление:** 2026-06-23

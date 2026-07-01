# 📋 Техническое задание: SMS Admin + Node Manager

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** SMS Admin Android + Ecosystem Node Manager  
**Версия:** 1.0.0  
**Платформа:** Android (Kotlin/Java) + Node.js (Node Manager)  
**Назначение:** Управление SMS gateway и узлами экосистемы  

## 2. SMS ADMIN ANDROID

### 2.1 Описание
Мобильное приложение для администраторов SMS gateway (Max Server).

### 2.2 Функционал
- Мониторинг SMS статусов (sent/delivered/failed)
- Управление балансом SMS
- Блокировка/разблокировка номеров
- Просмотр логов SMS
- Настройки SMS gateway
- Статистика отправки (daily/weekly/monthly)

### 2.3 Архитектура
```
android-sms-node/
├── src/
│   ├── MainActivity.kt
│   ├── sms/
│   │   ├── SmsDashboard.kt
│   │   ├── SmsStats.kt
│   │   ├── SmsLogs.kt
│   │   └── SmsSettings.kt
│   ├── api/
│   │   └── ApiService.kt
│   └── utils/
│       └── AuthManager.kt
├── res/
│   └── layout/
└── build.gradle
```

### 2.4 API Интеграция
```kotlin
// ApiService.kt
interface ApiService {
    @GET("/api/v1/sms/stats")
    suspend fun getSmsStats(): Response<SmsStats>
    
    @GET("/api/v1/sms/logs")
    suspend fun getSmsLogs(@Query("limit") limit: Int): Response<List<SmsLog>>
    
    @POST("/api/v1/sms/block/{number}")
    suspend fun blockNumber(@Path("number") number: String): Response<Unit>
}
```

## 3. NODE MANAGER (Единый узел управления)

### 3.1 Описание
Централизованная панель управления всеми узлами экосистемы Balloo.

### 3.2 Управление узлами
```
/node-manager/
├── Dashboard.tsx          # Общий статус всех узлов
├── Nodes.tsx              # Список узлов
├── NodeSettings.tsx       # Настройки каждого узла
├── NodeLogs.tsx           # Логи узлов
└── NodeActions.tsx        # Старт/стоп/перезапуск
```

### 3.3 Узлы экосистемы
1. **API Server** (port 3001)
   - Статус (running/stopped/error)
   - CPU/Memory usage
   - Restart button
   - Logs viewer
   - Environment variables

2. **Messenger** (port 3000)
   - Статус
   - Active users count
   - Restart button
   - Build status

3. **Admin Portal** (port 3002)
   - Статус
   - Admin count
   - Restart button

4. **PostgreSQL** (port 5432)
   - Статус
   - Database size
   - Connection pool
   - Backup/restore

5. **Redis** (port 6379)
   - Статус
   - Memory usage
   - Keys count
   - Clear cache

6. **PgBouncer** (port 6432)
   - Статус
   - Connection count
   - Pool stats

7. **Max Server** (port 8080)
   - Статус
   - SMS balance
   - Queue length

### 3.4 Функции управления
```typescript
interface NodeManager {
  // Статус
  getStatus(): Promise<NodeStatus[]>;
  getHealth(nodeId: string): Promise<HealthCheck>;
  
  // Управление
  startNode(nodeId: string): Promise<void>;
  stopNode(nodeId: string): Promise<void>;
  restartNode(nodeId: string): Promise<void>;
  
  // Настройки
  updateConfig(nodeId: string, config: object): Promise<void>;
  getEnv(nodeId: string): Promise<EnvVars>;
  updateEnv(nodeId: string, vars: object): Promise<void>;
  
  // Логи
  getLogs(nodeId: string, lines?: number): Promise<string[]>;
  followLogs(nodeId: string): AsyncIterable<string>;
  
  // Глобальные действия
  startAll(): Promise<void>;
  stopAll(): Promise<void>;
  restartAll(): Promise<void>;
  backupAll(): Promise<void>;
}
```

### 3.5 UI Компоненты
```typescript
// components/NodeCard.tsx
function NodeCard({ node }) {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between">
        <h3>{node.name}</h3>
        <StatusBadge status={node.status} />
      </div>
      <div className="mt-2">
        <span>CPU: {node.cpu}%</span>
        <span>Memory: {node.memory}MB</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => startNode(node.id)}>Start</button>
        <button onClick={() => restartNode(node.id)}>Restart</button>
        <button onClick={() => stopNode(node.id)}>Stop</button>
        <button onClick={() => showLogs(node.id)}>Logs</button>
        <button onClick={() => showSettings(node.id)}>Settings</button>
      </div>
    </div>
  );
}

// components/NodeSettings.tsx
function NodeSettings({ node }) {
  const [env, setEnv] = useState(node.env);
  
  return (
    <div className="p-4">
      <h2>Settings: {node.name}</h2>
      {Object.entries(env).map(([key, value]) => (
        <div key={key} className="mb-2">
          <label>{key}</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setEnv({...env, [key]: e.target.value})}
          />
        </div>
      ))}
      <button onClick={() => updateEnv(node.id, env)}>Save</button>
    </div>
  );
}
```

## 4. API ДЛЯ NODE MANAGER

### 4.1 Endpoints
```
GET    /api/v1/admin/manager/status    # Статус всех узлов
GET    /api/v1/admin/manager/health/:id # Health check узла
POST   /api/v1/admin/manager/start/:id  # Запустить узел
POST   /api/v1/admin/manager/stop/:id   # Остановить узел
POST   /api/v1/admin/manager/restart/:id # Перезапустить узел
GET    /api/v1/admin/manager/logs/:id   # Логи узла
POST   /api/v1/admin/manager/config/:id # Обновить конфиг
GET    /api/v1/admin/manager/env/:id    # Переменные окружения
POST   /api/v1/admin/manager/env/:id    # Обновить env vars
POST   /api/v1/admin/manager/start-all  # Запустить все
POST   /api/v1/admin/manager/stop-all   # Остановить все
POST   /api/v1/admin/manager/backup     # Создать бэкап
```

### 4.2 Реализация (Node.js)
```javascript
// services/nodeManager.js
const { exec } = require('child_process');
const docker = require('dockerode')();

async function restartNode(nodeId) {
  const container = docker.getContainer(nodeId);
  await container.restart();
  return { status: 'restarted' };
}

async function getNodeLogs(nodeId, lines = 100) {
  const container = docker.getContainer(nodeId);
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail: lines,
  });
  return logs.toString();
}

async function updateEnv(nodeId, envVars) {
  // Stop container
  const container = docker.getContainer(nodeId);
  await container.stop();
  
  // Update docker-compose env (not recommended for prod)
  // Better: use Docker secrets or external env file
  
  // Restart with new env
  await container.start();
  return { status: 'updated' };
}
```

## 5. БЕЗОПАСНОСТЬ

- Только для администраторов
- JWT с admin role
- IP whitelist (опционально)
- Audit log всех действий
- 2FA обязательна
- Rate limiting (строгий)

## 6. ТЕКУЩИЙ СТАТУС

✅ **Реализовано:**
- API endpoints (частично)
- Docker infrastructure

⚠️ **Частично:**
- Node Manager API (структура)
- Basic health checks

❌ **Не реализовано:**
- Android SMS Admin app
- Full Node Manager UI
- Docker API integration
- Real-time monitoring
- Backup automation

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0

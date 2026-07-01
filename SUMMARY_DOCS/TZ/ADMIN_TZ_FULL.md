# 📋 Техническое задание: Admin Portal

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** App Balloo Admin Portal  
**Версия:** 1.0.0  
**Фреймворк:** Next.js 15 (App Router)  
**Язык:** TypeScript  
**UI:** React 19 + Tailwind CSS 3  
**Доступ:** Только администраторы (JWT admin role)  

## 2. АРХИТЕКТУРА

### 2.1 Структура
```
admin-portal/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── users/     # Управление пользователями
│   │   │   ├── chats/     # Мониторинг чатов
│   │   │   ├── stats/     # Статистика
│   │   │   ├── logs/      # Логи системы
│   │   │   ├── config/    # Глобальные настройки
│   │   │   └── backup/    # Бэкапы
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── UserTable.tsx
│   │   ├── StatsCard.tsx
│   │   └── LogViewer.tsx
│   └── lib/
│       └── adminApi.ts
├── Dockerfile
└── package.json
```

### 2.2 Порты
- **Dev:** 3002
- **Prod:** 3002

## 3. ФУНКЦИОНАЛ

### 3.1 Дашборд `/admin/dashboard`
- Общая статистика (users, chats, messages, active today)
- Графики активности (Chart.js / Recharts)
- Последние события
- Система уведомлений

### 3.2 Управление пользователями `/admin/users`
- Таблица пользователей (id, username, email, status, created)
- Поиск по username/email
- Фильтры (active/banned/deleted)
- Действия:
  - Заблокировать/разблокировать
  - Сбросить пароль
  - Удалить пользователя
  - Назначить роль (moderator/admin)
- Просмотр профиля пользователя
- История действий пользователя

### 3.3 Мониторинг чатов `/admin/chats`
- Список всех чатов
- Фильтры по типу (private/group)
- Статистика чата (messages count, participants)
- Просмотр содержимого (только для moderation)
- Удаление чата
- Бан участников

### 3.4 Статистика `/admin/stats`
- Active users (daily/weekly/monthly)
- Messages sent/received
- Top active users
- Top active chats
- File storage usage
- API request rate
- Error rate

### 3.5 Логи системы `/admin/logs`
- Системные логи (error/warn/info)
- Логи административных действий
- Фильтры по уровню и дате
- Поиск по action
- Экспорт логов (CSV/JSON)

### 3.6 Глобальные настройки `/admin/config`
- Настройки системы:
  - Регистрация включена/отключена
  - Макс. сообщений в минуту (rate limit)
  - Макс. размер файла
  - Настройки email
  - Настройки SMS
  - Настройки Yandex OAuth
- Переменные окружения (только для чтения)
- Применение настроек (restart required)

### 3.7 Бэкапы `/admin/backup`
- Создать бэкап БД
- Список бэкапов
- Скачать бэкап
- Удалить бэкап
- Автоматический бэкап (cron)

## 4. API ИНТЕГРАЦИЯ

### 4.1 Admin API Endpoints
```typescript
const adminApi = {
  // Users
  getUsers: () => fetch('/api/v1/admin/users'),
  banUser: (id, reason) => fetch(`/api/v1/admin/users/${id}/ban`, { method: 'POST' }),
  resetPassword: (id, password) => fetch(`/api/v1/admin/users/${id}/reset-password`, { method: 'POST' }),
  deleteUser: (id) => fetch(`/api/v1/admin/users/${id}`, { method: 'DELETE' }),
  
  // Stats
  getStats: () => fetch('/api/v1/admin/stats'),
  
  // Logs
  getLogs: (level, date) => fetch(`/api/v1/admin/logs?level=${level}&date=${date}`),
  
  // Config
  getConfig: () => fetch('/api/v1/admin/config'),
  updateConfig: (config) => fetch('/api/v1/admin/config', { method: 'POST' }),
  
  // Backup
  createBackup: () => fetch('/api/v1/admin/backup', { method: 'POST' }),
  listBackups: () => fetch('/api/v1/admin/backup'),
  downloadBackup: (id) => fetch(`/api/v1/admin/backup/${id}`),
  deleteBackup: (id) => fetch(`/api/v1/admin/backup/${id}`, { method: 'DELETE' }),
};
```

### 4.2 Авторизация
```typescript
// Middleware
function requireAdmin(req, res, next) {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
```

## 5. КОМПОНЕНТЫ

### 5.1 Dashboard
```typescript
// components/Dashboard.tsx
interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminApi.getStats().then(setStats);
  }, []);
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatsCard title="Users" value={stats.totalUsers} change={+5} />
      <StatsCard title="Chats" value={stats.totalChats} />
      <StatsCard title="Messages" value={stats.totalMessages} />
      <StatsCard title="Active Today" value={stats.activeUsers} change={+12} />
    </div>
  );
}
```

### 5.2 UserTable
```typescript
// components/UserTable.tsx
function UserTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  const filteredUsers = users.filter(u => 
    u.username.includes(search) || u.email.includes(search)
  );
  
  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <StatusBadge status={user.status} />
            </td>
            <td>
              <button onClick={() => banUser(user.id)}>Ban</button>
              <button onClick={() => resetPassword(user.id)}>Reset PW</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 5.3 LogViewer
```typescript
// components/LogViewer.tsx
function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="font-mono bg-black text-green-400 p-4">
      {logs.map((log, i) => (
        <div key={i} className="mb-1">
          <span className="text-gray-500">{log.timestamp}</span>
          <span className={`ml-2 ${log.level === 'error' ? 'text-red-500' : ''}`}>
            [{log.level.toUpperCase()}]
          </span>
          <span className="ml-2">{log.message}</span>
        </div>
      ))}
    </div>
  );
}
```

## 6. БЕЗОПАСНОСТЬ

- JWT с role: 'admin'
- IP whitelist (опционально)
- Rate limiting (строже чем для обычных пользователей)
- Audit logs (все действия админа логируются)
- 2FA для админов (обязательно)
- Session timeout (15 минут)

## 7. DOCKER

### 7.1 Dockerfile
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3002
CMD ["node", "server.js"]
```

### 7.2 docker-compose.yml (фрагмент)
```yaml
admin-portal:
  build: ./admin-portal
  ports:
    - "3002:3002"
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=http://api:3001
  depends_on:
    - api
  networks:
    - balloo-network
```

## 8. ТЕКУЩИЙ СТАТУС

✅ **Реализовано:**
- Docker build готов
- API endpoints (admin routes)
- Middleware auth

⚠️ **Частично:**
- Next.js app (структура)
- Basic components

❌ **Не реализовано:**
- Full admin UI
- Charts/Graphs
- Log viewer
- Config management UI
- Backup management UI

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0

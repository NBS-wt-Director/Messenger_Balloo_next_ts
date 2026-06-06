# Админка - Добавленные функции и API

## 📊 Итоговая статистика

| Категория | Эндпоинтов | Статус |
|-----------|------------|--------|
| **Пользователи** | 13 | ✅ Готово |
| **Чаты** | 3 | ✅ Готово |
| **Сообщения** | 2 | ✅ Готово |
| **Записи звонков** | 2 | ✅ Готово |
| **Отчёты** | 2 | ✅ Готово |
| **Версии** | 4 | ✅ Готово |
| **Аналитика** | 2 | ✅ Готово |
| **Итого** | **28** | ✅ **Все готовы** |

---

## 🎯 Функции админки (полный список)

### 1. Дашборд и аналитика
- [x] Общая статистика (пользователи, чаты, сообщения, админы)
- [x] Активные пользователи за сегодня
- [x] Новые пользователи за сегодня
- [x] Системная информация (Node.js, платформа, uptime)
- [x] Статистика по периодам (day/week/month)

### 2. Управление пользователями
- [x] Список пользователей с пагинацией
- [x] Поиск пользователей (email, displayName)
- [x] Фильтр по роли (admin/super-admin)
- [x] Просмотр деталей пользователя
- [x] Изменить роль (admin/super-admin/adminRoles)
- [x] Заблокировать пользователя
- [x] Сбросить пароль пользователя
- [x] Просмотр сессий пользователя
- [x] Завершить сессию пользователя
- [x] Завершить все сессии пользователя
- [x] Просмотр устройств пользователя
- [x] Удалить устройство пользователя
- [x] Просмотр E2E ключей пользователя
- [x] Удалить E2E ключ пользователя

### 3. Управление чатами
- [x] Список чатов с пагинацией
- [x] Фильтр по типу (private/group)
- [x] Просмотр деталей чата (участники, роли, статистика)
- [x] Удалить чат (с всеми сообщениями)

### 4. Управление сообщениями
- [x] Поиск сообщений (по тексту, пользователю, чату)
- [x] Удалить сообщение

### 5. Записи звонков
- [x] Информация о записях (количество, размер)
- [x] Очистка старых записей (по дням)

### 6. Отчёты и модерация
- [x] Список отчётов с фильтрами
- [x] Обработка отчётов (изменить статус, резолюция)

### 7. Управление версиями приложений
- [x] Список версий
- [x] Добавить версию
- [x] Обновить версию
- [x] Удалить версию
- [x] Force update

---

## 🔌 API Endpoints (полный список)

### Пользователи (`/api/v1/admin/users/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/users` | Список пользователей |
| `GET` | `/users/:userId` | Информация о пользователе |
| `PUT` | `/users/:userId/role` | Изменить роль |
| `DELETE` | `/users/:userId` | Заблокировать пользователя |
| `POST` | `/users/:userId/reset-password` | Сбросить пароль |
| `GET` | `/users/:userId/sessions` | Сессии пользователя |
| `DELETE` | `/users/:userId/sessions/:sessionId` | Завершить сессию |
| `DELETE` | `/users/:userId/sessions` | Завершить все сессии |
| `GET` | `/users/:userId/devices` | Устройства пользователя |
| `DELETE` | `/users/:userId/devices/:deviceId` | Удалить устройство |
| `GET` | `/users/:userId/e2e-keys` | E2E ключи пользователя |
| `DELETE` | `/users/:userId/e2e-keys/:keyId` | Удалить E2E ключ |
| `GET` | `/users/stats` | Статистика по периодам |

### Чаты (`/api/v1/admin/chats/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/chats` | Список чатов |
| `GET` | `/chats/:chatId` | Детали чата |
| `DELETE` | `/chats/:chatId` | Удалить чат |

### Сообщения (`/api/v1/admin/messages/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/messages/search` | Поиск сообщений |
| `DELETE` | `/messages/:messageId` | Удалить сообщение |

### Записи звонков (`/api/v1/admin/recordings/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/recordings/info` | Информация о записях |
| `POST` | `/recordings/cleanup` | Очистить старые записи |

### Отчёты (`/api/v1/admin/reports/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/reports` | Список отчётов |
| `PUT` | `/reports/:reportId` | Обработать отчёт |

### Версии (`/api/v1/admin/versions/*`)

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/versions` | Список версий |
| `POST` | `/versions` | Добавить версию |
| `PUT` | `/versions/:versionId` | Обновить версию |
| `DELETE` | `/versions/:versionId` | Удалить версию |

### Аналитика и система

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| `GET` | `/analytics` | Аналитика |
| `GET` | `/system` | Системная информация |

---

## 🔒 Роли и права доступа

### Admin
- Просмотр пользователей, чатов, отчётов
- Просмотр аналитики
- Обработка отчётов
- **НЕ может:** управлять правами других админов, назначать super-admin

### Super-admin
- Все права admin
- Управление правами других админов
- Назначение super-admin
- Сброс паролей всех пользователей
- Удаление пользователей

---

## 📋 Примеры использования

### Получить список пользователей с фильтрами
```bash
curl -X GET "http://localhost:3001/api/v1/admin/users?search=admin&isAdmin=true&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

### Сбросить пароль пользователя (сгенерировать случайный)
```bash
curl -X POST "http://localhost:3001/api/v1/admin/users/user-id/reset-password" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### Завершить все сессии пользователя
```bash
curl -X DELETE "http://localhost:3001/api/v1/admin/users/user-id/sessions" \
  -H "Authorization: Bearer <admin_token>"
```

### Удалить чат с всеми сообщениями
```bash
curl -X DELETE "http://localhost:3001/api/v1/admin/chats/chat-id" \
  -H "Authorization: Bearer <admin_token>"
```

### Очистить записи старше 30 дней
```bash
curl -X POST "http://localhost:3001/api/v1/admin/recordings/cleanup" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

### Получить статистику пользователей за неделю
```bash
curl -X GET "http://localhost:3001/api/v1/admin/users/stats?period=week" \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🚀 Интеграция с фронтендом

### Базовая конфигурация API клиента

```typescript
// lib/api/admin.ts
const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001/api/v1/admin';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

adminApi.interceptors.request.use(config => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Пример использования в React компоненте

```typescript
import { useQuery } from '@tanstack/react-query';

function UsersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await adminApi.get('/users');
      return res.data.data.users;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.displayName}</TableCell>
            <TableCell>
              {user.isSuperAdmin ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}
            </TableCell>
            <TableCell>
              <Button onClick={() => handleEditUser(user)}>Edit</Button>
              <Button onClick={() => handleBlockUser(user.id)}>Block</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

## 📝 Документация

- `ADMIN_API.md` - Полная документация API
- `ADMIN_SUMMARY.md` - Эта сводка
- `README.md` - Общая документация API

---

## ✅ Готовность

| Компонент | Статус |
|-----------|--------|
| Backend API | ✅ 100% |
| Документация | ✅ 100% |
| Тестирование | ⚠️ 0% (рекомендуется) |
| Frontend интеграция | ❌ 0% (ждёт фронтенд) |

**API готов к интеграции с админ-порталом!**

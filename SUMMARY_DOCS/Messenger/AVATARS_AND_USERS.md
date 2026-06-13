# Balloo Messenger - Аватарки и Пользователи

## 🎨 Аватарки

### Формат
- **Форма:** Восьмиугольник (не круг!)
- **Хранение:** Base64 в базе данных
- **Генерация:** Автоматическая при регистрации
- **История:** 10 последних аватарок

### Структура данных

```sql
User.avatar TEXT -- Base64 SVG
User.avatarHistory TEXT -- JSON массив из 10 Base64
```

### Генерация аватара

**Алгоритм:**
1. Берётся ID пользователя
2. Генерируется уникальный цвет на основе хеша SHA256
3. Создается SVG восьмиугольник с этим цветом
4. Добавляются инициалы имени пользователя
5. Конвертируется в Base64

**Пример SVG:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="10,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30" 
           fill="rgb(180,180,200)" stroke="white" stroke-width="2"/>
  <text x="50" y="62" font-family="Arial" font-size="40" 
        font-weight="bold" fill="white" text-anchor="middle">TU</text>
</svg>
```

**CSS для отображения:**
```css
.avatar-octagon {
  width: 50px;
  height: 50px;
  clip-path: polygon(
    15% 0%, 85% 0%, 
    100% 15%, 100% 85%, 
    85% 100%, 15% 100%, 
    0% 85%, 0% 15%
  );
}
```

---

## 👥 Пользователи

### Тестовые пользователи

**Запуск:**
```bash
# Сначала зарегистрируйте реального первого пользователя
# Затем создайте тестовых
node scripts/create-test-users.js
```

**Данные для входа:**
| Email | Пароль | Роль |
|-------|--------|------|
| test1@balloo.app | Test1234! | Пользователь |
| test2@balloo.app | Test1234! | Пользователь |

**Первый пользователь (реальный):**
- Автоматически становится супер-админом
- Получает 5000 баллов
- Номер #1

### Просмотр профилей

**Все пользователи могут видеть профили друг друга:**

1. **В чате:** При клике на имя/аватар участника
2. **В списке чатов:** Кнопка "👤" рядом с именем
3. **Групповые чаты:** Список участников с аватарами
4. **Каналы:** Информация о канале и подписчиках

**API для поиска:**
```bash
GET /api/users/search?q=ivan
```

**Ответ:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-xxx",
      "email": "ivan@example.com",
      "displayName": "Ivan Petrov",
      "avatar": "data:image/svg+xml;base64,...",
      "userNumber": 42,
      "status": "online"
    }
  ]
}
```

### Профиль пользователя

**Данные профиля:**
```json
{
  "id": "user-xxx",
  "email": "user@example.com",
  "displayName": "User Name",
  "avatar": "data:image/svg+xml;base64,...",
  "avatarHistory": [
    "data:image/svg+xml;base64,...",
    "data:image/svg+xml;base64,..."
  ],
  "userNumber": 42,
  "points": 5000,
  "status": "online",
  "fullName": "Full Name",
  "bio": "Bio text",
  "phone": "+79991234567"
}
```

---

## 🔧 API Endpoints

### Регистрация

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "displayName": "User Name"
}
```

**Ответ включает аватар:**
```json
{
  "success": true,
  "user": {
    "id": "user-xxx",
    "email": "user@example.com",
    "displayName": "User Name",
    "avatar": "data:image/svg+xml;base64,...",
    "userNumber": 2,
    "points": 5000
  }
}
```

### Поиск пользователей

```bash
GET /api/users/search?q=ivan&limit=50
```

### Получение профиля

```bash
GET /api/auth/profile?userId=user-xxx
```

---

## 🎯 Функционал

### При регистрации:
1. ✅ Генерируется уникальный аватар (восьмиугольник)
2. ✅ Сохраняется в базу как Base64
3. ✅ Добавляется в историю аватарок
4. ✅ Создаются системные чаты (избранное, поддержка)
5. ✅ Добавляется в канал новостей
6. ✅ Начисляются баллы (5000 или -55)
7. ✅ Присваивается номер регистрации

### При смене аватара:
1. ✅ Старая сохраняется в историю (макс. 10)
2. ✅ Новая генерируется или загружается
3. ✅ Обновляется в базе

### При просмотре профиля:
1. ✅ Виден аватар (восьмиугольник)
2. ✅ Виден номер (#42)
3. ✅ Виден статус (online/offline)
4. ✅ Видно displayName и fullName
5. ✅ **Баллы видны ТОЛЬКО себе!**

---

## 📱 UI Компоненты

### Компонент аватара (React)

```jsx
function Avatar({ userId, displayName, avatar, size = 50 }) {
  const octagonStyle = {
    width: `${size}px`,
    height: `${size}px`,
    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
  };

  return (
    <div style={octagonStyle}>
      {avatar ? (
        <img src={avatar} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: generateColor(userId)
        }}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>
            {getInitials(displayName)}
          </span>
        </div>
      )}
    </div>
  );
}
```

### Кнопка просмотра профиля

```jsx
function ProfileButton({ userId, displayName }) {
  return (
    <button 
      onClick={() => openProfile(userId)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px'
      }}
      title={`Профиль ${displayName}`}
    >
      👤 {displayName}
    </button>
  );
}
```

---

## ⚠️ Важные замечания

### Безопасность
- Аватары хранятся в БД как Base64 (увеличивает размер)
- Для больших аватарок использовать внешнее хранилище
- История аватарок ограничена 10 записями

### Производительность
- Base64 аватарки могут замедлить загрузку
- Кэшировать аватарки на клиенте
- Использовать lazy loading

### Ограничения
- Максимум 10 аватарок в истории
- SVG аватарки до 10KB каждый
- Все пользователи видят друг друга (публичный каталог)

---

## 🚀 Быстрый старт

```bash
# 1. Инициализировать БД
node scripts/init-db.js

# 2. Зарегистрировать первого пользователя (супер-админ)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"first@example.com","password":"Admin123!","displayName":"First Admin"}'

# 3. Создать тестовых пользователей
node scripts/create-test-users.js

# 4. Проверить
sqlite3 data/app.db "SELECT id, email, displayName, substr(avatar,1,50) as avatar_preview FROM User;"
```

---

**Версия:** 4.0  
**Дата:** 2024  
**Статус:** ✅ Готово к деплою

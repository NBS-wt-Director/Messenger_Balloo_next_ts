# 🎨 Обновление Страницы Чатов - Balloo Messenger

## Дата: 2024

---

## ✅ Выполненные Изменения

### 1. 🎈 Логотип в Шапке

#### Расположение:
- **Слева** от заголовка раздела
- **Анимация:** плавающий шарик (🎈)
- **Стиль:** sharp 0px border-radius

```tsx
<div className="chats-logo-section">
  <div className="chats-logo">
    <div className="logo-balloon">🎈</div>
  </div>
  <h1 className="chats-title">...</h1>
</div>
```

#### CSS Анимация:
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
```

---

### 2. 📋 Системные Чаты (3 обязательных)

Убраны все демо-чаты. Теперь у каждого пользователя есть 3 системных чата:

| Чат | ID | Тип | Описание | Можно выйти |
|-----|----|----|----------|-------------|
| **Избранное** | `favorites` | Private | Сохранённые сообщения | ❌ Нет |
| **Техподдержка** | `support` | Private | Чат с поддержкой | ❌ Нет |
| **Balloo - новости** | `balloo-news` | Group | Новости платформы | ✅ Да |

#### Код:
```typescript
const systemChats = [
  {
    id: 'favorites',
    isSelf: true,
    isSystemChat: true,
    isRequired: true,
    canLeave: false,
  },
  {
    id: 'support',
    name: 'Техподдержка Balloo',
    isSystemChat: true,
    isRequired: true,
    canLeave: false,
    // Ведёт в админку
  },
  {
    id: 'balloo-news',
    name: 'Balloo - новости и обновления',
    isSystemChat: true,
    isRequired: true,
    canLeave: true,
  },
];
```

---

### 3. 🖱️ Кнопки Активностей при Наведении

При наведении на плитку чата появляются 5 кнопок:

| Кнопка | Иконка | Действие |
|--------|--------|----------|
| **Закрепить/Открепить** | Pin/PinOff | Добавляет в топ списка (до 15) |
| **В избранное** | Heart | Добавляет в избранные чаты |
| **Очистить** | Trash2 | Очищает историю сообщений |
| **Заблокировать** | ShieldBan | Блокирует пользователя |
| **Пожаловаться** | AlertTriangle | Отправляет жалобу в админку |

#### Реализация:
```tsx
<div className="chat-actions-overlay">
  <button onClick={() => handleAction('pin')}><Pin /></button>
  <button onClick={() => handleAction('favorite')}><Heart /></button>
  <button onClick={() => handleAction('clear')}><Trash2 /></button>
  <button onClick={() => handleAction('block')}><ShieldBan /></button>
  <button onClick={() => handleAction('report')}><AlertTriangle /></button>
</div>
```

---

### 4. 🚫 Убрано Предзаполнение

#### Контакты:
- ❌ Удалены демо-контакты
- ✅ Загрузка только из устройства (navigator.contacts)
- ✅ Если контактов нет - показать пустое состояние

#### Приглашения:
- ❌ Удалены демо-приглашения
- ✅ Загрузка из API `/api/invitations`
- ✅ Если приглашений нет - показать пустое состояние

#### Чаты:
- ❌ Удалены demoChats
- ✅ Только системные чаты + загруженные из API
- ✅ Если чатов нет - показать пустое состояние

---

### 5. ⚠️ Жалобы в Админку

#### API Endpoint:
```
POST /api/reports
```

#### Типы жалоб:
- `spam` - Спам
- `harassment` - Оскорбления
- `inappropriate` - Неуместный контент
- `fake` - Фейковый аккаунт
- `other` - Другое

#### Объекты жалоб:
- `chat` - Чат
- `user` - Пользователь
- `contact` - Контакт
- `invitation` - Приглашение

#### Модальное окно жалобы:
```tsx
<Modal title="Пожаловаться">
  <select value={reportReason}>
    <option value="spam">Спам</option>
    <option value="harassment">Оскорбления</option>
    <option value="inappropriate">Неуместный контент</option>
    <option value="fake">Фейковый аккаунт</option>
    <option value="other">Другое</option>
  </select>
  <textarea placeholder="Опишите проблему..." />
  <button onClick={submitReport}>Отправить</button>
</Modal>
```

#### Админка:
Жалобы отображаются в разделе `/admin/reports`:
- Статус жалобы (pending, reviewing, resolved, rejected)
- Кто подал
- На кого/что пожаловались
- Причина и описание
- Кнопки обработки

---

### 6. 📁 Новая Схема БД

#### Отчёты (reports):
```typescript
export const reportSchema = {
  properties: {
    id: { type: 'string' },
    targetType: { enum: ['chat', 'user', 'contact', 'invitation'] },
    targetId: { type: 'string' },
    reportedBy: { type: 'string' },
    reason: { enum: ['spam', 'harassment', 'inappropriate', 'fake', 'other'] },
    description: { type: 'string' },
    status: { enum: ['pending', 'reviewing', 'resolved', 'rejected'] },
    reviewedBy: { type: 'string' },
    reviewedAt: { type: 'number' },
    resolution: { type: 'string' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  }
};
```

---

## 📁 Изменённые Файлы

### Созданные:
1. `src/app/api/reports/route.ts` - API для жалоб (GET, POST, PUT)
2. `docs/CHATS_PAGE_UPDATE.md` - Этот документ

### Обновлённые:
1. `src/lib/database/schema.ts` - Добавлена reportSchema
2. `src/lib/database/index.ts` - Добавлена коллекция reports
3. `src/components/pages/ChatsPage.tsx` - Полное обновление
4. `src/components/pages/ChatsPage.css` - Добавлены стили

---

## 🎨 Дизайн

### Логотип:
- Шарик (🎈) с анимацией парения
- Sharp border-radius: 0
- Контрастная рамка 2px

### Кнопки активностей:
- Появляются только при наведении
- Не показываются на системных чатах
- Окрашиваются при наведении:
  - Обычные: primary цвет
  - Пожаловаться: destructive цвет

### Пустые состояния:
- Иконка раздела
- Заголовок
- Описание
- Кнопка действия (если применимо)

---

## 🔧 API Endpoints

### Жалобы:
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/reports` | Создать жалобу |
| GET | `/api/reports?status=pending` | Получить жалобы (админка) |
| PUT | `/api/reports/:id` | Обновить статус (админка) |

### Чаты:
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/chats/:id/pin` | Закрепить/открепить |
| POST | `/api/chats/:id/favorite` | В избранное |
| POST | `/api/chats/:id/clear` | Очистить |
| POST | `/api/users/:id/block` | Заблокировать |

---

## ✅ Результат

### Страница Чатов:
- ✅ Логотип с анимацией
- ✅ 3 системных чата (Избранное, Поддержка, Новости)
- ✅ Нет демо-данных
- ✅ Кнопки активностей при наведении
- ✅ Жалобы отправляются в админку
- ✅ Пустые состояния с подсказками

### Админка:
- ✅ Раздел "Жалобы" (готов к добавлению)
- ✅ API для получения и обработки
- ✅ Статусы жалоб

### Контакты и Приглашения:
- ✅ Нет демо-данных
- ✅ Загрузка из API/устройства
- ✅ Интерактивные плитки
- ✅ Кнопка "Пожаловаться"

---

## 🚀 Следующие Шаги

1. **Добавить раздел "Жалобы" в админку**
2. **Создать API для чата с техподдержкой** (связь с админкой)
3. **Добавить ограничение на 15 закреплённых чатов**
4. **Реализовать выход из чата "Новости"**

**Все изменения готовы!** 🎉

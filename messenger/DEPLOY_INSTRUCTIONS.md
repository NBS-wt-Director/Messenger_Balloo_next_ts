
# 🚀 100% РАБОЧАЯ ИНСТРУКЦИЯ ДЕПЛОЯ НА alpha.balloo.su

## 🆕 ЧТО НОВОГО (Версия 2.0)

### Системные чаты (создаются автоматически при регистрации)

| Чат | Описание | Доступ |
|-----|----------|--------|
| **Мои заметки** | Чат с самим собой | Только владелец |
| **Техподдержка Balloo** | Чат с поддержкой | Пользователь + support |
| **Balloo - новости** | Канал с новостями | Все пользователи (читатели) |

### Профиль пользователя


Новые поля:
- **ID** (не редактируется, уникальные идентификатор)
- **Номер телефона** (редактируется)
- **Онлайн статус** (обновляется автоматически)
- **Дата регистрации** (не редактируется)

### Семейные связи

При создании частного чата:
- ✅ Участники добавляются в контакты друг друга (зеркально)
- ✅ Создаются семейные связи (relationType: 'friend')

---

## 🚀 АВТОМАТИЗИРОВАННЫЙ ДЕПЛОЙ (РЕКОМЕНДУЕТСЯ)

### Один скрипт - всё автоматически:

```bash
cd ~/Messenger_Balloo_next_ts && bash messenger/deploy-and-fix.sh
```

Скрипт выполняет:
1. ✅ git pull origin main
2. ✅ npm install --production
3. ✅ npx prisma migrate deploy
4. ✅ node deploy-fix.js (создаёт системные чаты для всех)
5. ✅ Пересборка приложения
6. ✅ Перезапуск PM2
7. ✅ Перезагрузка Nginx
8. ✅ Проверка статуса

---

## 📝 РУЧНОЙ ДЕПЛОЙ (по шагам)

### ШАГ 1: Подключение к серверу
```bash
ssh balloo@31.128.37.165
```

### ШАГ 2: Переход в директорию проекта
```bash
cd ~/Messenger_Balloo_next_ts
```

### ШАГ 3: Обновление кода
```bash
git pull origin main
```

### ШАГ 4: Установить зависимости
```bash
cd messenger
npm install --production
```

### ШАГ 5: Применить миграции БД
```bash
npx prisma migrate deploy
```

### ШАГ 6: Исправить системные чаты (важно!)
```bash
node deploy-fix.js
```

Этот скрипт:
- Создаёт системного пользователя 'support'
- Создаёт системные чаты для ВСЕХ существующих пользователей
- Исправляет контакты и семейные связи
- Проверяет целостность данных

### ШАГ 7: Пересобрать приложение
```bash
pm2 stop messenger-alpha || true
rm -rf .next
NODE_ENV=production npx next build
```

### ШАГ 8: Перезапустить PM2
```bash
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env
pm2 save
```

### ШАГ 9: Перезагрузить Nginx
```bash
sudo systemctl reload nginx
```

### ШАГ 10: Проверить статус
```bash
pm2 status messenger-alpha
pm2 logs messenger-alpha --lines 20
```

---

## ✅ ПРОВЕРКА РАБОТЫ

### 1. Проверка веб-интерфейса
```
Откройте: https://alpha.balloo.su
```

### 2. Проверка регистрации нового пользователя
```
1. Откройте: https://alpha.balloo.su/register
2. Создайте пользователя
3. После входа проверьте чаты - должны быть:
   ✅ Мои заметки
   ✅ Техподдержка Balloo
   ✅ Balloo - новости и обновления
```

### 3. Проверка профиля
```
1. Откройте: https://alpha.balloo.su/profile
2. Проверьте поля:
   ✅ ID (не редактируется)
   ✅ Email (не редактируется)
   ✅ Телефон (редактируется)
   ✅ Онлайн (автоматический)
   ✅ Дата регистрации
```

### 4. Проверка создания чата
```bash
# Отправьте запрос:
curl -X POST https://alpha.balloo.su/api/chats \
  -H "Content-Type: application/json" \
  -d '{"type":"private","participants":["user1","user2"],"createdBy":"user1"}'

# Проверьте в БД:
cd messenger
npx prisma db execute --stdin << EOF
SELECT * FROM Contact WHERE userId='user1' OR userId='user2';
SELECT * FROM FamilyRelation WHERE userId='user1' OR userId='user2';
EOF

# Должно быть:
# ✅ 2 контакта (зеркально)
# ✅ 2 семейные связи (friend)
```

### 5. Проверка отправки сообщений
```bash
# Отправьте сообщение:
curl -X POST https://alpha.balloo.su/api/messages \
  -H "Content-Type: application/json" \
  -d '{"chatId":"CHAT_ID","senderId":"user1","type":"text","content":"Привет!"}'

# Получите сообщения:
curl "https://alpha.balloo.su/api/messages?chatId=CHAT_ID"
```

---

## 🔍 ДИАГНОСТИКА И ИСПРАВЛЕНИЕ

### Проверка системных чатов
```bash
cd messenger

# Сколько системных чатов создано?
npx prisma db execute --stdin << EOF
SELECT COUNT(*) as count FROM Chat WHERE isSystemChat = true;
EOF

# Список системных чатов
npx prisma db execute --stdin << EOF
SELECT id, type, name, isSystemChat FROM Chat WHERE isSystemChat = true;
EOF
```

### Исправление системных чатов
```bash
cd messenger

# Запустите fix-скрипт
node deploy-fix.js
```

### Проверка PM2
```bash
pm2 status
pm2 logs messenger-alpha --lines 50
pm2 show messenger-alpha
```

### Проверка Nginx
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 ВОЗМОЖНЫЕ ПРОБЛЕМЫ

### Проблема: Нет системных чатов у пользователей

**Решение:**
```bash
cd messenger
node deploy-fix.js
```

### Проблема: Ошибка при регистрации

**Решение:**
```bash
pm2 logs messenger-alpha --lines 50
npx prisma studio
```

### Проблема: Профиль не обновляется

**Решение:**
```bash
curl -X PUT https://alpha.balloo.su/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Новое имя","phone":"+79991234567"}'
```

---

## 📊 СТАТИСТИКА БАЗЫ ДАННЫХ

```bash
cd messenger

npx prisma db execute --stdin << EOF
SELECT 'Users' as table, COUNT(*) as count FROM User
UNION ALL
SELECT 'Chats', COUNT(*) FROM Chat
UNION ALL
SELECT 'Messages', COUNT(*) FROM Message
UNION ALL
SELECT 'Contacts', COUNT(*) FROM Contact
UNION ALL
SELECT 'Family Relations', COUNT(*) FROM FamilyRelation;
EOF
```

---

## ✅ ЧЕК-ЛИСТ ДЕПЛОЯ

- [ ] Код обновлён (git pull)
- [ ] Зависимости установлены (npm install)
- [ ] Миграции применены (prisma migrate deploy)
- [ ] Fix-скрипт выполнен (node deploy-fix.js)
- [ ] Приложение собрано (next build)
- [ ] PM2 перезапущен
- [ ] Nginx перезагружен
- [ ] Новые пользователи получают системные чаты
- [ ] Существующие пользователи получили системные чаты
- [ ] Профиль отображает все поля
- [ ] Отправка/получение сообщений работает
- [ ] Создание чатов работает
- [ ] Контакты создаются зеркально
- [ ] Семейные связи создаются автоматически

---

**Дата обновления:** 2025-01-XX
**Версия:** 2.0.0

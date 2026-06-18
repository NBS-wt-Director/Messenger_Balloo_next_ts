# 🚀 Balloo Platform — Quick Start Guide

**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**Время запуска:** 10-15 минут

---

## 📋 Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- 4 CPU cores
- 8 GB RAM
- 50 GB disk space

---

## 🔧 Быстрый старт (5 минут)

### 1. Клонирование репозитория

```bash
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Balloo
```

### 2. Настройка окружения

```bash
# Копирование шаблона
cp .env.example .env

# Генерация секретов
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 24)

# Обновление .env (автоматически)
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i "s/^SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=postgresql://balloo:$DB_PASSWORD@localhost:5432/balloo|" .env
```

### 3. Запуск сервисов

```bash
docker-compose up -d --build
```

### 4. Проверка статуса

```bash
docker-compose ps
```

Ожидаемый результат:
```
NAME                    STATUS         PORTS
balloo-postgres         healthy        127.0.0.1:5432->5432/tcp
balloo-redis            healthy        127.0.0.1:6379->6379/tcp
balloo-main             running        0.0.0.0:3000->3000/tcp
balloo-messenger        running        0.0.0.0:3001->3000/tcp
balloo-admin            running        0.0.0.0:3002->3000/tcp
...
```

### 5. Открыть в браузере

- **balloo.su:** http://localhost:3000
- **messenger:** http://localhost:3001
- **admin:** http://localhost:3002
- **api:** http://localhost:3003

---

## 👤 Создание первого пользователя

### Через API

```bash
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@balloo.su",
    "password": "Admin123",
    "phone": "+79991234567",
    "displayName": "Администратор"
  }'
```

### Через UI

1. Откройте http://localhost:3001
2. Нажмите "Зарегистрироваться"
3. Заполните форму
4. Подтвердите email

---

## 🧪 Тестирование

### Запустить тесты

```bash
# Все тесты
npm run test

# Только unit тесты
npm run test:unit

# С покрытием
npm run test -- --coverage
```

### Проверить покрытие

```bash
# Открыть HTML отчёт
open coverage/lcov-report/index.html
```

---

## 📊 Мониторинг

### Логи

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f messenger
```

### Метрики

```bash
# PostgreSQL
docker exec balloo-postgres pg_isready -U balloo

# Redis
docker exec balloo-redis redis-cli ping

# Приложения
curl http://localhost:3000/health
curl http://localhost:3001/health
```

---

## 🛑 Остановка

```bash
# Остановить все сервисы
docker-compose down

# Остановить с удалением данных
docker-compose down -v
```

---

## 🔄 Обновление

```bash
git pull origin main
docker-compose pull
docker-compose up -d --build
```

---

## ⚠️ Troubleshooting

### Порт занят

```bash
# Найти процесс
lsof -i :3000

# Остановить процесс
kill -9 <PID>
```

### Недостаточно памяти

```bash
# Очистить Docker
docker system prune -af

# Увеличить лимит памяти в Docker Desktop
```

### БД не подключается

```bash
# Проверить логи
docker-compose logs postgres

# Пересоздать БД
docker-compose down -v
docker-compose up -d postgres
```

---

## 📞 Поддержка

**Email:** o8eryuhtin@yandex.ru  
**GitHub:** https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts  
**Документация:** https://balloo.su/docs

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0

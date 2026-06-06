# 🐳 Docker Deployment Guide

## Быстрое развёртывание

### 1. Подготовка

```bash
# Клонировать репозиторий
git clone <repo-url>
cd app_balloo

# Скопировать .env.example
cp api/.env.example api/.env
cp max-server/.env.example max-server/.env

# Отредактировать .env файлы
nano api/.env
nano max-server/.env
```

### 2. Запуск

```bash
# Build и запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 3. Остановка

```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением томов (данные!)
docker-compose down -v
```

---

## 📝 Конфигурация

### Nginx

```bash
# Редактировать nginx.conf
nano nginx/nginx.conf

# Перезагрузить nginx
docker-compose restart nginx
```

### SSL (Let's Encrypt)

```bash
# Получить SSL сертификат
docker-compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d api.balloo.ru \
  -d max.balloo.ru

# Обновить сертификат
docker-compose run --rm certbot renew
```

---

## 🔧 Полезные команды

```bash
# Перезапуск конкретного сервиса
docker-compose restart api

# Вход в контейнер
docker-compose exec api sh

# Проверка здоровья
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed

# Обновление
docker-compose pull
docker-compose up -d

# Восстановление из бэкапа
docker-compose exec api sh -c "cp /backup/data.db /app/data/"
```

---

## 📊 Мониторинг

```bash
# Статистика контейнеров
docker stats

# Логи всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f api
docker-compose logs -f max-server
```

# РУКОВОДСТВО ПО УСТАНОВКЕ BALLOO НА ПРОДАКШЕН-СЕРВЕР

## 1. ТРЕБОВАНИЯ К СЕРВЕРУ

### 1.1 Минимальные требования
- **OS:** Ubuntu 22.04 LTS
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disk:** 40 GB SSD
- **Network:** 100 Mbps

### 1.2 Рекомендуемые требования
- **OS:** Ubuntu 22.04 LTS
- **CPU:** 4 cores
- **RAM:** 8 GB
- **Disk:** 100 GB SSD
- **Network:** 1 Gbps

### 1.3 Программное обеспечение
- Docker 24.0+
- Docker Compose 2.0+
- Git 2.34+
- Node.js 20+ (для локальной разработки)

## 2. ПОДГОТОВКА СЕРВЕРА

### 2.1 Обновление системы
```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y

# Установить необходимые пакеты
sudo apt install -y curl git wget unzip

# Перезагрузить сервер (опционально)
sudo reboot
```

### 2.2 Создание пользователя
```bash
# Создать пользователя
sudo adduser balloo

# Добавить в группу sudo
sudo usermod -aG sudo balloo

# Войти как новый пользователь
su - balloo
```

### 2.3 Настройка firewall
```bash
# Установить UFW
sudo apt install -y ufw

# Разрешить SSH
sudo ufw allow 22/tcp

# Разрешить HTTP
sudo ufw allow 80/tcp

# Разрешить HTTPS
sudo ufw allow 443/tcp

# Включить firewall
sudo ufw enable

# Проверить статус
sudo ufw status
```

## 3. УСТАНОВКА DOCKER И DOCKER COMPOSE

### 3.1 Установка Docker
```bash
# Удалить старые версии
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# Установить зависимости
sudo apt-get install -y ca-certificates curl gnupg

# Добавить GPG ключ
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Добавить репозиторий
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установить Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Добавить пользователя в группу docker
sudo usermod -aG docker $USER

# Новый group session
newgrp docker

# Проверить установку
docker --version
docker compose version
```

### 3.2 Настройка Docker
```bash
# Создать файл daemon.json
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# Перезапустить Docker
sudo systemctl restart docker

# Включить автозапуск
sudo systemctl enable docker
```

## 4. ПОЛУЧЕНИЕ ДОМЕНОВ И SSL

### 4.1 Регистрация доменов
- **messenger.example.com** - Messenger Web App
- **admin.example.com** - Admin Portal
- **api.example.com** - API Server
- **sms.example.com** - Max Server

### 4.2 Настройка DNS
```
# A record для каждого домена
messenger.example.com.  IN  A     <SERVER_IP>
admin.example.com.      IN  A     <SERVER_IP>
api.example.com.        IN  A     <SERVER_IP>
sms.example.com.        IN  A     <SERVER_IP>
```

### 4.3 SSL сертификаты (Let's Encrypt)
```bash
# Установить Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получить сертификаты
sudo certbot --nginx -d messenger.example.com
sudo certbot --nginx -d admin.example.com
sudo certbot --nginx -d api.example.com
sudo certbot --nginx -d sms.example.com

# Настроить автообновление
sudo systemctl enable certbot.timer
sudo certbot renew --dry-run
```

## 5. КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ

### 5.1 Клонирование
```bash
# Перейти в домашнюю директорию
cd ~

# Клонировать репозиторий
git clone https://github.com/username/app_balloo.git
cd app_balloo

# Проверить структуру
ls -la
```

### 5.2 Настройка .env
```bash
# Скопировать пример
cp .env.example .env

# Открыть для редактирования
nano .env
```

### 5.3 Заполнение .env

```bash
# ============================================
# POSTGRESQL
# ============================================
# Сгенерировать надежный пароль
# openssl rand -base64 32
DB_PASSWORD=<сгенерировать_надежный_пароль>
DB_USER=balloo
DB_NAME=balloo_production

# ============================================
# JWT SECRET
# ============================================
# Сгенерировать секрет
# openssl rand -base64 32
JWT_SECRET=<сгенерировать_минимум_32_символа>

# ============================================
# YANDEX OAUTH
# ============================================
# Получить в Яндекс Кабинете разработчика
YANDEX_CLIENT_ID=<id_из_кабинета>
YANDEX_CLIENT_SECRET=<секрет_из_кабинета>
YANDEX_DISK_CLIENT_ID=<id_диска>
YANDEX_DISK_CLIENT_SECRET=<секрет_диска>

# ============================================
# EMAIL
# ============================================
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=<email@yandex.ru>
EMAIL_PASSWORD=<пароль_приложения_яндекс>

# ============================================
# MAX SERVER
# ============================================
# Сгенерировать ключ
# uuidgen
MAX_SERVER_API_KEY=<сгенерировать_uuid>

# ============================================
# CORS
# ============================================
CORS_ORIGIN=https://messenger.example.com

# ============================================
# STORAGE
# ============================================
STORAGE_PROVIDER=yandex

# ============================================
# MESSAGES
# ============================================
MESSAGE_RETENTION_DAYS=90
```

## 6. НАСТРОЙКА NGINX

### 6.1 Создать конфигурацию
```bash
# Создать файл
sudo nano /etc/nginx/sites-available/balloo
```

### 6.2 Содержимое конфигурации
```nginx
upstream api {
    server 127.0.0.1:3001;
}

upstream messenger {
    server 127.0.0.1:3000;
}

upstream admin-portal {
    server 127.0.0.1:3002;
}

upstream max-server {
    server 127.0.0.1:8080;
}

# HTTP -> HTTPS redirect
server {
    listen 80;
    server_name messenger.example.com admin.example.com api.example.com sms.example.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# Messenger
server {
    listen 443 ssl http2;
    server_name messenger.example.com;

    ssl_certificate /etc/letsencrypt/live/messenger.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/messenger.example.com/privkey.pem;

    location / {
        proxy_pass http://messenger;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Admin Portal
server {
    listen 443 ssl http2;
    server_name admin.example.com;

    ssl_certificate /etc/letsencrypt/live/admin.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.example.com/privkey.pem;

    location / {
        proxy_pass http://admin-portal;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API
server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    location / {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Max Server
server {
    listen 443 ssl http2;
    server_name sms.example.com;

    ssl_certificate /etc/letsencrypt/live/sms.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sms.example.com/privkey.pem;

    location / {
        proxy_pass http://max-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.3 Включить конфигурацию
```bash
# Создать symlink
sudo ln -s /etc/nginx/sites-available/balloo /etc/nginx/sites-enabled/

# Удалить default
sudo rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

## 7. ЗАПУСК СИСТЕМЫ

### 7.1 Сборка и запуск
```bash
# Перейти в директорию проекта
cd ~/app_balloo

# Остановить все контейнеры (если запущены)
docker compose down

# Собрать образы
docker compose build

# Запустить все сервисы
docker compose up -d

# Проверить статус
docker compose ps
```

### 7.2 Проверка запуска
```bash
# Проверить логи API
docker compose logs -f api

# Проверить логи Messenger
docker compose logs -f messenger

# Проверить health check
curl https://api.example.com/health
curl https://messenger.example.com/api/health

# Проверить все сервисы
curl https://api.example.com/
curl https://messenger.example.com/
curl https://admin.example.com/
curl https://sms.example.com/health
```

### 7.3 Создание первого админа
```bash
# Войти в контейнер API
docker exec -it app_balloo-api-1 sh

# Создать админа (команда зависит от реализации)
node scripts/create-admin.js

# Выйти
exit
```

## 8. НАСТРОЙКА БЭКАПОВ

### 8.1 Бэкап PostgreSQL
```bash
# Создать скрипт бэкапа
nano ~/app_balloo/scripts/backup.sh

# Содержимое:
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER=$(docker ps -qf "name=app_balloo-postgres-1")

mkdir -p $BACKUP_DIR

docker exec $CONTAINER pg_dumpall -U balloo > $BACKUP_DIR/balloo_$DATE.sql

# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup completed: $DATE"
```

### 8.2 Настроить cron
```bash
# Открыть crontab
crontab -e

# Добавить строку (ежедневный бэкап в 2:00)
0 2 * * * /home/balloo/app_balloo/scripts/backup.sh >> /var/log/balloo-backup.log 2>&1
```

### 8.3 Бэкап файлов
```bash
# Создать скрипт бэкапа файлов
nano ~/app_balloo/scripts/backup-files.sh

# Содержимое:
#!/bin/bash
BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER=$(docker ps -qf "name=app_balloo-api-1")

mkdir -p $BACKUP_DIR

docker cp $CONTAINER:/app/uploads $BACKUP_DIR/uploads_$DATE
docker cp $CONTAINER:/app/data $BACKUP_DIR/data_$DATE

echo "Files backup completed: $DATE"
```

### 8.4 Настроить cron для файлов
```bash
# Добавить в crontab (еженедельный бэкап в воскресенье в 3:00)
0 3 * * 0 /home/balloo/app_balloo/scripts/backup-files.sh >> /var/log/balloo-files-backup.log 2>&1
```

## 9. МОНИТОРИНГ

### 9.1 Установка Prometheus
```bash
# Создать docker-compose.monitoring.yml
nano ~/app_balloo/docker-compose.monitoring.yml

# Содержимое:
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3003:3003"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=<admin_password>
    volumes:
      - grafana-data:/var/lib/grafana
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
```

### 9.2 Настроить Prometheus
```bash
# Создать prometheus.yml
nano ~/app_balloo/prometheus.yml

# Содержимое:
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'docker'
    static_configs:
      - targets: ['host.docker.internal:9323']
```

## 10. ОБНОВЛЕНИЕ СИСТЕМЫ

### 10.1 Обновление кода
```bash
# Перейти в директорию
cd ~/app_balloo

# Получить последние изменения
git pull

# Собрать новые образы
docker compose build

# Перезапустить сервисы
docker compose up -d
```

### 10.2 Обновление Docker
```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y docker-ce docker-ce-cli containerd.io

# Перезапустить Docker
sudo systemctl restart docker
```

## 11. УСТРАНЕНИЕ НЕПОЛАДОК

### 11.1 Контейнер не запускается
```bash
# Посмотреть логи
docker compose logs <service_name>

# Перезапустить сервис
docker compose restart <service_name>

# Удалить и создать заново
docker compose down <service_name>
docker compose up -d <service_name>
```

### 11.2 Проблемы с базой данных
```bash
# Проверить подключение
docker exec -it app_balloo-postgres-1 psql -U balloo -d balloo_production

# Проверить таблицы
\dt

# Посмотреть ошибки в логах
docker compose logs postgres
```

### 11.3 Проблемы с сетью
```bash
# Проверить открытые порты
sudo netstat -tlnp

# Проверить firewall
sudo ufw status

# Проверить доступность сервисов
curl http://localhost:3001/health
curl http://localhost:3000/
```

## 12. ФИНАЛЬНАЯ ПРОВЕРКА

### 12.1 Чеклист
- [ ] Сервер обновлен
- [ ] Docker установлен
- [ ] Firewall настроен
- [ ] Домены настроены
- [ ] SSL сертификаты получены
- [ ] Nginx настроен
- [ ] .env заполнен
- [ ] Система запущена
- [ ] Health checks проходят
- [ ] Бэкапы настроены
- [ ] Мониторинг настроен
- [ ] Первый админ создан
- [ ] Документация доступна

### 12.2 Проверка доступа
- [ ] https://messenger.example.com - открывается
- [ ] https://admin.example.com - открывается
- [ ] https://api.example.com/health - возвращает OK
- [ ] https://sms.example.com/health - возвращает OK

---

**Статус:** ✅ Руководство готово  
**Последнее обновление:** 2026-06-23

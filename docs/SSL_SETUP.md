# SSL/TLS Setup Guide

## Production SSL с Let's Encrypt

### Предварительные требования

1. Домен настроен и указывает на сервер
2. Port 80 открыт для доступа Let's Encrypt
3. Nginx установлен и работает

### Шаг 1: Установить Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### Шаг 2: Получить SSL сертификат

```bash
# Для одного домена
sudo certbot certonly --nginx -d api.balloo.ru -d app.balloo.ru

# Или через webroot (если Nginx уже работает)
sudo certbot certonly --webroot -w /var/www/certbot -d api.balloo.ru -d app.balloo.ru
```

### Шаг 3: Автоматическое обновление

```bash
# Добавить в crontab
sudo crontab -e

# Обновление каждый день в 3:00
0 3 * * * certbot renew --quiet
```

### Шаг 4: Настроить Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name api.balloo.ru;

    ssl_certificate /etc/letsencrypt/live/api.balloo.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.balloo.ru/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://api:3001;
        # ... остальные настройки proxy
    }
}

# Редирект HTTP → HTTPS
server {
    listen 80;
    server_name api.balloo.ru;
    return 301 https://$server_name$request_uri;
}
```

### Шаг 5: Проверить SSL

```bash
# Проверка через SSL Labs
curl https://api.balloo.ru

# Локальная проверка
openssl s_client -connect api.balloo.ru:443 -servername api.balloo.ru
```

---

## Docker Compose + SSL

### Вариант 1: Сертификаты в Docker

```yaml
services:
  nginx:
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot
```

### Вариант 2: Автообновление через отдельный контейнер

```yaml
services:
  certbot:
    image: certbot/certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/www/certbot:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

---

## Self-Signed Certificates (Development)

```bash
# Генерация самоподписанного сертификата
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./nginx/ssl/privkey.pem \
  -out ./nginx/ssl/fullchain.pem \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Balloo/CN=api.balloo.ru"
```

---

## Troubleshooting

### Проблема: "Failed authorization procedure"

**Решение:**
- Проверить DNS записи
- Открыть порт 80
- Остановить Nginx на время получения сертификата

### Проблема: "Permission denied"

**Решение:**
```bash
sudo chmod 755 /etc/letsencrypt
sudo chown -R $USER:$USER /etc/letsencrypt
```

### Проверка сертификата

```bash
# Срок действия
openssl x509 -in /etc/letsencrypt/live/api.balloo.ru/cert.pem -noout -dates

# Полный чек
sudo certbot certificates
```

---

**NLP-Core-Team** - App Balloo SSL Setup

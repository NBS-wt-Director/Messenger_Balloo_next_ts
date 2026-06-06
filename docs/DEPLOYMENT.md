# 🚀 Production Deployment Guide

**App Balloo Messenger**  
**Version:** 1.0.0  
**Last Updated:** 2026-06-03

---

## 📋 Quick Start (5 minutes)

```bash
# 1. Setup secrets
mkdir secrets
openssl rand -hex 32 > secrets/db_password.txt
openssl rand -hex 64 > secrets/jwt_secret.txt

# 2. Setup PostgreSQL
./api/scripts/setup-postgres.sh

# 3. Run migration
cd api && node scripts/migrate-to-pg.js

# 4. Start everything
cd .. && docker-compose up -d

# 5. Verify
curl http://localhost:3001/health
```

---

## 📦 Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for migrations)
- 2GB RAM minimum
- 10GB disk space

---

## 🔐 Secrets Setup

```bash
# Create secrets directory
mkdir -p secrets

# Generate secure passwords
openssl rand -hex 32 > secrets/db_password.txt
openssl rand -hex 64 > secrets/jwt_secret.txt

# Set permissions
chmod 600 secrets/*
```

**Required secrets:**
- `secrets/db_password.txt` - PostgreSQL password
- `secrets/jwt_secret.txt` - JWT signing key

---

## 🗄️ Database Setup

### Option A: Docker (Recommended for Dev)

```bash
./api/scripts/setup-postgres.sh
```

### Option B: Manual Installation

```bash
# Install PostgreSQL 15
sudo apt install postgresql-15

# Create user and database
sudo -u postgres psql
CREATE USER balloo WITH PASSWORD 'your-password';
CREATE DATABASE balloo_production OWNER balloo;
```

---

## 🔄 Database Migration

```bash
# Run migration
cd api
node scripts/migrate-to-pg.js

# Verify
docker-compose exec api node -e "const {db} = require('./src/config/database'); console.log('DB connected')"

# Rollback (if needed)
docker-compose exec api node -e "const {db} = require('./src/config/database'); db.close()"
```

---

## 🔒 SSL/TLS Setup

### Let's Encrypt (Production)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d api.balloo.ru \
  -d app.balloo.ru

# Auto-renewal (cron)
0 0 * * * certbot renew --quiet
```

### Self-Signed (Development)

```bash
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem
```

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

```bash
# Build images
docker-compose build --no-cache

# Start
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

# Monitor
docker-compose logs -f api
```

### Commands

```bash
# View logs
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f redis

# Restart service
docker-compose restart api

# Scale (production)
docker-compose up -d --scale api=3

# Health check
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed
```

---

## 📊 Monitoring

### Health Checks

```bash
# Simple
curl http://localhost:3001/health

# Detailed
curl http://localhost:3001/health/detailed

# Prometheus metrics
curl http://localhost:3001/metrics
```

### Redis

```bash
docker exec -it balloo-redis redis-cli ping
docker exec -it balloo-redis redis-cli info
```

### PostgreSQL

```bash
docker exec -it balloo-postgres psql -U balloo -c "SELECT version();"
docker exec -it balloo-postgres pg_stat_activity
```

---

## 💾 Backup Strategy

### Automatic Backup (Cron)

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * /path/to/api/scripts/backup-postgres.sh >> /var/log/balloo-backup.log 2>&1
```

### Manual Backup

```bash
./api/scripts/backup-postgres.sh
```

### Restore

```bash
gunzip < backup_20260603_120000.sql.gz | docker exec -i balloo-postgres psql -U balloo balloo_production
```

---

## 🔄 Update Procedure

```bash
# 1. Pull latest code
git pull origin main

# 2. Backup database
./api/scripts/backup-postgres.sh

# 3. Rebuild and restart
docker-compose build --no-cache
docker-compose up -d

# 4. Verify health
curl http://localhost:3001/health

# 5. Rollback (if needed)
git reset --hard HEAD~1
docker-compose build
docker-compose up -d
```

---

## 🔧 Troubleshooting

### API won't start

```bash
# Check logs
docker-compose logs api

# Check database connection
docker-compose exec api node -e "const {db} = require('./src/config/database'); console.log('OK')"

# Check Redis connection
docker-compose exec api node -e "const {checkConnection} = require('./src/config/redis'); checkConnection().then(console.log)"
```

### PostgreSQL connection refused

```bash
# Check PostgreSQL status
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Redis connection refused

```bash
# Check Redis status
docker-compose ps redis

# Check logs
docker-compose logs redis

# Restart
docker-compose restart redis
```

---

## 📈 Performance Tuning

### PostgreSQL

```sql
-- Edit postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
max_connections = 100
work_mem = 4MB
```

### API

```bash
# Environment variables
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=2048"
```

### Nginx

```nginx
# nginx.conf
worker_processes auto;
worker_connections 4096;

upstream api {
    server api:3001;
    keepalive 32;
}
```

---

## 🎯 Production Checklist

- [ ] PostgreSQL installed and running
- [ ] Database migrated
- [ ] Secrets configured (not in git)
- [ ] SSL certificates installed
- [ ] Firewall configured (only 80, 443, 6379)
- [ ] Backup cron job set
- [ ] Monitoring enabled
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Health checks passing
- [ ] Load tested

---

## 📞 Support

- **Documentation:** `docs/`
- **API Docs:** `http://localhost:3001/api-docs`
- **Health Check:** `http://localhost:3001/health`

---

**NLP-Core-Team** - App Balloo Messenger

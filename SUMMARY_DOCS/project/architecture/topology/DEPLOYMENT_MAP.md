# 🗺️ DEPLOYMENT MAP

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🚀 DEPLOYMENT TOPOLOGY

### Dev Environment
**Node:** home_aio (primary), laptop_control (local)  
**Source:** Feature branches  
**Trigger:** Manual / PR

```
laptop_control (dev)
    ↓ git push
home_aio
    ↓ docker-compose up
Preview environment running
```

---

### Stage Environment
**Node:** home_aio (primary), work_server (isolated)  
**Source:** Pull requests  
**Trigger:** PR merge to staging

```
GitHub (staging branch)
    ↓ CI/CD or manual
home_aio or work_server (stage containers)
    ↓ docker-compose -f docker-compose.stage.yml
Stage environment running
```

---

### Production Environment
**Node:** work_server ONLY  
**Source:** main branch  
**Trigger:** Manual approval from laptop_control

```
laptop_control
    ↓ ssh work_server
    ↓ git pull origin main
    ↓ docker-compose pull
    ↓ docker-compose up -d
Production rollout complete
```

---

## 📊 PROJECT SEPARATION

### Messenger Ecosystem
**Domain:** balloo.su  
**Node:** work_server  
**Containers:**
- messenger (port 3000)
- api-server (port 3001)
- admin-portal (port 3002)
- postgres (shared)
- redis (shared)

---

## 🔧 DEPLOYMENT COMMANDS

### From laptop_control:

```bash
# Dev deployment to home_aio
ssh home_aio
cd /opt/balloo/dev
git pull
docker-compose -f docker-compose.dev.yml up -d

# Stage deployment
ssh work_server
cd /opt/balloo/stage
git pull origin staging
docker-compose -f docker-compose.stage.yml up -d

# Production deployment
ssh work_server
cd /opt/balloo/prod
git pull origin main
docker-compose pull
docker-compose up -d
docker-compose logs -f
```

---

## 📝 SOURCE OF TRUTH

**Production:**
- Code: GitHub (main branch)
- Config: work_server .env + home_nas backup
- Database: PostgreSQL on work_server
- Artifacts: home_nas backup

**Separation:**
- Separate Docker networks per environment

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
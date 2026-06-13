# 📱 MESSENGER NODE BINDING

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 MESSENGER ECOSYSTEM TO NODES

### balloo.su Ecosystem

**Primary Node:** work-server

---

## 🖥️ WORK-SERVER

### Services MUST live here:

**Production:**
- ✅ API Server (Express.js) - `api.balloo.su`
- ✅ Messenger Web App - `balloo.su`
- ✅ Admin Portal - `admin.balloo.su`
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ WebSocket server
- ✅ Reverse proxy (Nginx/Caddy)

**Optional:**
- ⭕ Ollama (heavy AI models)
- ⭕ Open WebUI

**Public Exposure:**
- ✅ balloo.su (Messenger)
- ✅ api.balloo.su (API)
- ✅ admin.balloo.su (Admin)
- ❌ Internal endpoints (must NOT be public)

---

## 💻 HOME-AIO

### Services MAY live here:

**Dev/Staging:**
- ⭕ Dev environment (feature branches)
- ⭕ Preview environments
- ⭕ Stage testing

**Boundaries:**
- ❌ NOT production source of truth
- ❌ NOT for production data
- ⭕ Sync with work-server repositories

---

## 📱 CONTROL-PLANE

### Access Points:

**laptop_control:**
- ✅ Development (VS Code / Koda)
- ✅ Deployment commands
- ✅ SSH to work-server
- ✅ Git operations

**phone_personal:**
- ✅ User access to balloo.su
- ✅ Notifications
- ✅ 2FA authentication

**phone_service:**
- ✅ Admin access
- ✅ Admin 2FA
- ✅ Isolated service access

---

## 🗄️ HOME-NAS

### Storage Role:

**Backups:**
- ✅ PostgreSQL backups
- ✅ Application backups
- ✅ Configuration backups
- ✅ Git/artifact mirrors

**Boundaries:**
- ❌ NOT execution node
- ❌ NOT for production workload

---

## 🌐 NETWORK BINDING

### Public Endpoints (balloo.su):
```
Internet → Cloudflare → work-server (nginx)
  ↓
  ├── / → Messenger:3000
  ├── /api → API:3001
  └── /admin → Admin:3002
```

### Private Endpoints:
```
Tailscale Network:
  ├── laptop_control → work-server (SSH, deployment)
  ├── home_aio → work-server (git sync)
  └── work-server → home_nas (backup sync)
```

---

## 🔒 SECURITY BOUNDARIES

### Public (MAY be exposed):
- ✅ Messenger web app
- ✅ Public API endpoints
- ✅ WebSocket connections
- ✅ Health checks

### Private (MUST NOT be public):
- ❌ Database ports (5432)
- ❌ Redis ports (6379)
- ❌ Internal API endpoints
- ❌ Admin API (unless on subdomain with auth)
- ❌ Metrics/debug endpoints

---

## 📊 PROJECT MAPPING

| Component | Node | Exposure |
|-----------|------|----------|
| Messenger App | work-server | Public (balloo.su) |
| API Server | work-server | Public (api.balloo.su) |
| Admin Portal | work-server | Public (admin.balloo.su) |
| PostgreSQL | work-server | Private only |
| Redis | work-server | Private only |
| Dev Env | home_aio | Private/May be public |
| Backups | home_nas | Private only |
| Control | laptop_control | Private only |

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
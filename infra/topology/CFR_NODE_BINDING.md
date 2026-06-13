# 🏢 CFR NODE BINDING

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 CFR ECOSYSTEM TO NODES

### центр-фр.рф Ecosystem

**Primary Node:** work-server

---

## 🖥️ WORK-SERVER

### Services MUST live here:

**Production:**
- ✅ ЦФР Official Website - `центр-фр.рф`
- ✅ ЦФР Admin Panel - `admin.центр-фр.рф`
- ✅ ЦФР API - `api.центр-фр.рф`
- ✅ PostgreSQL database (separate from Messenger)
- ✅ Reverse proxy configuration

**Public Exposure:**
- ✅ центр-фр.рф (Official website)
- ✅ admin.центр-фр.рф (Admin - auth required)
- ✅ api.центр-фр.рф (API)
- ❌ Internal admin services (must NOT be public)

---

## 📄 PUBLIC WEBSITE

### Root Domain: центр-фр.рф

**Content:**
- ✅ About ЦФР
- ✅ Services information
- ✅ Contact information
- ✅ Official documents

**Routing:**
```
центр-фр.рф/ → Official website
центр-фр.рф/about → About page
центр-фр.рф/services → Services
центр-фр.рф/contact → Contact
```

---

## 🔐 ADMIN SERVICES

### Protected Endpoints:

**admin.центр-фр.рф:**
- ✅ Admin panel (authentication required)
- ✅ Content management
- ✅ User management
- ✅ Analytics

**Boundaries:**
- ❌ MUST require 2FA for admin access
- ❌ MUST NOT be accessible without auth
- ❌ MUST log all admin actions

---

## 💻 CONTROL-PLANE

### Access Points:

**laptop_control:**
- ✅ Development (ЦФР website)
- ✅ Deployment commands
- ✅ Content management

**phone_service:**
- ✅ Admin 2FA
- ✅ Admin access verification
- ✅ Isolated admin checks

---

## 🗄️ HOME-NAS

### Storage Role:

**Backups:**
- ✅ ЦФР website backups
- ✅ ЦФР database backups
- ✅ Configuration backups

---

## 🌐 NETWORK BINDING

### Public Endpoints (центр-фр.рф):
```
Internet → Cloudflare → work-server (nginx)
  ↓
  ├── / → CFR Website:8080
  ├── /admin → CFR Admin (protected)
  └── /api → CFR API:8081
```

### Private Endpoints:
```
Tailscale Network:
  ├── laptop_control → work-server (deployment)
  └── work-server → home_nas (backup sync)
```

---

## 🔒 SECURITY BOUNDARIES

### Public (MAY be exposed):
- ✅ Official website
- ✅ Public API endpoints
- ✅ Health checks

### Private (MUST NOT be public):
- ❌ Database ports
- ❌ Internal admin services
- ❌ Debug endpoints
- ❌ Metrics

---

## 📊 PROJECT MAPPING

| Component | Node | Exposure |
|-----------|------|----------|
| CFR Website | work-server | Public (центр-фр.рф) |
| CFR Admin | work-server | Public + Auth |
| CFR API | work-server | Public (api.центр-фр.рф) |
| PostgreSQL | work-server | Private only |
| Backups | home_nas | Private only |
| Control | laptop_control | Private only |

---

## 🆚 MESSENGER vs CFR SEPARATION

**Separation Requirements:**
- ✅ Separate Docker networks
- ✅ Separate databases
- ✅ Separate domains
- ⭕ Shared Redis (optional, isolated namespaces)
- ❌ NO shared production state

**Shared Infrastructure:**
- ✅ work-server (physical node)
- ✅ Reverse proxy
- ✅ Tailscale network
- ✅ Backups (home_nas)

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
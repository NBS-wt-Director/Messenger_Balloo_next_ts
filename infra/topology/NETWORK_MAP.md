# 🗺️ NETWORK MAP

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🌐 СЕТОВАЯ ТОПОЛОГИЯ

### Private Overlay Network: Tailscale

```
┌─────────────────────────────────────────────────────────────┐
│                    TAILSCALE NETWORK                         │
│                      (100.x.y.z/10)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  control-plane:                                              │
│    ├── laptop_control → 100.x.y.1                           │
│    ├── phone_personal → 100.x.y.2                           │
│    ├── phone_service → 100.x.y.3                            │
│    └── phone_recovery_optional → 100.x.y.4 (optional)       │
│                                                              │
│  work-plane:                                                 │
│    └── work-server → 100.x.y.10                             │
│                                                              │
│  home-plane:                                                 │
│    ├── home_aio → 100.x.y.20                                │
│    └── home_nas → 100.x.y.21                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌍 PUBLIC INGRESS: Nginx/Caddy Reverse Proxy

```
Internet
    ↓
Nginx/Caddy Reverse Proxy
    ↓
work-server (Routing Layer)
    ↓
┌────────────────────────────────────┐
│  Routing:                          │
│  - balloo.su → Messenger:3000      │
│  - api.balloo.su → API:3001        │
│  - admin.balloo.su → Admin:3002    │
└────────────────────────────────────┘
```

---

## 🔗 INTERNAL SERVICE-TO-SERVICE

### work-server Docker Network

```
┌──────────────────────────────────────────┐
│          work-server Internal            │
│        (Docker Network: 172.x.x.x)       │
├──────────────────────────────────────────┤
│                                          │
│  Container Network:                      │
│  ├── nginx-proxy → 172.18.0.2           │
│  ├── api-server → 172.18.0.3            │
│  ├── messenger → 172.18.0.4             │
│  ├── admin-portal → 172.18.0.5          │
│  ├── postgres → 172.18.0.10             │
│  └── redis → 172.18.0.11                │
│                                          │
│  Communication:                          │
│  - All containers → postgres:5432       │
│  - All containers → redis:6379          │
│  - nginx-proxy ← all public traffic      │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📡 ACCESS PATHS

### Control Plane → Work Plane

```
laptop_control (Tailscale)
    ↓ SSH (port 22)
work-server (Tailscale IP)
    ↓ Docker exec
Containers
```

### Backup Sync

```
work-server
    ↓ rsync over SSH (Tailscale)
home_nas
```

### Dev Sync

```
home_aio
    ↓ git pull / rsync
work-server (repositories mirror)
```

---

## 🔒 PORT EXPOSURE

### MUST NOT be Public:
- PostgreSQL: 5432 ❌ (internal only)
- Redis: 6379 ❌ (internal only)
- SSH: 22 ❌ (Tailscale only)
- Metrics: 9090 ❌ (internal only)

### MAY be Public (via proxy):
- HTTP: 80 ✅ (reverse proxy)
- HTTPS: 443 ✅ (reverse proxy)
- WebSocket ✅ (via proxy)

---

## 🎯 HOST TAGGING

```
laptop_control → control-plane, operator
work-server → work-plane, production, critical
home_aio → home-plane, dev
home_nas → home-plane, backup
phone_personal → control-plane, access, 2fa
phone_service → control-plane, access, admin
```

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
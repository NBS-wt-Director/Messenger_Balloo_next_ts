# 🗺️ DOMAIN MAP

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🌐 ДОМЕННАЯ СТРУКТУРА

### balloo.su (Messenger Ecosystem)

```
balloo.su
├── Root → Redirect to /app or serve SPA
├── api.balloo.su → API Server (Express.js)
├── admin.balloo.su → Admin Portal
├── docs.balloo.su → Documentation (optional)
└── *.balloo.su → Preview environments (optional)

Public Endpoints:
├── / → Messenger web app
├── /api/* → Public API (auth, users, chats)
├── /socket.io/* → WebSocket
└── /health → Health check

Protected Endpoints:
├── /api/admin/* → Admin API (auth required)
├── /admin/* → Admin Portal (auth required)
└── /api/internal/* → Internal (NOT public)
```

---

### центр-фр.рф (CFR Ecosystem)

```
центр-фр.рф
├── Root → Official website
├── admin.центр-фр.рф → Admin panel (protected)
└── api.центр-фр.рф → ЦФР API

Public Endpoints:
├── / → Official website
├── /about → About ЦФР
├── /services → Services
└── /contact → Contact

Protected Endpoints:
├── /admin/* → Admin (auth required)
├── /dashboard → Internal dashboard
└── /api/internal/* → Internal (NOT public)
```

---

## 🎯 TARGET NODE: work-server

**ALL domains point to:** work-server

**Reverse Proxy Configuration:**
```nginx
# balloo.su
server {
    listen 80;
    server_name balloo.su www.balloo.su;
    location / { proxy_pass http://messenger:3000; }
}

# api.balloo.su
server {
    listen 80;
    server_name api.balloo.su;
    location /api { proxy_pass http://api-server:3001; }
}

# admin.balloo.su
server {
    listen 80;
    server_name admin.balloo.su;
    location / { proxy_pass http://admin-portal:3002; }
}

# центр-фр.рф
server {
    listen 80;
    server_name центр-фр.рф www.центр-фр.рф;
    location / { proxy_pass http://cfr-website:8080; }
}
```

---

## 🔐 TLS/SSL

**Provider:** Cloudflare SSL/TLS  
**Mode:** Full (encrypted end-to-end)  
**Certificate:** Auto-renew via Cloudflare

**Requirements:**
- HTTPS everywhere
- HSTS enabled
- Strong cipher suites
- OCSP stapling

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
# 🖥 Узлы Монорепо

**Дата создания:** 26.06.2026  
**Последнее обновление:** 2026-06-26  
**Платформа:** Balloo Platform  

---

## Архитектура

Monorepo из 8 узлов, объединённых кодовой базой. Каждый узел работает на контейнерах в виртуальной сети `balloo_net`.

| Узел | Hostname | Порт | Роль |
|------|----------|------|------|
| API Gateway | api.balloo.su | 3001 | Backend / Auth / REST API |
| Messenger | messenger.balloo.su | 3002 | WebSocket / Real-time Messages |
| Admin Portal | admin.balloo.su | 3003 | Next.js Admin Dashboard |
| Web App | web.balloo.su | 3004 | Next.js SSR / Static Assets |
| Mobile API | mobile.balloo.su | 3005 | React Native API Gateway |
| Database | db.balloo.su | 3006 | PostgreSQL / Drizzle ORM |
| Cache | cache.balloo.su | 3007 | Redis / Message Broker |
| File Storage | storage.balloo.su | 3008 | File Storage / Transcoding |

---

## Детальное описание узлов

### API Gateway Node

**Hostname:** api.balloo.su  
**Порты:** 3001  
**Роль:** Backend / Auth / REST API

**Services:**
- Express.js API (REST)
- Auth Service (JWT, 2FA)
- Notification Worker (SMS, Push, Email)

**Requirements:**
- CPU: 4 vCPU
- RAM: 8 GB
- Disk: 100 GB SSD

**Dependencies:** node-db, node-cache

---

### Messenger Node

**Hostname:** messenger.balloo.su  
**Порты:** 3002  
**Роль:** WebSocket / Real-time Messages

**Services:**
- Socket.IO (Real-time)
- Message Queue Processing
- Online Status Management

**Requirements:**
- CPU: 4 vCPU
- RAM: 8 GB
- Disk: 100 GB SSD

**Dependencies:** node-api, node-db, node-cache

---

### Admin Portal Node

**Hostname:** admin.balloo.su  
**Порты:** 3003  
**Роль:** Next.js Admin Dashboard

**Services:**
- Admin Dashboard
- Analytics Reports
- User Management UI

**Requirements:**
- CPU: 2 vCPU
- RAM: 4 GB
- Disk: 50 GB SSD

**Dependencies:** node-api

---

### Web App Node

**Hostname:** web.balloo.su  
**Порты:** 3004  
**Роль:** Next.js SSR / Static Assets

**Services:**
- Messenger (Next.js App Router)
- Static Assets (Images, JS, CSS)
- SSR Rendering

**Requirements:**
- CPU: 2 vCPU
- RAM: 4 GB
- Disk: 50 GB SSD

**Dependencies:** node-api, node-messenger

---

### Mobile API Node

**Hostname:** mobile.balloo.su  
**Порты:** 3005  
**Роль:** React Native API Gateway

**Services:**
- Mobile-specific API endpoints
- Push Notification Service
- Device Management

**Requirements:**
- CPU: 2 vCPU
- RAM: 4 GB
- Disk: 50 GB SSD

**Dependencies:** node-api

---

### Database Node

**Hostname:** db.balloo.su  
**Порты:** 3006  
**Роль:** PostgreSQL / Drizzle ORM

**Services:**
- PostgreSQL 16 (Main DB)
- Drizzle ORM (Schema Migrations)
- Backups (Daily to Yandex Disk)

**Requirements:**
- CPU: 4 vCPU
- RAM: 16 GB
- Disk: 500 GB NVMe (RAID 1 recommended)

**Dependencies:** нет (root node)

---

### Cache Node

**Hostname:** cache.balloo.su  
**Порты:** 3007  
**Роль:** Redis / Message Broker

**Services:**
- Redis 7 (Cache, Sessions)
- BullMQ (Job Queue)
- Rate Limiting Storage

**Requirements:**
- CPU: 2 vCPU
- RAM: 8 GB
- Disk: 20 GB SSD

**Dependencies:** нет (root node)

---

### File Storage Node

**Hostname:** storage.balloo.su  
**Порты:** 3008  
**Роль:** File Storage / Transcoding

**Services:**
- Yandex Object Storage (S3 compatible)
- FFmpeg (Video/Audio transcode)
- Sharp (Image optimization)
- Nginx (File serving)

**Requirements:**
- CPU: 4 vCPU
- RAM: 8 GB
- Disk: 2 TB HDD (RAID 5)

**Dependencies:** node-api

---

*Все узлы работают в одной виртуальной сети balloo_net (Docker bridge).*

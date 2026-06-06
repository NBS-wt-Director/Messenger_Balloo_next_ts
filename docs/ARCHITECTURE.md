# 🏗️ App Balloo Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     App Balloo System                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │   Web    │    │  Mobile  │    │ Desktop  │                  │
│  │ Client   │    │  Client  │    │  Client  │                  │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                  │
│       │               │               │                          │
│       └───────────────┼───────────────┘                          │
│                       │                                          │
│              ┌────────▼────────┐                                 │
│              │   Nginx LB      │                                 │
│              │  (Port 80/443)  │                                 │
│              └────────┬────────┘                                 │
│                       │                                          │
│       ┌───────────────┼───────────────┐                          │
│       │               │               │                          │
│  ┌────▼────┐    ┌────▼────┐    ┌────▼────┐                      │
│  │   API   │    │   API   │    │   API   │                      │
│  │ Server  │    │ Server  │    │ Server  │                      │
│  │ (3001)  │    │ (3001)  │    │ (3001)  │                      │
│  └────┬────┘    └────┬────┘    └────┬────┘                      │
│       │              │              │                            │
│       └──────────────┼──────────────┘                            │
│                      │                                           │
│         ┌────────────┴────────────┐                              │
│         │                         │                              │
│  ┌──────▼──────┐          ┌───────▼───────┐                     │
│  │   SQLite    │          │  Max SMS      │                     │
│  │  Database   │          │  Server       │                     │
│  │             │          │  (8080)       │                     │
│  └─────────────┘          └───────┬───────┘                     │
│                                   │                              │
│                          ┌───────▼───────┐                     │
│                          │ Android App   │                     │
│                          │ (Samsung J3)  │                     │
│                          └───────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Frontend Clients

#### Web Client (Next.js + React)
- **Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Features:**
  - Real-time messaging via WebSocket
  - E2E encryption
  - File uploads via Yandex Disk
  - Push notifications
  - PWA support

#### Mobile Client (React Native) - *Planned*
- **Tech Stack:** React Native, TypeScript
- **Features:** Same as web + native push notifications

#### Desktop Client (Electron) - *Planned*
- **Tech Stack:** Electron, React, TypeScript
- **Features:** Same as web + system notifications

---

### 2. API Server (Node.js + Express)

**Port:** 3001

**Architecture:**
```
┌─────────────────────────────────────────┐
│           API Server                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐    ┌──────────┐          │
│  │  Routes  │───▶│Controllers│          │
│  └──────────┘    └────┬─────┘          │
│                       │                  │
│              ┌────────▼────────┐        │
│              │   Middleware    │        │
│              │ - Auth          │        │
│              │ - Validation    │        │
│              │ - Rate Limit    │        │
│              └────────┬────────┘        │
│                       │                  │
│              ┌────────▼────────┐        │
│              │   Services      │        │
│              │ - Business Logic│        │
│              └────────┬────────┘        │
│                       │                  │
│              ┌────────▼────────┐        │
│              │   Database      │        │
│              │   (SQLite)      │        │
│              └─────────────────┘        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     WebSocket Server            │   │
│  │     (Socket.IO)                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Key Modules:**
- **Auth:** JWT, 2FA (TOTP, SMS, Bot)
- **Chats:** 1-on-1, Groups, Roles
- **Messages:** Text, Media, E2E Encryption
- **WebSocket:** Real-time communication
- **Calls:** WebRTC signaling
- **Notifications:** Push, Email
- **Yandex:** OAuth, Disk Integration
- **Admin:** Management Panel
- **Max SMS:** SMS Gateway Integration

---

### 3. Max SMS System

**Port:** 8080

**Architecture:**
```
┌─────────────────────────────────────────┐
│          Max SMS Server                 │
├─────────────────────────────────────────┤
│                                         │
│  API Requests → Queue → Android App    │
│                                         │
│  ┌──────────┐    ┌──────────┐         │
│  │   API    │───▶│  Queue   │         │
│  │ Endpoints│    │(Memory)  │         │
│  └──────────┘    └────┬─────┘         │
│                       │                 │
│              ┌────────▼────────┐       │
│              │  Polling (5s)   │       │
│              └────────┬────────┘       │
│                       │                 │
│              ┌────────▼────────┐       │
│              │ Android App     │       │
│              │ (Termux/Node)   │       │
│              └────────┬────────┘       │
│                       │                 │
│              ┌────────▼────────┐       │
│              │  SMS Send       │       │
│              │ (Termux:SMS)    │       │
│              └─────────────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- 3-digit codes
- Auto-disable on errors
- Auto-recovery
- Monitoring

---

## Data Flow

### Message Sending Flow

```
User → Frontend → WebSocket → API Server
                          ↓
                    Save to Database
                          ↓
                  Broadcast to Recipients
                          ↓
                    Recipients' Clients
```

### 2FA Flow (Smart Router)

```
User Request → 2FA Router
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Max SMS (Priority 1)    Bot (Priority 2)
        ↓                       ↓
   Samsung J3            WebSocket Online
        ↓                       ↓
   Success? ✓              Success? ✓
        ↓                       ↓
   10 Errors → Disable    Offline → Skip
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
            Fallback: TOTP (Priority 3)
```

---

## Security Architecture

### Layers

1. **Transport Layer**
   - HTTPS (TLS 1.3)
   - WSS (WebSocket Secure)

2. **Authentication**
   - JWT tokens
   - 2FA (TOTP, SMS, Bot)
   - Session management

3. **Authorization**
   - Role-based access control
   - Resource-level permissions

4. **Data Encryption**
   - E2E encryption for messages
   - Password hashing (bcrypt)
   - Code hashing (SHA-256)

5. **Rate Limiting**
   - Global: 100 req/15min
   - Auth: 20 req/hour
   - SMS: 10 req/hour
   - WebSocket: 10 msg/3sec

---

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────┐
│          Cloud Provider                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │         Load Balancer            │  │
│  │         (Nginx)                  │  │
│  └──────────────┬───────────────────┘  │
│                 │                       │
│  ┌──────────────┼───────────────────┐  │
│  │              │                   │  │
│  ▼              ▼                   ▼  │
│ ┌────┐      ┌────┐            ┌────┐  │
│ │API │      │API │            │API │  │
│ │ #1 │      │ #2 │            │ #3 │  │
│ └────┘      └────┘            └────┘  │
│   │          │                    │   │
│   └──────────┼────────────────────┘   │
│              │                         │
│       ┌──────▼──────┐                  │
│       │  Database   │                  │
│       │  (Primary)  │                  │
│       └─────────────┘                  │
│                                         │
└─────────────────────────────────────────┘
```

### Docker Compose

```yaml
services:
  api:       # API Server (3 replicas)
  nginx:     # Reverse Proxy
  max:       # Max SMS Server
```

---

## Monitoring & Observability

### Metrics Collected

- HTTP requests (total, by endpoint, by status)
- WebSocket connections (active, total, errors)
- Database queries (count, avg response time, errors)
- System metrics (memory, CPU, uptime)

### Health Checks

- `/health` - Simple health check
- `/health/detailed` - Full system check
- `/health/ready` - Readiness probe
- `/health/live` - Liveness probe

### Logging

- Winston logger
- Structured JSON logs
- Separate files for errors and combined logs

---

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite (production: PostgreSQL)
- **WebSocket:** Socket.IO
- **Validation:** Zod
- **Authentication:** JWT + bcrypt
- **Encryption:** crypto-js, tweetnacl

### Frontend
- **Framework:** Next.js 15
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **HTTP Client:** Axios

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Reverse Proxy:** Nginx
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana

---

## Scalability

### Horizontal Scaling

- Stateless API servers
- Load balancer distribution
- Shared database
- Redis for session/cache (future)

### Performance Optimization

- Database indexing
- Connection pooling
- Rate limiting
- Caching (future)
- CDN for static assets (future)

---

## Future Enhancements

1. **Mobile Apps**
   - React Native (iOS/Android)
   - Native push notifications

2. **Desktop Apps**
   - Electron (Windows/macOS/Linux)
   - System tray integration

3. **Database Migration**
   - PostgreSQL for production
   - Connection pooling
   - Read replicas

4. **Advanced Monitoring**
   - Prometheus + Grafana
   - ELK stack for logs
   - Distributed tracing

5. **Microservices**
   - Split monolith
   - Service discovery
   - API gateway

---

**NLP-Core-Team** - App Balloo Messenger  
*Architecture Documentation v1.0*

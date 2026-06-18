---
title: Admin Portal Node
date: 2026-06-12
status: ✅ Production Ready
---

# Admin Portal Node Documentation

## Overview

The Admin Portal is the web-based administration interface for the Balloo platform.

## Features

- User management
- Content moderation
- Analytics dashboard
- System configuration
- Audit logs

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- React Query

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Overview and statistics |
| Users | `/users` | User management |
| Messages | `/messages` | Message moderation |
| Settings | `/settings` | System configuration |
| Logs | `/logs` | Audit logs |

## Authentication

Admin portal uses JWT-based authentication with role-based access control (RBAC).

### Roles

- `superadmin` - Full access
- `admin` - Most operations
- `moderator` - Content moderation only

## Configuration

```env
NEXT_PUBLIC_API_URL=http://api:3001
NEXT_PUBLIC_WS_URL=ws://messenger:3002
ADMIN_SESSION_TIMEOUT=3600
```

---
title: Messenger Node
date: 2026-06-12
status: ✅ Production Ready
---

# Messenger Node Documentation

## Overview

The Messenger node handles real-time messaging functionality.

## Features

- Real-time messaging via WebSocket
- Message encryption
- Read receipts
- Typing indicators
- File sharing support

## Architecture

```
┌─────────────┐     WebSocket     ┌─────────────┐
│   Client    │ ◄──────────────► │  Messenger  │
└─────────────┘                   │    Node     │
                                  └─────────────┘
                                        │
                                        ▼
                                  ┌─────────────┐
                                  │   Redis     │
                                  │   Pub/Sub   │
                                  └─────────────┘
```

## Configuration

```env
PORT=3002
REDIS_URL=redis://localhost:6379
API_URL=http://api:3001
```

## Events

### Client → Server
- `message:send` - Send new message
- `message:read` - Mark message as read
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Server → Client
- `message:new` - New message received
- `message:delivered` - Message delivered
- `user:online` - User came online
- `user:offline` - User went offline

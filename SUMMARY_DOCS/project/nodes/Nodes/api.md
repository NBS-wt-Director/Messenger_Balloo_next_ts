---
title: API Node
date: 2026-06-12
status: ✅ Production Ready
---

# API Node Documentation

## Overview

The API node is the main backend service for the Balloo platform.

## Features

- RESTful API endpoints
- WebSocket support for real-time communication
- Authentication & Authorization
- Rate limiting
- Request validation

## Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message
- `DELETE /api/messages/:id` - Delete message

## Configuration

Environment variables:
```env
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## Deployment

```bash
docker-compose up -d api
```

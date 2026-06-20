---
objectType: integration
nodeId: working
appId: messenger
integrationId: int-auth-email-password
title: "Email-Password аутентификация"
direction: inbound
targetType: service
targetId: api-auth-service
purpose: "Авторизация и регистрация пользователей через email и пароль"
trigger: "user submits login or register form"
input: "email (string), password (string)"
output: "JWT token, user profile, session ID"
protocolOrChannel: "HTTPS / REST API (POST /api/auth/login, POST /api/auth/register)"
authRequirements: "bcrypt-hashed password stored server-side, JWT signed with JWT_SECRET"
failureHandling: "return 401 for invalid credentials, 409 for duplicate email, log error"
relatedScreens: ["login", "register"]
relatedTransitions: ["t-login-to-dashboard", "t-register-to-dashboard"]
relatedScenarios: ["sc-login-flow", "sc-register-flow"]
sourceRefs:
  - type: code
    path: messenger/src/api/auth/email-password.ts
    title: "Email-password auth client"
  - type: code
    path: api/src/routes/auth.ts
    title: "Auth API routes"
  - type: state
    path: SUMMARY_DOCS/state/auth-policy-manifest.json
    title: "Authentication policy"
status: active
---

# Интеграция: Email-Password аутентификация

## Описание
Авторизация и регистрация пользователей через email и пароль.

## Параметры
- **Направление:** inbound
- **Тип цели:** service
- **Цель:** api-auth-service
- **Протокол:** HTTPS / REST API

## Связанные экраны
- [login](../screens/login.md)
- [register](../screens/register.md)

## Связанные сценарии
- [sc-login-flow](../scenarios/sc-login-flow.md)
- [sc-register-flow](../scenarios/sc-register-flow.md)

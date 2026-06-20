---
objectType: integration
nodeId: working
appId: messenger
integrationId: int-auth-yandex-oauth
title: "Yandex OAuth"
direction: inbound
targetType: external-system
targetId: yandex-id
purpose: "Авторизация пользователей через Яндекс ID"
trigger: "user clicks Yandex login button"
input: "OAuth authorization code"
output: "user profile data (email, name, avatar, yandex-id)"
protocolOrChannel: "OAuth 2.0 / HTTPS"
authRequirements: "Yandex OAuth client credentials (YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET)"
failureHandling: "fallback to email-password auth, log error, show user-friendly message"
relatedScreens: ["login"]
relatedTransitions: ["t-login-to-dashboard"]
relatedScenarios: ["sc-login-flow"]
sourceRefs:
  - type: code
    path: messenger/src/api/auth/yandex.ts
    title: "Yandex OAuth handler"
  - type: config
    path: messenger/config.json
    title: "Yandex OAuth config"
  - type: state
    path: SUMMARY_DOCS/state/auth-creator-superadmin.json
    title: "Creator-superadmin auth isolation rules"
status: active
---

# Интеграция: Yandex OAuth

## Описание
Авторизация пользователей через Яндекс ID.

## Параметры
- **Направление:** inbound
- **Тип цели:** external-system
- **Цель:** yandex-id
- **Протокол:** OAuth 2.0 / HTTPS

## Связанные экраны
- [login](../screens/login.md)

## Связанные сценарии
- [sc-login-flow](../scenarios/sc-login-flow.md)

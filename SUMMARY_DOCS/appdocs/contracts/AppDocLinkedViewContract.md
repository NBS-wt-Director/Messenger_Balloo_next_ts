# AppDocLinkedViewContract — Контракт Linked View

## Purpose

Описывает структуру linked-view JSON, который используется SUMMARYDOCS viewer для отображения связей между каноническими объектами.

## Root Structure

```json
{
  "version": "1.0.0",
  "nodeId": "<node-id>",
  "appId": "<app-id>",
  "lastUpdated": "ISO-8601 timestamp",
  "counters": {
    "screens": 0,
    "transitions": 0,
    "scenarios": 0,
    "integrations": 0
  },
  "screens": [],
  "transitions": [],
  "scenarios": [],
  "integrations": []
}
```

## Screens Array

```json
{
  "screenId": "login",
  "title": "Экран входа",
  "status": "active",
  "actors": ["public-user"],
  "relatedTransitions": ["t-login-to-dashboard", "t-login-to-register"],
  "relatedScenarios": ["sc-login-flow"],
  "relatedIntegrations": ["int-auth-email", "int-auth-yandex"],
  "sourceRefs": []
}
```

## Transitions Array

```json
{
  "transitionId": "t-login-to-dashboard",
  "title": "Вход в систему",
  "sourceScreenId": "login",
  "targetScreenId": "dashboard",
  "trigger": "user clicks login button",
  "status": "active",
  "relatedScenarios": ["sc-login-flow"],
  "relatedIntegrations": ["int-auth-email"]
}
```

## Scenarios Array

```json
{
  "scenarioId": "sc-login-flow",
  "title": "Поток авторизации",
  "goal": "Авторизовать пользователя",
  "actor": "public-user",
  "involvedScreens": ["login", "dashboard"],
  "involvedTransitions": ["t-login-to-dashboard"],
  "status": "active"
}
```

## Integrations Array

```json
{
  "integrationId": "int-auth-yandex",
  "title": "Yandex OAuth",
  "direction": "inbound",
  "targetType": "external-system",
  "targetId": "yandex-id",
  "relatedScreens": ["login"],
  "relatedScenarios": ["sc-login-flow"],
  "status": "active"
}
```

## API Contract

### GET /api/appdocs/linked-view?nodeId=X&appId=Y

Returns the linked-view JSON for the specified node and app.

**Response:**
```json
{
  "success": true,
  "data": { ...linked-view object... }
}
```

### GET /api/appdocs/linked-view?nodeId=X&appId=Y&type=screen&id=Z

Returns a single object by type and ID.

**Response:**
```json
{
  "success": true,
  "data": { ...object... }
}
```

### POST /api/appdocs/save

Saves a modified object.

**Request:**
```json
{
  "nodeId": "working",
  "appId": "messenger",
  "objectType": "screen",
  "screenId": "login",
  "data": { ...screen object... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Screen saved successfully",
  "auditId": "audit-xxx"
}
```

# Theme Contract

## Purpose

Этот контракт определяет систему тем оформления для всей платформы Balloo.

## Preset Themes

### 1. Light Theme (`light`)
```json
{
  "id": "light",
  "name": "Светлая",
  "colors": {
    "primary": "#007bff",
    "secondary": "#6c757d",
    "background": "#ffffff",
    "surface": "#f8f9fa",
    "text": "#212529",
    "textSecondary": "#6c757d",
    "border": "#dee2e6",
    "accent": "#007bff"
  }
}
```

### 2. Dark Theme (`dark`)
```json
{
  "id": "dark",
  "name": "Тёмная",
  "colors": {
    "primary": "#0d6efd",
    "secondary": "#6c757d",
    "background": "#1a1a1a",
    "surface": "#2d2d2d",
    "text": "#ffffff",
    "textSecondary": "#b0b0b0",
    "border": "#404040",
    "accent": "#0d6efd"
  }
}
```

### 3. Russia Theme (`russia`)
```json
{
  "id": "russia",
  "name": "Россия",
  "colors": {
    "primary": "#0039A6",
    "secondary": "#D52B1E",
    "background": "#ffffff",
    "surface": "#f0f0f0",
    "text": "#000000",
    "textSecondary": "#555555",
    "border": "#cccccc",
    "accent": "#D52B1E"
  }
}
```

## Rules

### Allowed Apps (custom themes)
- ✅ `apps/web-main` (messenger)
- ✅ `apps/mobile`
- ✅ `apps/desktop`

### Forbidden Apps (custom themes)
- ❌ `apps/admin` (admin-portal)
- ❌ `apps/api`
- ❌ `apps/docs-site`
- ❌ `apps/abaut`
- ❌ `apps/nodes-switcher`

### Storage Rules
- Custom themes сохраняются только после **2 дней использования**
- Пользовательские темы доступны **без регистрации** (для всех)
- Сохранение только для авторизованных пользователей

## Source

- **Current implementation**: `messenger/src/stores/settings-store.ts`
- **Future location**: `packages/core-theme`
- **Preset themes source**: `messenger/src/components/ThemeSelector.tsx`

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active
- **Total Presets**: 3

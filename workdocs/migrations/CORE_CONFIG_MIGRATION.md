# Phase 4: Core-Config Migration

**Date:** 2026-06-11  
**Status:** ✅ Complete  
**Phase:** 4/12

---

## Objective

Extract platform-wide configuration from `settings/` to `@balloo/core-config` package.

---

## Files Created

### `packages/core-config/`

```
packages/core-config/
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config
└── src/
    ├── types.ts          # Type definitions
    ├── config.ts         # Implementation
    └── index.ts          # Exports
```

### Types Extracted

| Category | Types/Interfaces |
|----------|------------------|
| Environment | Environment, Platform |
| App | AppSettings |
| Security | SecuritySettings |
| Database | DatabaseSettings |
| Push | PushSettings |
| Yandex | YandexSettings |
| Email | EmailSettings |
| Features | FeatureFlags |
| Admin | AdminSettings, TestUsers |
| Rate Limit | RateLimitSettings |
| Upload | UploadSettings |
| API | ApiSettings |
| Messenger | MessengerSettings |
| Admin Portal | AdminPortalSettings |
| Main Config | SettingsConfig |

### Functions Exported

| Function | Description |
|----------|-------------|
| `initSettings(platform)` | Initialize settings for platform |
| `getSettings(platform?)` | Get settings (auto-initialize) |
| `getEnvironment()` | Get current environment |
| `isDevelopment()` | Check if development |
| `isProduction()` | Check if production |
| `getApiUrl(platform?)` | Get API URL |
| `getWsUrl()` | Get WebSocket URL |
| `getApiBaseUrl()` | Get base API URL |
| `getMaxFileSize()` | Get max file size |
| `isRegistrationEnabled()` | Check registration status |
| `isMaintenanceMode()` | Check maintenance mode |

---

## Integration

### Backward Compatibility

Legacy `settings/` package re-exports from `@balloo/core-config`:

```typescript
// settings/src/index.ts
export type {
  Environment,
  Platform,
  AppSettings,
  // ... all types
} from '@balloo/core-config';

export {
  initSettings,
  getSettings,
  // ... all functions
} from '@balloo/core-config';
```

### Usage in Applications

```typescript
import { getSettings, isDevelopment } from '@balloo/core-config';

const settings = getSettings('web');

if (isDevelopment()) {
  console.log('Dev mode enabled');
}
```

---

## TypeScript Validation

```bash
cd packages/core-config
npx tsc --noEmit
# ✅ 0 errors
```

---

## Migration Impact

| Metric | Value |
|--------|-------|
| Types Extracted | 15+ |
| Functions Extracted | 11 |
| Files Changed | 3 |
| Backward Compatible | Yes |
| Breaking Changes | None |

---

## Next Steps

- Phase 5: Core-I18n ✅ (Complete)
- Future: Migrate api/, admin-api/ to use @balloo/core-config

---

## Rollback

If rollback needed:
1. Remove `packages/core-config/`
2. Restore settings/src/ files
3. Update STATE.json

---

*Migration completed: 2026-06-11*

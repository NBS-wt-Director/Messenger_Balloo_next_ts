# Core Types

## Purpose

Core type definitions for the Balloo platform.

## Source

This package is the extraction target from `shared/`.

## Migration Status

- **Phase 3**: Migration from `shared/` to `packages/core-types/` - IN PROGRESS
- **Current**: `shared/` remains in place with backward compatibility
- **Legacy apps**: Still use `@balloo/shared` (imports not changed yet)

## Types Extracted

- User types
- Chat types
- Message types
- Invitation types
- Notification types
- Feature types
- Page types
- Report types
- Auth types
- API response types
- Platform types
- Config types

## Backward Compatibility

During migration, `shared/` re-exports from `core-types` to maintain compatibility:

```typescript
// shared/src/index.ts (backward compat)
export * from '@balloo/core-types';
```

## Rules

1. **Type-first**: Types define the contract
2. **No implementation**: This package contains only types
3. **Backward compat**: Keep compatibility with shared/ during migration
4. **No breaking changes**: Add types, don't remove or modify existing signatures

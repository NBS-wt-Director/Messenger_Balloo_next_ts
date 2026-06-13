# Phase 10: Node Apps Normalization

**Date:** 2026-06-12  
**Status:** In Progress  
**Phase:** 10/12

---

## Objective

Normalize Node.js applications (api/, admin-api/, notifications/) with:
- Shared ESLint configuration
- Shared Prettier configuration
- Unified TypeScript base config
- Standardized package.json scripts

---

## Files Created

### Shared Config Packages

#### @balloo/eslint-config
```
packages/eslint-config/
├── package.json
├── index.js
└── README.md
```

#### @balloo/prettier-config
```
packages/prettier-config/
├── package.json
├── index.json
└── README.md
```

#### @balloo/tsconfig
```
packages/tsconfig/
├── package.json
├── base.json         # Node.js backend config
├── next.json         # Next.js frontend config
└── README.md
```

---

## Progress

| Task | Status |
|------|--------|
| Create shared ESLint config | ✅ Done |
| Create shared Prettier config | ✅ Done |
| Create shared tsconfig base | ✅ Done |
| Create shared tsconfig next | ✅ Done |
| Update api/ to use shared configs | ⏳ Pending |
| Update admin-api/ to use shared configs | ⏳ Pending |
| Update notifications/ to use shared configs | ⏳ Pending |
| Standardize package.json scripts | ⏳ Pending |
| TypeScript validation | ⏳ Pending |

**Overall Progress:** 30%

---

## Migration Plan

### Step 1: Update api/

**tsconfig.json:**
```json
{
  "extends": "@balloo/tsconfig/base.json",
  "compilerOptions": {
    // App-specific overrides
  }
}
```

**.eslintrc.js:**
```javascript
module.exports = {
  extends: ['@balloo'],
};
```

**.prettierrc:**
```json
{
  "extends": "@balloo"
}
```

### Step 2: Update admin-api/

Same as api/

### Step 3: Update notifications/

Same as api/

### Step 4: Standardize Scripts

All Node apps should have:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src/",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Current State

### api/
- Uses standalone tsconfig.json
- No ESLint config
- No Prettier config

### admin-api/
- Uses standalone tsconfig.json
- No ESLint config
- No Prettier config

### notifications/
- Uses standalone tsconfig.json
- No ESLint config
- No Prettier config

---

## Next Steps

1. Update api/tsconfig.json to extend @balloo/tsconfig/base.json
2. Create api/.eslintrc.js with @balloo/eslint-config
3. Create api/.prettierrc with @balloo/prettier-config
4. Repeat for admin-api/ and notifications/
5. Standardize package.json scripts
6. Validate TypeScript
7. Run linting
8. Test builds

---

## Acceptance Criteria

1. [ ] All Node apps use shared configs
2. [ ] TypeScript validation passes
3. [ ] Linting passes with no errors
4. [ ] All scripts standardized
5. [ ] Builds succeed
6. [ ] STATE.json updated

---

## Rollback

If rollback needed:
1. Remove shared config packages
2. Restore original tsconfig.json files
3. Remove .eslintrc.js files
4. Remove .prettierrc files
5. Restore original package.json scripts

---

*Phase 10 started: 2026-06-12*

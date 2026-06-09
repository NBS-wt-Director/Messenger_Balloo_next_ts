# Tree Contract

## Purpose

Этот контракт определяет модель дерева узлов платформы Balloo.

## Node Structure

```typescript
interface Node {
  id: string;
  type: 'app' | 'package' | 'contract' | 'doc' | 'tool';
  name: string;
  path: string;
  parent?: string;
  children?: string[];
  metadata: {
    status: 'active' | 'legacy' | 'planned';
    version?: string;
    dependencies?: string[];
  };
}
```

## Tree Structure (Current)

```
balloo-monorepo/
├── apps/
│   ├── web-main (messenger) [active]
│   ├── admin (admin-portal) [active]
│   ├── api [active]
│   ├── desktop [planned]
│   ├── mobile [planned]
│   ├── android-service [planned]
│   └── max-server [planned]
├── packages/
│   ├── shared [active]
│   ├── settings [active]
│   └── [core-* packages] [planned]
├── workdocs/
│   ├── contracts/ [active]
│   ├── nodes/ [planned]
│   └── trees/ [planned]
├── docs-content/ [planned]
└── infra/ [planned]
```

## Rules

1. **Unique IDs**: каждый узел имеет уникальный id
2. **Path-based**: path определяет местоположение в репозитории
3. **Status tracking**: active, legacy, planned
4. **Dependencies**: явные зависимости между узлами

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

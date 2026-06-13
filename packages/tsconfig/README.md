# @balloo/tsconfig

Shared TypeScript configurations for the Balloo platform.

## Installation

```bash
npm install @balloo/tsconfig --save-dev
```

## Configurations

### Base (Node.js)

For Node.js backend services:

```json
{
  "extends": "@balloo/tsconfig/base.json"
}
```

Includes:
- ES2020 target
- CommonJS module
- Strict type checking
- Declaration files
- Source maps

### Next.js

For Next.js applications:

```json
{
  "extends": "@balloo/tsconfig/next.json"
}
```

Includes:
- ES2020 target
- ESNext modules
- JSX support (preserve)
- No emit (handled by Next.js)
- Incremental builds

## Usage

### Backend (api/, admin-api/)

```json
{
  "extends": "@balloo/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### Frontend (messenger/, admin-portal/)

```json
{
  "extends": "@balloo/tsconfig/next.json"
}
```

### Libraries (packages/*)

```json
{
  "extends": "@balloo/tsconfig/base.json",
  "compilerOptions": {
    "declaration": true
  }
}
```

## License

MIT

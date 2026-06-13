# @balloo/eslint-config

Shared ESLint configuration for the Balloo platform.

## Installation

```bash
npm install @balloo/eslint-config --save-dev
```

## Usage

Extend this config in your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@balloo'],
};
```

Or in `.eslintrc.json`:

```json
{
  "extends": ["@balloo"]
}
```

## Included Rules

Based on:
- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:react-hooks/recommended`
- `next/core-web-vitals`

## Customizations

- Allows unused variables starting with `_`
- Warns on `any` types
- Warns on console statements (except warn/error)
- Enforces `const` over `var`

## License

MIT

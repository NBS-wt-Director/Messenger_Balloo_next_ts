# @balloo/prettier-config

Shared Prettier configuration for the Balloo platform.

## Installation

```bash
npm install @balloo/prettier-config --save-dev
```

## Usage

Extend this config in your `.prettierrc`:

```json
{
  "extends": "@balloo"
}
```

Or create `.prettierrc.js`:

```javascript
module.exports = require('@balloo/prettier-config');
```

## Configuration

- **semi**: true - Always use semicolons
- **trailingComma**: "es5" - Trailing commas where valid in ES5
- **singleQuote**: true - Use single quotes
- **printWidth**: 80 - Max line length
- **tabWidth**: 2 - 2 spaces per tab
- **useTabs**: false - Use spaces instead of tabs
- **bracketSpacing**: true - Spaces in object brackets
- **arrowParens**: "always" - Always wrap arrow params
- **endOfLine**: "lf" - LF line endings

## License

MIT

module.exports = {
  extends: ['@balloo', 'next/core-web-vitals'],
  rules: {
    // App-specific overrides
    'no-console': 'off', // Allow console in admin portal
  },
};

module.exports = {
  extends: ['@balloo'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // App-specific overrides
    'no-console': 'off', // Allow console in API
  },
};

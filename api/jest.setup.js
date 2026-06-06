/**
 * Jest Setup
 */

globalThis.TEST_MODE = true;

// Mock console.log в тестовом режиме
if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
}

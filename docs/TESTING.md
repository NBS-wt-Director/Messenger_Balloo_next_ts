# 🧪 Testing Guide

**Руководство по тестированию App Balloo**

---

## 📋 Содержание

1. [Типы тестов](#типы-тестов)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Test Coverage](#test-coverage)
6. [CI/CD](#cicd)

---

## Типы тестов

### Пирамида тестирования

```
        E2E Tests (10%)
           /   \
          /     \
Integration (30%)
        /   \
       /     \
   Unit (60%)
```

| Тип | Инструменты | Где |
|-----|-------------|-----|
| **Unit** | Jest, Vitest | API, Utils, Services |
| **Integration** | Supertest, Jest | API endpoints, DB |
| **E2E** | Playwright, Cypress | Frontend |

---

## Unit Tests

### API Server

**Тестирование контроллеров:**

```javascript
// __tests__/controllers/auth.controller.test.js
const { register, login } = require('../../src/controllers/auth.controller');
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Controller', () => {
  test('register should create user', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'Test1234!',
        displayName: 'Test User'
      }
    };
    const res = mockRes();
    
    await register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test('login with invalid credentials', async () => {
    const req = {
      body: {
        email: 'wrong@example.com',
        password: 'wrongpass'
      }
    };
    const res = mockRes();
    
    await login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
```

**Запуск тестов:**

```bash
cd api
npm test
```

**Тесты с coverage:**

```bash
npm run test:coverage
```

### Frontend (Messenger)

**Тестирование компонентов:**

```typescript
// __tests__/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { AuthProvider } from '@/contexts/AuthContext';

describe('Header', () => {
  test('renders user name when logged in', () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
    
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  test('logout button calls handler', async () => {
    const logoutMock = jest.fn();
    
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await userEvent.click(logoutButton);
    
    expect(logoutMock).toHaveBeenCalled();
  });
});
```

**Запуск тестов:**

```bash
cd messenger
npm test
```

---

## Integration Tests

### API Integration Tests

```javascript
// __tests__/integration/chats.integration.test.js
const request = require('supertest');
const app = require('../../src/index');
const db = require('../../src/config/database');

describe('Chats API Integration', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Создать тестового пользователя
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'integration@test.com',
        password: 'Test1234!',
        displayName: 'Integration Test'
      });
    
    authToken = res.body.data.accessToken;
    userId = res.body.data.user.id;
  });

  test('create chat', async () => {
    const res = await request(app)
      .post('/api/v1/chats')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        type: 'direct',
        participantIds: ['other-user-id']
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  test('get chats list', async () => {
    const res = await request(app)
      .get('/api/v1/chats')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
```

**Запуск интеграционных тестов:**

```bash
cd api
npm run test:integration
```

### Database Integration Tests

```javascript
// __tests__/integration/database.test.js
const db = require('../../src/config/database');

describe('Database Integration', () => {
  beforeAll(() => {
    db.run('DELETE FROM users WHERE email LIKE ?', ['integration-test%']);
  });

  test('create and retrieve user', () => {
    const userId = db.prepare(`
      INSERT INTO users (email, password, displayName, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(
      'integration@test.com',
      'hashed_password',
      'Test User',
      Date.now()
    );

    const user = db.prepare('SELECT * FROM users WHERE id = ?')
      .get(userId);

    expect(user.email).toBe('integration@test.com');
    expect(user.displayName).toBe('Test User');
  });
});
```

---

## E2E Tests

### Playwright E2E Tests

**Конфигурация:**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
});
```

**Тесты:**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('[name="email"]', 'e2e@test.com');
    await page.fill('[name="password"]', 'Test1234!');
    await page.fill('[name="displayName"]', 'E2E User');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/chats');
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'test@balloo.ru');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/chats');
  });
});

test.describe('Chats', () => {
  test('should create chat', async ({ page }) => {
    await page.goto('/chats');
    await page.click('[data-testid="new-chat-button"]');
    
    await page.fill('[name="name"]', 'New Chat');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.chat-list')).toContainText('New Chat');
  });
});
```

**Запуск E2E тестов:**

```bash
cd messenger
npm run test:e2e
```

**E2E тесты с UI:**

```bash
npm run test:e2e:ui
```

---

## Test Coverage

### Настройка Coverage

**API (jest.config.js):**

```javascript
module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Frontend (jest.config.js):**

```javascript
module.exports = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Генерация отчёта

```bash
# API
cd api
npm run test:coverage

# Frontend
cd messenger
npm run test:coverage
```

### View Coverage Report

```bash
# Open HTML report
open coverage/lcov-report/index.html
```

**Цели покрытия:**

| Компонент | Min Coverage | Target |
|-----------|--------------|--------|
| **API Controllers** | 70% | 85% |
| **Services** | 80% | 90% |
| **Frontend Components** | 60% | 75% |
| **Utils** | 90% | 95% |

---

## CI/CD

### GitHub Actions

**.github/workflows/test.yml:**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-api:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./api
        run: npm install
      
      - name: Run tests
        working-directory: ./api
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./api/coverage/lcov.info

  test-messenger:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./messenger
        run: npm install
      
      - name: Run tests
        working-directory: ./messenger
        run: npm test
      
      - name: Build
        working-directory: ./messenger
        run: npm run build

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        working-directory: ./messenger
        run: npm run test:e2e
```

### Codecov

```yaml
# .codecov.yml
codecov:
  require_ci_to_pass: yes

coverage:
  precision: 2
  round: down
  range: "70...100"

parsers:
  gcov:
    branch_detection:
      conditional: yes
      loop: yes
      method: no
      macro: no

comment:
  layout: "reach,diff,flags,files,footer"
  behavior: default
  require_changes: no
```

---

## Best Practices

### 1. Тестовые данные

```javascript
// __tests__/fixtures/users.js
module.exports = {
  validUser: {
    email: 'valid@test.com',
    password: 'Test1234!',
    displayName: 'Valid User',
  },
  invalidEmail: {
    email: 'invalid-email',
    password: 'Test1234!',
    displayName: 'Invalid User',
  },
  shortPassword: {
    email: 'test@test.com',
    password: '123',
    displayName: 'Short Password',
  },
};
```

### 2. Моки

```javascript
// __tests__/mocks/db.js
module.exports = {
  db: {
    prepare: jest.fn().mockReturnValue({
      run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
      get: jest.fn().mockReturnValue({ id: 1, email: 'test@test.com' }),
      all: jest.fn().mockReturnValue([]),
    }),
  },
};
```

### 3. Before/After Hooks

```javascript
describe('Feature', () => {
  beforeAll(async () => {
    // Setup: создать тестовые данные
  });

  beforeEach(() => {
    // Reset state перед каждым тестом
  });

  afterEach(() => {
    // Cleanup после каждого теста
  });

  afterAll(async () => {
    // Teardown: удалить тестовые данные
  });
});
```

---

## Troubleshooting

### Проблема: Тесты падают случайно

```bash
# Запустить с флагом --detectOpenHandles
npm test -- --detectOpenHandles

# Запустить с детальной информацией
npm test -- --verbose
```

### Проблема: Медленные тесты

```bash
# Запустить только изменённые тесты
npm test -- --changedSince=main

# Параллельное выполнение
npm test -- --maxWorkers=4
```

### Проблема: Моки не работают

```bash
# Очистить кэш Jest
npm test -- --clearCache

# Пересоздать моки
rm -rf node_modules/.cache
```

---

**Успешного тестирования! 🧪**

**NLP-Core-Team** - App Balloo Project

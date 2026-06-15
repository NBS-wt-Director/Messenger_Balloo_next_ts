/**
 * E2E Smoke Tests
 * Базовые тесты критического функционала
 * 
 * @playwright
 */

import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:3001';

test.describe('Balloo Platform - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.describe('Landing Page', () => {
    test('should load landing page successfully', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check title
      await expect(page).toHaveTitle(/Balloo/);
      
      // Check hero section
      await expect(page.locator('h1')).toContainText('Переверни общение');
      
      // Check navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Check features section
      await expect(page.locator('#features')).toBeVisible();
      
      // Check pricing section
      await expect(page.locator('#pricing')).toBeVisible();
    });

    test('should navigate to login from landing', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const loginButton = page.locator('a[href*="3007"]').first();
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toHaveText(/Войти|Начать/);
    });

    test('should scroll and show sticky navigation', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Navigation should be transparent at top
      const nav = page.locator('nav');
      await expect(nav).toHaveClass(/transparent|bg-transparent/);
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);
      
      // Navigation should have background
      await expect(nav).toHaveClass(/scrolled|shadow|bg-white/);
    });
  });

  test.describe('Nodes Switcher', () => {
    test('should load nodes switcher', async ({ page }) => {
      await page.goto(`${BASE_URL}:3007`);
      
      await expect(page).toHaveTitle(/Nodes|Balloo/);
      await expect(page.locator('h1')).toContainText(/Nodes|Узлы/);
    });

    test('should display all platform nodes', async ({ page }) => {
      await page.goto(`${BASE_URL}:3007`);
      
      // Check for node cards
      const nodeCards = page.locator('[data-testid="node-card"]');
      await expect(nodeCards.count()).toBeGreaterThan(10);
    });

    test('should filter nodes by search', async ({ page }) => {
      await page.goto(`${BASE_URL}:3007`);
      
      const searchInput = page.locator('input[placeholder*="Поиск"]');
      await expect(searchInput).toBeVisible();
      
      await searchInput.fill('API');
      await page.waitForTimeout(300);
      
      // Should filter results
      const filteredCards = page.locator('[data-testid="node-card"]');
      const count = await filteredCards.count();
      expect(count).toBeLessThan(20);
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Workdocs', () => {
    test('should load documentation portal', async ({ page }) => {
      await page.goto(`${BASE_URL}:3006`);
      
      await expect(page).toHaveTitle(/Workdocs|Documentation/);
      await expect(page.locator('h1')).toContainText(/Documentation|Документация/);
    });

    test('should display documentation categories', async ({ page }) => {
      await page.goto(`${BASE_URL}:3006`);
      
      // Check for category sections
      const categories = page.locator('[data-testid="doc-category"]');
      await expect(categories.count()).toBeGreaterThan(3);
    });
  });

  test.describe('API Gateway', () => {
    test('should respond to health check', async ({ request }) => {
      const response = await request.get(`${API_URL}/health`);
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
      
      const body = await response.json();
      expect(body.status).toBe('ok');
    });

    test('should return API version', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/version`);
      
      expect(response.ok()).toBeTruthy();
      
      const body = await response.json();
      expect(body).toHaveProperty('version');
    });

    test('should reject unauthenticated requests', async ({ request }) => {
      const response = await request.get(`${API_URL}/api/auth/me`);
      
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Working Sandbox', () => {
    test('should load code editor', async ({ page }) => {
      await page.goto(`${BASE_URL}:3008`);
      
      await expect(page).toHaveTitle(/Working|Sandbox/);
      
      // Check for code editor
      const editor = page.locator('[data-testid="code-editor"]');
      await expect(editor).toBeVisible();
    });

    test('should execute code', async ({ page }) => {
      await page.goto(`${BASE_URL}:3008`);
      
      // Find code editor and run button
      const editor = page.locator('[data-testid="code-editor"]');
      const runButton = page.locator('button:has-text("Run"), button:has-text("Запустить")');
      
      if (await runButton.isVisible()) {
        // Clear editor and add simple code
        await editor.fill('console.log("Hello from Balloo!");');
        
        // Run code
        await runButton.click();
        
        // Check for output
        const output = page.locator('[data-testid="output"]');
        await expect(output).toBeVisible();
      }
    });
  });

  test.describe('Kodegen', () => {
    test('should load AI code generator', async ({ page }) => {
      await page.goto(`${BASE_URL}:3009`);
      
      await expect(page).toHaveTitle(/Kodegen|AI|Generator/);
      
      // Check for template selection
      const templates = page.locator('[data-testid="template"]');
      await expect(templates.count()).toBeGreaterThan(3);
    });
  });

  test.describe('Platform State', () => {
    test('should load monitoring dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}:3015`);
      
      await expect(page).toHaveTitle(/Platform|State|Monitoring/);
      
      // Check for metrics
      const metrics = page.locator('[data-testid="metric"]');
      await expect(metrics.count()).toBeGreaterThan(3);
    });

    test('should show node status', async ({ page }) => {
      await page.goto(`${BASE_URL}:3015`);
      
      // Check for status indicators
      const statusBadges = page.locator('[data-testid="status-badge"]');
      await expect(statusBadges.count()).toBeGreaterThan(5);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto(BASE_URL);
      
      // Check mobile menu button
      const mobileMenuButton = page.locator('button.md\\:hidden');
      await expect(mobileMenuButton).toBeVisible();
      
      // Check hero is visible
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto(BASE_URL);
      
      // Check layout adapts
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load landing page within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    });

    test('should load nodes switcher within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}:3007`);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    });
  });
});

import { test, expect } from '@playwright/test';

test.describe('API Health', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
  });

  test('config endpoint returns app config', async ({ request }) => {
    const response = await request.get('/api/config');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.data).toHaveProperty('appName');
    expect(data.data.appName).toBe('PolyOdin');
  });

  test('portfolio endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/portfolio');
    expect(response.status()).toBe(401);
  });

  test('trades endpoint requires auth', async ({ request }) => {
    const response = await request.get('/api/trades');
    expect(response.status()).toBe(401);
  });

  test('markets endpoint is public', async ({ request }) => {
    const response = await request.get('/api/markets');
    // Should return 200 (or 500 if Polymarket API is down), but not 401
    expect(response.status()).not.toBe(401);
  });
});

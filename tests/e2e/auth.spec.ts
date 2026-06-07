import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText(/Connect/i)).toBeVisible();
  });

  test('shows MetaMask connect button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /metamask/i })).toBeVisible();
  });

  test('unauthenticated user is redirected from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('unauthenticated user is redirected from portfolio', async ({ page }) => {
    await page.goto('/dashboard/portfolio');
    await expect(page).toHaveURL(/login/);
  });

  test('login page has terms link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /terms/i })).toBeVisible();
  });
});

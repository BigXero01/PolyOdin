import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PolyOdin/);
  });

  test('shows hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('PolyOdin')).toBeVisible();
  });

  test('has Get Started button', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('link', { name: /get started/i });
    await expect(btn).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Features' }).first().click();
    await expect(page).toHaveURL('/features');
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/pricing/i)).toBeVisible();
  });

  test('blog page loads', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByText(/blog/i)).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText(/contact/i)).toBeVisible();
  });
});

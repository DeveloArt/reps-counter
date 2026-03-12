import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads without errors', async ({ page }) => {
    await expect(page).toHaveTitle(/FitCounter/i);
  });

  test('shows main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('has call to action buttons', async ({ page }) => {
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
  });

  test('navigation to app works', async ({ page }) => {
    const appLink = page.getByRole('link', { name: /start/i });
    await expect(appLink).toBeVisible();
  });
});

test.describe('PWA App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
  });

  test('loads dashboard', async ({ page }) => {
    await expect(page.getByText(/home/i)).toBeVisible({ timeout: 10000 });
  });

  test('shows exercises section', async ({ page }) => {
    await expect(page.getByText(/exercise/i)).toBeVisible({ timeout: 10000 });
  });
});

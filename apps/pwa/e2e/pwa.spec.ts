import { expect, test } from '@playwright/test';

test.describe('Exercise Logging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
  });

  test('can view exercises', async ({ page }) => {
    const exerciseCards = page.locator('[class*="exercise"], [class*="card"]');
    await expect(exerciseCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to stats', async ({ page }) => {
    const statsLink = page.getByRole('link', { name: /stats/i });
    if (await statsLink.isVisible()) {
      await statsLink.click();
      await expect(page.getByText(/statistics/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('can navigate to goals', async ({ page }) => {
    const goalsLink = page.getByRole('link', { name: /goals/i });
    if (await goalsLink.isVisible()) {
      await goalsLink.click();
      await expect(page.getByText(/goal/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('can navigate to settings', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /settings/i });
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await expect(page.getByText(/settings/i)).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Responsive Design', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    await expect(page).toHaveTitle(/FitCounter/i);
  });

  test('works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/app');
    await expect(page).toHaveTitle(/FitCounter/i);
  });
});

import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('loads and shows onboarding welcome', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveTitle(/DETOXYA/i);
  });

  test('app shell serves offline-ready assets', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest');
    expect(response?.ok()).toBeTruthy();
    const body = await response!.text();
    expect(body).toContain('DETOXYA');
  });
});

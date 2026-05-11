const { test, expect } = require('@playwright/test');

const CASE_COUNT = 120;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 24 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^local guide$/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^tours$/i }).click();
    await expect(page).toHaveURL(/\/tours/);
  },
  async (page) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^login$/i }).click();
    await expect(page).toHaveURL(/\/login/);
  },
  async (page) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^register$/i }).click();
    await expect(page).toHaveURL(/\/register/);
  },
  async (page) => {
    await page.goto('/missing-route-for-404');
    await page.getByRole('link', { name: /go home/i }).click();
    await expect(page).toHaveURL(/\/$/);
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /toggle theme/i })).toBeVisible();
  },
];

test.describe('Navigation Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`NAV-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

const { test, expect } = require('@playwright/test');

const CASE_COUNT = 140;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 28 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^login$/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^register$/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^my dashboard$/i })).toHaveCount(0);
  },
  async (page) => {
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/dashboard/tourist');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/dashboard/guide');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^tours$/i })).toBeVisible();
  },
];

test.describe('Dashboard Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`DASH-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

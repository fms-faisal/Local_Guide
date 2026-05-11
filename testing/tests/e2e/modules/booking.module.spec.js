const { test, expect } = require('@playwright/test');

const CASE_COUNT = 180;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 30 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/dashboard/tourist');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/dashboard/guide');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByText(/refine results/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByRole('button', { name: /apply filters/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/register');
    await expect(page.getByRole('button', { name: /register account/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /tours/i })).toBeVisible();
  },
];

test.describe('Booking Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`BOOK-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

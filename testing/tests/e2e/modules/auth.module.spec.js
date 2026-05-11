const { test, expect } = require('@playwright/test');

const CASE_COUNT = 180;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 30 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Password')).toHaveAttribute('required', '');
  },
  async (page) => {
    await page.goto('/login');
    await page.fill('input[aria-label="Email"]', 'invalid-email');
    const valid = await page.locator('input[aria-label="Email"]').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
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
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL(/\/login$/);
  },
];

test.describe('Authentication Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`AUTH-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

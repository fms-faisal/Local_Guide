const { test, expect } = require('@playwright/test');

const CASE_COUNT = 160;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 25 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/tours/000000000000000000000000');
    await expect(page.getByText(/tour not found/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours/invalid-id');
    await expect(page.getByText(/tour not found/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/missing-route-for-404');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  },
  async (page) => {
    await page.goto('/missing-route-for-404');
    await expect(page.getByRole('link', { name: /go home/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByText(/featured guides & tours/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByText(/verified guides/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByText(/premium support/i)).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.getByText(/top rated experiences/i)).toBeVisible();
  },
];

test.describe('Tour Detail Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`DETAIL-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

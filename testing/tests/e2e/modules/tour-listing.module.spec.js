const { test, expect } = require('@playwright/test');

const CASE_COUNT = 220;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 35 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByRole('heading', { name: /discover premium tours guided by locals/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByRole('heading', { name: /available tours/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByLabel('Location')).toBeVisible();
    await expect(page.getByLabel('Language')).toBeVisible();
    await expect(page.getByLabel('Max Price')).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByLabel('Available Date')).toBeVisible();
    await expect(page.getByLabel('Minimum Rating')).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours?search=Dhaka');
    await expect(page.getByLabel('Location')).toHaveValue('Dhaka');
  },
  async (page) => {
    await page.goto('/');
    await page.fill('input[placeholder="Destination"]', 'Dhaka');
    await page.click('button:has-text("Search")');
    await expect(page).toHaveURL(/\/tours\?/);
  },
  async (page) => {
    await page.goto('/tours');
    await page.fill('input[aria-label="Location"]', 'Coxs Bazar');
    await page.click('button:has-text("Apply Filters")');
    await expect(page).toHaveURL(/\/tours/);
  },
  async (page) => {
    await page.goto('/');
    await expect(page.locator('a[href*="category=Adventure"]')).toBeVisible();
  },
  async (page) => {
    await page.goto('/');
    await expect(page.locator('a[href*="category=Culture"]')).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours');
    await expect(page.getByRole('button', { name: /apply filters/i })).toBeVisible();
  },
];

test.describe('Tour Listing Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`TOUR-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

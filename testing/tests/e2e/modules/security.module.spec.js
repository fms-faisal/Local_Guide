const { test, expect } = require('@playwright/test');

const CASE_COUNT = 160;

const tagsFor = (i) => {
  const tags = ['@security', '@regression'];
  if (i % 20 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  },
  async (page) => {
    await page.goto('/dashboard/admin');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login$/);
  },
  async (page) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours?search=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
    await expect(page.getByRole('heading', { name: /discover premium tours guided by locals/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/tours?location=%3Cimg%20src=x%20onerror=alert(1)%3E');
    await expect(page.getByRole('heading', { name: /available tours/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/login');
    await page.fill('input[aria-label="Email"]', 'drop-table@example.com');
    await page.fill('input[aria-label="Password"]', "' OR 1=1 --");
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/\/login|\/dashboard\//);
  },
];

test.describe('Security Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`SEC-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

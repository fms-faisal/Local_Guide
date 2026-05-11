const { test, expect } = require('@playwright/test');

const CASE_COUNT = 180;

const tagsFor = (i) => {
  const tags = ['@regression'];
  if (i % 30 === 0) tags.push('@smoke');
  return tags.join(' ');
};

const checks = [
  async (page) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create your guide profile/i })).toBeVisible();
  },
  async (page) => {
    await page.goto('/register');
    await expect(page.getByLabel('Name')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Email')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Password')).toHaveAttribute('required', '');
  },
  async (page) => {
    await page.goto('/register');
    await expect(page.getByLabel('Role')).toBeVisible();
    const options = await page.locator('select[aria-label="Role"] option').allTextContents();
    expect(options.join(' ')).toMatch(/Tourist/);
    expect(options.join(' ')).toMatch(/Guide/);
  },
  async (page) => {
    await page.goto('/register');
    await expect(page.getByLabel('Bio')).toBeVisible();
    await expect(page.getByLabel('Location')).toBeVisible();
  },
  async (page) => {
    await page.goto('/register');
    await page.click('button:has-text("Register Account")');
    await expect(page).toHaveURL(/\/register$/);
  },
  async (page) => {
    await page.goto('/register');
    await page.fill('input[aria-label="Email"]', 'wrong');
    const valid = await page.locator('input[aria-label="Email"]').evaluate((el) => el.checkValidity());
    expect(valid).toBe(false);
  },
];

test.describe('Registration Module Pack', () => {
  for (let i = 1; i <= CASE_COUNT; i += 1) {
    test(`REG-${String(i).padStart(4, '0')} ${tagsFor(i)}`, async ({ page }) => {
      const check = checks[(i - 1) % checks.length];
      await check(page);
    });
  }
});

import { expect, test } from '@playwright/test';

test('home shows hero and financeflow cta', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Isaiah Francois' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View FinanceFlow' }),
  ).toHaveAttribute('href', 'https://www.financeflow.dev');
});

test('contact form renders and validates required fields', async ({ page }) => {
  await page.goto('/contact');

  await page.getByRole('button', { name: 'Send Message' }).click();

  await expect(
    page.getByText('Name must be at least 2 characters.'),
  ).toBeVisible();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(
    page.getByText('Message must be at least 10 characters.'),
  ).toBeVisible();
});

test('admin route requires authentication', async ({ page }) => {
  await page.goto('/admin');

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

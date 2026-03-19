import { expect, test } from '@playwright/test';

test('home shows hero and financeflow project link', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: "I'm Isaiah." }),
  ).toBeVisible();

  await page.locator('article').first().hover();

  await expect(
    page.getByRole('link', { name: 'FinanceFlow' }).first(),
  ).toHaveAttribute('href', 'https://www.financeflow.dev');
});

test('contact route redirects to the homepage contact section', async ({
  page,
}) => {
  await page.goto('/contact');

  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole('heading', { name: "Let's Build Something Great!" }),
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'View next month' }),
  ).toBeVisible();

  const firstTimeButton = page
    .locator('#contact button')
    .filter({ hasText: /\d{1,2}:\d{2}/ })
    .first();

  if ((await firstTimeButton.count()) > 0) {
    await expect(firstTimeButton).toBeVisible();
    await firstTimeButton.click();
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  } else {
    await expect(
      page.getByText('No available times for this day.'),
    ).toBeVisible();
  }
});

test('admin route requires authentication', async ({ page }) => {
  await page.goto('/admin');

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

import { expect, test } from '@playwright/test';

const menuLabels = ['Work', 'About', 'Résumé', 'Contact'];
const menuNames = new RegExp(`^(?:${menuLabels.join('|')})$`);

test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('desktop visitors can reach each page from the opaque menu bar', async ({
  page,
}) => {
  await page.goto('/#projects');
  const banner = page.getByRole('banner');
  const menu = banner.getByRole('navigation', { name: 'Primary navigation' });
  await expect(menu.getByRole('link', { name: menuNames })).toHaveText(
    menuLabels,
  );
  await expect(
    menu.getByRole('link', { name: 'Go to the homepage' }),
  ).toBeVisible();
  await expect(
    menu.getByRole('button', { name: 'Reduce motion' }),
  ).toBeEnabled();
  await page.evaluate(() => window.scrollTo(0, 0));
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await skipLink.focus();
  await skipLink.click({ trial: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(banner).toBeInViewport({ ratio: 1 });
  await expect(banner).toHaveCSS('background-color', /^rgb\(/);

  await menu.getByRole('link', { name: 'Résumé' }).press('Enter');
  await expect(page).toHaveURL(/\/resume$/);
});

test('the compact menu presents all four destinations and restores keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 360 });
  await page.goto('/about');
  const banner = page.getByRole('banner');
  await expect(banner.getByRole('link', { name: menuNames })).toHaveCount(0);
  const menuButton = banner.getByRole('button', { name: /navigation menu/ });
  await menuButton.press('Enter');
  const links = banner.getByRole('link', { name: menuNames });
  await expect(links).toHaveText(menuLabels);
  const lastSocialLink = banner.getByRole('link', { name: 'GitHub' });
  await lastSocialLink.focus();
  await expect(lastSocialLink).toBeInViewport({ ratio: 1 });
  await page.keyboard.press('Escape');
  await expect(links).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await menuButton.press('Enter');
  await banner.getByRole('link', { name: 'Work', exact: true }).press('Enter');
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator('#projects')).toBeFocused();

  await menuButton.press('Enter');
  await banner
    .getByRole('link', { name: 'Contact', exact: true })
    .press('Enter');
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator('#contact')).toBeFocused();
});

test('featured work is named and keeps its project destinations on a phone', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#projects');
  const project = page.getByRole('article', { name: 'FinanceFlow' }).first();
  await expect(
    project.getByRole('heading', { name: 'FinanceFlow' }),
  ).toBeVisible();
  const liveSite = project.getByRole('link', {
    name: 'FinanceFlow',
    exact: true,
  });
  await expect(liveSite).toBeVisible();
  await expect(liveSite).toHaveAttribute('href', 'https://www.financeflow.dev');
  await expect(
    project.getByRole('link', {
      name: 'Open GitHub repository for FinanceFlow',
    }),
  ).toHaveAttribute(
    'href',
    'https://github.com/FrancoisCoding/personal-finance',
  );
});

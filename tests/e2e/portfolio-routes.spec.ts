import { expect, test } from '@playwright/test';

test('the portfolio keeps its Projects index and retires detail routes', async ({
  request,
}) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  const paths = Array.from(
    (await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, url]) => new URL(url).pathname,
  );

  expect(paths).toContain('/projects');
  expect(paths).not.toContain('/experience');
  expect(paths.filter((path) => /^\/projects?\//.test(path))).toEqual([]);

  for (const path of [
    '/experience',
    '/projects/financeflow',
    '/project/financeflow',
    '/project/other',
    '/projects/other',
    '/projects/other/gallery',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }

  expect((await request.get('/projects')).status()).toBe(200);
  expect((await request.get('/resume')).status()).toBe(200);
});

test('career and project destinations remain available through the portfolio', async ({
  page,
}) => {
  await page.goto('/about');
  await expect(
    page.getByRole('link', { name: /Synchrony Financial/ }),
  ).toHaveAttribute('href', 'https://www.synchrony.com/about-us');

  await page.goto('/');
  const featuredProject = page
    .locator('#projects')
    .getByRole('article')
    .first();
  await featuredProject.hover();
  await expect(
    featuredProject.getByRole('link', { name: 'FinanceFlow', exact: true }),
  ).toHaveAttribute('href', 'https://www.financeflow.dev');
  await expect(
    featuredProject.getByRole('link', { name: 'Open GitHub repository' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/FrancoisCoding/personal-finance',
  );
});

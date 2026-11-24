import { expect, test, type Page } from '@playwright/test';

function startupIntro(page: Page) {
  return page.getByRole('dialog', { name: 'Startup intro' });
}

async function pausePageTime(page: Page) {
  const time = new Date();
  await page.clock.install({ time });
  await page.clock.pauseAt(new Date(time.getTime() + 1_000));
}

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

test('a fresh homepage shows the startup intro for 1,200 ms', async ({
  page,
}) => {
  await pausePageTime(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const intro = startupIntro(page);
  await expect(intro).toBeVisible();
  await expect(intro.getByRole('button', { name: 'Skip intro' })).toBeVisible();

  await page.clock.runFor(1_199);
  await expect(intro).toBeVisible();
  await page.clock.runFor(1);
  await expect(intro).toBeHidden();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('main')).not.toBeFocused();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(intro).toBeHidden();
});

for (const action of ['pointer', 'keyboard', 'Escape', 'timeout'] as const) {
  test(`${action} dismissal returns focus to the homepage content`, async ({
    page,
  }) => {
    await pausePageTime(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const intro = startupIntro(page);
    const skip = intro.getByRole('button', { name: 'Skip intro' });
    await expect(skip).toBeVisible();

    if (action === 'pointer') {
      await skip.click();
    } else if (action === 'Escape') {
      await page.keyboard.press('Escape');
    } else {
      await page.keyboard.press('Tab');
      await expect(skip).toBeFocused();
      if (action === 'keyboard') await page.keyboard.press('Enter');
      else await page.clock.runFor(1_200);
    }

    await expect(intro).toBeHidden();
    await expect(page.getByRole('main')).toBeFocused();
  });
}

test('deep links open without the intro in fresh tabs', async ({ context }) => {
  for (const path of [
    '/resume',
    '/projects',
    '/about',
    '/#projects',
    '/#contact',
  ]) {
    const page = await context.newPage();
    await pausePageTime(page);
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(startupIntro(page)).toBeHidden();
    await expect(page.getByRole('main')).toBeVisible();
    await page.close();
  }
});

test('following the home link in the same tab bypasses the intro', async ({
  page,
}) => {
  await pausePageTime(page);
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Go to the homepage' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(startupIntro(page)).toBeHidden();
  await expect(page.getByRole('main')).toBeVisible();
});

test('returning to the homepage through history does not reopen the intro', async ({
  page,
}) => {
  await pausePageTime(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(startupIntro(page)).toBeVisible();
  await page.goto('/about', { waitUntil: 'domcontentloaded' });
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(startupIntro(page)).toBeHidden();
  await expect(page.getByRole('main')).toBeVisible();
});

test('a new tab opening the homepage can play its own intro', async ({
  page,
}) => {
  await page.goto('/about');
  const newTab = page.waitForEvent('popup');
  await page.evaluate(() => {
    window.open('/', '_blank');
  });
  const popup = await newTab;
  await expect(startupIntro(popup)).toBeVisible();
  await expect(startupIntro(popup)).toBeHidden();
});

test('a saved reduced-motion override bypasses the intro before hydration', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('reduce-motion', 'true'));
  await pausePageTime(page);
  await page.route('**/_next/**/*.js*', (route) => route.abort());
  await page.goto('/');
  await expect(startupIntro(page)).toBeHidden();
  await expect(page.getByRole('main')).toBeVisible();
});

test('system reduced motion dismisses an active intro and bypasses it in a fresh tab', async ({
  page,
  context,
}) => {
  await pausePageTime(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(startupIntro(page)).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(startupIntro(page)).toBeHidden();

  const reducedPage = await context.newPage();
  await reducedPage.emulateMedia({ reducedMotion: 'reduce' });
  await pausePageTime(reducedPage);
  await reducedPage.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(startupIntro(reducedPage)).toBeHidden();
  await expect(reducedPage.getByRole('main')).toBeVisible();
});

test('blocked session storage leaves the homepage accessible', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get: () => {
        throw new DOMException('Storage blocked', 'SecurityError');
      },
    });
  });
  await pausePageTime(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(startupIntro(page)).toBeHidden();
  await expect(page.getByRole('main')).toBeVisible();
});

test.describe('with scripts disabled', () => {
  test.use({ javaScriptEnabled: false });

  test('the homepage is reachable without the intro', async ({ page }) => {
    await page.goto('/');
    await expect(startupIntro(page)).toBeHidden();
    await expect(page.getByRole('main')).toBeVisible();
  });
});

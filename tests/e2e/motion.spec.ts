import { expect, test, type Page } from '@playwright/test';

const storageKey = 'reduce-motion';

function motionToggle(page: Page) {
  return page.getByRole('button', { name: 'Reduce motion' });
}

function openMenu(page: Page) {
  return page.getByRole('button', { name: 'Open navigation menu' });
}

function menuResumeLink(page: Page) {
  return page.getByRole('banner').getByRole('link', { name: 'Resume' });
}

function hobbyCards(page: Page) {
  return page.locator('#hobbies').getByRole('article');
}

async function expectMotion(page: Page, reduced: boolean) {
  await expect(motionToggle(page)).toHaveAttribute(
    'aria-pressed',
    String(reduced),
  );
  await expect(page.locator('html')).toHaveCSS(
    'scroll-behavior',
    reduced ? 'auto' : 'smooth',
  );
}

for (const { name, system, saved, reduced } of [
  { name: 'system default', system: 'reduce', saved: null, reduced: true },
  {
    name: 'invalid saved value',
    system: 'no-preference',
    saved: 'invalid',
    reduced: false,
  },
  {
    name: 'saved full motion',
    system: 'reduce',
    saved: 'false',
    reduced: false,
  },
  {
    name: 'saved reduced motion',
    system: 'no-preference',
    saved: 'true',
    reduced: true,
  },
] as const) {
  test(`applies ${name} before hydration`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: system });
    if (saved !== null) {
      await page.addInitScript(
        ({ key, value }) => localStorage.setItem(key, value),
        {
          key: storageKey,
          value: saved,
        },
      );
    }
    await page.route('**/_next/**/*.js*', (route) => route.abort());
    await page.goto('/');

    await expect(page.locator('html')).toHaveCSS(
      'scroll-behavior',
      reduced ? 'auto' : 'smooth',
    );
    await expect(
      page
        .locator('header')
        .getByRole('button', { name: 'Open navigation menu' }),
    ).toBeVisible();
    await openMenu(page).click();
    await expect(openMenu(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(motionToggle(page)).toBeDisabled();
    await expect(motionToggle(page)).not.toHaveAttribute('aria-pressed');

    if (reduced) {
      const socialLink = page
        .getByRole('contentinfo')
        .getByRole('link', { name: 'GitHub' });
      await expect(socialLink).toHaveCSS('width', '36px');
      await expect(socialLink).toHaveCSS('height', '36px');
      const icon = await socialLink.locator('svg').boundingBox();
      expect(icon).toMatchObject({ width: 16, height: 16 });
    }
  });
}

test('follows live system changes until the visitor overrides them', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expectMotion(page, true);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expectMotion(page, false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expectMotion(page, true);

  await motionToggle(page).click();
  await expectMotion(page, false);
  await page.reload();
  await expectMotion(page, false);
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'About' })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expectMotion(page, false);
});

test('syncs a saved override across tabs and falls back to the system when it is cleared', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const secondTab = await context.newPage();
  await secondTab.emulateMedia({ reducedMotion: 'reduce' });
  await secondTab.goto('/');
  await expectMotion(secondTab, true);

  await motionToggle(secondTab).click();
  await expectMotion(secondTab, false);
  await motionToggle(page).click();
  await expectMotion(secondTab, true);
  await secondTab.emulateMedia({ reducedMotion: 'no-preference' });
  await expectMotion(secondTab, true);

  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await expectMotion(secondTab, false);
});

test('keeps the toggle usable when browser storage is blocked', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage is blocked', 'SecurityError');
      },
    });
  });
  await page.goto('/');
  await expectMotion(page, true);

  await motionToggle(page).click();
  await expectMotion(page, false);
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'About' })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expectMotion(page, false);
  await motionToggle(page).click();
  await expectMotion(page, true);
});

test('replaces an in-memory choice when a later preference can be saved', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript((key) => {
    const setItem = Storage.prototype.setItem;
    let blockNextWrite = true;
    Storage.prototype.setItem = function (name, value) {
      if (this === localStorage && name === key && blockNextWrite) {
        blockNextWrite = false;
        throw new DOMException('Storage is blocked', 'QuotaExceededError');
      }
      setItem.call(this, name, value);
    };
  }, storageKey);
  await page.goto('/');

  await motionToggle(page).click();
  await expectMotion(page, true);
  await motionToggle(page).click();
  await expectMotion(page, false);
  await page.reload();
  await expectMotion(page, false);
});

test('opens a static menu and shows footer hover and focus feedback immediately', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await expectMotion(page, true);

  await openMenu(page).click();
  const resume = menuResumeLink(page);
  await expect(resume).toBeVisible();
  await expect(resume).toHaveCSS('transition-property', 'none');
  await resume.focus();
  await expect(resume).toBeFocused();

  const socialLink = page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'GitHub' });
  await socialLink.scrollIntoViewIfNeeded();
  const before = await socialLink.boundingBox();
  await socialLink.hover();
  await expect(socialLink.getByText('GitHub')).toHaveCSS('opacity', '1');
  expect(await socialLink.boundingBox()).toEqual(before);

  await page.mouse.move(0, 0);
  const precedingLink = page
    .getByRole('contentinfo')
    .getByRole('link', { name: 'LinkedIn' });
  await precedingLink.focus();
  await precedingLink.press('Tab');
  await expect(socialLink).toBeFocused();
  await expect(socialLink.getByText('GitHub')).toHaveCSS('opacity', '1');
});

test('switches motion while the menu is open and restores desktop gallery effects', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/about');
  await expectMotion(page, false);
  await expect(hobbyCards(page)).toHaveCount(4);
  await expect(hobbyCards(page).first()).toHaveCSS('position', 'absolute');

  await openMenu(page).click();
  await motionToggle(page).click();
  await expectMotion(page, true);
  await expect(
    page.getByRole('button', { name: 'Close navigation menu' }),
  ).toBeVisible();
  await expect(menuResumeLink(page)).toBeVisible();
  await expect(hobbyCards(page).first()).toHaveCSS('position', 'static');
  await expect(hobbyCards(page).first()).toHaveCSS(
    'transition-property',
    'none',
  );

  await motionToggle(page).click();
  await expectMotion(page, false);
  await expect(menuResumeLink(page)).toBeVisible();
  await page.keyboard.press('Escape');
  const firstCard = hobbyCards(page).first();
  await expect(firstCard).toHaveCSS('position', 'absolute');
  const restingTranslate = await firstCard.evaluate(
    (card) => getComputedStyle(card).translate,
  );
  await firstCard.hover();
  await expect(firstCard).not.toHaveCSS('translate', restingTranslate);
});

test('settles the open menu immediately when motion is switched off mid-animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expectMotion(page, false);
  await openMenu(page).click();
  await expect(menuResumeLink(page)).toBeVisible();
  await page.getByRole('button', { name: 'Close navigation menu' }).click();
  await expect(menuResumeLink(page)).toHaveCount(0);

  const toggle = await motionToggle(page).elementHandle();
  const opacity = await openMenu(page).evaluate(
    async (menuButton, toggleButton) => {
      if (
        !(menuButton instanceof HTMLButtonElement) ||
        !(toggleButton instanceof HTMLButtonElement)
      ) {
        throw new Error('Expected buttons for the menu and motion controls');
      }
      const menuId = menuButton.getAttribute('aria-controls');
      if (!menuId) throw new Error('The menu button must identify its panel');
      menuButton.click();
      const nextFrame = () => new Promise(requestAnimationFrame);
      await nextFrame();
      const menu = document.getElementById(menuId);
      if (!menu) throw new Error('Expected the menu panel to be open');
      const moving = Number(getComputedStyle(menu).opacity);
      toggleButton.click();
      await nextFrame();
      return { moving, settled: Number(getComputedStyle(menu).opacity) };
    },
    toggle,
  );

  expect(opacity.moving).toBeLessThan(1);
  expect(opacity.settled).toBe(1);
  await expectMotion(page, true);
});

for (const { name, isMobile, viewport } of [
  { name: 'mobile', isMobile: true, viewport: { width: 390, height: 844 } },
  { name: 'desktop', isMobile: false, viewport: { width: 1280, height: 900 } },
]) {
  test.describe(`${name} touch gallery`, () => {
    test.use({ hasTouch: true, isMobile, viewport });

    test('shows all hobby photos with motion enabled and no hover', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.goto('/about');
      await expectMotion(page, false);
      expect(
        await page.evaluate(() => matchMedia('(any-pointer: coarse)').matches),
      ).toBe(true);
      await expect(hobbyCards(page)).toHaveCount(4);
      for (const card of await hobbyCards(page).all()) {
        await expect(card.getByRole('img')).toBeVisible();
        await expect(card).toHaveCSS('position', 'static');
      }
    });
  });
}

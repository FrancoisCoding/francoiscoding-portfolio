import { expect, test } from '@playwright/test';
import { rm, writeFile } from 'node:fs/promises';

const bookingMode = process.env.PLAYWRIGHT_BOOKING_MODE;
const fixedTime = new Date(process.env.PLAYWRIGHT_BOOKING_FIXTURE_TIME ?? '');
const bookingDetails = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  websiteUrl: 'https://example.com',
  budgetRange: '$1k - $5k',
  timezone: 'America/New_York',
};

test.use({
  timezoneId: 'America/New_York',
  contextOptions: { reducedMotion: 'reduce' },
});

test('availability contains only slots in the requested local month', async ({
  request,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
  const response = await request.get('/api/calendly/availability', {
    params: { month: '2031-05', timezone: 'America/New_York' },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    source: 'live',
    eventLabel: '15 minute intro',
    days: [
      {
        date: '2031-05-31',
        startTimes: ['2031-06-01T03:45:00.123Z', '2031-06-01T03:45:00.123456Z'],
      },
    ],
  });
});

test('confirmation rechecks a slot by its local month and absolute instant', async ({
  request,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');

  for (const [startTime, expectedInstant] of [
    ['2031-06-01T03:45:00.123Z', '2031-06-01T03:45:00.123Z'],
    ['2031-05-31T23:45:00.12345600-04:00', '2031-06-01T03:45:00.123456Z'],
  ]) {
    const response = await request.post('/api/calendly/book', {
      data: { ...bookingDetails, startTime },
    });

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      success: true,
      booking: {
        source: 'live',
        startTime: expectedInstant,
        cancelUrl: 'https://calendly.com/cancellations/e2e',
      },
    });
  }

  const unavailable = await request.post('/api/calendly/book', {
    data: { ...bookingDetails, startTime: '2031-06-01T03:45:00.123457Z' },
  });
  expect(unavailable.status()).toBe(409);
});

test('rejects invalid months, zones, and start times as validation errors', async ({
  request,
}) => {
  for (const params of [
    { month: '2031-13', timezone: 'America/New_York' },
    { month: '2031-06', timezone: 'Not/A_Zone' },
  ]) {
    const response = await request.get('/api/calendly/availability', {
      params,
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toHaveProperty('issues');
  }

  for (const startTime of ['2031-02-30T00:00:00Z', '2031-06-01T03:45:00']) {
    const response = await request.post('/api/calendly/book', {
      data: { ...bookingDetails, startTime },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toHaveProperty('issues.startTime');
  }
});

test('a conflict during provider confirmation also returns HTTP 409', async ({
  request,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
  const response = await request.post('/api/calendly/book', {
    data: {
      ...bookingDetails,
      email: 'already-taken@example.com',
      startTime: '2031-06-02T14:00:00.000Z',
    },
  });

  expect(response.status()).toBe(409);
  expect(await response.json()).toHaveProperty(
    'error',
    expect.stringContaining('no longer available'),
  );
});

test('weekend slots are selectable and June dates do not carry over to an empty July', async ({
  page,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
  await page.clock.setFixedTime(fixedTime);
  await page.goto('/#contact');
  const scheduler = page.locator('#contact');
  const nextMonth = scheduler.getByRole('button', { name: 'View next month' });

  await expect(
    scheduler.getByRole('heading', { name: 'May 2031' }),
  ).toBeVisible();
  const saturday = scheduler.getByRole('button', {
    name: 'Saturday, May 31, 2031',
  });
  await expect(saturday).toBeEnabled();
  await expect(saturday).toHaveAttribute('aria-pressed', 'true');
  await expect(
    scheduler.getByRole('button', { name: 'Wednesday, April 30, 2031' }),
  ).toBeDisabled();

  await nextMonth.press('Enter');
  const sunday = scheduler.getByRole('button', {
    name: 'Sunday, June 1, 2031',
  });
  await expect(sunday).toHaveAttribute('aria-pressed', 'true');
  await expect(
    scheduler.getByRole('button', { name: 'Tuesday, June 3, 2031' }),
  ).toBeDisabled();
  const monday = scheduler.getByRole('button', {
    name: 'Monday, June 2, 2031',
  });
  await monday.press('Enter');
  await expect(monday).toHaveAttribute('aria-pressed', 'true');
  await expect(sunday).toHaveAttribute('aria-pressed', 'false');
  await expect(
    scheduler.getByRole('button', { name: '10:00am' }),
  ).toBeVisible();

  await nextMonth.press('Enter');
  await expect(nextMonth).toBeFocused();
  await expect(scheduler.getByRole('status')).toContainText(
    'No available times in July 2031',
  );
  await expect(scheduler.getByRole('button', { name: '10:00am' })).toHaveCount(
    0,
  );
});

test.describe('in a UTC+14 browser', () => {
  test.use({ timezoneId: 'Pacific/Kiritimati' });

  test('labels the civil date once and confirms the date shown on the calendar', async ({
    page,
  }) => {
    test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
    await page.clock.setFixedTime(fixedTime);
    await page.goto('/#contact');
    const scheduler = page.locator('#contact');

    await expect(
      scheduler.getByRole('heading', { name: 'June 2031' }),
    ).toBeVisible();
    const sunday = scheduler.getByRole('button', {
      name: 'Sunday, June 1, 2031',
    });
    await expect(sunday).toHaveText('1');
    await sunday.press('Enter');
    await expect(
      scheduler.getByRole('button', { name: '5:45:00.123pm', exact: true }),
    ).toBeVisible();
    await scheduler
      .getByRole('button', { name: '5:45:00.123456pm' })
      .press('Enter');
    await page.getByLabel('Your name').fill(bookingDetails.name);
    await page.getByLabel('Email address').fill(bookingDetails.email);
    await page
      .getByLabel('Website or app link')
      .fill(bookingDetails.websiteUrl);
    await page
      .getByLabel('What budget range are you considering?')
      .selectOption(bookingDetails.budgetRange);
    await scheduler.getByRole('button', { name: 'Confirm' }).press('Enter');
    await expect(
      scheduler.getByRole('heading', { name: "You're booked." }),
    ).toBeFocused();
    await expect(
      scheduler.getByText('Sunday, June 1, 2031 at 5:45:00.123456pm'),
    ).toBeVisible();
  });
});

test('a slot removed before confirmation returns focus to availability and preserves the form', async ({
  page,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
  const fixtureState = process.env.PLAYWRIGHT_BOOKING_FIXTURE_STATE;
  if (!fixtureState)
    throw new Error('Use scripts/run-e2e.mjs to start the booking fixture.');

  await page.clock.setFixedTime(fixedTime);
  await page.goto('/#contact');
  const scheduler = page.locator('#contact');
  await scheduler
    .getByRole('button', { name: 'View next month' })
    .press('Enter');
  await scheduler.getByRole('button', { name: '12:30am' }).press('Enter');

  await page.getByLabel('Your name').fill(bookingDetails.name);
  await page.getByLabel('Email address').fill(bookingDetails.email);
  await page.getByLabel('Website or app link').fill(bookingDetails.websiteUrl);
  await page
    .getByLabel('What budget range are you considering?')
    .selectOption(bookingDetails.budgetRange);
  await page.getByLabel('Additional notes').fill('A test note');
  await page.getByLabel('Add guests').fill('guest@example.com');

  let releaseConfirmation!: () => void;
  const confirmationGate = new Promise<void>((resolve) => {
    releaseConfirmation = resolve;
  });
  await page.route(
    '**/api/calendly/book',
    async (route) => {
      await confirmationGate;
      await route.continue();
    },
    { times: 1 },
  );

  try {
    await writeFile(
      fixtureState,
      JSON.stringify({ unavailableSlot: '2031-06-01T04:30:00.000Z' }),
    );
    await scheduler.getByRole('button', { name: 'Confirm' }).press('Enter');

    const refresh = page.waitForResponse((response) =>
      response.url().includes('/api/calendly/availability?month=2031-06'),
    );
    await page.evaluate(() =>
      window.dispatchEvent(new Event('visibilitychange')),
    );
    await (await refresh).finished();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await expect(
      scheduler.getByRole('button', { name: 'Confirming...' }),
    ).toBeDisabled();
    const bookingResponse = page.waitForResponse((response) =>
      response.url().endsWith('/api/calendly/book'),
    );
    releaseConfirmation();

    expect((await bookingResponse).status()).toBe(409);
    await expect(scheduler.getByRole('alert')).toContainText(
      'That slot is no longer available',
    );
    await expect(scheduler.getByRole('heading', { name: /Sun/ })).toBeFocused();
    await expect(
      scheduler.getByRole('button', { name: '12:30am' }),
    ).toHaveCount(0);

    await rm(fixtureState, { force: true });
    await scheduler
      .getByRole('button', { name: 'View next month' })
      .press('Enter');
    await expect(scheduler.getByRole('status')).toContainText(
      'No available times in July 2031',
    );
    const refreshedJune = page.waitForResponse((response) =>
      response.url().includes('/api/calendly/availability?month=2031-06'),
    );
    await scheduler
      .getByRole('button', { name: 'View previous month' })
      .press('Enter');
    expect(await (await refreshedJune).json()).toMatchObject({
      days: expect.arrayContaining([
        {
          date: '2031-06-01',
          startTimes: expect.arrayContaining(['2031-06-01T04:30:00.000Z']),
        },
      ]),
    });
    await expect(scheduler.getByRole('status')).toContainText(
      '1 available time on Sunday',
    );
    await expect(
      scheduler.getByRole('button', { name: '12:30am' }),
    ).toHaveCount(0);
    await scheduler.getByRole('button', { name: '11:00am' }).press('Enter');

    await expect(page.getByLabel('Your name')).toHaveValue(bookingDetails.name);
    await expect(page.getByLabel('Email address')).toHaveValue(
      bookingDetails.email,
    );
    await expect(page.getByLabel('Website or app link')).toHaveValue(
      bookingDetails.websiteUrl,
    );
    await expect(
      page.getByLabel('What budget range are you considering?'),
    ).toHaveValue(bookingDetails.budgetRange);
    await expect(page.getByLabel('Additional notes')).toHaveValue(
      'A test note',
    );
    await expect(page.getByLabel('Add guests')).toHaveValue(
      'guest@example.com',
    );
    await scheduler.getByRole('button', { name: 'Confirm' }).press('Enter');
    await expect(
      scheduler.getByRole('heading', { name: "You're booked." }),
    ).toBeVisible();
  } finally {
    releaseConfirmation();
    await rm(fixtureState, { force: true });
  }
});

test('availability refresh restores focus when it removes the focused time', async ({
  page,
}) => {
  test.skip(bookingMode !== 'live', 'Requires the offline live-like fixture');
  await page.clock.setFixedTime(fixedTime);

  let startTime = '2031-06-01T03:45:00.000Z';
  await page.route('**/api/calendly/availability?*', (route) =>
    route.fulfill({
      json: {
        days: [{ date: '2031-05-31', startTimes: [startTime] }],
        eventLabel: '15 minute intro',
        source: 'live',
      },
    }),
  );

  await page.goto('/#contact');
  const scheduler = page.locator('#contact');
  const previousTime = scheduler.getByRole('button', { name: '11:45pm' });
  await previousTime.focus();
  await expect(previousTime).toBeFocused();

  startTime = '2031-06-01T03:50:00.000Z';
  await page.evaluate(() =>
    window.dispatchEvent(new Event('visibilitychange')),
  );

  await expect(
    scheduler.getByRole('button', { name: '11:50pm' }),
  ).toBeVisible();
  await expect(scheduler.getByRole('heading', { name: /Sat/ })).toBeFocused();
  await expect(previousTime).toHaveCount(0);
});

test('demo dates match their slot instants in UTC+14 and confirm without a provider', async ({
  request,
}) => {
  test.skip(bookingMode !== 'demo', 'Requires the offline demo fixture');
  const timezone = 'Pacific/Kiritimati';
  const response = await request.get('/api/calendly/availability', {
    params: { month: '2031-06', timezone },
  });
  expect(response.status()).toBe(200);
  const { days, source } = await response.json();
  expect(source).toBe('demo');
  expect(days[0]).toMatchObject({
    date: '2031-06-02',
    startTimes: [
      '2031-06-01T15:00:00.000Z',
      '2031-06-01T15:45:00.000Z',
      '2031-06-01T16:45:00.000Z',
    ],
  });
  const booking = await request.post('/api/calendly/book', {
    data: {
      ...bookingDetails,
      startTime: '2031-06-01T15:00:00.000Z',
      timezone,
    },
  });
  expect(booking.status()).toBe(200);
  expect(await booking.json()).toEqual({
    success: true,
    booking: { source: 'demo', startTime: '2031-06-01T15:00:00.000Z' },
  });
});

test('demo preserves the year of a valid four-digit calendar month', async ({
  request,
}) => {
  test.skip(bookingMode !== 'demo', 'Requires the offline demo fixture');
  const response = await request.get('/api/calendly/availability', {
    params: { month: '0099-03', timezone: 'UTC' },
  });

  expect(response.status()).toBe(200);
  const { days } = await response.json();
  expect(days.length).toBeGreaterThan(0);
  expect(days[0].date).toMatch(/^0099-03-/);
  expect(days[0].startTimes[0]).toMatch(/^0099-03-/);
});

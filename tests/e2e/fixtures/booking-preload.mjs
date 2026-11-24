import { readFile } from 'node:fs/promises';

const fixtureState = process.env.PLAYWRIGHT_BOOKING_FIXTURE_STATE;
const mode = process.env.PLAYWRIGHT_BOOKING_MODE;
const eventType = 'https://api.calendly.com/event_types/e2e-event';
const fixedTime = process.env.PLAYWRIGHT_BOOKING_FIXTURE_TIME;

if (!fixtureState || !fixedTime) {
  throw new Error('Start the booking fixture with scripts/run-e2e.mjs.');
}

// Disconnecting the runner also stops the test server's worker.
if (process.connected) {
  process.once('disconnect', () => process.exit(0));
}

const slotTimes = [
  '2031-06-01T03:45:00.123456Z',
  '2031-06-01T03:45:00.123Z',
  '2031-06-01T03:45:00.123000Z',
  '2031-06-01T04:30:00.000Z',
  '2031-06-01T15:00:00.000Z',
  '2031-06-02T14:00:00.000Z',
];

globalThis.Date = new Proxy(Date, {
  construct(target, args, newTarget) {
    return Reflect.construct(
      target,
      args.length ? args : [fixedTime],
      newTarget,
    );
  },
});

async function readFixtureState() {
  try {
    return JSON.parse(await readFile(fixtureState, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

const originalFetch = globalThis.fetch;
globalThis.fetch = async function fixtureFetch(input, options) {
  const rawUrl =
    typeof input === 'string' || input instanceof URL ? input : input.url;
  const url = new URL(rawUrl);

  if (url.hostname === 'api.resend.com') {
    throw new Error('Email delivery is forbidden in E2E tests.');
  }

  if (url.hostname !== 'api.calendly.com') {
    return originalFetch(input, options);
  }

  if (
    mode !== 'live' ||
    new Headers(options?.headers).get('authorization') !==
      'Bearer e2e-calendly-token'
  ) {
    throw new Error(
      'Only fake Calendly requests are allowed in the live fixture.',
    );
  }

  const state = await readFixtureState();

  if (url.pathname === '/event_type_available_times') {
    const { searchParams } = url;
    const start = Date.parse(searchParams.get('start_time'));
    const end = Date.parse(searchParams.get('end_time'));

    if (
      searchParams.get('event_type') !== eventType ||
      !(
        start > Date.parse(fixedTime) &&
        end > start &&
        end - start <= 7 * 86_400_000
      )
    ) {
      return Response.json(
        { message: 'Invalid provider time range.' },
        { status: 400 },
      );
    }

    return Response.json({
      collection: slotTimes
        .filter((time) => Date.parse(time) >= start && Date.parse(time) < end)
        .filter((time) => time !== state.unavailableSlot)
        .map((start_time) => ({ start_time })),
      pagination: { next_page: null, next_page_token: null },
    });
  }

  if (url.pathname === '/invitees' && options?.method === 'POST') {
    const payload = JSON.parse(options.body);

    if (
      payload.event_type !== eventType ||
      !slotTimes.includes(payload.start_time) ||
      payload.start_time === state.unavailableSlot
    ) {
      return Response.json(
        { message: 'Invalid appointment in test fixture.' },
        { status: 400 },
      );
    }

    if (payload.invitee.email === 'already-taken@example.com') {
      return Response.json(
        { message: 'This time is no longer available.' },
        { status: 404 },
      );
    }

    return Response.json({
      resource: {
        uri: 'https://api.calendly.com/scheduled_events/e2e/invitees/e2e',
        cancel_url: 'https://calendly.com/cancellations/e2e',
        reschedule_url: 'https://calendly.com/reschedulings/e2e',
      },
    });
  }

  throw new Error(`Unexpected Calendly request: ${url.pathname}`);
};

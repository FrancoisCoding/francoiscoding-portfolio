import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4317);
const baseUrl = `http://127.0.0.1:${port}`;
const bookingMode = process.env.PLAYWRIGHT_BOOKING_MODE ?? 'live';
const isDemoBooking = bookingMode === 'demo';
const pnpmCommand = 'pnpm';
const cmdCommand =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : null;
const serverEnv = {
  ...process.env,
  ADMIN_ALLOWLIST_EMAILS: 'admin@example.com',
  CALENDLY_API_TOKEN: isDemoBooking ? '' : 'e2e-calendly-token',
  CALENDLY_EVENT_TYPE_URI: isDemoBooking
    ? ''
    : 'https://api.calendly.com/event_types/e2e-event',
  CALENDLY_EVENT_LABEL: '15 minute intro',
  DATABASE_URL: 'postgresql://e2e:e2e@127.0.0.1:1/e2e',
  NEXT_PUBLIC_CALENDLY_TIMEZONE: '',
  NEXT_PUBLIC_E2E_BYPASS_TURNSTILE: 'true',
  NEXT_PUBLIC_SITE_URL: baseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'example-anon-key',
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  OPENAI_API_KEY: '',
  PLAYWRIGHT_BOOKING_FIXTURE_TIME: '2031-06-01T03:30:00.000Z',
  PLAYWRIGHT_BOOKING_MODE: bookingMode,
  PLAYWRIGHT_PORT: String(port),
  RESEND_API_KEY: '',
  SUPABASE_SERVICE_ROLE_KEY: '',
  TURNSTILE_SECRET_KEY: '',
  TURNSTILE_SITE_KEY: '',
};

function spawnProcess(command, args, options = {}) {
  if (process.platform === 'win32') {
    return spawn(cmdCommand, ['/d', '/s', '/c', [command, ...args].join(' ')], {
      cwd: process.cwd(),
      env: serverEnv,
      stdio: 'inherit',
      ...options,
    });
  }

  return spawn(command, args, {
    cwd: process.cwd(),
    env: serverEnv,
    stdio: 'inherit',
    ...options,
  });
}

function waitForExit(childProcess) {
  return new Promise((resolve, reject) => {
    childProcess.on('error', reject);
    childProcess.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${childProcess.spawnargs.join(' ')} exited with code ${code ?? 'null'}${signal ? ` (${signal})` : ''}`,
        ),
      );
    });
  });
}

async function waitForServer(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });

      if (response.ok || (response.status >= 300 && response.status < 400)) {
        return;
      }
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

async function stopServer(childProcess) {
  if (!childProcess.connected) {
    return;
  }

  const exited = waitForExit(childProcess);
  childProcess.disconnect();
  await exited;
}

async function run() {
  if (bookingMode !== 'live' && bookingMode !== 'demo') {
    throw new Error('PLAYWRIGHT_BOOKING_MODE must be "live" or "demo".');
  }

  const playwrightArgs = process.argv.slice(2);
  const fixtureDirectory = await mkdtemp(join(tmpdir(), 'portfolio-booking-'));
  const fixtureState = join(fixtureDirectory, 'state.json');
  const fixtureEnv = {
    ...serverEnv,
    PLAYWRIGHT_BOOKING_FIXTURE_STATE: fixtureState,
  };
  let serverProcess;

  try {
    await waitForExit(spawnProcess(pnpmCommand, ['build']));

    serverProcess = spawn(
      process.execPath,
      [
        '--import',
        './tests/e2e/fixtures/booking-preload.mjs',
        './node_modules/next/dist/bin/next',
        'start',
        '--port',
        String(port),
        '--hostname',
        '127.0.0.1',
      ],
      { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], env: fixtureEnv },
    );
    await waitForServer(baseUrl, 60_000);

    await waitForExit(
      spawn(
        process.execPath,
        ['./node_modules/@playwright/test/cli.js', 'test', ...playwrightArgs],
        { stdio: 'inherit', env: fixtureEnv },
      ),
    );
  } finally {
    if (serverProcess) {
      await stopServer(serverProcess);
    }
    await rm(fixtureDirectory, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

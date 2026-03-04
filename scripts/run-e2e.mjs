import { spawn } from 'node:child_process';
import process from 'node:process';

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4317);
const baseUrl = `http://127.0.0.1:${port}`;
const pnpmCommand = 'pnpm';
const cmdCommand =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : null;
const taskkillCommand =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\taskkill.exe' : null;

const serverEnv = {
  ...process.env,
  ADMIN_ALLOWLIST_EMAILS: 'admin@example.com',
  NEXT_PUBLIC_E2E_BYPASS_TURNSTILE: 'true',
  NEXT_PUBLIC_SITE_URL: baseUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'example-anon-key',
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  PLAYWRIGHT_PORT: String(port),
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
  if (!childProcess.pid) {
    return;
  }

  if (process.platform === 'win32') {
    const taskkillProcess = spawn(
      taskkillCommand,
      ['/PID', String(childProcess.pid), '/T', '/F'],
      {
        stdio: 'inherit',
      },
    );

    try {
      await waitForExit(taskkillProcess);
    } catch {}

    return;
  }

  childProcess.kill('SIGTERM');

  await new Promise((resolve) => setTimeout(resolve, 3_000));

  if (!childProcess.killed) {
    childProcess.kill('SIGKILL');
  }
}

async function run() {
  const playwrightArgs = process.argv.slice(2);

  await waitForExit(spawnProcess(pnpmCommand, ['build']));

  const serverProcess = spawnProcess(pnpmCommand, [
    'start',
    '--port',
    String(port),
  ]);

  try {
    await waitForServer(baseUrl, 60_000);

    await waitForExit(
      spawnProcess(pnpmCommand, [
        'exec',
        'playwright',
        'test',
        ...playwrightArgs,
      ]),
    );
  } finally {
    await stopServer(serverProcess);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

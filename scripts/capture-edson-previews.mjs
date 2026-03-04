import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const edsonDirectory = path.resolve(__dirname, '..', '..', 'edson-realtor');
const outputDirectory = path.resolve(__dirname, '..', 'public', 'projects');
const port = 3305;
const baseUrl = `http://127.0.0.1:${port}/en`;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const cmdCommand =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\cmd.exe' : null;
const taskkillCommand =
  process.platform === 'win32' ? 'C:\\Windows\\System32\\taskkill.exe' : null;

function spawnProcess(args, options = {}) {
  if (process.platform === 'win32') {
    return spawn(
      cmdCommand,
      ['/d', '/s', '/c', [npmCommand, ...args].join(' ')],
      {
        cwd: edsonDirectory,
        stdio: 'inherit',
        ...options,
      },
    );
  }

  return spawn(npmCommand, args, {
    cwd: edsonDirectory,
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

async function captureSectionImages(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 1,
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('#hero').waitFor();
    await page.addStyleTag({
      content: `
        #hero {
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.78)),
            url('/images/hero-poster.jpg') center / cover no-repeat !important;
        }

        #hero video {
          display: none !important;
        }

        [aria-label="WhatsApp"],
        [aria-label="Accessibility"],
        [aria-label="Back to top"],
        [aria-label="Instagram"],
        [aria-label="YouTube"] {
          display: none !important;
        }
      `,
    });
    await page.waitForTimeout(1_500);

    await page.locator('#hero').screenshot({
      path: path.join(outputDirectory, 'edson-prime-estates.jpg'),
      quality: 90,
      type: 'jpeg',
    });

    const listingsSection = page.locator('#listings');
    await listingsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await listingsSection.screenshot({
      path: path.join(outputDirectory, 'edson-prime-estates-listings.jpg'),
      quality: 90,
      type: 'jpeg',
    });
  } finally {
    await browser.close();
  }
}

async function run() {
  await waitForExit(spawnProcess(['run', 'build']));

  const serverProcess = spawnProcess([
    'run',
    'start',
    '--',
    '--hostname',
    '127.0.0.1',
    '--port',
    String(port),
  ]);

  try {
    await waitForServer(baseUrl, 60_000);
    await captureSectionImages(baseUrl);
  } finally {
    await stopServer(serverProcess);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

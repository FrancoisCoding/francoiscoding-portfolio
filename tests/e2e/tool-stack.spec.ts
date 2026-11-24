import { expect, test } from '@playwright/test';

test('the Tool Stack shows core tools in order and expands from the keyboard', async ({
  page,
}) => {
  await page.goto('/about#tool-stack');
  const stack = page.locator('#tool-stack');

  const readToolNames = async () =>
    (await stack.getByRole('link').allInnerTexts()).map(
      (text) => text.split('\n')[0],
    );

  expect(await readToolNames()).toEqual([
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Django',
    'PostgreSQL',
    'Snowflake',
    'Docker',
    'AWS',
  ]);

  const disclosure = stack.locator('summary');
  const summary = await disclosure.innerText();
  const expandedCount = Number(summary.match(/\((\d+) more\)/)?.[1]);
  const coreCount = await stack.getByRole('link').count();
  expect(expandedCount).toBe(40);

  await disclosure.press('Enter');
  await expect(disclosure).toHaveText('Collapse complete toolkit', {
    useInnerText: true,
  });
  await expect(
    stack.getByRole('link', { name: 'Supabase Backend platform' }),
  ).toHaveAttribute('href', 'https://supabase.com');
  await expect(
    stack.getByRole('link', { name: 'Prisma Type-safe ORM' }),
  ).toHaveAttribute('href', 'https://www.prisma.io');

  const names = await readToolNames();
  expect(names.length).toBe(coreCount + expandedCount);
  expect(new Set(names).size).toBe(names.length);

  await disclosure.press('Enter');
  await expect(disclosure).toHaveText(summary, { useInnerText: true });
  await expect(stack.getByRole('link')).toHaveCount(coreCount);
});

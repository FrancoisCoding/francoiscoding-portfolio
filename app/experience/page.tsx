import type { Metadata } from 'next';

import { companyExperience } from '@/lib/company-experience';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Timeline of company experience spanning Disney, Department of Defense, and MassVirtual.',
  openGraph: {
    title: 'Experience | Isaiah Francois',
    description:
      'Company timeline and engineering delivery highlights across enterprise and regulated environments.',
    url: '/experience',
  },
};

export default function ExperiencePage() {
  return (
    <section className="py-16">
      <div className="space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-xs font-medium tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400">
            Experience
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Experience
          </h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
            A concise overview of company work and technical delivery.
          </p>
        </div>
        <div className="space-y-5">
          {companyExperience.map((item) => (
            <article
              key={item.company}
              className="rounded-[2rem] border border-black/8 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[var(--surface)] dark:shadow-none"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400">
                    Company
                  </p>
                  <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {item.company}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.roleTitle}
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.timeframe}
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {item.impacts.map((impact) => (
                  <li key={impact}>{impact}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-950 dark:text-white">
                  Stack:
                </span>{' '}
                {item.stack.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

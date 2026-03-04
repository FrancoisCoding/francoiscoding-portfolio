import Image from 'next/image';
import type { Metadata } from 'next';

import { financeFlowProject } from '@/lib/projects-data';
import { siteConfig } from '@/lib/site-config';

const financeFlowGallery = [
  {
    src: '/projects/financeflow-dashboard.png',
    alt: 'FinanceFlow dashboard preview',
  },
  {
    src: '/projects/financeflow-ai.png',
    alt: 'FinanceFlow AI assistant preview',
  },
  {
    src: '/projects/financeflow-subscriptions.png',
    alt: 'FinanceFlow subscriptions preview',
  },
];

export const metadata: Metadata = {
  title: 'FinanceFlow',
  description: 'FinanceFlow project overview and product preview.',
  openGraph: {
    title: 'FinanceFlow | Isaiah Francois',
    description: 'FinanceFlow project overview and product preview.',
    url: '/projects/financeflow',
  },
};

export default function FinanceFlowProjectPage() {
  return (
    <section className="pt-10 pb-12 sm:pt-12">
      <div className="grid gap-8 border-b border-white/8 pb-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-sm text-white/55">{financeFlowProject.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {financeFlowProject.name}
          </h1>
        </div>
        <div className="space-y-5">
          <p className="text-base leading-7 text-white/72">
            {financeFlowProject.summary}
          </p>
          <p className="text-base leading-7 text-white/64">
            {financeFlowProject.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {financeFlowProject.stack.map((item) => (
              <span
                key={item}
                className="inline-flex min-h-10 items-center rounded-full border border-white/10 bg-white/6 px-3 text-sm text-white/70"
              >
                {item}
              </span>
            ))}
          </div>
          <a
            href={siteConfig.financeFlowUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            View FinanceFlow
          </a>
        </div>
      </div>

      <div className="grid gap-4 pt-8 lg:grid-cols-3">
        {financeFlowGallery.map((image) => (
          <div
            key={image.src}
            className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

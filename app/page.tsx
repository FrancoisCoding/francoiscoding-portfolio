import Link from 'next/link';
import { BriefcaseBusiness, Sparkles, Target } from 'lucide-react';

import { HeroSection } from '@/components/home/hero-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const recruiterHighlights = [
  {
    icon: Target,
    title: 'Impact Driven',
    detail: 'Shipped production systems with measurable business outcomes.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Cross-Industry Experience',
    detail:
      'Delivered software for Disney, Department of Defense, and MassVirtual.',
  },
  {
    icon: Sparkles,
    title: 'Execution Speed',
    detail:
      'Owns architecture through delivery while preserving engineering quality.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14 pb-20">
      <HeroSection />
      <section aria-labelledby="quick-scan" className="space-y-6">
        <div className="space-y-2">
          <h2
            id="quick-scan"
            className="font-display text-3xl font-semibold text-slate-950 dark:text-white"
          >
            Quick Recruiter Scan
          </h2>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300">
            Fast context for hiring managers evaluating product delivery,
            systems thinking, and technical breadth.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recruiterHighlights.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <item.icon className="size-5 text-[var(--brand)]" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {item.detail}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="companies"
        aria-labelledby="companies-heading"
        className="rounded-2xl border border-black/10 bg-white/60 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
      >
        <h2
          id="companies-heading"
          className="font-display text-2xl font-semibold text-slate-950 dark:text-white"
        >
          Companies
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Detailed cinematic company banners are available in the next section
          of the build. You can already review the full timeline on the
          experience page.
        </p>
        <Link
          href="/experience"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
        >
          Open Experience Timeline
        </Link>
      </section>
    </div>
  );
}

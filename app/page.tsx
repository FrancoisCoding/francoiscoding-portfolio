import Link from 'next/link';
import type { Metadata } from 'next';
import { BriefcaseBusiness, Sparkles, Target } from 'lucide-react';

import { CompaniesSection } from '@/components/home/companies-section';
import { HeroSection } from '@/components/home/hero-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Senior Full Stack Engineer portfolio featuring FinanceFlow, enterprise delivery, and contact options.',
  openGraph: {
    title: 'Isaiah Francois | Senior Full Stack Engineer',
    description:
      'Explore featured work including FinanceFlow, company experience, and direct contact details.',
    url: '/',
  },
};

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
      <CompaniesSection />
      <section
        id="contact-cta"
        className="rounded-2xl border border-black/10 bg-white/60 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
      >
        <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
          Ready to Connect?
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Open the contact page for direct email and phone details.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
        >
          Go to Contact
        </Link>
      </section>
    </div>
  );
}

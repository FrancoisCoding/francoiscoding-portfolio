import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projectsData } from '@/lib/projects-data';

const financeFlowProject = projectsData.find(
  (project) => project.slug === 'financeflow',
);

export const metadata: Metadata = {
  title: 'FinanceFlow Case Study',
  description:
    'Case study breakdown of FinanceFlow covering problem, solution, impact, and delivery stack.',
  openGraph: {
    title: 'FinanceFlow Case Study | Isaiah Francois',
    description:
      'A concise case study walkthrough for FinanceFlow, a featured product project.',
    url: '/projects/financeflow',
  },
};

export default function FinanceFlowCaseStudyPage() {
  if (!financeFlowProject) {
    return (
      <section className="py-16">
        <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
          FinanceFlow Case Study
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Case study details are currently unavailable.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8 py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold tracking-[0.16em] text-[var(--brand)] uppercase">
          Case Study
        </p>
        <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
          {financeFlowProject.name}
        </h1>
        <p className="max-w-3xl text-slate-600 dark:text-slate-300">
          {financeFlowProject.summary}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Problem</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {financeFlowProject.problem}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {financeFlowProject.solution}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Impact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {financeFlowProject.impact}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
          Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {financeFlowProject.stack.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href="https://www.financeflow.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
        >
          View FinanceFlow
          <ArrowUpRight className="size-3.5" />
        </a>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 underline-offset-4 hover:underline dark:text-slate-200"
        >
          Back to Projects
        </Link>
      </div>
    </section>
  );
}

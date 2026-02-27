import { Download } from 'lucide-react';
import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';

const resumePath = '/isaiah-francois-resume.pdf';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Embedded resume viewer and direct resume download for Isaiah Francois.',
  openGraph: {
    title: 'Resume | Isaiah Francois',
    description: 'View or download the resume for Isaiah Francois.',
    url: '/resume',
  },
};

export default function ResumePage() {
  return (
    <section className="space-y-8 py-16">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
          Resume
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">
          View the resume inline or download a local copy.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={resumePath} download>
            <Download className="size-4" />
            Download Resume
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={resumePath} target="_blank" rel="noreferrer">
            Open in New Tab
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 dark:border-white/15 dark:bg-white/5">
        <iframe
          src={`${resumePath}#view=FitH`}
          title="Isaiah Francois resume PDF viewer"
          className="h-[70vh] w-full"
        />
      </div>
    </section>
  );
}

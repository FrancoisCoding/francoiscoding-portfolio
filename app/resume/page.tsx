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
    <section className="py-16">
      <div className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
              Resume
            </h1>
            <p className="max-w-xs text-slate-600 dark:text-slate-300">
              View the PDF inline or download a copy.
            </p>
          </div>

          <div className="space-y-6">
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

            <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
              <iframe
                src={`${resumePath}#view=FitH`}
                title="Isaiah Francois resume PDF viewer"
                className="h-[70vh] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

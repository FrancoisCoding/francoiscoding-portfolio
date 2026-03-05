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
  const inlineResumePath = `${resumePath}#page=1&view=FitH&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-[68rem] space-y-8">
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
                <a href={resumePath} target="_blank" rel="noreferrer">
                  Open in New Tab
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href={resumePath} download>
                  <Download className="size-4" />
                  Download Resume
                </a>
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
              <iframe
                src={inlineResumePath}
                title="Isaiah Francois resume PDF viewer"
                className="h-[calc(100vh-13.5rem)] min-h-[46rem] w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

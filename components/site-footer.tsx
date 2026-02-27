import { Copy, Github, Mail, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-4 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {siteConfig.name} • {siteConfig.title}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="size-4" />
              {siteConfig.email}
            </a>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}>
              <Phone className="size-4" />
              {siteConfig.phone}
            </a>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
          <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
            <Copy className="size-3.5" />
            Copy on contact page
          </span>
        </div>
      </div>
    </footer>
  );
}

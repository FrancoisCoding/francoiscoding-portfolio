import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';

import { siteConfig } from '@/lib/site-config';

const socialLinks = [
  {
    href: siteConfig.linkedinUrl,
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: siteConfig.githubUrl,
    label: 'GitHub',
    icon: Github,
  },
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="mx-auto w-full max-w-[64rem] px-5 py-10 sm:px-8 lg:px-10 xl:px-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-base font-semibold tracking-[-0.01em] text-white">
              {siteConfig.name}
            </p>
            <p className="text-sm text-white/58">
              Full stack developer building modern products.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-colors duration-200 ease-in-out hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              {siteConfig.email}
            </a>

            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-colors duration-200 ease-in-out hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/8 pt-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={siteConfig.financeFlowUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 ease-in-out hover:text-white"
            >
              FinanceFlow
            </a>
            <Link
              href="/about"
              className="transition-colors duration-200 ease-in-out hover:text-white"
            >
              About
            </Link>
            <Link
              href="/#contact"
              className="transition-colors duration-200 ease-in-out hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

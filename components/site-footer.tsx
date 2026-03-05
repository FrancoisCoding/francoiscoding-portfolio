'use client';

import Link from 'next/link';
import { Globe, Github, Linkedin, Twitter } from 'lucide-react';

import { FloatingDock } from '@/components/ui/floating-dock';
import { siteConfig } from '@/lib/site-config';

const dockItems = [
  {
    title: 'LinkedIn',
    href: siteConfig.linkedinUrl,
    icon: <Linkedin className="h-4 w-4" aria-hidden="true" />,
    external: true,
  },
  {
    title: 'GitHub',
    href: siteConfig.githubUrl,
    icon: <Github className="h-4 w-4" aria-hidden="true" />,
    external: true,
  },
  {
    title: 'X',
    href: siteConfig.twitterUrl,
    icon: <Twitter className="h-4 w-4" aria-hidden="true" />,
    external: true,
  },
  {
    title: 'FinanceFlow',
    href: siteConfig.financeFlowUrl,
    icon: <Globe className="h-4 w-4" aria-hidden="true" />,
    external: true,
  },
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-white/10 pb-8 sm:pb-10">
      <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-5 px-5 pt-6 sm:px-8 sm:pt-7 lg:px-10 xl:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex min-h-10 w-fit items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow] duration-200 ease-in-out hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            {siteConfig.email}
          </a>
          <FloatingDock items={[...dockItems]} />
        </div>

        <div className="flex flex-col gap-2.5 border-t border-white/10 pt-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="transition-colors duration-200 ease-in-out hover:text-white"
            >
              About
            </Link>
            <Link
              href="/#projects"
              className="transition-colors duration-200 ease-in-out hover:text-white"
            >
              Work
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

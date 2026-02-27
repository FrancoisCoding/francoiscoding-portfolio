import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

const anchorLinks = [
  { href: '/#hero', label: 'Hero' },
  { href: '/#companies', label: 'Companies' },
];

const routeLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-black/10 bg-white/75 p-3 shadow-xl shadow-black/5 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/75">
        <Link
          href="/"
          className="rounded-md px-2 py-1 text-sm font-semibold text-slate-900 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:outline-none dark:text-slate-100"
        >
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {anchorLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          {routeLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <a
              href={siteConfig.financeFlowUrl}
              target="_blank"
              rel="noreferrer"
            >
              FinanceFlow
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

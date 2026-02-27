import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AppProviders } from '@/components/providers/app-providers';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const displayFont = Sora({
  variable: '--font-display',
  subsets: ['latin'],
});

const bodyFont = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Isaiah Francois | Senior Full Stack Engineer',
    template: '%s | Isaiah Francois',
  },
  description:
    'Portfolio of Isaiah Francois, Senior Full Stack Engineer with 8+ years building high-impact products.',
  openGraph: {
    title: 'Isaiah Francois | Senior Full Stack Engineer',
    description:
      'Portfolio of Isaiah Francois, Senior Full Stack Engineer with 8+ years building high-impact products.',
    type: 'website',
    url: '/',
    siteName: 'Isaiah Francois Portfolio',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Isaiah Francois portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isaiah Francois | Senior Full Stack Engineer',
    description:
      'Portfolio of Isaiah Francois, Senior Full Stack Engineer with 8+ years building high-impact products.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} min-h-screen antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProviders>
            <a
              href="#main-content"
              className="sr-only z-50 rounded-md bg-white px-3 py-2 text-slate-900 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:ring-[var(--brand)] focus:outline-none"
            >
              Skip to main content
            </a>
            <div className="relative flex min-h-screen flex-col">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="hero-glow-primary" />
                <div className="hero-glow-secondary" />
              </div>
              <SiteHeader />
              <main
                id="main-content"
                className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6"
              >
                {children}
              </main>
              <SiteFooter />
            </div>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}

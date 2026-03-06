import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Caveat, Manrope } from 'next/font/google';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { AppProviders } from '@/components/providers/app-providers';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

const manropeFont = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const accentFont = Caveat({
  variable: '--font-accent',
  subsets: ['latin'],
  weight: ['500', '600'],
});

const openGraphImageUrl = new URL(
  '/opengraph-image',
  siteConfig.siteUrl,
).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Isaiah Francois | Senior Full Stack Engineer Portfolio',
    template: '%s | Isaiah Francois',
  },
  description:
    'Senior full stack engineer Isaiah Francois builds scalable products like FinanceFlow using modern architecture, clean UX, and product-focused engineering.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/profile.ico?v=1', type: 'image/x-icon' }],
    shortcut: [{ url: '/profile.ico?v=1', type: 'image/x-icon' }],
    apple: [{ url: '/profile.jpg?v=1', type: 'image/jpeg' }],
  },
  openGraph: {
    title: 'Isaiah Francois Portfolio | Senior Full Stack Engineer',
    description:
      'Senior full stack engineer Isaiah Francois builds scalable products like FinanceFlow using modern architecture, clean UX, and product-focused engineering.',
    type: 'website',
    url: '/',
    siteName: 'Isaiah Francois Portfolio',
    images: [
      {
        url: openGraphImageUrl,
        width: 1200,
        height: 630,
        alt: 'Isaiah Francois portfolio preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isaiah Francois Portfolio | Senior Full Stack Engineer',
    description:
      'Senior full stack engineer Isaiah Francois builds scalable products like FinanceFlow using modern architecture, clean UX, and product-focused engineering.',
    images: [openGraphImageUrl],
  },
  keywords: [
    'Isaiah Francois',
    'Full Stack Engineer',
    'Senior Software Engineer',
    'React Developer',
    'Next.js Developer',
    'FinanceFlow',
    'Software Engineer Portfolio',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manropeFont.variable} ${accentFont.variable} min-h-screen antialiased`}
      >
        <ThemeProvider attribute="class" forcedTheme="dark">
          <AppProviders>
            <a
              href="#main-content"
              className="sr-only z-50 rounded-md bg-white px-3 py-2 text-slate-950 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
            >
              Skip to main content
            </a>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main
                id="main-content"
                className="w-full flex-1 px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-14"
              >
                {children}
              </main>
              <SiteFooter />
            </div>
            <Analytics />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}

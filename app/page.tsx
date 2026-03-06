import type { Metadata } from 'next';

import { ContactSection } from '@/components/contact/contact-section';
import { HeroSection } from '@/components/home/hero-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { siteConfig } from '@/lib/site-config';

const openGraphImageUrl = new URL(
  '/opengraph-image',
  siteConfig.siteUrl,
).toString();

export const metadata: Metadata = {
  title: 'Isaiah Francois | Full Stack Engineer Portfolio & Projects',
  description:
    'Review Isaiah Francois’s portfolio with FinanceFlow and selected projects showcasing full stack product engineering, scalable architecture, and modern UI delivery.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Isaiah Francois | Full Stack Engineer Portfolio & Projects',
    description:
      'Review Isaiah Francois’s portfolio with FinanceFlow and selected projects showcasing full stack product engineering, scalable architecture, and modern UI delivery.',
    url: '/',
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
    title: 'Isaiah Francois | Full Stack Engineer Portfolio & Projects',
    description:
      'Review Isaiah Francois’s portfolio with FinanceFlow and selected projects showcasing full stack product engineering, scalable architecture, and modern UI delivery.',
    images: [openGraphImageUrl],
  },
};

export default function HomePage() {
  return (
    <div className="pb-12">
      <HeroSection />
      <ProjectsSection />

      <ContactSection id="contact" />
    </div>
  );
}

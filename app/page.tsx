import type { Metadata } from 'next';

import { ContactSection } from '@/components/contact/contact-section';
import { HeroSection } from '@/components/home/hero-section';
import { ProjectsSection } from '@/components/home/projects-section';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Senior Full Stack Engineer portfolio featuring FinanceFlow, Edson Prime Estates, Bible Jeopardy, and Bear-X.',
  openGraph: {
    title: 'Isaiah Francois | Senior Full Stack Engineer',
    description:
      'Selected work from Isaiah Francois, including FinanceFlow and featured web projects.',
    url: '/',
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

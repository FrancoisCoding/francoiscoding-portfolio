import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import {
  SiNextdotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

import { siteConfig } from '@/lib/site-config';

const aboutNavigationLinks = [
  {
    href: '#overview',
    label: "I'm Isaiah",
  },
  {
    href: '#expertise',
    label: 'Expertise',
  },
  {
    href: '#tool-stack',
    label: 'Tool Stack',
  },
] as const;

const expertiseTags = [
  'Full stack engineering',
  'Frontend systems',
  'Backend architecture',
  'Internal tools',
  'AI-assisted workflows',
  'Product delivery',
] as const;

const experienceItems = [
  {
    company: 'FinanceFlow',
    detail: 'Product engineering, architecture, and modern finance UX.',
    timeframe: 'Current',
  },
  {
    company: 'Disney',
    detail: 'Frontend and full stack delivery on production-facing systems.',
    timeframe: 'Previous',
  },
  {
    company: 'Department of Defense',
    detail:
      'Secure workflows, engineering delivery, and pragmatic systems work.',
    timeframe: 'Previous',
  },
  {
    company: 'MassVirtual',
    detail: 'Product development across immersive and web-based experiences.',
    timeframe: 'Previous',
  },
] as const;

const toolLinks = [
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    icon: SiNextdotjs,
  },
  {
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    icon: SiTypescript,
  },
  {
    name: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
    icon: SiTailwindcss,
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com',
    icon: SiSupabase,
  },
  {
    name: 'Prisma',
    href: 'https://www.prisma.io',
    icon: SiPrisma,
  },
  {
    name: 'PostgreSQL',
    href: 'https://www.postgresql.org',
    icon: SiPostgresql,
  },
  {
    name: 'OpenAI',
    href: 'https://openai.com',
    icon: SiOpenai,
  },
] as const;

const aboutGalleryItems = [
  {
    src: '/about/about1.jpg',
    alt: 'Isaiah Francois standing near Big Ben in London.',
    className: 'row-span-2 min-h-[18rem] md:min-h-[22rem]',
    sizes: '(max-width: 1024px) 100vw, 22vw',
  },
  {
    src: '/about/about5.jpg',
    alt: 'Isaiah Francois smiling beside a dolphin in the water.',
    className: 'min-h-[8.5rem] md:min-h-[10.5rem]',
    sizes: '(max-width: 1024px) 50vw, 10vw',
  },
  {
    src: '/about/about8.jpg',
    alt: 'Ocean overlook from a cliffside viewpoint.',
    className: 'min-h-[8.5rem] md:min-h-[10.5rem]',
    sizes: '(max-width: 1024px) 50vw, 10vw',
  },
  {
    src: '/about/about3.jpg',
    alt: 'Isaiah Francois walking through greenery in Bali.',
    className: 'row-span-2 min-h-[18rem] md:min-h-[22rem]',
    sizes: '(max-width: 1024px) 100vw, 12vw',
  },
] as const;

export const metadata: Metadata = {
  title: 'About',
  description:
    'Background, experience, and technology stack for Isaiah Francois.',
  openGraph: {
    title: 'About | Isaiah Francois',
    description:
      'Background, experience, and technology stack for Isaiah Francois.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <section className="pt-7 pb-12 sm:pt-9">
      <div className="mx-auto max-w-[64rem] lg:grid lg:grid-cols-[5.75rem_minmax(0,1fr)] lg:gap-12">
        <nav
          aria-label="About page sections"
          className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
        >
          <div className="space-y-3 text-[0.95rem] text-white/52">
            {aboutNavigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-14">
          <section id="overview" className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr_0.55fr] sm:grid-rows-2">
              {aboutGalleryItems.map((item) => (
                <div
                  key={item.src}
                  className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0f0f10] ${item.className}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes={item.sizes}
                    priority
                  />
                </div>
              ))}
            </div>

            <div className="max-w-[43rem] space-y-6">
              <h1 className="max-w-[18ch] text-[clamp(2rem,3.1vw,2.95rem)] font-semibold tracking-[-0.05em] text-white">
                I&apos;m Isaiah, a full stack developer building scalable,
                user-focused digital products.
              </h1>

              <div className="max-w-[40rem] space-y-5 text-[1.03rem] leading-8 text-white/76">
                <p>
                  With 7+ years of experience across product engineering,
                  frontend architecture, backend systems, and internal tools, I
                  build software that is clean, fast, and practical.
                </p>
                <p>
                  My focus is straightforward: ship dependable products, reduce
                  friction for users, and keep the underlying systems
                  maintainable as they grow.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  {siteConfig.email}
                </a>
                <Link
                  href="/resume"
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  Resume
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={siteConfig.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <p className="max-w-[40rem] text-[1.03rem] leading-8 text-white/72">
                Great software goes beyond aesthetics. It should solve real
                problems, stay usable under pressure, and scale without turning
                into a maintenance burden.
              </p>
            </div>
          </section>

          <section id="expertise" className="space-y-6">
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
              Expertise
            </h2>

            <div className="flex flex-wrap gap-2">
              {expertiseTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/6 px-3.5 text-sm font-medium text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              {experienceItems.map((item) => (
                <article
                  key={item.company}
                  className="rounded-[1.35rem] border border-white/10 bg-white/5 px-5 py-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-[1.08rem] font-semibold text-white">
                        {item.company}
                      </h3>
                      <p className="max-w-3xl text-sm leading-6 text-white/64">
                        {item.detail}
                      </p>
                    </div>
                    <p className="text-sm text-white/48">{item.timeframe}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="tool-stack" className="space-y-6">
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
              Tool Stack
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              {toolLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-[5.25rem] items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 px-5 transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/10 bg-[#111214] text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[0.98rem] font-medium text-white">
                          {item.name}
                        </p>
                        <p className="text-sm text-white/52">
                          Open technology site
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-white/42 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bot,
  Code2,
  Database,
  Github,
  LayoutGrid,
  Linkedin,
  Rocket,
  Settings2,
} from 'lucide-react';
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
    href: '#hobbies',
    label: 'Hobbies',
  },
  {
    href: '#tool-stack',
    label: 'Tool Stack',
  },
] as const;

const expertiseTags = [
  {
    label: 'Full stack engineering',
    icon: Code2,
    iconClassName: 'text-sky-300',
  },
  {
    label: 'Frontend systems',
    icon: LayoutGrid,
    iconClassName: 'text-violet-300',
  },
  {
    label: 'Backend architecture',
    icon: Database,
    iconClassName: 'text-emerald-300',
  },
  {
    label: 'Internal tools',
    icon: Settings2,
    iconClassName: 'text-amber-300',
  },
  {
    label: 'AI-assisted workflows',
    icon: Bot,
    iconClassName: 'text-cyan-300',
  },
  {
    label: 'Product delivery',
    icon: Rocket,
    iconClassName: 'text-pink-300',
  },
] as const;

const experienceItems = [
  {
    role: 'Senior Full Stack Engineer',
    company: 'FinanceFlow',
    location: 'Remote',
    timeframe: '2024 - Present',
    duration: '(2+ years)',
    logoLabel: 'FF',
    logoClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(16,185,129,0.3),rgba(5,46,22,0.22))] text-emerald-100',
  },
  {
    role: 'Software Engineer',
    company: 'Disney',
    location: 'United States',
    timeframe: '2022 - 2024',
    duration: '(2 years)',
    logoLabel: 'D',
    logoClassName:
      'border-red-300/35 bg-[linear-gradient(180deg,rgba(248,113,113,0.3),rgba(69,10,10,0.22))] text-red-100',
  },
  {
    role: 'Full Stack Engineer',
    company: 'Department of Defense',
    location: 'United States',
    timeframe: '2020 - 2022',
    duration: '(2 years)',
    logoLabel: 'DoD',
    logoClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.3),rgba(23,37,84,0.22))] text-blue-100',
  },
  {
    role: 'Software Developer',
    company: 'MassVirtual',
    location: 'United States',
    timeframe: '2018 - 2020',
    duration: '(2 years)',
    logoLabel: 'MV',
    logoClassName:
      'border-fuchsia-300/35 bg-[linear-gradient(180deg,rgba(232,121,249,0.3),rgba(74,4,78,0.22))] text-fuchsia-100',
  },
] as const;

const toolLinks = [
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    icon: SiNextdotjs,
    iconColor: '#f8fafc',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
  },
  {
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    icon: SiTypescript,
    iconColor: '#3178c6',
    iconContainerClassName:
      'border-[#3178c6]/40 bg-[linear-gradient(180deg,rgba(49,120,198,0.28),rgba(49,120,198,0.14))]',
  },
  {
    name: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
    icon: SiTailwindcss,
    iconColor: '#38bdf8',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(56,189,248,0.22),rgba(14,116,144,0.14))]',
  },
  {
    name: 'Supabase',
    href: 'https://supabase.com',
    icon: SiSupabase,
    iconColor: '#3ecf8e',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(62,207,142,0.24),rgba(22,101,52,0.14))]',
  },
  {
    name: 'Prisma',
    href: 'https://www.prisma.io',
    icon: SiPrisma,
    iconColor: '#5a67d8',
    iconContainerClassName:
      'border-indigo-300/35 bg-[linear-gradient(180deg,rgba(90,103,216,0.22),rgba(49,46,129,0.14))]',
  },
  {
    name: 'PostgreSQL',
    href: 'https://www.postgresql.org',
    icon: SiPostgresql,
    iconColor: '#336791',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(51,103,145,0.24),rgba(30,58,138,0.14))]',
  },
  {
    name: 'OpenAI',
    href: 'https://openai.com',
    icon: SiOpenai,
    iconColor: '#4ade80',
    iconContainerClassName:
      'border-green-300/35 bg-[linear-gradient(180deg,rgba(74,222,128,0.2),rgba(21,128,61,0.14))]',
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

const hobbiesCards = [
  {
    src: '/about/about6.jpg',
    alt: 'Workspace setup with laptop and desk tools.',
    title: 'Building & Learning',
    className: 'rotate-[-7deg]',
  },
  {
    src: '/about/about8.jpg',
    alt: 'Ocean and travel scene.',
    title: 'Travel & Exploration',
    className: 'rotate-[3deg]',
  },
  {
    src: '/about/about4.jpg',
    alt: 'Fitness equipment and gym space.',
    title: 'Fitness & Wellness',
    className: 'rotate-[6deg]',
  },
] as const;

const hobbiesMosaic = [
  {
    src: '/about/about2.jpg',
    alt: 'Isaiah standing in front of a skyline view.',
    className: 'row-span-2 min-h-[14rem]',
  },
  {
    src: '/about/about7.jpg',
    alt: 'Night skyline from a city vantage point.',
    className: 'row-span-2 min-h-[14rem]',
  },
  {
    src: '/about/about5.jpg',
    alt: 'Outdoor water and coastline view.',
    className: 'min-h-[9rem]',
  },
  {
    src: '/about/about3.jpg',
    alt: 'Landscape view with mountains.',
    className: 'min-h-[9rem]',
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
              {expertiseTags.map((tag) => {
                const Icon = tag.icon;

                return (
                  <span
                    key={tag.label}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-3.5 text-[0.96rem] font-medium text-white/88"
                  >
                    <Icon className={`h-4 w-4 ${tag.iconClassName}`} />
                    {tag.label}
                  </span>
                );
              })}
            </div>

            <div className="space-y-3.5">
              {experienceItems.map((item) => (
                <article
                  key={item.company}
                  className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4"
                >
                  <div className="grid gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)] md:items-start">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-[1rem] border text-sm font-semibold tracking-wide ${item.logoClassName}`}
                    >
                      {item.logoLabel}
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-[1.12rem] font-semibold text-white">
                          {item.role}
                        </h3>
                        <p className="text-[1.02rem] text-white/84">
                          {item.company}
                        </p>
                        <p className="text-sm text-white/58">{item.location}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[1rem] text-white/84">
                          {item.timeframe}
                        </p>
                        <p className="text-sm text-white/48">{item.duration}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="hobbies" className="space-y-8">
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
              Hobbies
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              {hobbiesCards.map((item) => (
                <article
                  key={item.src}
                  className={`rounded-[1.2rem] border border-white/10 bg-[#202124] p-2.5 ${item.className}`}
                >
                  <div className="relative min-h-[9rem] overflow-hidden rounded-[0.95rem] border border-white/8">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <p className="px-1 pt-3 pb-1 text-center text-[0.94rem] font-medium text-white/88">
                    {item.title}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr] sm:grid-rows-2">
              {hobbiesMosaic.map((item) => (
                <div
                  key={item.src}
                  className={`relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0f0f10] ${item.className}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
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
                    className="group flex min-h-[5.25rem] items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 px-5 transition-[transform,background-color,border-color] duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-[1rem] border ${item.iconContainerClassName}`}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: item.iconColor }}
                        />
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

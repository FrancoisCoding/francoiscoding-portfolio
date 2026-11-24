import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import { imageSize } from 'image-size';
import type { CSSProperties } from 'react';
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
  Twitter,
} from 'lucide-react';
import { AboutSideNav } from '@/components/about/about-side-nav';
import { ToolStack } from '@/components/about/tool-stack';
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
    label: 'SaaS architecture',
    icon: LayoutGrid,
    iconClassName: 'text-violet-300',
  },
  {
    label: 'REST API design',
    icon: Database,
    iconClassName: 'text-emerald-300',
  },
  {
    label: 'State management',
    icon: Settings2,
    iconClassName: 'text-amber-300',
  },
  {
    label: 'Cloud delivery',
    icon: Bot,
    iconClassName: 'text-cyan-300',
  },
  {
    label: 'Performance optimization',
    icon: Rocket,
    iconClassName: 'text-pink-300',
  },
] as const;

interface IExperienceItem {
  role: string;
  company: string;
  href: string;
  location: string;
  timeframe: string;
  duration: string;
  logoAlt?: string;
  logoClassName: string;
  logoLabel: string;
  logoSrc?: string;
  logoImageClassName?: string;
}

const experienceItems: IExperienceItem[] = [
  {
    role: 'Tech Lead',
    company: 'Synchrony Financial',
    href: 'https://www.synchrony.com/about-us',
    location: 'Remote',
    timeframe: 'May 2026 - Oct 2026',
    duration: '(6 months)',
    logoSrc: '/expertise/synchrony.svg',
    logoAlt: 'Synchrony Financial logo',
    logoLabel: 'S',
    logoClassName: 'border-[#fbc600]/30 bg-[#101113] text-[#fbc600]',
  },
  {
    role: 'Senior Full Stack Engineer',
    company: 'Disney',
    href: 'https://thewaltdisneycompany.com/',
    location: 'Lake Buena Vista, FL',
    timeframe: 'Jun 2024 - May 2026',
    duration: '(2 years)',
    logoSrc: '/expertise/disney.svg',
    logoAlt: 'Disney logo',
    logoLabel: 'D',
    logoClassName: 'border-white/14 bg-white text-slate-950',
  },
  {
    role: 'Lead Web Engineer',
    company: 'MassVirtual',
    href: 'https://www.massvirtual.com/',
    location: 'Orlando, FL',
    timeframe: 'Apr 2023 - Jun 2024',
    duration: '(1 year 3 months)',
    logoSrc: '/expertise/massvirtual.svg',
    logoAlt: 'MassVirtual logo',
    logoLabel: 'MV',
    logoClassName: 'border-[#00A4E4]/35 bg-[#071018] text-[#9edfff]',
  },
  {
    role: 'Lead Front-End Engineer',
    company: 'SoSha',
    href: 'https://www.sosha.co/',
    location: 'Remote',
    timeframe: 'Feb 2021 - Apr 2023',
    duration: '(2 years 3 months)',
    logoSrc: '/expertise/sosha.svg',
    logoAlt: 'SoSha logo',
    logoLabel: 'S',
    logoClassName: 'border-white/14 bg-[#dfe5f2] text-slate-950',
    logoImageClassName: 'h-7 w-full object-contain',
  },
  {
    role: 'Front-End Engineer (Externship)',
    company: 'Department of Defense',
    href: 'https://www.usa.gov/agencies/u-s-department-of-defense',
    location: 'Remote',
    timeframe: 'Oct 2020 - Dec 2020',
    duration: '(3 months)',
    logoSrc: '/expertise/dod.png',
    logoAlt: 'Department of Defense logo',
    logoLabel: 'DoD',
    logoClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.3),rgba(23,37,84,0.22))] text-blue-100',
  },
  {
    role: 'Team Lead',
    company: 'Bloom Institute of Technology',
    href: 'https://www.bloomtech.com/',
    location: 'Remote',
    timeframe: 'Oct 2019 - Jul 2020',
    duration: '(10 months)',
    logoSrc: '/expertise/bloominstituteoftechnology_logo.jpg',
    logoAlt: 'Bloom Institute of Technology logo',
    logoLabel: 'B',
    logoClassName: 'border-white/14 bg-white text-slate-950',
  },
];

const aboutImageQuality = 100;

const mainAboutImageFileNames = [
  'main.jpg',
  'main2.jpg',
  'main3.jpg',
  'main4.jpg',
] as const;

const hobbyCategoryImageFileNames = [
  'travel.jpg',
  'cooking.jpg',
  'bouldering.jpg',
  'volleyball.jpg',
] as const;

interface IAboutImageMeta {
  fileName: string;
  height: number;
  width: number;
}

function getAboutImagesMeta(): IAboutImageMeta[] {
  try {
    const aboutDirectoryPath = join(process.cwd(), 'public', 'about');
    return readdirSync(aboutDirectoryPath)
      .filter((fileName) => /\.(avif|jpg|jpeg|png|webp)$/i.test(fileName))
      .map((fileName) => {
        const imagePath = join(aboutDirectoryPath, fileName);
        const dimensions = imageSize(readFileSync(imagePath));

        return {
          fileName,
          height: dimensions.height ?? 1200,
          width: dimensions.width ?? 1200,
        };
      })
      .sort((leftFileName, rightFileName) =>
        leftFileName.fileName.localeCompare(rightFileName.fileName),
      );
  } catch {
    return [];
  }
}

function buildAboutImageAlt(fileName: string) {
  const sanitizedLabel = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!sanitizedLabel) {
    return 'Isaiah Francois lifestyle photo.';
  }

  return `Isaiah Francois ${sanitizedLabel} photo.`;
}

const aboutImagesMeta = getAboutImagesMeta();

const usedAboutImageFileNameSet = new Set<string>([
  ...mainAboutImageFileNames,
  ...hobbyCategoryImageFileNames,
]);

const additionalAboutImageTiles = aboutImagesMeta
  .filter((item) => !usedAboutImageFileNameSet.has(item.fileName))
  .map((item) => ({
    src: `/about/${item.fileName}`,
    alt: buildAboutImageAlt(item.fileName),
    height: item.height,
    width: item.width,
  }));

const aboutGalleryItems = [
  {
    src: '/about/main.jpg',
    alt: 'Isaiah Francois portrait in London.',
    className: 'row-span-2 min-h-[18rem] md:min-h-[22rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 46vw, 35vw',
  },
  {
    src: '/about/main2.jpg',
    alt: 'Isaiah Francois with scenic travel backdrop.',
    className: 'min-h-[8.5rem] md:min-h-[10.5rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 20vw',
  },
  {
    src: '/about/main3.jpg',
    alt: 'Lifestyle portrait in Las Vegas.',
    className: 'min-h-[8.5rem] md:min-h-[10.5rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 22vw, 14vw',
  },
  {
    src: '/about/main4.jpg',
    alt: 'Isaiah Francois on travel in Bali.',
    className: 'row-span-2 min-h-[18rem] md:min-h-[22rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 30vw, 20vw',
  },
] as const;

const hobbiesCards = [
  {
    src: '/about/travel.jpg',
    alt: 'Travel moment by the coast.',
    title: 'Travel',
    stack: { offset: -8, angle: -8, openOffset: -18, openAngle: -5 },
  },
  {
    src: '/about/cooking.jpg',
    alt: 'Cooking moment.',
    title: 'Cooking',
    stack: { offset: -2.6, angle: -2, openOffset: -6, openAngle: -1 },
  },
  {
    src: '/about/bouldering.jpg',
    alt: 'Indoor bouldering session.',
    title: 'Bouldering',
    stack: { offset: 2.6, angle: 2, openOffset: 6, openAngle: 1 },
  },
  {
    src: '/about/volleyball.jpg',
    alt: 'Volleyball event with teammates.',
    title: 'Volleyball',
    stack: { offset: 8, angle: 8, openOffset: 18, openAngle: 5 },
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
        <AboutSideNav links={aboutNavigationLinks} />

        <div className="space-y-14">
          <section id="overview" className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr_0.55fr] sm:grid-rows-2">
              {aboutGalleryItems.map((item, index) => (
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
                    quality={aboutImageQuality}
                    priority={index < 2}
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
                  href={siteConfig.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                >
                  <Twitter className="h-4 w-4" aria-hidden="true" />
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
                  className="group relative rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <div className="grid gap-4 md:grid-cols-[3.5rem_minmax(0,1fr)] md:items-start">
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-[1rem] border text-sm font-semibold tracking-wide ${item.logoClassName}`}
                    >
                      {item.logoSrc ? (
                        <Image
                          src={item.logoSrc}
                          alt={item.logoAlt ?? `${item.company} logo`}
                          width={42}
                          height={42}
                          className={
                            item.logoImageClassName ??
                            'h-10 w-10 object-contain'
                          }
                        />
                      ) : (
                        item.logoLabel
                      )}
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-[1.12rem] font-semibold text-white">
                          {item.role}
                        </h3>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[1.02rem] text-white/84 underline-offset-4 group-hover:text-white group-hover:underline after:absolute after:inset-0 after:rounded-[1.25rem] focus-visible:text-white focus-visible:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white"
                        >
                          <span>{item.company}</span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="motion-enabled:transition-opacity size-4 shrink-0 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:opacity-0"
                          />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
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

            <div className="hobby-gallery mx-auto grid w-full max-w-[48rem] items-start gap-4 sm:grid-cols-2 lg:min-h-[16.5rem] lg:grid-cols-4">
              {hobbiesCards.map((item, index) => (
                <article
                  key={item.src}
                  className="hobby-photo rounded-[1.2rem] border border-white/10 bg-[#202124] p-2.5"
                  style={
                    {
                      '--hobby-layer': hobbiesCards.length - index,
                      '--hobby-x': `${item.stack.offset}rem`,
                      '--hobby-rotation': `${item.stack.angle}deg`,
                      '--hobby-open-x': `${item.stack.openOffset}rem`,
                      '--hobby-open-rotation': `${item.stack.openAngle}deg`,
                    } as CSSProperties
                  }
                >
                  <div className="relative min-h-[9.1rem] overflow-hidden rounded-[0.95rem] border border-white/8">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 184px, (min-width: 640px) 50vw, 100vw"
                      quality={aboutImageQuality}
                    />
                  </div>
                  <p className="font-accent px-1 pt-3 pb-1 text-center text-[1.06rem] font-medium tracking-[0.01em] text-white/90">
                    {item.title}
                  </p>
                </article>
              ))}
            </div>

            <div className="mx-auto w-full max-w-[48rem] columns-2 gap-2.5 sm:columns-3 sm:gap-3">
              {additionalAboutImageTiles.map((item, index) => (
                <figure
                  key={item.src}
                  className="mb-2.5 break-inside-avoid sm:mb-3"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    className="h-auto w-full rounded-[1rem]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 34vw, 24vw"
                    quality={aboutImageQuality}
                    priority={index < 3}
                  />
                </figure>
              ))}
            </div>
          </section>

          <ToolStack />
        </div>
      </div>
    </section>
  );
}

import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bot,
  Cloud,
  CloudCog,
  Code2,
  Database,
  FlaskConical,
  Github,
  LayoutGrid,
  Linkedin,
  Rocket,
  Settings2,
} from 'lucide-react';
import {
  SiConfluence,
  SiCypress,
  SiDatadog,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGitlab,
  SiGraphql,
  SiJest,
  SiJira,
  SiMongodb,
  SiNewrelic,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiReactquery,
  SiRedux,
  SiSnowflake,
  SiStreamlit,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiVercel,
} from 'react-icons/si';

import { AboutSideNav } from '@/components/about/about-side-nav';
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
    role: 'Senior Full Stack Engineer',
    company: 'Disney',
    location: 'Lake Buena Vista, FL',
    timeframe: 'Jun 2024 - Present',
    duration: '(1 year 9 months)',
    logoSrc: '/expertise/disney.svg',
    logoAlt: 'Disney logo',
    logoLabel: 'D',
    logoClassName: 'border-white/14 bg-white text-slate-950',
  },
  {
    role: 'Lead Web Engineer',
    company: 'MassVirtual',
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
    location: 'Remote',
    timeframe: 'Oct 2019 - Jul 2020',
    duration: '(10 months)',
    logoSrc: '/expertise/bloominstituteoftechnology_logo.jpg',
    logoAlt: 'Bloom Institute of Technology logo',
    logoLabel: 'B',
    logoClassName: 'border-white/14 bg-white text-slate-950',
  },
];

const toolLinks = [
  {
    name: 'Next.js',
    href: 'https://nextjs.org',
    icon: SiNextdotjs,
    iconColor: '#f8fafc',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
  },
  {
    name: 'Vue.js',
    href: 'https://vuejs.org',
    icon: SiVuedotjs,
    iconColor: '#42b883',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(66,184,131,0.24),rgba(6,78,59,0.14))]',
  },
  {
    name: 'React',
    href: 'https://react.dev',
    icon: SiReact,
    iconColor: '#61dafb',
    iconContainerClassName:
      'border-cyan-300/35 bg-[linear-gradient(180deg,rgba(97,218,251,0.24),rgba(8,47,73,0.14))]',
  },
  {
    name: 'TanStack Query',
    href: 'https://tanstack.com/query/latest',
    icon: SiReactquery,
    iconColor: '#ff4154',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(255,65,84,0.24),rgba(127,29,29,0.14))]',
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
    name: 'Redux',
    href: 'https://redux.js.org',
    icon: SiRedux,
    iconColor: '#8b5cf6',
    iconContainerClassName:
      'border-violet-300/35 bg-[linear-gradient(180deg,rgba(139,92,246,0.24),rgba(76,29,149,0.14))]',
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
    name: 'Node.js',
    href: 'https://nodejs.org',
    icon: SiNodedotjs,
    iconColor: '#66cc33',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(102,204,51,0.22),rgba(54,83,20,0.14))]',
  },
  {
    name: 'Express',
    href: 'https://expressjs.com',
    icon: SiExpress,
    iconColor: '#d1d5db',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
  },
  {
    name: 'Django',
    href: 'https://www.djangoproject.com',
    icon: SiDjango,
    iconColor: '#44b78b',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(68,183,139,0.24),rgba(6,78,59,0.14))]',
  },
  {
    name: 'GraphQL',
    href: 'https://graphql.org',
    icon: SiGraphql,
    iconColor: '#e535ab',
    iconContainerClassName:
      'border-fuchsia-300/35 bg-[linear-gradient(180deg,rgba(229,53,171,0.22),rgba(80,7,36,0.14))]',
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
    name: 'MongoDB',
    href: 'https://www.mongodb.com',
    icon: SiMongodb,
    iconColor: '#22c55e',
    iconContainerClassName:
      'border-green-300/35 bg-[linear-gradient(180deg,rgba(34,197,94,0.22),rgba(20,83,45,0.14))]',
  },
  {
    name: 'Firebase',
    href: 'https://firebase.google.com',
    icon: SiFirebase,
    iconColor: '#f59e0b',
    iconContainerClassName:
      'border-amber-300/35 bg-[linear-gradient(180deg,rgba(245,158,11,0.22),rgba(120,53,15,0.14))]',
  },
  {
    name: 'Snowflake',
    href: 'https://www.snowflake.com',
    icon: SiSnowflake,
    iconColor: '#38bdf8',
    iconContainerClassName:
      'border-cyan-300/35 bg-[linear-gradient(180deg,rgba(56,189,248,0.22),rgba(8,47,73,0.14))]',
  },
  {
    name: 'Docker',
    href: 'https://www.docker.com',
    icon: SiDocker,
    iconColor: '#2496ed',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(36,150,237,0.22),rgba(12,74,110,0.14))]',
  },
  {
    name: 'AWS',
    href: 'https://aws.amazon.com',
    icon: Cloud,
    iconColor: '#f59e0b',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(245,158,11,0.2),rgba(124,45,18,0.14))]',
  },
  {
    name: 'Azure',
    href: 'https://azure.microsoft.com',
    icon: CloudCog,
    iconColor: '#60a5fa',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.22),rgba(30,58,138,0.14))]',
  },
  {
    name: 'OpenAI',
    href: 'https://openai.com',
    icon: SiOpenai,
    iconColor: '#4ade80',
    iconContainerClassName:
      'border-green-300/35 bg-[linear-gradient(180deg,rgba(74,222,128,0.2),rgba(21,128,61,0.14))]',
  },
  {
    name: 'Python',
    href: 'https://www.python.org',
    icon: SiPython,
    iconColor: '#ffde57',
    iconContainerClassName:
      'border-yellow-300/35 bg-[linear-gradient(180deg,rgba(255,222,87,0.2),rgba(113,63,18,0.14))]',
  },
  {
    name: 'Playwright',
    href: 'https://playwright.dev',
    icon: FlaskConical,
    iconColor: '#84cc16',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(132,204,22,0.2),rgba(63,98,18,0.14))]',
  },
  {
    name: 'Cypress',
    href: 'https://www.cypress.io',
    icon: SiCypress,
    iconColor: '#d1d5db',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
  },
  {
    name: 'Jest',
    href: 'https://jestjs.io',
    icon: SiJest,
    iconColor: '#e11d48',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(225,29,72,0.2),rgba(127,29,29,0.14))]',
  },
  {
    name: 'Datadog',
    href: 'https://www.datadoghq.com',
    icon: SiDatadog,
    iconColor: '#a78bfa',
    iconContainerClassName:
      'border-violet-300/35 bg-[linear-gradient(180deg,rgba(167,139,250,0.2),rgba(76,29,149,0.14))]',
  },
  {
    name: 'New Relic',
    href: 'https://newrelic.com',
    icon: SiNewrelic,
    iconColor: '#84cc16',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(132,204,22,0.2),rgba(63,98,18,0.14))]',
  },
  {
    name: 'Vercel',
    href: 'https://vercel.com',
    icon: SiVercel,
    iconColor: '#ffffff',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
  },
  {
    name: 'Framer Motion',
    href: 'https://www.framer.com/motion/',
    icon: SiFramer,
    iconColor: '#7f5af0',
    iconContainerClassName:
      'border-indigo-300/35 bg-[linear-gradient(180deg,rgba(127,90,240,0.24),rgba(49,46,129,0.14))]',
  },
  {
    name: 'Figma',
    href: 'https://www.figma.com',
    icon: SiFigma,
    iconColor: '#f97316',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(249,115,22,0.22),rgba(124,45,18,0.14))]',
  },
  {
    name: 'Jira',
    href: 'https://www.atlassian.com/software/jira',
    icon: SiJira,
    iconColor: '#60a5fa',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.22),rgba(30,58,138,0.14))]',
  },
  {
    name: 'Confluence',
    href: 'https://www.atlassian.com/software/confluence',
    icon: SiConfluence,
    iconColor: '#93c5fd',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(147,197,253,0.22),rgba(30,64,175,0.14))]',
  },
  {
    name: 'GitLab',
    href: 'https://about.gitlab.com',
    icon: SiGitlab,
    iconColor: '#fb7185',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(251,113,133,0.2),rgba(127,29,29,0.14))]',
  },
  {
    name: 'Git',
    href: 'https://git-scm.com',
    icon: SiGit,
    iconColor: '#f05032',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(240,80,50,0.22),rgba(124,45,18,0.14))]',
  },
  {
    name: 'Streamlit',
    href: 'https://streamlit.io',
    icon: SiStreamlit,
    iconColor: '#f43f5e',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(244,63,94,0.2),rgba(127,29,29,0.14))]',
  },
] as const;

const toolUsageByName: Record<(typeof toolLinks)[number]['name'], string> = {
  AWS: 'Cloud infrastructure',
  Azure: 'Cloud deployment',
  Confluence: 'Documentation hub',
  Cypress: 'E2E test coverage',
  Datadog: 'Runtime monitoring',
  Django: 'Backend services',
  Docker: 'Containerized delivery',
  Express: 'REST API layer',
  Figma: 'UI system design',
  Firebase: 'Auth and realtime',
  'Framer Motion': 'UI motion',
  Git: 'Version control',
  GitLab: 'CI and repos',
  GraphQL: 'Typed API queries',
  Jest: 'Unit testing',
  Jira: 'Sprint tracking',
  MongoDB: 'Document database',
  'New Relic': 'Performance insights',
  'Next.js': 'Product web apps',
  'Node.js': 'Server runtime',
  OpenAI: 'AI assistance',
  Playwright: 'Browser automation',
  PostgreSQL: 'Relational database',
  Prisma: 'Type-safe ORM',
  Python: 'Data tooling',
  React: 'Component UI',
  Redux: 'Global state',
  Snowflake: 'Analytics warehouse',
  Streamlit: 'Data apps',
  Supabase: 'Backend platform',
  'Tailwind CSS': 'Design system styling',
  'TanStack Query': 'Server-state caching',
  TypeScript: 'Typed JavaScript',
  Vercel: 'Frontend hosting',
  'Vue.js': 'Reactive interfaces',
};

const coreToolNames = [
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Supabase',
  'Prisma',
  'PostgreSQL',
  'AWS',
] as const;

const coreToolNameSet = new Set<string>(coreToolNames);

const coreTools = toolLinks.filter((item) => coreToolNameSet.has(item.name));
const extendedTools = toolLinks.filter(
  (item) => !coreToolNameSet.has(item.name),
);

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

const additionalGalleryLayoutCycle = [
  {
    className: 'sm:col-span-1 sm:row-span-2 min-h-[12rem] sm:min-h-[17rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 24vw',
  },
  {
    className: 'sm:col-span-2 sm:row-span-2 min-h-[12rem] sm:min-h-[17rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 84vw, 48vw',
  },
  {
    className: 'sm:col-span-1 sm:row-span-2 min-h-[12rem] sm:min-h-[17rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 24vw',
  },
  {
    className: 'sm:col-span-1 min-h-[9.5rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 24vw',
  },
  {
    className: 'sm:col-span-1 min-h-[9.5rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 42vw, 24vw',
  },
  {
    className: 'sm:col-span-2 min-h-[9.5rem]',
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 84vw, 48vw',
  },
] as const;

function getAboutImageFileNames() {
  try {
    const aboutDirectoryPath = join(process.cwd(), 'public', 'about');
    return readdirSync(aboutDirectoryPath)
      .filter((fileName) => /\.(avif|jpg|jpeg|png|webp)$/i.test(fileName))
      .sort((leftFileName, rightFileName) =>
        leftFileName.localeCompare(rightFileName),
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

const aboutImageFileNames = getAboutImageFileNames();

const usedAboutImageFileNameSet = new Set<string>([
  ...mainAboutImageFileNames,
  ...hobbyCategoryImageFileNames,
]);

const additionalAboutImageTiles = aboutImageFileNames
  .filter((fileName) => !usedAboutImageFileNameSet.has(fileName))
  .map((fileName, index) => {
    const isDrawingImage = fileName.startsWith('drawing');
    const layout =
      additionalGalleryLayoutCycle[index % additionalGalleryLayoutCycle.length];

    return {
      src: `/about/${fileName}`,
      alt: buildAboutImageAlt(fileName),
      className: isDrawingImage
        ? 'sm:col-span-2 min-h-[11.5rem] sm:min-h-[16.5rem]'
        : layout.className,
      imageClassName: isDrawingImage
        ? 'object-contain bg-[#0f0f10] p-2 sm:p-3'
        : 'object-cover',
      sizes: isDrawingImage
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 84vw, 48vw'
        : layout.sizes,
    };
  });

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
    stackClassName:
      'z-40 -translate-x-[8rem] -rotate-[8deg] group-hover:-translate-x-[18rem] group-hover:-rotate-[5deg]',
  },
  {
    src: '/about/cooking.jpg',
    alt: 'Cooking moment.',
    title: 'Cooking',
    stackClassName:
      'z-30 -translate-x-[2.6rem] -rotate-[2deg] group-hover:-translate-x-[6rem] group-hover:-rotate-[1deg]',
  },
  {
    src: '/about/bouldering.jpg',
    alt: 'Indoor bouldering session.',
    title: 'Bouldering',
    stackClassName:
      'z-20 translate-x-[2.6rem] rotate-[2deg] group-hover:translate-x-[6rem] group-hover:rotate-[1deg]',
  },
  {
    src: '/about/volleyball.jpg',
    alt: 'Volleyball event with teammates.',
    title: 'Volleyball',
    stackClassName:
      'z-10 translate-x-[8rem] rotate-[8deg] group-hover:translate-x-[18rem] group-hover:rotate-[5deg]',
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

            <div className="grid gap-4 sm:hidden">
              {hobbiesCards.map((item) => (
                <article
                  key={item.src}
                  className="rounded-[1.2rem] border border-white/10 bg-[#202124] p-2.5"
                >
                  <div className="relative min-h-[9rem] overflow-hidden rounded-[0.95rem] border border-white/8">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      quality={aboutImageQuality}
                    />
                  </div>
                  <p className="font-accent px-1 pt-3 pb-1 text-center text-[1.02rem] font-medium tracking-[0.01em] text-white/90">
                    {item.title}
                  </p>
                </article>
              ))}
            </div>

            <div className="group relative mx-auto hidden h-[16.5rem] w-full max-w-[48rem] sm:block">
              {hobbiesCards.map((item) => (
                <article
                  key={`${item.src}-stack`}
                  className={`absolute top-2 left-1/2 w-[11.5rem] rounded-[1.2rem] border border-white/10 bg-[#202124] p-2.5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${item.stackClassName}`}
                >
                  <div className="relative min-h-[9.1rem] overflow-hidden rounded-[0.95rem] border border-white/8">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 260px"
                      quality={aboutImageQuality}
                    />
                  </div>
                  <p className="font-accent px-1 pt-3 pb-1 text-center text-[1.06rem] font-medium tracking-[0.01em] text-white/90">
                    {item.title}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid auto-rows-[8.6rem] gap-3 sm:auto-rows-[7.9rem] sm:grid-cols-3">
              {additionalAboutImageTiles.map((item, index) => (
                <div
                  key={item.src}
                  className={`relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0f0f10] ${item.className}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className={item.imageClassName}
                    sizes={item.sizes}
                    quality={aboutImageQuality}
                    priority={index < 3}
                  />
                </div>
              ))}
            </div>
          </section>

          <section id="tool-stack" className="space-y-6">
            <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
              Tool Stack
            </h2>
            <p className="max-w-[36rem] text-sm text-white/58">
              Core stack first for quick scanning. Expand to view the full
              toolkit.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {coreTools.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-h-[4.75rem] items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/5 px-5 transition-[transform,background-color,border-color] duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
                          {toolUsageByName[item.name]}
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

            <details className="group rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-white/78 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  View complete toolkit ({extendedTools.length} more)
                </span>
                <span className="hidden group-open:inline">
                  Collapse complete toolkit
                </span>
              </summary>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {extendedTools.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-[4rem] items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.03] px-4 transition-[background-color,border-color] duration-200 ease-in-out hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-[0.8rem] border ${item.iconContainerClassName}`}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{ color: item.iconColor }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-white/52">
                            {toolUsageByName[item.name]}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-white/38 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </details>
          </section>
        </div>
      </div>
    </section>
  );
}

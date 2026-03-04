export interface IProjectLink {
  label: string;
  href: string;
  external?: boolean;
  tone?: 'primary' | 'secondary';
}

export type TProjectPreview = 'image' | 'bibleJeopardy' | 'bearX';

export interface IProjectItem {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  links: IProjectLink[];
  stack: string[];
  preview: TProjectPreview;
  imageSrc?: string;
  imageAlt?: string;
}

export interface IHomeProjectTile {
  key: string;
  projectSlug: IProjectItem['slug'];
  className: string;
  cardClassName: string;
  imageSrc?: string;
  imageAlt?: string;
  sizes?: string;
}

export const financeFlowProject: IProjectItem = {
  slug: 'financeflow',
  name: 'FinanceFlow',
  eyebrow: 'Personal finance platform',
  summary:
    'AI-powered personal finance management for budgeting, subscriptions, exports, and financial insights.',
  description:
    'FinanceFlow helps users track accounts, manage budgets, monitor subscriptions, export reports, and use AI-assisted financial guidance in a modern web app.',
  links: [
    {
      label: 'Access app',
      href: 'https://www.financeflow.dev',
      external: true,
      tone: 'primary',
    },
  ],
  stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
  preview: 'image',
  imageSrc: '/projects/financeflow-dashboard.png',
  imageAlt: 'FinanceFlow dashboard interface',
};

export const showcasedProjects: IProjectItem[] = [
  {
    slug: 'edson-prime-estates',
    name: 'Edson Prime Estates',
    eyebrow: 'Luxury real estate website',
    summary:
      'Curated luxury real estate experience with multilingual content, premium presentation, and schedule-first conversion flow.',
    description:
      'A polished real estate site focused on private collection storytelling, listing discovery, and premium contact flow for high-end residences.',
    links: [
      {
        label: 'Visit site',
        href: 'https://edson-imovies.vercel.app/en',
        external: true,
        tone: 'primary',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/FrancoisCoding/edson-website',
        external: true,
        tone: 'secondary',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'i18n'],
    preview: 'image',
    imageSrc: '/projects/edson-prime-estates.jpg',
    imageAlt: 'Edson Prime Estates landing page preview',
  },
  {
    slug: 'bible-jeopardy',
    name: 'Bible Jeopardy',
    eyebrow: 'Browser game',
    summary:
      'Arcade-style Bible trivia experience built for quick play, clear categories, and lightweight web delivery.',
    description:
      'A game-first web project with a branded identity, straightforward interaction loop, and fast access through the browser or itch.io.',
    links: [
      {
        label: 'Play game',
        href: 'https://francoiscoding.itch.io/bible-jeopardy',
        external: true,
        tone: 'primary',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/FrancoisCoding/bible-jeopardy',
        external: true,
        tone: 'secondary',
      },
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'Game UI'],
    preview: 'bibleJeopardy',
    imageSrc:
      'https://raw.githubusercontent.com/FrancoisCoding/bible-jeopardy/main/bible_jeopardy_logo.png',
    imageAlt: 'Bible Jeopardy logo',
  },
  {
    slug: 'bear-x',
    name: 'Bear-X',
    eyebrow: 'Retro landing page',
    summary:
      'Pixel-art promotional site with community-first branding, collectible character presentation, and strong visual identity.',
    description:
      'A retro-styled web experience built around a distinctive Bear-X world, with bold typography, avatars, and playful interaction design.',
    links: [
      {
        label: 'Visit site',
        href: 'https://bear-x.netlify.app/',
        external: true,
        tone: 'primary',
      },
    ],
    stack: [
      'Frontend UI',
      'Brand web design',
      'Animation',
      'Responsive layout',
    ],
    preview: 'bearX',
  },
];

export const projectsData = [financeFlowProject, ...showcasedProjects];

export const homeProjectTiles: IHomeProjectTile[] = [
  {
    key: 'financeflow-dashboard',
    projectSlug: 'financeflow',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
    imageSrc: '/projects/financeflow-dashboard.png',
    imageAlt: 'FinanceFlow dashboard project preview',
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  },
  {
    key: 'edson-prime-estates',
    projectSlug: 'edson-prime-estates',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
    imageSrc: '/projects/edson-prime-estates.jpg',
    imageAlt: 'Edson Prime Estates landing page preview',
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  },
  {
    key: 'financeflow-ai',
    projectSlug: 'financeflow',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
    imageSrc: '/projects/financeflow-ai.png',
    imageAlt: 'FinanceFlow AI workspace preview',
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  },
  {
    key: 'bible-jeopardy',
    projectSlug: 'bible-jeopardy',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
  },
  {
    key: 'bear-x',
    projectSlug: 'bear-x',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
  },
  {
    key: 'financeflow-subscriptions',
    projectSlug: 'financeflow',
    className: '',
    cardClassName: 'min-h-[24rem] lg:min-h-[31rem]',
    imageSrc: '/projects/financeflow-subscriptions.png',
    imageAlt: 'FinanceFlow subscriptions preview',
    sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  },
];

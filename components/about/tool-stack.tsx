import {
  Accessibility,
  ArrowUpRight,
  Cloud,
  CloudCog,
  FlaskConical,
  Ghost,
  ListOrdered,
  type LucideIcon,
} from 'lucide-react';
import type { IconType } from 'react-icons';
import {
  SiClaude,
  SiConfluence,
  SiCypress,
  SiDatadog,
  SiDjango,
  SiDocker,
  SiDrizzle,
  SiExpress,
  SiFfmpeg,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiGitlab,
  SiGraphql,
  SiJest,
  SiJira,
  SiKubernetes,
  SiLighthouse,
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
  SiRust,
  SiSnowflake,
  SiStreamlit,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTauri,
  SiTypescript,
  SiVuedotjs,
  SiVercel,
  SiVitest,
} from 'react-icons/si';

import { cn } from '@/lib/utils';

type TToolPlacement = 'core' | 'expanded';

interface IToolDetails {
  name: string;
  href: string;
  icon: IconType | LucideIcon;
  iconColor: string;
  iconContainerClassName: string;
  usage: string;
  placement: TToolPlacement;
  order: number;
}

const tools = {
  typescript: {
    name: 'TypeScript',
    href: 'https://www.typescriptlang.org',
    icon: SiTypescript,
    iconColor: '#3178c6',
    iconContainerClassName:
      'border-[#3178c6]/40 bg-[linear-gradient(180deg,rgba(49,120,198,0.28),rgba(49,120,198,0.14))]',
    usage: 'Typed JavaScript',
    placement: 'core',
    order: 10,
  },
  react: {
    name: 'React',
    href: 'https://react.dev',
    icon: SiReact,
    iconColor: '#61dafb',
    iconContainerClassName:
      'border-cyan-300/35 bg-[linear-gradient(180deg,rgba(97,218,251,0.24),rgba(8,47,73,0.14))]',
    usage: 'Component UI',
    placement: 'core',
    order: 20,
  },
  'next-js': {
    name: 'Next.js',
    href: 'https://nextjs.org',
    icon: SiNextdotjs,
    iconColor: '#f8fafc',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Product web apps',
    placement: 'core',
    order: 30,
  },
  'node-js': {
    name: 'Node.js',
    href: 'https://nodejs.org',
    icon: SiNodedotjs,
    iconColor: '#66cc33',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(102,204,51,0.22),rgba(54,83,20,0.14))]',
    usage: 'Server runtime',
    placement: 'core',
    order: 40,
  },
  python: {
    name: 'Python',
    href: 'https://www.python.org',
    icon: SiPython,
    iconColor: '#ffde57',
    iconContainerClassName:
      'border-yellow-300/35 bg-[linear-gradient(180deg,rgba(255,222,87,0.2),rgba(113,63,18,0.14))]',
    usage: 'Data tooling',
    placement: 'core',
    order: 50,
  },
  django: {
    name: 'Django',
    href: 'https://www.djangoproject.com',
    icon: SiDjango,
    iconColor: '#44b78b',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(68,183,139,0.24),rgba(6,78,59,0.14))]',
    usage: 'Backend services',
    placement: 'core',
    order: 60,
  },
  postgresql: {
    name: 'PostgreSQL',
    href: 'https://www.postgresql.org',
    icon: SiPostgresql,
    iconColor: '#336791',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(51,103,145,0.24),rgba(30,58,138,0.14))]',
    usage: 'Relational database',
    placement: 'core',
    order: 70,
  },
  snowflake: {
    name: 'Snowflake',
    href: 'https://www.snowflake.com',
    icon: SiSnowflake,
    iconColor: '#38bdf8',
    iconContainerClassName:
      'border-cyan-300/35 bg-[linear-gradient(180deg,rgba(56,189,248,0.22),rgba(8,47,73,0.14))]',
    usage: 'Analytics warehouse',
    placement: 'core',
    order: 80,
  },
  docker: {
    name: 'Docker',
    href: 'https://www.docker.com',
    icon: SiDocker,
    iconColor: '#2496ed',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(36,150,237,0.22),rgba(12,74,110,0.14))]',
    usage: 'Containerized delivery',
    placement: 'core',
    order: 90,
  },
  aws: {
    name: 'AWS',
    href: 'https://aws.amazon.com',
    icon: Cloud,
    iconColor: '#f59e0b',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(245,158,11,0.2),rgba(124,45,18,0.14))]',
    usage: 'Cloud infrastructure',
    placement: 'core',
    order: 100,
  },
  'vue-js': {
    name: 'Vue.js',
    href: 'https://vuejs.org',
    icon: SiVuedotjs,
    iconColor: '#42b883',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(66,184,131,0.24),rgba(6,78,59,0.14))]',
    usage: 'Reactive interfaces',
    placement: 'expanded',
    order: 10,
  },
  'tanstack-query': {
    name: 'TanStack Query',
    href: 'https://tanstack.com/query/latest',
    icon: SiReactquery,
    iconColor: '#ff4154',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(255,65,84,0.24),rgba(127,29,29,0.14))]',
    usage: 'Server-state caching',
    placement: 'expanded',
    order: 20,
  },
  redux: {
    name: 'Redux',
    href: 'https://redux.js.org',
    icon: SiRedux,
    iconColor: '#8b5cf6',
    iconContainerClassName:
      'border-violet-300/35 bg-[linear-gradient(180deg,rgba(139,92,246,0.24),rgba(76,29,149,0.14))]',
    usage: 'Global state',
    placement: 'expanded',
    order: 30,
  },
  'tailwind-css': {
    name: 'Tailwind CSS',
    href: 'https://tailwindcss.com',
    icon: SiTailwindcss,
    iconColor: '#38bdf8',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(56,189,248,0.22),rgba(14,116,144,0.14))]',
    usage: 'Design system styling',
    placement: 'expanded',
    order: 40,
  },
  express: {
    name: 'Express',
    href: 'https://expressjs.com',
    icon: SiExpress,
    iconColor: '#d1d5db',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'REST API layer',
    placement: 'expanded',
    order: 50,
  },
  graphql: {
    name: 'GraphQL',
    href: 'https://graphql.org',
    icon: SiGraphql,
    iconColor: '#e535ab',
    iconContainerClassName:
      'border-fuchsia-300/35 bg-[linear-gradient(180deg,rgba(229,53,171,0.22),rgba(80,7,36,0.14))]',
    usage: 'Typed API queries',
    placement: 'expanded',
    order: 60,
  },
  supabase: {
    name: 'Supabase',
    href: 'https://supabase.com',
    icon: SiSupabase,
    iconColor: '#3ecf8e',
    iconContainerClassName:
      'border-emerald-300/35 bg-[linear-gradient(180deg,rgba(62,207,142,0.24),rgba(22,101,52,0.14))]',
    usage: 'Backend platform',
    placement: 'expanded',
    order: 70,
  },
  prisma: {
    name: 'Prisma',
    href: 'https://www.prisma.io',
    icon: SiPrisma,
    iconColor: '#5a67d8',
    iconContainerClassName:
      'border-indigo-300/35 bg-[linear-gradient(180deg,rgba(90,103,216,0.22),rgba(49,46,129,0.14))]',
    usage: 'Type-safe ORM',
    placement: 'expanded',
    order: 80,
  },
  mongodb: {
    name: 'MongoDB',
    href: 'https://www.mongodb.com',
    icon: SiMongodb,
    iconColor: '#22c55e',
    iconContainerClassName:
      'border-green-300/35 bg-[linear-gradient(180deg,rgba(34,197,94,0.22),rgba(20,83,45,0.14))]',
    usage: 'Document database',
    placement: 'expanded',
    order: 90,
  },
  firebase: {
    name: 'Firebase',
    href: 'https://firebase.google.com',
    icon: SiFirebase,
    iconColor: '#f59e0b',
    iconContainerClassName:
      'border-amber-300/35 bg-[linear-gradient(180deg,rgba(245,158,11,0.22),rgba(120,53,15,0.14))]',
    usage: 'Auth and realtime',
    placement: 'expanded',
    order: 100,
  },
  azure: {
    name: 'Azure',
    href: 'https://azure.microsoft.com',
    icon: CloudCog,
    iconColor: '#60a5fa',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.22),rgba(30,58,138,0.14))]',
    usage: 'Cloud deployment',
    placement: 'expanded',
    order: 110,
  },
  openai: {
    name: 'OpenAI',
    href: 'https://openai.com',
    icon: SiOpenai,
    iconColor: '#4ade80',
    iconContainerClassName:
      'border-green-300/35 bg-[linear-gradient(180deg,rgba(74,222,128,0.2),rgba(21,128,61,0.14))]',
    usage: 'AI assistance',
    placement: 'expanded',
    order: 120,
  },
  playwright: {
    name: 'Playwright',
    href: 'https://playwright.dev',
    icon: FlaskConical,
    iconColor: '#84cc16',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(132,204,22,0.2),rgba(63,98,18,0.14))]',
    usage: 'Browser automation',
    placement: 'expanded',
    order: 130,
  },
  cypress: {
    name: 'Cypress',
    href: 'https://www.cypress.io',
    icon: SiCypress,
    iconColor: '#d1d5db',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'E2E test coverage',
    placement: 'expanded',
    order: 140,
  },
  jest: {
    name: 'Jest',
    href: 'https://jestjs.io',
    icon: SiJest,
    iconColor: '#e11d48',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(225,29,72,0.2),rgba(127,29,29,0.14))]',
    usage: 'Unit testing',
    placement: 'expanded',
    order: 150,
  },
  datadog: {
    name: 'Datadog',
    href: 'https://www.datadoghq.com',
    icon: SiDatadog,
    iconColor: '#a78bfa',
    iconContainerClassName:
      'border-violet-300/35 bg-[linear-gradient(180deg,rgba(167,139,250,0.2),rgba(76,29,149,0.14))]',
    usage: 'Runtime monitoring',
    placement: 'expanded',
    order: 160,
  },
  'new-relic': {
    name: 'New Relic',
    href: 'https://newrelic.com',
    icon: SiNewrelic,
    iconColor: '#84cc16',
    iconContainerClassName:
      'border-lime-300/35 bg-[linear-gradient(180deg,rgba(132,204,22,0.2),rgba(63,98,18,0.14))]',
    usage: 'Performance insights',
    placement: 'expanded',
    order: 170,
  },
  vercel: {
    name: 'Vercel',
    href: 'https://vercel.com',
    icon: SiVercel,
    iconColor: '#ffffff',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Frontend hosting',
    placement: 'expanded',
    order: 180,
  },
  'framer-motion': {
    name: 'Framer Motion',
    href: 'https://www.framer.com/motion/',
    icon: SiFramer,
    iconColor: '#7f5af0',
    iconContainerClassName:
      'border-indigo-300/35 bg-[linear-gradient(180deg,rgba(127,90,240,0.24),rgba(49,46,129,0.14))]',
    usage: 'UI motion',
    placement: 'expanded',
    order: 190,
  },
  figma: {
    name: 'Figma',
    href: 'https://www.figma.com',
    icon: SiFigma,
    iconColor: '#f97316',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(249,115,22,0.22),rgba(124,45,18,0.14))]',
    usage: 'UI system design',
    placement: 'expanded',
    order: 200,
  },
  jira: {
    name: 'Jira',
    href: 'https://www.atlassian.com/software/jira',
    icon: SiJira,
    iconColor: '#60a5fa',
    iconContainerClassName:
      'border-blue-300/35 bg-[linear-gradient(180deg,rgba(96,165,250,0.22),rgba(30,58,138,0.14))]',
    usage: 'Sprint tracking',
    placement: 'expanded',
    order: 210,
  },
  confluence: {
    name: 'Confluence',
    href: 'https://www.atlassian.com/software/confluence',
    icon: SiConfluence,
    iconColor: '#93c5fd',
    iconContainerClassName:
      'border-sky-300/35 bg-[linear-gradient(180deg,rgba(147,197,253,0.22),rgba(30,64,175,0.14))]',
    usage: 'Documentation hub',
    placement: 'expanded',
    order: 220,
  },
  gitlab: {
    name: 'GitLab',
    href: 'https://about.gitlab.com',
    icon: SiGitlab,
    iconColor: '#fb7185',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(251,113,133,0.2),rgba(127,29,29,0.14))]',
    usage: 'CI and repos',
    placement: 'expanded',
    order: 230,
  },
  git: {
    name: 'Git',
    href: 'https://git-scm.com',
    icon: SiGit,
    iconColor: '#f05032',
    iconContainerClassName:
      'border-orange-300/35 bg-[linear-gradient(180deg,rgba(240,80,50,0.22),rgba(124,45,18,0.14))]',
    usage: 'Version control',
    placement: 'expanded',
    order: 240,
  },
  streamlit: {
    name: 'Streamlit',
    href: 'https://streamlit.io',
    icon: SiStreamlit,
    iconColor: '#f43f5e',
    iconContainerClassName:
      'border-rose-300/35 bg-[linear-gradient(180deg,rgba(244,63,94,0.2),rgba(127,29,29,0.14))]',
    usage: 'Data apps',
    placement: 'expanded',
    order: 250,
  },
  jotai: {
    name: 'Jotai',
    href: 'https://jotai.org/',
    icon: Ghost,
    iconColor: '#f5f5f5',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Atomic React state',
    placement: 'expanded',
    order: 260,
  },
  'react-native': {
    name: 'React Native',
    href: 'https://reactnative.dev/',
    icon: SiReact,
    iconColor: '#61dafb',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Cross-platform mobile apps',
    placement: 'expanded',
    order: 270,
  },
  kubernetes: {
    name: 'Kubernetes',
    href: 'https://kubernetes.io/',
    icon: SiKubernetes,
    iconColor: '#7da3ff',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Container orchestration',
    placement: 'expanded',
    order: 280,
  },
  'amazon-sqs': {
    name: 'Amazon SQS',
    href: 'https://aws.amazon.com/sqs/',
    icon: ListOrdered,
    iconColor: '#fbbf24',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Message queues',
    placement: 'expanded',
    order: 290,
  },
  'github-actions': {
    name: 'GitHub Actions',
    href: 'https://github.com/features/actions',
    icon: SiGithubactions,
    iconColor: '#79c0ff',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'CI and release automation',
    placement: 'expanded',
    order: 300,
  },
  claude: {
    name: 'Claude',
    href: 'https://claude.com/',
    icon: SiClaude,
    iconColor: '#eda486',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Engineering automation',
    placement: 'expanded',
    order: 310,
  },
  codex: {
    name: 'Codex',
    href: 'https://openai.com/codex/',
    icon: SiOpenai,
    iconColor: '#f5f5f5',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Coding workflows',
    placement: 'expanded',
    order: 320,
  },
  'drizzle-orm': {
    name: 'Drizzle ORM',
    href: 'https://orm.drizzle.team/',
    icon: SiDrizzle,
    iconColor: '#c5f74f',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Typed SQL queries',
    placement: 'expanded',
    order: 330,
  },
  stripe: {
    name: 'Stripe',
    href: 'https://stripe.com/',
    icon: SiStripe,
    iconColor: '#a79aff',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Billing and subscriptions',
    placement: 'expanded',
    order: 340,
  },
  rust: {
    name: 'Rust',
    href: 'https://rust-lang.org/',
    icon: SiRust,
    iconColor: '#f0a88b',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Native desktop tooling',
    placement: 'expanded',
    order: 350,
  },
  tauri: {
    name: 'Tauri',
    href: 'https://tauri.app/',
    icon: SiTauri,
    iconColor: '#73ded1',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Desktop app framework',
    placement: 'expanded',
    order: 360,
  },
  vitest: {
    name: 'Vitest',
    href: 'https://vitest.dev/',
    icon: SiVitest,
    iconColor: '#90d162',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Unit testing',
    placement: 'expanded',
    order: 370,
  },
  ffmpeg: {
    name: 'FFmpeg',
    href: 'https://ffmpeg.org/',
    icon: SiFfmpeg,
    iconColor: '#79d58c',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Media processing',
    placement: 'expanded',
    order: 380,
  },
  'axe-core': {
    name: 'axe-core',
    href: 'https://github.com/dequelabs/axe-core',
    icon: Accessibility,
    iconColor: '#88dbe0',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Accessibility testing',
    placement: 'expanded',
    order: 390,
  },
  lighthouse: {
    name: 'Lighthouse',
    href: 'https://developer.chrome.com/docs/lighthouse/overview',
    icon: SiLighthouse,
    iconColor: '#ff9b89',
    iconContainerClassName: 'border-white/12 bg-[#101113]',
    usage: 'Performance audits',
    placement: 'expanded',
    order: 400,
  },
} satisfies Record<string, IToolDetails>;

const orderedTools = Object.entries(tools).sort(
  ([, firstTool], [, secondTool]) => firstTool.order - secondTool.order,
);
const coreTools = orderedTools.filter(([, tool]) => tool.placement === 'core');
const expandedTools = orderedTools.filter(
  ([, tool]) => tool.placement === 'expanded',
);

const appearances = {
  core: {
    link: 'motion-enabled:hover:-translate-y-0.5 min-h-[4.75rem] rounded-[1.35rem] border-white/10 bg-white/5 px-5 transition-[translate,background-color,border-color] hover:bg-white/8',
    content: 'gap-4',
    iconContainer: 'size-11 rounded-[1rem]',
    icon: 'size-5',
    name: 'text-[0.98rem]',
    usage: 'text-sm',
    arrow: 'size-4 text-white/42',
  },
  expanded: {
    link: 'min-h-[4rem] rounded-[1rem] border-white/8 bg-white/[0.03] px-4 transition-[background-color,border-color] hover:bg-white/[0.06]',
    content: 'gap-3',
    iconContainer: 'size-9 rounded-[0.8rem]',
    icon: 'size-4',
    name: 'text-sm',
    usage: 'text-xs',
    arrow: 'size-3.5 text-white/38',
  },
} as const;

function ToolLink({ tool }: { tool: IToolDetails }) {
  const Icon = tool.icon;
  const appearance = appearances[tool.placement];
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group/tool flex items-center justify-between border duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
        appearance.link,
      )}
    >
      <div className={cn('flex items-center', appearance.content)}>
        <div
          className={cn(
            'flex items-center justify-center border',
            appearance.iconContainer,
            tool.iconContainerClassName,
          )}
        >
          <Icon
            aria-hidden="true"
            className={appearance.icon}
            style={{ color: tool.iconColor }}
          />
        </div>
        <div>
          <p className={cn('font-medium text-white', appearance.name)}>
            {tool.name}
          </p>
          <p className={cn('text-white/52', appearance.usage)}>{tool.usage}</p>
        </div>
      </div>
      <ArrowUpRight
        aria-hidden="true"
        className={cn(
          'motion-enabled:transition-transform motion-enabled:group-hover/tool:translate-x-0.5 motion-enabled:group-hover/tool:-translate-y-0.5',
          appearance.arrow,
        )}
      />
    </a>
  );
}

/** Renders the core tools and the expanded toolkit in their catalog order. */
export function ToolStack() {
  return (
    <section id="tool-stack" className="space-y-6">
      <h2 className="text-[2rem] font-semibold tracking-[-0.05em] text-white">
        Tool Stack
      </h2>
      <p className="max-w-[36rem] text-sm text-white/58">
        Core stack first for quick scanning. Expand to view the full toolkit.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {coreTools.map(([id, tool]) => (
          <ToolLink key={id} tool={tool} />
        ))}
      </div>
      <details className="group rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-white/78 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">
            View complete toolkit ({expandedTools.length} more)
          </span>
          <span className="hidden group-open:inline">
            Collapse complete toolkit
          </span>
        </summary>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {expandedTools.map(([id, tool]) => (
            <ToolLink key={id} tool={tool} />
          ))}
        </div>
      </details>
    </section>
  );
}

export interface IProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface IProjectItem {
  slug: string;
  name: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  links: IProjectLink[];
  featured?: boolean;
}

export const projectsData: IProjectItem[] = [
  {
    slug: 'financeflow',
    name: 'FinanceFlow',
    summary:
      'A modern financial workflow product with polished UX and practical tooling.',
    problem:
      'Teams need a focused platform to move faster on financial operations without sacrificing clarity.',
    solution:
      'Developed a streamlined full stack product experience with clear flows, resilient architecture, and pragmatic automation.',
    impact:
      'Created a production-grade foundation that makes workflows easier to understand, execute, and improve.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    links: [
      {
        label: 'Live Product',
        href: 'https://www.financeflow.dev',
        external: true,
      },
      { label: 'Case Study', href: '/projects/financeflow' },
      {
        label: 'GitHub',
        href: 'https://github.com/FrancoisCoding',
        external: true,
      },
    ],
    featured: true,
  },
  {
    slug: 'enterprise-modernization',
    name: 'Enterprise Platform Modernization',
    summary:
      'Private project representative of large-scale migration and stabilization work.',
    problem:
      'Legacy platform constraints slowed delivery and complicated maintenance for product teams.',
    solution:
      'Implemented incremental modernization patterns for UI, APIs, and deployment workflows.',
    impact:
      'Improved developer efficiency and release confidence across critical product surfaces.',
    stack: ['React', 'TypeScript', 'Node.js', 'Cloud Infrastructure'],
    links: [{ label: 'Available on request', href: '/contact' }],
  },
  {
    slug: 'secure-workflow-ops',
    name: 'Secure Workflow Operations',
    summary: 'Private project focused on regulated workflow orchestration.',
    problem:
      'Operational processes required stronger traceability, reliability, and approval controls.',
    solution:
      'Designed and shipped robust, role-aware interfaces with auditable backend operations.',
    impact:
      'Enabled dependable execution in high-accountability environments while maintaining usability.',
    stack: ['Next.js', 'Zod', 'PostgreSQL', 'Cloud Services'],
    links: [{ label: 'Available on request', href: '/contact' }],
  },
];

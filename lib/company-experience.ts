export interface ICompanyExperienceItem {
  company: string;
  roleTitle: string;
  timeframe: string;
  impacts: string[];
  stack: string[];
}

export const companyExperience: ICompanyExperienceItem[] = [
  {
    company: 'Disney',
    roleTitle: 'Full Stack Engineering',
    timeframe: 'Timeframe available on request',
    impacts: [
      'Built and shipped production-ready interfaces and backend integrations.',
      'Collaborated with cross-functional teams to deliver high-quality releases.',
      'Balanced feature velocity with reliability and maintainability.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    company: 'Department of Defense',
    roleTitle: 'Full Stack Engineering',
    timeframe: 'Timeframe available on request',
    impacts: [
      'Implemented secure workflows for regulated, mission-aligned environments.',
      'Contributed to scalable systems with traceable operational outcomes.',
      'Supported iterative delivery under strict quality and compliance expectations.',
    ],
    stack: ['React', 'Next.js', 'Python', 'AWS'],
  },
  {
    company: 'MassVirtual',
    roleTitle: 'Full Stack Engineering',
    timeframe: 'Timeframe available on request',
    impacts: [
      'Delivered performant user experiences for immersive product initiatives.',
      'Integrated frontend and API layers to streamline product workflows.',
      'Helped improve delivery speed through practical engineering standards.',
    ],
    stack: ['React', 'Three.js', 'Node.js', 'Cloud Services'],
  },
];

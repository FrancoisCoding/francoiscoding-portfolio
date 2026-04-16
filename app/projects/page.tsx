import type { Metadata } from 'next';

import { ProjectCard } from '@/components/projects/project-card';
import { showcasedProjects } from '@/lib/projects-data';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Selected projects from Isaiah Francois, including Tesla USB Manager, Edson Prime Estates, Bible Jeopardy, and Bear-X.',
  openGraph: {
    title: 'Projects | Isaiah Francois',
    description:
      'Selected projects, product links, and GitHub references where available.',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <section className="pt-10 pb-12 sm:pt-12">
      <div className="space-y-4 border-b border-white/8 pb-10">
        <p className="text-sm text-white/55">Work</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Product-focused projects with strong visual direction and direct
          access.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-white/68">
          A concise view of selected public projects. Each card links straight
          to the product or repository, with GitHub included where it is public.
        </p>
      </div>

      <div className="grid gap-4 pt-8 lg:grid-cols-3">
        {showcasedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

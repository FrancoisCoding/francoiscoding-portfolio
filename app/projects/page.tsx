import { ProjectCard } from '@/components/projects/project-card';
import { projectsData } from '@/lib/projects-data';

const featuredProject = projectsData.find((project) => project.featured);
const secondaryProjects = projectsData.filter((project) => !project.featured);

export default function ProjectsPage() {
  return (
    <section className="space-y-10 py-16">
      <div className="space-y-3">
        <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
          Projects
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">
          Selected work demonstrating problem framing, technical execution, and
          measurable product impact.
        </p>
      </div>

      {featuredProject ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-[0.16em] text-[var(--brand)] uppercase">
            Featured
          </p>
          <ProjectCard project={featuredProject} />
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-semibold tracking-[0.16em] text-slate-600 uppercase dark:text-slate-300">
          Additional Work
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {secondaryProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

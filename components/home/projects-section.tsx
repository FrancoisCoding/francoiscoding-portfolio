'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { homeProjectTiles, projectsData } from '@/lib/projects-data';
import { ProjectCard } from '@/components/projects/project-card';

const projectsBySlug = new Map(
  projectsData.map((project) => [project.slug, project]),
);

export function ProjectsSection() {
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = isHydrated && !shouldReduceMotion;

  return (
    <section id="projects" className="relative scroll-mt-24 py-2 sm:py-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-72 max-w-7xl rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)] blur-[120px]"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {homeProjectTiles.map((tile, index) => {
          const project = projectsBySlug.get(tile.projectSlug);

          if (!project) {
            return null;
          }

          return (
            <motion.div
              key={tile.key}
              className={tile.className}
              initial={canAnimate ? { opacity: 0, y: 22 } : false}
              whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
            >
              <ProjectCard
                project={project}
                className={tile.cardClassName}
                previewImageSrc={tile.imageSrc}
                previewImageAlt={tile.imageAlt}
                sizes={tile.sizes}
                priority={index === 0}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

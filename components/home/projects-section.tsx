'use client';

import { motion } from 'framer-motion';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { useReducedMotionPreference } from '@/hooks/use-reduced-motion';
import { homeProjectTiles, projectsData } from '@/lib/projects-data';
import { ProjectCard } from '@/components/projects/project-card';

const projectsBySlug = new Map(
  projectsData.map((project) => [project.slug, project]),
);

export function ProjectsSection() {
  const isHydrated = useIsHydrated();
  const { reduceMotion } = useReducedMotionPreference();
  const canAnimate = isHydrated && !reduceMotion;

  return (
    <section
      id="projects"
      tabIndex={-1}
      className="relative scroll-mt-24 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 sm:py-4"
    >
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
              animate={canAnimate ? undefined : { opacity: 1, y: 0 }}
              whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: canAnimate ? 0.45 : 0,
                delay: canAnimate ? index * 0.05 : 0,
                ease: 'easeOut',
              }}
            >
              <ProjectCard
                project={project}
                isFeatured
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

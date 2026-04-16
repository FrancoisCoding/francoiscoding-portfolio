'use client';

import Image from 'next/image';
import { useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';

import type { IProjectItem } from '@/lib/projects-data';
import { useReducedMotionPreference } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

interface IProjectCardProps {
  project: IProjectItem;
  className?: string;
  previewImageSrc?: string;
  previewImageAlt?: string;
  sizes?: string;
  priority?: boolean;
}

export function ProjectCard({
  project,
  className,
  previewImageSrc,
  previewImageAlt,
  sizes,
  priority,
}: IProjectCardProps) {
  const primaryLink = project.links.find((link) => link.tone === 'primary');
  const githubLink = project.links.find((link) => link.label === 'GitHub');
  const cardRef = useRef<HTMLElement>(null);
  const { reduceMotion: shouldReduceMotion } = useReducedMotionPreference();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (shouldReduceMotion) return;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setSpotlight({ x: x * 100, y: y * 100 });
      setTilt({
        rotateX: (y - 0.5) * -8,
        rotateY: (x - 0.5) * 8,
      });
    },
    [shouldReduceMotion],
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group relative isolate min-h-[24rem] overflow-hidden rounded-[1.9rem] border border-white/7 bg-[#0f0f10] shadow-[0_28px_72px_rgba(0,0,0,0.36)] ring-1 ring-white/4 transition-shadow duration-300 ease-out',
        isHovered && 'shadow-[0_36px_80px_rgba(0,0,0,0.5)]',
        className,
      )}
      style={
        !shouldReduceMotion
          ? {
              transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.01 : 1})`,
              transition: isHovered
                ? 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                : 'transform 0.4s ease-out, box-shadow 0.3s ease-out',
            }
          : undefined
      }
    >
      <div className="absolute inset-0">
        {renderProjectPreview(
          project,
          previewImageSrc,
          previewImageAlt,
          sizes,
          priority,
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.05)_52%,rgba(0,0,0,0.34)_100%)] transition-opacity duration-200 ease-in-out group-hover:opacity-100" />

      {/* Cursor spotlight */}
      {!shouldReduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 280px at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.08), transparent)`,
          }}
        />
      )}

      <div className="absolute inset-x-4 bottom-4 translate-y-0 opacity-100 transition-all duration-200 ease-in-out md:translate-y-4 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
        <div className="flex items-center gap-2">
          {primaryLink ? (
            <ProjectPrimaryPill
              projectName={project.name}
              href={primaryLink.href}
            />
          ) : null}
          {githubLink ? <ProjectGithubPill href={githubLink.href} /> : null}
        </div>
      </div>
    </article>
  );
}

function ProjectPrimaryPill({
  projectName,
  href,
}: {
  projectName: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,20,0.72),rgba(18,18,20,0.58))] px-4 text-sm font-medium text-white backdrop-blur-xl transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(18,18,20,0.82),rgba(18,18,20,0.68))] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
    >
      <span>{projectName}</span>
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function ProjectGithubPill({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Open GitHub repository"
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(18,18,20,0.72),rgba(18,18,20,0.58))] text-white backdrop-blur-xl transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(18,18,20,0.82),rgba(18,18,20,0.68))] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
    >
      <Github className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function renderProjectPreview(
  project: IProjectItem,
  previewImageSrc?: string,
  previewImageAlt?: string,
  sizes = '(max-width: 1024px) 100vw, 33vw',
  priority = false,
) {
  if (previewImageSrc) {
    return (
      <Image
        src={previewImageSrc}
        alt={previewImageAlt ?? project.imageAlt ?? `${project.name} preview`}
        fill
        className="object-cover object-top transition-transform duration-300 ease-in-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (project.preview === 'image' && project.imageSrc && project.imageAlt) {
    return (
      <Image
        src={project.imageSrc}
        alt={project.imageAlt}
        fill
        className="object-cover object-top transition-transform duration-300 ease-in-out motion-reduce:transition-none md:group-hover:scale-[1.02]"
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (
    project.preview === 'bibleJeopardy' &&
    project.imageSrc &&
    project.imageAlt
  ) {
    return (
      <div className="h-full w-full bg-[linear-gradient(180deg,#3f1f03_0%,#6c3506_56%,#3b1d05_100%)] p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_30%)]" />
        <div className="relative flex h-full flex-col items-center justify-center rounded-[1.6rem] border border-[#ffd36a]/18 bg-[linear-gradient(180deg,rgba(255,205,89,0.06),rgba(71,30,2,0.14))]">
          <div className="relative h-28 w-[72%] max-w-[15rem] sm:h-32">
            <Image
              src={project.imageSrc}
              alt={project.imageAlt}
              fill
              className="object-contain"
              sizes="320px"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-[linear-gradient(180deg,#593003_0%,#5b3105_100%)] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.12),transparent_26%)]" />
      <div className="relative flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(59,26,77,0.32),rgba(34,17,45,0.16))] px-6 py-5">
        <div className="inline-flex w-fit items-center rounded-full border border-[#ff4dd2]/25 bg-[#251130] px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#ff95f2]">
          BEAR-X
        </div>
        <div className="mt-6 text-3xl font-semibold tracking-[-0.06em] text-[#ffbf58] sm:text-4xl">
          BearX Has Arrived
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {[
            '#f2a65a',
            '#3f8cf1',
            '#4f2bb8',
            '#f4de3b',
            '#f056ff',
            '#111111',
            '#d94545',
            '#6dd3ff',
            '#f2a65a',
            '#4f2bb8',
          ].map((color, index) => (
            <div
              key={index}
              className="aspect-square rounded-[0.8rem] border border-black/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

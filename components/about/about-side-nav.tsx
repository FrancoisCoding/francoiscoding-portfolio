'use client';

import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

interface IAboutNavigationLink {
  href: string;
  label: string;
}

interface IAboutSideNavProps {
  links: readonly IAboutNavigationLink[];
}

export function AboutSideNav({ links }: IAboutSideNavProps) {
  const sectionIds = useMemo(
    () => links.map((link) => link.href.replace('#', '')).filter(Boolean),
    [links],
  );
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (!sectionIds.length) {
      return;
    }

    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const visibilityBySection = new Map<string, number>();

    const setClosestSection = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.34;
      const closestSection = sections.reduce<HTMLElement | null>(
        (closest, section) => {
          if (!closest) {
            return section;
          }

          const closestDistance = Math.abs(
            closest.getBoundingClientRect().top +
              window.scrollY -
              viewportAnchor,
          );
          const nextDistance = Math.abs(
            section.getBoundingClientRect().top +
              window.scrollY -
              viewportAnchor,
          );

          return nextDistance < closestDistance ? section : closest;
        },
        null,
      );

      if (closestSection) {
        setActiveSectionId(closestSection.id);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityBySection.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        const visibleSections = Array.from(visibilityBySection.entries()).sort(
          (left, right) => right[1] - left[1],
        );

        if (visibleSections[0]?.[1] > 0) {
          setActiveSectionId(visibleSections[0][0]);
          return;
        }

        setClosestSection();
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1],
      },
    );

    sections.forEach((section) => {
      visibilityBySection.set(section.id, 0);
      observer.observe(section);
    });

    const handleHashChange = () => {
      const hashId = window.location.hash.replace('#', '');

      if (hashId) {
        setActiveSectionId(hashId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [sectionIds]);

  return (
    <nav
      aria-label="About page sections"
      className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
    >
      <div className="space-y-3 text-[0.95rem]">
        {links.map((link) => {
          const sectionId = link.href.replace('#', '');
          const isActive = activeSectionId === sectionId;

          return (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'location' : undefined}
              className={cn(
                'relative block pl-3 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                isActive ? 'text-white' : 'text-white/52 hover:text-white/85',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-opacity duration-200',
                  isActive
                    ? 'bg-emerald-300 opacity-100'
                    : 'bg-white/55 opacity-0',
                )}
              />
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

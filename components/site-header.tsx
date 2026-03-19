'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { useReducedMotionPreference } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

interface INavigationLink {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

const primaryLinks: INavigationLink[] = [
  {
    href: '/#projects',
    label: 'Work',
    match: (pathname) => pathname === '/' || pathname.startsWith('/projects'),
  },
  {
    href: '/about',
    label: 'About',
    match: (pathname) => pathname.startsWith('/about'),
  },
  {
    href: '/#contact',
    label: 'Contact',
    match: () => false,
  },
];

const secondaryLinks = [
  { href: '/resume', label: 'Resume' },
  {
    href: siteConfig.linkedinUrl,
    label: 'LinkedIn',
    external: true,
  },
  {
    href: siteConfig.twitterUrl,
    label: 'X',
    external: true,
  },
  {
    href: siteConfig.githubUrl,
    label: 'GitHub',
    external: true,
  },
  {
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email,
    external: true,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const isHydrated = useIsHydrated();
  const { reduceMotion, toggleReduceMotion } = useReducedMotionPreference();
  const canAnimate = isHydrated && !reduceMotion;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuContainerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto flex w-full max-w-[68rem] items-start justify-center px-5 py-3 sm:px-6 lg:px-8">
        <div ref={menuContainerRef} className="relative header-entry">
          {/* ── Unified frosted glass capsule ── */}
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 shadow-[0_2px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
          >
            {/* Profile link */}
            <Link
              href="/"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              aria-label="Go to the homepage"
            >
              <Image
                src="/profile.jpg"
                alt="Isaiah Francois"
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </Link>

            {/* Divider */}
            <div
              className="mx-0.5 hidden h-4 w-px bg-white/[0.08] md:block"
              aria-hidden="true"
            />

            {/* Nav links — desktop */}
            <div className="hidden items-center gap-0.5 md:flex">
              {primaryLinks.map((link) => {
                const isActive = link.match(pathname);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'relative inline-flex h-8 items-center rounded-full px-3.5 text-[0.72rem] font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                      isActive ? 'text-slate-950' : 'text-white/70 hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={canAnimate ? 'nav-active' : undefined}
                        className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
                        transition={
                          canAnimate
                            ? {
                                type: 'spring',
                                stiffness: 380,
                                damping: 30,
                                mass: 0.6,
                              }
                            : { duration: 0 }
                        }
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className="mx-0.5 h-4 w-px bg-white/[0.08]"
              aria-hidden="true"
            />

            {/* Reduced motion toggle */}
            <button
              type="button"
              onClick={toggleReduceMotion}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              aria-label={
                reduceMotion ? 'Enable animations' : 'Reduce motion'
              }
              title={reduceMotion ? 'Enable animations' : 'Reduce motion'}
            >
              {reduceMotion ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4" y1="4" x2="20" y2="20" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div
              className="mx-0.5 h-4 w-px bg-white/[0.08]"
              aria-hidden="true"
            />

            {/* Menu button */}
            <motion.button
              type="button"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="site-header-menu"
              aria-label={
                isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              whileTap={canAnimate ? { scale: 0.9 } : undefined}
            >
              <MenuToggleIcon isOpen={isMenuOpen} canAnimate={canAnimate} />
            </motion.button>
          </nav>

          {/* ── Dropdown menu ── */}
          <AnimatePresence>
            {isMenuOpen ? (
              <motion.div
                id="site-header-menu"
                initial={
                  canAnimate ? { opacity: 0, y: -8, scale: 0.96 } : false
                }
                animate={
                  canAnimate ? { opacity: 1, y: 0, scale: 1 } : undefined
                }
                exit={
                  canAnimate ? { opacity: 0, y: -6, scale: 0.96 } : undefined
                }
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-14 right-0 left-0 mx-auto w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/80 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              >
                <motion.div
                  className="grid gap-1 md:hidden"
                  initial={canAnimate ? 'closed' : false}
                  animate={canAnimate ? 'open' : undefined}
                  variants={menuListVariants}
                >
                  {primaryLinks.map((link) => {
                    const isActive = link.match(pathname);

                    return (
                      <motion.div
                        key={link.label}
                        variants={menuItemVariants}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'inline-flex min-h-10 w-full items-center rounded-xl px-3.5 text-[0.82rem] font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                            isActive
                              ? 'bg-white text-slate-950'
                              : 'text-white/80 hover:bg-white/[0.06] hover:text-white',
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="my-1.5 h-px bg-white/[0.06] md:hidden" />

                <motion.div
                  className="grid gap-1"
                  initial={canAnimate ? 'closed' : false}
                  animate={canAnimate ? 'open' : undefined}
                  variants={menuListVariants}
                >
                  {secondaryLinks.map((link) => {
                    if (link.external) {
                      return (
                        <motion.div
                          key={link.label}
                          variants={menuItemVariants}
                        >
                          <a
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            target={
                              link.href.startsWith('mailto:')
                                ? undefined
                                : '_blank'
                            }
                            rel={
                              link.href.startsWith('mailto:')
                                ? undefined
                                : 'noreferrer'
                            }
                            className="group inline-flex min-h-10 w-full items-center justify-between rounded-xl px-3.5 text-[0.82rem] font-medium text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                          >
                            {link.label}
                            <span
                              className="text-white/30 transition-transform duration-200 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            >
                              ↗
                            </span>
                          </a>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={link.label}
                        variants={menuItemVariants}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="group inline-flex min-h-10 w-full items-center justify-between rounded-xl px-3.5 text-[0.82rem] font-medium text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                        >
                          {link.label}
                          <span
                            className="text-white/30 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function MenuToggleIcon({
  isOpen,
  canAnimate,
}: {
  isOpen: boolean;
  canAnimate: boolean;
}) {
  const topLineState = isOpen
    ? { y: 5.5, rotate: 45, scaleX: 0.95 }
    : { y: 0, rotate: 0, scaleX: 1 };
  const middleLineState = isOpen
    ? { opacity: 0, scaleX: 0, x: 2 }
    : { opacity: 1, scaleX: 1, x: 0 };
  const bottomLineState = isOpen
    ? { y: -5.5, rotate: -45, scaleX: 0.95 }
    : { y: 0, rotate: 0, scaleX: 1 };
  const iconTransition = {
    type: 'spring' as const,
    stiffness: 420,
    damping: 30,
    mass: 0.33,
    duration: canAnimate ? undefined : 0,
  };

  return (
    <span className="relative h-4 w-4" aria-hidden="true">
      <motion.span
        className="absolute top-[2px] left-0 h-[1.5px] w-4 rounded-full bg-current"
        animate={topLineState}
        transition={iconTransition}
      />
      <motion.span
        className="absolute top-[7px] left-0 h-[1.5px] w-4 rounded-full bg-current"
        animate={middleLineState}
        transition={{
          type: 'spring',
          stiffness: 420,
          damping: 34,
          mass: 0.28,
          duration: canAnimate ? undefined : 0,
        }}
      />
      <motion.span
        className="absolute top-[12px] left-0 h-[1.5px] w-4 rounded-full bg-current"
        animate={bottomLineState}
        transition={iconTransition}
      />
    </span>
  );
}

const menuListVariants = {
  open: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.03,
    },
  },
  closed: {},
};

const menuItemVariants = {
  open: {
    opacity: 1,
    y: 0,
  },
  closed: {
    opacity: 0,
    y: -4,
  },
};

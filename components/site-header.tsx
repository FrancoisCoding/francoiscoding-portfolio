'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
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
    href: '/resume',
    label: 'Résumé',
    match: (pathname) => pathname === '/resume',
  },
  {
    href: '/#contact',
    label: 'Contact',
    match: () => false,
  },
];

const secondaryLinks = [
  {
    href: siteConfig.linkedinUrl,
    label: 'LinkedIn',
  },
  {
    href: siteConfig.twitterUrl,
    label: 'X',
  },
  {
    href: siteConfig.githubUrl,
    label: 'GitHub',
  },
  {
    href: `mailto:${siteConfig.email}`,
    label: siteConfig.email,
  },
];

/** Renders the portfolio's menu bar and compact navigation. */
export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSectionFocus = useRef<string | null>(null);
  const isHydrated = useIsHydrated();
  const { reduceMotion, toggleReduceMotion } = useReducedMotionPreference();
  const canAnimate = isHydrated && !reduceMotion;

  function handleMenuNavigation(href: string) {
    setIsMenuOpen(false);
    const [, section] = href.split('#');
    pendingSectionFocus.current = null;
    if (!section) return;

    if (pathname === '/') {
      document.getElementById(section)?.focus({ preventScroll: true });
    } else {
      pendingSectionFocus.current = section;
    }
  }

  useEffect(() => {
    const section = pendingSectionFocus.current;
    if (pathname === '/' && section) {
      pendingSectionFocus.current = null;
      document.getElementById(section)?.focus({ preventScroll: true });
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        if (menuPanelRef.current?.contains(document.activeElement)) {
          menuButtonRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#17171a] shadow-[0_1px_0_rgba(0,0,0,0.35)]">
      <div className="mx-auto w-full max-w-[68rem] px-4 sm:px-6 lg:px-8">
        <div ref={menuContainerRef} className="header-entry relative">
          <nav
            aria-label="Primary navigation"
            className="flex min-h-12 items-center gap-1 py-1 sm:gap-2"
          >
            {/* Profile link */}
            <Link
              href="/"
              className="relative flex size-11 shrink-0 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
              aria-label="Go to the homepage"
            >
              <Image
                src="/profile.jpg"
                alt="Isaiah Francois"
                fill
                className="rounded-md border border-white/15 object-cover"
                sizes="44px"
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
                      'relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                      isActive
                        ? 'text-white'
                        : 'text-white/75 hover:bg-white/8 hover:text-white',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={canAnimate ? 'nav-active' : undefined}
                        className="absolute inset-0 rounded-md border border-white/8 bg-[#303036]"
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
              className="mr-1 ml-auto h-4 w-px bg-white/10"
              aria-hidden="true"
            />

            {/* Reduced motion toggle */}
            <button
              type="button"
              onClick={toggleReduceMotion}
              disabled={!isHydrated}
              className="inline-flex size-11 items-center justify-center rounded-md text-white/75 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none enabled:cursor-pointer enabled:hover:bg-white/8 enabled:hover:text-white"
              aria-label="Reduce motion"
              aria-pressed={isHydrated ? reduceMotion : undefined}
              title={
                isHydrated
                  ? reduceMotion
                    ? 'Enable animations'
                    : 'Reduce motion'
                  : undefined
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="motion-enabled:hidden"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="4" y1="4" x2="20" y2="20" />
              </svg>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="motion-enabled:block hidden"
                aria-hidden="true"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>

            {/* Divider */}
            <div
              className="mx-0.5 h-4 w-px bg-white/[0.08]"
              aria-hidden="true"
            />

            {/* Menu button */}
            <motion.button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-white/75 transition-colors duration-200 hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
                ref={menuPanelRef}
                initial={
                  canAnimate ? { opacity: 0, y: -8, scale: 0.96 } : false
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  canAnimate ? { opacity: 0, y: -6, scale: 0.96 } : undefined
                }
                transition={{
                  duration: canAnimate ? 0.18 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[calc(100%+0.375rem)] right-0 max-h-[calc(100dvh-4.5rem)] w-[min(22rem,calc(100vw-2rem))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-white/12 bg-[#1b1b1e] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.45)]"
              >
                <motion.div
                  className="grid gap-1 md:hidden"
                  initial={canAnimate ? 'closed' : false}
                  animate="open"
                  variants={canAnimate ? menuListVariants : undefined}
                >
                  {primaryLinks.map((link) => {
                    const isActive = link.match(pathname);

                    return (
                      <motion.div
                        key={link.label}
                        className="site-header-menu-item"
                        variants={canAnimate ? menuItemVariants : undefined}
                        animate={canAnimate ? undefined : { opacity: 1, y: 0 }}
                        transition={canAnimate ? undefined : { duration: 0 }}
                      >
                        <Link
                          href={link.href}
                          onNavigate={() => handleMenuNavigation(link.href)}
                          className={cn(
                            'inline-flex min-h-11 w-full items-center rounded-md px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                            isActive
                              ? 'bg-[#303036] text-white'
                              : 'text-white/80 hover:bg-white/8 hover:text-white',
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
                  animate="open"
                  variants={canAnimate ? menuListVariants : undefined}
                >
                  {secondaryLinks.map((link) => {
                    const opensInNewTab = !link.href.startsWith('mailto:');

                    return (
                      <motion.div
                        key={link.label}
                        className="site-header-menu-item"
                        variants={canAnimate ? menuItemVariants : undefined}
                        animate={canAnimate ? undefined : { opacity: 1, y: 0 }}
                        transition={canAnimate ? undefined : { duration: 0 }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          target={opensInNewTab ? '_blank' : undefined}
                          rel={opensInNewTab ? 'noreferrer' : undefined}
                          className="group inline-flex min-h-11 w-full items-center justify-between rounded-md px-3.5 text-sm font-medium text-white/75 transition-colors duration-200 hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                        >
                          {link.label}
                          <span
                            className="motion-enabled:transition-transform motion-enabled:duration-200 motion-enabled:group-hover:translate-x-0.5 text-white/40"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </a>
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
  if (!canAnimate) {
    const Icon = isOpen ? X : Menu;
    return <Icon className="size-4" aria-hidden="true" />;
  }

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
        transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.28 }}
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

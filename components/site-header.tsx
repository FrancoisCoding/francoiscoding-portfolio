'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
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
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = isHydrated && !shouldReduceMotion;

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
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-[74rem] items-start justify-between gap-3 px-5 py-3 sm:px-6 lg:px-8">
        <motion.div
          initial={canAnimate ? { opacity: 0, y: -10 } : false}
          animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Link
            href="/"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-label="Go to the homepage"
          >
            <Image
              src="/profile.jpg"
              alt="Isaiah Francois"
              fill
              className="object-cover"
              sizes="44px"
              priority
            />
          </Link>
        </motion.div>

        <motion.div
          ref={menuContainerRef}
          className="relative flex items-center gap-2"
          initial={canAnimate ? { opacity: 0, y: -10 } : false}
          animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.06 }}
        >
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 md:flex"
          >
            {primaryLinks.map((link) => {
              const isActive = link.match(pathname);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'inline-flex min-h-10 items-center rounded-xl border px-3.5 text-[0.72rem] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                    isActive
                      ? 'border-white/12 bg-white text-slate-950 shadow-[0_14px_32px_rgba(255,255,255,0.06)]'
                      : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white/92 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))]',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            aria-expanded={isMenuOpen}
            aria-controls="site-header-menu"
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
          >
            <MenuToggleIcon isOpen={isMenuOpen} canAnimate={canAnimate} />
          </button>

          <AnimatePresence>
            {isMenuOpen ? (
              <motion.div
                id="site-header-menu"
                initial={
                  canAnimate ? { opacity: 0, y: -10, scale: 0.98 } : false
                }
                animate={
                  canAnimate ? { opacity: 1, y: 0, scale: 1 } : undefined
                }
                exit={
                  canAnimate ? { opacity: 0, y: -8, scale: 0.98 } : undefined
                }
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-14 right-0 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#121212]/90 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
              >
                <motion.div
                  className="grid gap-2 md:hidden"
                  initial={canAnimate ? 'closed' : false}
                  animate={canAnimate ? 'open' : undefined}
                  variants={menuListVariants}
                >
                  {primaryLinks.map((link) => {
                    const isActive = link.match(pathname);

                    return (
                      <motion.div key={link.label} variants={menuItemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'inline-flex min-h-11 w-full items-center rounded-xl border px-4 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                            isActive
                              ? 'border-white/10 bg-white text-slate-950'
                              : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] text-white hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.05))]',
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  className="mt-2 grid gap-2"
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
                            className="inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                          >
                            {link.label}
                            <span className="text-white/50" aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div key={link.label} variants={menuItemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.035))] px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                        >
                          {link.label}
                          <span className="text-white/50" aria-hidden="true">
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
        </motion.div>
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
  const topLineState = isOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 };
  const middleLineState = isOpen
    ? { opacity: 0, scaleX: 0.5 }
    : { opacity: 1, scaleX: 1 };
  const bottomLineState = isOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 };
  const iconTransition = {
    duration: canAnimate ? 0.2 : 0,
    ease: 'easeOut' as const,
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
          duration: canAnimate ? 0.16 : 0,
          ease: 'easeOut',
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
      staggerChildren: 0.035,
      delayChildren: 0.04,
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
    y: -6,
  },
};

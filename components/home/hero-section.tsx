'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { siteConfig } from '@/lib/site-config';

const heroHighlights = ['7+ years of experience'];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = isHydrated && !shouldReduceMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backgroundGlowY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const backgroundGlowX = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-6 pb-9 sm:pt-8 sm:pb-11"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute top-[6.5rem] left-[7%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.032),transparent_66%)] blur-[120px]"
          style={
            canAnimate ? { x: backgroundGlowX, y: backgroundGlowY } : undefined
          }
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_60%,rgba(255,255,255,0.016),transparent_42%)]" />
      </div>

      <div className="mx-auto grid max-w-[68rem] gap-8 lg:grid-cols-[minmax(0,35rem)_12rem] xl:grid-cols-[minmax(0,37rem)_13rem] xl:gap-14">
        <motion.div
          initial={canAnimate ? { opacity: 0, y: 16 } : false}
          animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(1.9rem,2.95vw,2.9rem)] leading-[0.98] font-medium tracking-[-0.055em] text-white">
              <span className="block sm:whitespace-nowrap">
                I&apos;m Isaiah.
              </span>
              <span className="block sm:whitespace-nowrap">
                Full stack developer.
              </span>
              <span className="block sm:whitespace-nowrap">
                Building modern products.
              </span>
            </h1>
          </div>

          <ul className="grid gap-2.5 sm:max-w-xl">
            {heroHighlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-[0.9rem] font-medium text-white/76"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.56rem] h-1.5 w-1.5 rounded-full bg-white/62"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="flex items-end justify-end">
          <div className="ml-auto flex w-fit flex-col items-end space-y-2.5 text-right lg:pt-[7.85rem] xl:pt-[8.1rem]">
            <motion.div
              initial={canAnimate ? { opacity: 0, y: 10 } : false}
              animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.16,
              }}
              className="flex items-center justify-end gap-2 text-[0.82rem] font-medium text-white"
            >
              <span className="relative inline-flex h-2 w-2 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="status-light-glow absolute h-2 w-2 rounded-full bg-emerald-300/32 blur-[2px]"
                />
                <span
                  aria-hidden="true"
                  className="status-light-core relative h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(74,222,128,0.72)]"
                />
              </span>
              <span>Available for work</span>
            </motion.div>

            <motion.a
              href={`mailto:${siteConfig.email}`}
              initial={
                canAnimate ? { opacity: 0, y: 10, filter: 'blur(6px)' } : false
              }
              animate={
                canAnimate
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : undefined
              }
              transition={{
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.24,
              }}
              className="block text-[0.88rem] text-white/60 transition-[color,text-shadow] hover:text-white hover:[text-shadow:0_0_18px_rgba(255,255,255,0.16)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              {siteConfig.email}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

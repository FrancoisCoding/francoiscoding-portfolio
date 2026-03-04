'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { siteConfig } from '@/lib/site-config';

const heroHighlights = ['7+ years of experience'];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isHydrated = useIsHydrated();
  const canAnimate = isHydrated;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backgroundGlowY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const backgroundGlowX = useTransform(scrollYProgress, [0, 1], [0, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-7 pb-10 sm:pt-9 sm:pb-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -top-24 left-[-8%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_62%)] blur-[120px]"
          style={
            canAnimate ? { x: backgroundGlowX, y: backgroundGlowY } : undefined
          }
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.018),transparent_26%)]" />
      </div>

      <div className="mx-auto grid max-w-[74rem] gap-10 lg:grid-cols-[minmax(0,40rem)_12rem] xl:grid-cols-[minmax(0,42rem)_13rem] xl:gap-20">
        <motion.div
          initial={canAnimate ? { opacity: 0, y: 16 } : false}
          animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-9"
        >
          <div className="space-y-4">
            <h1 className="font-display text-[clamp(2.1rem,3.35vw,3.28rem)] leading-[1] font-medium tracking-[-0.058em] text-white">
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

          <ul className="grid gap-3 sm:max-w-xl">
            {heroHighlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 text-[0.92rem] font-medium text-white/76"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.58rem] h-1.5 w-1.5 rounded-full bg-white/62"
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="flex items-end justify-end">
          <div className="ml-auto flex w-fit flex-col items-end space-y-2.5 text-right lg:pt-[8.8rem] xl:pt-[9.15rem]">
            <motion.div
              initial={canAnimate ? { opacity: 0, y: 10 } : false}
              animate={canAnimate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.16,
              }}
              className="flex items-center justify-end gap-2 text-[0.84rem] font-medium text-white"
            >
              <span className="relative inline-flex h-2.5 w-2.5 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="status-light-glow absolute h-2.5 w-2.5 rounded-full bg-emerald-300/35 blur-[2px]"
                />
                <span
                  aria-hidden="true"
                  className="status-light-core relative h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.84)]"
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
              className="block text-[0.9rem] text-white/60 transition-[color,text-shadow] hover:text-white hover:[text-shadow:0_0_18px_rgba(255,255,255,0.16)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              {siteConfig.email}
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

import { CalendlyPanel } from '@/components/contact/calendly-panel';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { siteConfig } from '@/lib/site-config';

interface IContactSectionProps {
  id?: string;
}

export function ContactSection({ id }: IContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = isHydrated && !shouldReduceMotion;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const panelY = useTransform(scrollYProgress, [0, 1], [34, -12]);

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="relative scroll-mt-24 border-t border-white/8 pt-9 pb-10 sm:pt-11"
      initial={canAnimate ? { opacity: 0, y: 18 } : false}
      whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-48 max-w-4xl rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)] blur-[90px]"
        style={canAnimate ? { y: glowY } : undefined}
      />

      <div className="mx-auto max-w-[36rem] space-y-3 text-center">
        <p className="text-sm text-white/55">Contact</p>
        <h2 className="font-display text-[clamp(1.8rem,2.7vw,2.65rem)] leading-[0.96] font-semibold tracking-[-0.05em] text-white">
          Let&apos;s Build Something Great!
          <span className="block">Book a Call or Drop an Email.</span>
        </h2>
        <div className="flex justify-center">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      <motion.div
        className="mx-auto mt-6 max-w-[44rem]"
        style={canAnimate ? { y: panelY } : undefined}
      >
        <CalendlyPanel />
      </motion.div>
    </motion.section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

import { CalendlyPanel } from '@/components/contact/calendly-panel';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { useReducedMotionPreference } from '@/hooks/use-reduced-motion';
import { siteConfig } from '@/lib/site-config';

interface IContactSectionProps {
  id?: string;
}

export function ContactSection({ id }: IContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isHydrated = useIsHydrated();
  const { reduceMotion } = useReducedMotionPreference();
  const canAnimate = isHydrated && !reduceMotion;
  const isHeadingInView = useInView(headingRef, {
    once: true,
    amount: 0.45,
  });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const panelY = useTransform(scrollYProgress, [0, 1], [34, -12]);
  const contactHeadlineLines = [
    "Let's Build Something Great!",
    'Book a Call or Drop an Email.',
  ] as const;

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className="relative scroll-mt-24 border-t border-white/8 pt-9 pb-10 sm:pt-11"
      initial={canAnimate ? { opacity: 0, y: 18 } : false}
      animate={canAnimate ? undefined : { opacity: 1, y: 0 }}
      whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: canAnimate ? 0.45 : 0, ease: 'easeOut' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-48 max-w-4xl rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)] blur-[90px]"
        style={{ y: canAnimate ? glowY : 0 }}
      />

      <div className="mx-auto max-w-[34rem] space-y-3 text-center">
        <h2
          ref={headingRef}
          className="font-display text-[clamp(1.58rem,2.45vw,2.35rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-white"
        >
          {contactHeadlineLines.map((line, index) => (
            <TextGenerateEffect
              key={line}
              words={line}
              className="block"
              delay={canAnimate ? 0.12 + index * 0.14 : 0}
              isActive={canAnimate ? isHeadingInView : true}
            />
          ))}
        </h2>
        <div className="flex justify-center">
          <a
            href={`mailto:${siteConfig.email}`}
            className="motion-enabled:hover:-translate-y-0.5 inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow,translate] duration-200 ease-in-out hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>

      <motion.div
        className="mx-auto mt-6 max-w-[44rem]"
        style={{ y: canAnimate ? panelY : 0 }}
      >
        <CalendlyPanel />
      </motion.div>
    </motion.section>
  );
}

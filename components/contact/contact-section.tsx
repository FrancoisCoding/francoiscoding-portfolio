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
      whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-48 max-w-4xl rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_62%)] blur-[90px]"
        style={canAnimate ? { y: glowY } : undefined}
      />

      <div className="mx-auto max-w-[34rem] space-y-3 text-center">
        <motion.h2
          className="font-display text-[clamp(1.58rem,2.45vw,2.35rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-white"
          initial={canAnimate ? 'hidden' : false}
          whileInView={canAnimate ? 'visible' : undefined}
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            visible: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: 0.11,
              },
            },
          }}
        >
          {contactHeadlineLines.map((line) => (
            <motion.span
              key={line}
              className="block"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 16,
                  filter: 'blur(6px)',
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.52,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h2>
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

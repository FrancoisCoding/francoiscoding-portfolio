'use client';

import { ArrowRight, Github } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

const heroTags = [
  'React + Next.js',
  'TypeScript',
  'Cloud & DevOps',
  'Product-Driven Delivery',
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const startValues = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 24 };
  const endValues = { opacity: 1, y: 0 };

  return (
    <section id="hero" className="pt-16 pb-24 sm:pt-24">
      <motion.div
        initial={startValues}
        animate={endValues}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
        className="space-y-8"
      >
        <p className="text-sm font-semibold tracking-[0.18em] text-[var(--brand)] uppercase">
          Portfolio
        </p>
        <div className="space-y-4">
          <h1 className="font-display max-w-4xl text-5xl leading-tight font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            Isaiah Francois
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-slate-700 dark:text-slate-200">
            Senior Full Stack Engineer (8+ years)
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Building reliable, user-first products across enterprise, defense,
            and media domains with an emphasis on outcomes, speed, and
            engineering quality.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a
              href={siteConfig.financeFlowUrl}
              target="_blank"
              rel="noreferrer"
            >
              View FinanceFlow
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact">Contact</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/resume">Download Resume</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {heroTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-sm text-slate-700 dark:border-white/20 dark:bg-white/5 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-3 shadow-xl shadow-black/5 dark:border-white/15 dark:bg-white/5">
          <Image
            src="/financeflow-preview.svg"
            alt="FinanceFlow product preview"
            width={1200}
            height={720}
            priority
            className="h-auto w-full rounded-xl"
          />
        </div>
      </motion.div>
    </section>
  );
}

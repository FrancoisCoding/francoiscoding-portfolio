'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin } from 'lucide-react';

import { useIsHydrated } from '@/hooks/use-is-hydrated';
import { siteConfig } from '@/lib/site-config';

const emailLink = {
  href: `mailto:${siteConfig.email}`,
  label: siteConfig.email,
};

const socialLinks = [
  {
    href: siteConfig.linkedinUrl,
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: siteConfig.githubUrl,
    label: 'GitHub',
    icon: Github,
  },
];

const footerCards = [
  {
    key: 'left-sheet',
    className:
      'bottom-[5.1rem] left-[10%] z-0 hidden h-[6.5rem] w-[15rem] sm:block sm:h-[8.2rem] sm:w-[20rem] lg:h-[10.2rem] lg:w-[26rem]',
    surfaceClassName:
      'bg-[linear-gradient(180deg,#f6f2ee_0%,#ddd7d0_100%)] text-slate-900',
    rotation: -9,
    render: () => (
      <div className="h-full w-full p-4 lg:p-5">
        <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-3 rounded-[1rem] border border-slate-900/8 bg-white/58 p-3">
          <div className="space-y-2">
            <div className="h-2.5 rounded-full bg-slate-900/10" />
            <div className="h-2.5 rounded-full bg-slate-900/10" />
            <div className="h-2.5 w-2/3 rounded-full bg-slate-900/10" />
          </div>
          <div className="rounded-[0.8rem] bg-slate-900/6" />
        </div>
      </div>
    ),
  },
  {
    key: 'left-visual',
    className:
      'bottom-[-1rem] left-[2%] z-20 h-[8.7rem] w-[15rem] sm:h-[11.5rem] sm:w-[21rem] lg:h-[14.5rem] lg:w-[29rem]',
    surfaceClassName: 'bg-[linear-gradient(180deg,#24105d_0%,#3b1177_100%)]',
    rotation: -8,
    render: () => (
      <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#24105d_0%,#3b1177_100%)]">
        <div className="absolute inset-x-0 top-[22%] h-[40%] bg-[#f1ddeb]" />
        <div className="absolute top-[18%] left-[10%] h-4 w-4 rounded-full bg-[#f1a36a] opacity-90 lg:h-5 lg:w-5" />
        <div className="absolute top-[40%] left-[16%] h-4 w-4 rounded-full border-[3px] border-cyan-400/80 lg:h-5 lg:w-5" />
        <div className="absolute top-[26%] right-[14%] h-5 w-5 rotate-45 bg-[#fff2b7] lg:h-6 lg:w-6" />
        <div className="absolute top-[34%] left-[25%] h-1 w-[30%] rounded-full bg-[#d4f4ff]/85 shadow-[0_0_10px_rgba(212,244,255,0.82)]" />
        <div className="absolute top-[43%] left-[31%] h-1 w-[22%] rounded-full bg-[#d4f4ff]/85 shadow-[0_0_10px_rgba(212,244,255,0.82)]" />
        <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#17121f]/92" />
      </div>
    ),
  },
  {
    key: 'center-main',
    className:
      'bottom-[-1.4rem] left-[34%] z-40 h-[9.2rem] w-[14rem] sm:h-[12.4rem] sm:w-[20rem] lg:h-[15.5rem] lg:w-[28rem]',
    surfaceClassName: 'bg-[#101216]',
    rotation: -3,
    render: () => (
      <Image
        src="/projects/financeflow-dashboard.png"
        alt=""
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 48vw, 33vw"
      />
    ),
  },
  {
    key: 'center-phone',
    className:
      'bottom-[-1.8rem] left-[52%] z-50 h-[9rem] w-[6.2rem] sm:h-[12rem] sm:w-[8.2rem] lg:h-[15.3rem] lg:w-[10.8rem]',
    surfaceClassName: 'bg-[#0e1115]',
    rotation: 7,
    render: () => (
      <Image
        src="/projects/financeflow-ai.png"
        alt=""
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 24vw, 14vw"
      />
    ),
  },
  {
    key: 'right-accent',
    className:
      'bottom-[4rem] right-[10%] z-10 h-[5.4rem] w-[10rem] sm:h-[7rem] sm:w-[12.5rem] lg:h-[9rem] lg:w-[16.5rem]',
    surfaceClassName: 'bg-[linear-gradient(180deg,#f2a385_0%,#f0b39b_100%)]',
    rotation: 8,
    render: () => (
      <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_46%)]" />
    ),
  },
  {
    key: 'right-sheet',
    className:
      'bottom-[-1.1rem] right-[2%] z-20 h-[8rem] w-[15rem] sm:h-[10.5rem] sm:w-[20rem] lg:h-[13.8rem] lg:w-[29rem]',
    surfaceClassName:
      'bg-[linear-gradient(180deg,#edf0f3_0%,#dfe3e8_100%)] text-slate-900',
    rotation: -7,
    render: () => (
      <div className="h-full w-full p-3 lg:p-4">
        <div className="grid h-full grid-cols-[1fr_1fr] gap-3 rounded-[1.1rem] border border-slate-900/8 bg-white/58 p-3">
          <div className="rounded-[0.85rem] border border-slate-900/8 bg-white/85" />
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-slate-900/10" />
            <div className="h-8 rounded-[0.8rem] bg-slate-900/8" />
            <div className="h-8 rounded-[0.8rem] bg-slate-900/8" />
            <div className="h-8 rounded-[0.8rem] bg-slate-900/8" />
          </div>
        </div>
      </div>
    ),
  },
] as const;

export function SiteFooter() {
  const isHydrated = useIsHydrated();
  const canAnimate = isHydrated;

  return (
    <footer className="relative overflow-hidden pt-8 sm:pt-10 lg:pt-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]"
      />

      <motion.div
        initial={canAnimate ? { opacity: 0, y: 16 } : false}
        whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-40 flex flex-wrap items-center justify-center gap-2.5 px-4"
      >
        <a
          href={emailLink.href}
          className="inline-flex min-h-10 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
        >
          {emailLink.label}
        </a>

        {socialLinks.map((link) => {
          const Icon = link.icon;

          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          );
        })}
      </motion.div>

      <div className="relative mt-4 h-[12rem] sm:h-[16rem] lg:h-[20rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] blur-[70px]"
        />

        <div aria-hidden="true" className="absolute inset-0">
          {footerCards.map((card, index) => (
            <motion.div
              key={card.key}
              initial={
                canAnimate
                  ? {
                      opacity: 0,
                      y: 24,
                      rotate: card.rotation + (card.rotation > 0 ? 2 : -2),
                    }
                  : false
              }
              whileInView={
                canAnimate
                  ? { opacity: 1, y: 0, rotate: card.rotation }
                  : undefined
              }
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.46,
                delay: 0.05 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`absolute overflow-hidden rounded-[1.65rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.46)] ${card.className} ${card.surfaceClassName}`}
            >
              {card.render()}
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}

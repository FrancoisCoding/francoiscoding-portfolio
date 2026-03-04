'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
      'bottom-[3.25rem] left-[8%] z-0 hidden h-[8rem] w-[18rem] sm:block sm:h-[10rem] sm:w-[24rem] lg:h-[12rem] lg:w-[30rem]',
    surfaceClassName:
      'bg-[linear-gradient(180deg,#f6f2ee_0%,#ddd7d0_100%)] text-slate-900',
    rotation: -8,
    render: () => (
      <div className="h-full w-full p-4 text-slate-900 lg:p-5">
        <div className="flex items-center justify-between text-[0.58rem] font-semibold tracking-[0.16em] text-slate-500 uppercase">
          <span>Product systems</span>
          <span>Preview</span>
        </div>
        <div className="mt-4 grid grid-cols-[1.25fr_0.75fr] gap-3">
          <div className="space-y-3">
            <div className="h-4 rounded-full bg-slate-900/10" />
            <div className="h-14 rounded-[1.2rem] bg-slate-900/7" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 rounded-[0.95rem] bg-slate-900/7" />
              <div className="h-10 rounded-[0.95rem] bg-slate-900/7" />
            </div>
          </div>
          <div className="rounded-[1.2rem] bg-white/82" />
        </div>
      </div>
    ),
  },
  {
    key: 'left-visual',
    className:
      'bottom-[-2.25rem] left-[3%] z-20 h-[10rem] w-[18rem] sm:h-[13rem] sm:w-[24rem] lg:h-[18rem] lg:w-[33rem]',
    surfaceClassName: 'bg-[linear-gradient(180deg,#24105d_0%,#34106f_100%)]',
    rotation: -10,
    render: () => (
      <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#24105d_0%,#3b1177_100%)]">
        <div className="absolute inset-x-0 top-[18%] h-[42%] bg-[#f1ddeb]" />
        <div className="absolute top-[18%] left-[8%] h-4 w-4 rounded-full bg-[#f1a36a] opacity-80 lg:h-6 lg:w-6" />
        <div className="absolute top-[44%] left-[13%] h-4 w-4 rounded-full border-[3px] border-cyan-400/85 lg:h-6 lg:w-6" />
        <div className="absolute top-[22%] right-[13%] h-5 w-5 rotate-45 bg-[#fff2b7] lg:h-7 lg:w-7" />
        <div className="absolute top-[30%] left-[18%] h-1 w-[34%] rounded-full bg-[#d4f4ff]/90 shadow-[0_0_10px_rgba(212,244,255,0.8)]" />
        <div className="absolute top-[37%] left-[24%] h-1 w-[28%] rounded-full bg-[#d4f4ff]/90 shadow-[0_0_10px_rgba(212,244,255,0.8)]" />
        <div className="absolute top-[68%] left-[15%] h-2 w-2 rotate-45 bg-cyan-400 lg:h-3 lg:w-3" />
        <div className="absolute top-[22%] left-[47%] h-[48%] w-[22%] rounded-[2rem_2rem_1rem_1rem] border border-black/20 bg-[#9e76ff]/20 backdrop-blur-[1px] lg:w-[18%]">
          <div className="absolute inset-[14%] rounded-[2rem] bg-[#baf2ff]">
            <div className="absolute top-[30%] left-[34%] h-[28%] w-[32%] rounded-full border-[5px] border-[#00d8ff] border-t-transparent" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[16%] h-[16%] bg-[linear-gradient(180deg,transparent_0%,rgba(8,8,12,0.12)_100%)]" />
        <div className="absolute right-[5%] bottom-0 left-[5%] h-[28%] rounded-t-[1.5rem] bg-[#1a1226]/92">
          <div className="absolute top-[15%] right-[5%] left-[5%] h-[18%] rounded-full bg-black/40" />
          <div className="absolute bottom-[18%] left-[8%] h-[10%] w-[22%] rounded-full bg-[#161616]" />
          <div className="absolute bottom-[18%] left-[34%] h-[10%] w-[18%] rounded-full bg-[#f1f0f5]" />
          <div className="absolute bottom-[18%] left-[56%] h-[10%] w-[14%] rounded-full bg-[#1f1f24]" />
          <div className="absolute bottom-[18%] left-[73%] h-[10%] w-[15%] rounded-full bg-[#222229]" />
        </div>
      </div>
    ),
  },
  {
    key: 'center-left',
    className:
      'bottom-[-3rem] left-[38%] z-30 h-[11rem] w-[8rem] sm:h-[15rem] sm:w-[10.5rem] lg:h-[22rem] lg:w-[15rem]',
    surfaceClassName: 'bg-[#101215]',
    rotation: -8,
    render: () => (
      <Image
        src="/projects/financeflow-dashboard.png"
        alt=""
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 20vw, 13vw"
      />
    ),
  },
  {
    key: 'center-main',
    className:
      'bottom-[-4rem] left-[47%] z-40 h-[12rem] w-[8.75rem] sm:h-[16rem] sm:w-[11.5rem] lg:h-[24rem] lg:w-[17rem]',
    surfaceClassName: 'bg-[#0f1115]',
    rotation: -2,
    render: () => (
      <Image
        src="/projects/financeflow-ai.png"
        alt=""
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 22vw, 14vw"
      />
    ),
  },
  {
    key: 'center-right',
    className:
      'bottom-[-3rem] left-[57%] z-30 h-[11rem] w-[8rem] sm:h-[15rem] sm:w-[10.5rem] lg:h-[22rem] lg:w-[15rem]',
    surfaceClassName: 'bg-[#111316]',
    rotation: 8,
    render: () => (
      <Image
        src="/projects/financeflow-subscriptions.png"
        alt=""
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 20vw, 13vw"
      />
    ),
  },
  {
    key: 'right-accent',
    className:
      'bottom-[4.5rem] right-[12%] z-10 h-[6.5rem] w-[11rem] sm:h-[8.5rem] sm:w-[14rem] lg:h-[11rem] lg:w-[20rem]',
    surfaceClassName: 'bg-[linear-gradient(180deg,#f2a385_0%,#f0b39b_100%)]',
    rotation: 9,
    render: () => (
      <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
    ),
  },
  {
    key: 'right-sheet',
    className:
      'bottom-[-1.5rem] right-[4%] z-0 h-[9rem] w-[19rem] sm:h-[12rem] sm:w-[25rem] lg:h-[17rem] lg:w-[35rem]',
    surfaceClassName:
      'bg-[linear-gradient(180deg,#edf0f3_0%,#dfe3e8_100%)] text-slate-900',
    rotation: -6,
    render: () => (
      <div className="h-full w-full p-4 text-slate-900 lg:p-5">
        <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-4 rounded-[1.35rem] border border-slate-900/6 bg-white/55 p-4">
          <div className="rounded-[1.2rem] border border-slate-900/5 bg-white/75" />
          <div className="space-y-3">
            <div className="h-6 rounded-full bg-slate-900/10" />
            <div className="h-11 rounded-[1rem] bg-slate-900/7" />
            <div className="h-11 rounded-[1rem] bg-slate-900/7" />
            <div className="h-11 rounded-[1rem] bg-slate-900/7" />
          </div>
        </div>
      </div>
    ),
  },
];

export function SiteFooter() {
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = isHydrated && !shouldReduceMotion;

  return (
    <footer className="relative overflow-hidden pt-10 sm:pt-12 lg:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_24%)]"
      />

      <motion.div
        initial={canAnimate ? { opacity: 0, y: 18 } : false}
        whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-30 flex flex-wrap items-center justify-center gap-3 px-4"
      >
        <a
          href={emailLink.href}
          className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-white/8 px-4 text-sm font-medium text-white transition-colors hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/8 text-white transition-colors hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          );
        })}
      </motion.div>

      <div className="relative mt-6 h-[12rem] sm:h-[16rem] lg:h-[22rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-2 h-20 bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] blur-[70px]"
        />

        <div aria-hidden="true" className="absolute inset-0">
          {footerCards.map((card, index) => (
            <motion.div
              key={card.key}
              initial={
                canAnimate
                  ? {
                      opacity: 0,
                      y: 26,
                      rotate: card.rotation + (card.rotation > 0 ? 2 : -2),
                    }
                  : false
              }
              whileInView={
                canAnimate
                  ? { opacity: 1, y: 0, rotate: card.rotation }
                  : undefined
              }
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.42,
                delay: 0.04 * index,
                ease: 'easeOut',
              }}
              className={`absolute overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.46)] ${card.className} ${card.surfaceClassName}`}
            >
              {card.render()}
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { useReducedMotionPreference } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

interface IFloatingDockItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

interface IFloatingDockProps {
  items: IFloatingDockItem[];
  className?: string;
}

interface IFloatingDockIconProps {
  item: IFloatingDockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  reduceMotion: boolean;
}

function FloatingDockIcon({
  item,
  mouseX,
  reduceMotion,
}: IFloatingDockIconProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);

  const distanceFromCursor = useTransform(mouseX, (x) => {
    const bounds = itemRef.current?.getBoundingClientRect();
    if (!bounds) return 0;
    return x - bounds.left - bounds.width / 2;
  });

  const itemWidth = useSpring(
    useTransform(distanceFromCursor, [-140, 0, 140], [36, 52, 36]),
    {
      damping: 22,
      mass: 0.12,
      stiffness: 260,
    },
  );

  const iconScale = useSpring(
    useTransform(distanceFromCursor, [-140, 0, 140], [0.92, 1.14, 0.92]),
    {
      damping: 22,
      mass: 0.12,
      stiffness: 260,
    },
  );

  const staticSize = 36;

  return (
    <a
      ref={itemRef}
      href={item.href}
      aria-label={item.title}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      className="group relative inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
    >
      <motion.span
        style={
          reduceMotion
            ? { height: staticSize, width: staticSize }
            : { height: itemWidth, width: itemWidth }
        }
        className="inline-flex items-center justify-center text-white/70 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white"
      >
        <motion.span
          style={{ scale: reduceMotion ? 1 : iconScale }}
          className="inline-flex items-center justify-center"
        >
          {item.icon}
        </motion.span>
      </motion.span>

      <span
        aria-hidden="true"
        className="motion-enabled:translate-y-1 motion-enabled:transition-[opacity,translate,visibility] motion-enabled:duration-150 motion-enabled:group-hover:translate-y-0 motion-enabled:group-focus-visible:translate-y-0 pointer-events-none invisible absolute -top-9 z-10 rounded-full border border-white/[0.08] bg-[var(--surface)] px-2.5 py-1 text-[0.68rem] font-medium whitespace-nowrap text-white/80 opacity-0 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
      >
        {item.title}
      </span>
    </a>
  );
}

export function FloatingDock({ items, className }: IFloatingDockProps) {
  const mouseX = useMotionValue(0);
  const { reduceMotion } = useReducedMotionPreference();

  return (
    <motion.div
      onMouseMove={
        reduceMotion ? undefined : (event) => mouseX.set(event.pageX)
      }
      onMouseLeave={
        reduceMotion ? undefined : () => mouseX.set(Number.POSITIVE_INFINITY)
      }
      className={cn('flex items-end gap-1', className)}
    >
      {items.map((item) => (
        <FloatingDockIcon
          key={item.title}
          item={item}
          mouseX={mouseX}
          reduceMotion={reduceMotion}
        />
      ))}
    </motion.div>
  );
}

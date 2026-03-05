'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
}

function FloatingDockIcon({ item, mouseX }: IFloatingDockIconProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distanceFromCursor = useTransform(mouseX, (x) => {
    const bounds = itemRef.current?.getBoundingClientRect();

    if (!bounds) {
      return 0;
    }

    return x - bounds.left - bounds.width / 2;
  });

  const itemWidth = useSpring(
    useTransform(distanceFromCursor, [-140, 0, 140], [40, 58, 40]),
    {
      damping: 22,
      mass: 0.12,
      stiffness: 260,
    },
  );

  const iconScale = useSpring(
    useTransform(distanceFromCursor, [-140, 0, 140], [0.92, 1.18, 0.92]),
    {
      damping: 22,
      mass: 0.12,
      stiffness: 260,
    },
  );

  return (
    <a
      ref={itemRef}
      href={item.href}
      aria-label={item.title}
      title={item.title}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
    >
      <motion.span
        style={{ height: itemWidth, width: itemWidth }}
        className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-[#151516]/92 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-colors duration-200 ease-in-out hover:bg-[#1b1b1d]"
      >
        <motion.span
          style={{ scale: iconScale }}
          className="inline-flex items-center justify-center"
        >
          {item.icon}
        </motion.span>
      </motion.span>

      {isHovered ? (
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute -top-10 rounded-lg border border-white/10 bg-[#101011]/96 px-2.5 py-1 text-xs font-medium text-white/90 shadow-[0_10px_22px_rgba(0,0,0,0.35)]"
        >
          {item.title}
        </motion.span>
      ) : null}
    </a>
  );
}

export function FloatingDock({ items, className }: IFloatingDockProps) {
  const mouseX = useMotionValue(0);

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-2 py-2 backdrop-blur-xl',
        className,
      )}
    >
      {items.map((item) => (
        <FloatingDockIcon key={item.title} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}

'use client';

import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);

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
      title={item.title}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
    >
      <motion.span
        style={
          reduceMotion
            ? { height: staticSize, width: staticSize }
            : { height: itemWidth, width: itemWidth }
        }
        className={cn(
          'inline-flex items-center justify-center rounded-full text-white/70 transition-colors duration-200',
          'hover:bg-white/[0.08] hover:text-white',
        )}
      >
        <motion.span
          style={reduceMotion ? undefined : { scale: iconScale }}
          className="inline-flex items-center justify-center"
        >
          {item.icon}
        </motion.span>
      </motion.span>

      {isHovered && !reduceMotion ? (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -top-9 rounded-full border border-white/[0.08] bg-[#0a0a0a]/80 px-2.5 py-1 text-[0.68rem] font-medium text-white/80 shadow-[0_8px_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          {item.title}
        </motion.span>
      ) : null}
    </a>
  );
}

export function FloatingDock({ items, className }: IFloatingDockProps) {
  const mouseX = useMotionValue(0);
  const { reduceMotion } = useReducedMotionPreference();

  return (
    <motion.div
      onMouseMove={(event) => mouseX.set(event.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        'flex items-end gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] p-1.5 shadow-[0_2px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl',
        className,
      )}
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

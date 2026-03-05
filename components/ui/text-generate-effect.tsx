'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface ITextGenerateEffectProps {
  words: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}

export function TextGenerateEffect({
  words,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.055,
  duration = 0.56,
}: ITextGenerateEffectProps) {
  const wordsArray = words.split(' ');

  return (
    <motion.span
      className={cn('inline', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {wordsArray.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={cn('inline-block', wordClassName)}
          variants={{
            hidden: {
              opacity: 0,
              y: 16,
              filter: 'blur(8px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          {word}
          {index < wordsArray.length - 1 ? '\u00A0' : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

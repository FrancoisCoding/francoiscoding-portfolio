import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 min-h-11',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)] focus-visible:ring-[var(--brand)]',
        secondary:
          'border border-black/10 bg-white/60 text-slate-900 hover:bg-white focus-visible:ring-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20 dark:focus-visible:ring-slate-300',
        ghost:
          'text-slate-800 hover:bg-slate-900/10 focus-visible:ring-slate-700 dark:text-slate-100 dark:hover:bg-white/10 dark:focus-visible:ring-slate-300',
        link: 'h-auto min-h-0 p-0 text-[var(--brand)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-5 py-2.5',
        sm: 'rounded-md px-3 py-2 text-xs',
        lg: 'rounded-lg px-6 py-3 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface IButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

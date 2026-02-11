import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden before:content-[''] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full",
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 before:bg-current',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 before:bg-muted-foreground',
        destructive:
          'border-transparent bg-error-light text-primary [a&]:hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40 dark:bg-error/60 before:bg-error',
        outline:
          'text-primary [a&]:hover:bg-accent [a&]:hover:text-accent-foreground before:bg-current',
        warning:
          'border-transparent bg-warning-light text-primary [a&]:hover:bg-warning-light/90 before:bg-warning',
        success:
          'border-transparent bg-success-light text-primary [a&]:hover:bg-success-light/90 before:bg-success',
        info: 'border-transparent bg-info-light text-primary [a&]:hover:bg-info-light/90 before:bg-info',
        ghost: 'border-transparent  text-primary [a&]:hover:bg-accent before:bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

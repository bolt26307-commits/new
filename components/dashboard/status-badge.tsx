import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'success' | 'warning' | 'destructive' | 'accent' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

const dotClasses: Record<Variant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  accent: 'bg-accent',
  neutral: 'bg-muted-foreground',
};

export function StatusBadge({
  label,
  variant = 'neutral',
  dot = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[variant])} />
      )}
      {label}
    </span>
  );
}

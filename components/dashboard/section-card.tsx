'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  contentClassName,
  delay = 0,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <section
        className={cn(
          'rounded-[1.125rem] border bg-card shadow-soft',
          className
        )}
      >
        {(title || action) && (
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2.5">
              {Icon && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-sm font-semibold">{title}</h2>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            {action}
          </div>
        )}
        <div className={cn('p-5', contentClassName)}>{children}</div>
      </section>
    </motion.div>
  );
}

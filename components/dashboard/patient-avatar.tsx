'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { initials } from '@/lib/status';

interface PatientAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-20 w-20',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-lg',
};

export function PatientAvatar({
  name,
  avatarUrl,
  size = 'md',
  className,
}: PatientAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && (
        <AvatarImage src={avatarUrl} alt={name} />
      )}
      <AvatarFallback
        className={cn(
          'bg-gradient-to-br from-primary/15 to-accent/15 font-semibold text-primary',
          textSizeClasses[size]
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Bell, Menu, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/appointments': 'Appointments',
  '/patients': 'Patients',
  '/calendar': 'Calendar',
  '/ai-summaries': 'AI Summaries',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb */}
      <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <span className="font-medium text-foreground">Dashboard</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>{title}</span>
      </div>

      {/* Search */}
      <div className="relative ml-auto w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search patients, appointments..."
          className="h-9 rounded-lg pl-9 pr-4 text-sm"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground md:flex">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Link href="/notifications">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg"
          >
            <Bell className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>
        </Link>

        <Link href="/settings" className="ml-1">
          <PatientAvatar
            name="Sarah Chen"
            avatarUrl="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=256"
            size="sm"
            className={cn('ring-2 ring-border')}
          />
        </Link>
      </div>
    </header>
  );
}

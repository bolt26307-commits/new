'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Settings,
  Stethoscope,
  Users,
  FileText,
  BarChart3,
  Sparkles,
  HeartPulse,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Appointments', href: '/appointments', icon: CalendarDays },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'AI Summaries', href: '/ai-summaries', icon: Sparkles },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/overview" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight">
                ClinicOS
              </span>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Doctor Dashboard
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4.5 w-4.5 transition-colors',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  style={{ width: '1.125rem', height: '1.125rem' }}
                />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Doctor card */}
        <div className="border-t p-3">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Dr. Sarah Chen</p>
              <p className="truncate text-xs text-muted-foreground">
                Cardiology
              </p>
            </div>
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

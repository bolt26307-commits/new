'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Bell,
  CalendarPlus,
  CalendarX,
  Siren,
  Sparkles,
  Check,
  CheckCheck,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { relativeTime, notificationTypeConfig } from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { AppNotification, NotificationType } from '@/lib/types';

const iconMap: Record<NotificationType, LucideIcon> = {
  appointment_request: CalendarPlus,
  cancellation: CalendarX,
  emergency: Siren,
  system: Bell,
  summary_ready: Sparkles,
};

const colorMap: Record<NotificationType, string> = {
  appointment_request: 'bg-primary/10 text-primary',
  cancellation: 'bg-destructive/10 text-destructive',
  emergency: 'bg-destructive/10 text-destructive',
  system: 'bg-muted text-muted-foreground',
  summary_ready: 'bg-accent/10 text-accent',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  React.useEffect(() => {
    (async () => {
      const data = await dataService.getNotifications();
      setNotifications(data);
      setLoading(false);
    })();
  }, []);

  const filtered = notifications.filter((n) =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      >
        <div className="flex items-center gap-1 rounded-xl border bg-card p-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </PageHeader>

      <SectionCard icon={Bell}>
        {loading ? (
          <LoadingSkeleton variant="list" count={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up. New notifications will appear here."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((n, i) => {
              const Icon = iconMap[n.type];
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30',
                      !n.read && 'border-primary/20 bg-primary/5'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        colorMap[n.type]
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {n.description}
                          </p>
                        </div>
                        {!n.read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(n.timestamp)}
                        </span>
                        {n.patientId && (
                          <Link
                            href={`/patients/${n.patientId}`}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                          >
                            <PatientAvatar
                              name={n.title}
                              size="sm"
                              className="h-5 w-5"
                            />
                            View patient
                          </Link>
                        )}
                        <button
                          onClick={() => toggleRead(n.id)}
                          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <Check className="h-3 w-3" />
                          {n.read ? 'Read' : 'Mark read'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { appointmentStatusConfig } from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { Appointment } from '@/lib/types';

type ViewMode = 'month' | 'week' | 'day';

export default function CalendarPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    (async () => {
      const data = await dataService.getAppointments();
      setAppointments(data);
      setLoading(false);
    })();
  }, []);

  const appointmentsByDate = React.useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments]);

  const dateKey = (d: Date) => d.toISOString().slice(0, 10);

  // --- Month view ---
  const monthMatrix = React.useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [currentDate]);

  // --- Week view ---
  const weekDays = React.useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const dayHours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM - 6 PM

  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + dir);
    else if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const headerLabel = React.useMemo(() => {
    if (viewMode === 'month')
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    if (viewMode === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [currentDate, viewMode, weekDays]);

  const selectedDayAppts =
    appointmentsByDate[dateKey(selectedDate)] ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="View and manage your appointment schedule"
      >
        <div className="flex items-center gap-1 rounded-xl border bg-card p-1">
          {(['month', 'week', 'day'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                viewMode === m
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Calendar */}
        <SectionCard
          icon={CalendarDays}
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center text-sm font-medium">
                {headerLabel}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 rounded-lg"
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
              >
                Today
              </Button>
            </div>
          }
        >
          {loading ? (
            <LoadingSkeleton variant="list" count={7} />
          ) : viewMode === 'month' ? (
            <div>
              <div className="mb-2 grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthMatrix.map((day, i) => {
                  if (!day) return <div key={i} className="aspect-square" />;
                  const key = dateKey(day);
                  const appts = appointmentsByDate[key] ?? [];
                  const isToday = key === dateKey(new Date());
                  const isSelected = key === dateKey(selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'flex aspect-square flex-col items-center justify-start rounded-lg border p-1.5 transition-all hover:border-primary/30 hover:bg-muted/40',
                        isSelected && 'border-primary bg-primary/5',
                        isToday && !isSelected && 'border-primary/40 bg-primary/5'
                      )}
                    >
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isToday ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {day.getDate()}
                      </span>
                      {appts.length > 0 && (
                        <div className="mt-auto flex flex-wrap items-center justify-center gap-0.5">
                          {appts.slice(0, 4).map((a) => (
                            <span
                              key={a.id}
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                appointmentStatusConfig[a.status].dot
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : viewMode === 'week' ? (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1">
                  <div />
                  {weekDays.map((d, i) => {
                    const isToday = dateKey(d) === dateKey(new Date());
                    return (
                      <div
                        key={i}
                        className="py-2 text-center"
                      >
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p
                          className={cn(
                            'mt-0.5 text-lg font-semibold',
                            isToday ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {d.getDate()}
                        </p>
                      </div>
                    );
                  })}
                  {dayHours.map((hour) => (
                    <React.Fragment key={hour}>
                      <div className="flex h-16 items-start justify-end pr-2 text-xs text-muted-foreground">
                        {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>
                      {weekDays.map((d, di) => {
                        const key = dateKey(d);
                        const appts = (appointmentsByDate[key] ?? []).filter(
                          (a) => parseInt(a.time.split(':')[0]) === hour
                        );
                        return (
                          <div
                            key={di}
                            className="h-16 rounded-lg border border-dashed border-border/50 p-1"
                          >
                            {appts.map((a) => (
                              <div
                                key={a.id}
                                className={cn(
                                  'mb-1 truncate rounded-md px-1.5 py-1 text-xs font-medium',
                                  appointmentStatusConfig[a.status].badge
                                )}
                              >
                                {a.time} {a.patientName.split(' ')[0]}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Day view
            <div className="space-y-1">
              {dayHours.map((hour) => {
                const key = dateKey(currentDate);
                const appts = (appointmentsByDate[key] ?? []).filter(
                  (a) => parseInt(a.time.split(':')[0]) === hour
                );
                return (
                  <div
                    key={hour}
                    className="flex gap-3 border-b border-border/50 py-2"
                  >
                    <div className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
                      {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    <div className="flex-1">
                      {appts.length > 0 ? (
                        appts.map((a) => (
                          <motion.div
                            key={a.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              'mb-2 flex items-center justify-between rounded-lg border p-3',
                              appointmentStatusConfig[a.status].badge
                            )}
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                {a.patientName}
                              </p>
                              <p className="text-xs opacity-80">{a.reason}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">
                                {a.time}
                              </span>
                              <StatusBadge
                                label={appointmentStatusConfig[a.status].label}
                                variant={
                                  a.status === 'completed'
                                    ? 'success'
                                    : a.status === 'confirmed'
                                    ? 'primary'
                                    : a.status === 'pending'
                                    ? 'warning'
                                    : 'destructive'
                                }
                                dot
                              />
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="h-12 rounded-lg border border-dashed border-border/30" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Selected day appointments */}
        <SectionCard
          title="Selected Day"
          description={selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
          icon={Clock}
        >
          {selectedDayAppts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No appointments scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDayAppts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.patientName}</p>
                    <p className="text-xs text-muted-foreground">{a.reason}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs font-medium">{a.time}</span>
                      <StatusBadge
                        label={appointmentStatusConfig[a.status].label}
                        variant={
                          a.status === 'completed'
                            ? 'success'
                            : a.status === 'confirmed'
                            ? 'primary'
                            : a.status === 'pending'
                            ? 'warning'
                            : 'destructive'
                        }
                        dot
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

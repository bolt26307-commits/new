'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { SectionCard } from '@/components/dashboard/section-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  appointmentStatusConfig,
  priorityConfig,
  formatDate,
} from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { Appointment } from '@/lib/types';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function OverviewPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [satisfactionData, setSatisfactionData] = React.useState<
    { month: string; score: number }[]
  >([]);

  React.useEffect(() => {
    (async () => {
      const [appts, sat] = await Promise.all([
        dataService.getTodaysAppointments(),
        dataService.getSatisfactionTrend(),
      ]);
      setAppointments(appts);
      setSatisfactionData(sat);
      setLoading(false);
    })();
  }, []);

  const today = new Date();
  const completedCount = appointments.filter(
    (a) => a.status === 'completed'
  ).length;
  const pendingCount = appointments.filter(
    (a) => a.status === 'pending'
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Dr. Chen"
        description={formatDate(today.toISOString())}
      >
        <Link href="/appointments">
          <Button variant="outline" className="rounded-xl">
            View all appointments
          </Button>
        </Link>
        <Link href="/calendar">
          <Button className="rounded-xl">
            Open calendar
          </Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Appointments"
            value={appointments.length}
            icon={CalendarCheck2}
            trend={{ value: 12, positive: true, label: 'vs yesterday' }}
            accent="primary"
            delay={0}
          />
          <StatCard
            title="Completed Today"
            value={completedCount}
            unit={`/ ${appointments.length}`}
            icon={CheckCircle2}
            trend={{ value: 8, positive: true, label: 'this week' }}
            accent="success"
            delay={0.05}
          />
          <StatCard
            title="Pending Reviews"
            value={pendingCount}
            icon={Clock}
            trend={{ value: 3, positive: false, label: 'needs attention' }}
            accent="warning"
            delay={0.1}
          />
          <StatCard
            title="Patient Satisfaction"
            value="4.9"
            unit="/ 5.0"
            icon={HeartHandshake}
            trend={{ value: 4, positive: true, label: 'this month' }}
            accent="accent"
            delay={0.15}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's appointments table */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Today's Appointments"
            description={`${appointments.length} scheduled for today`}
            icon={CalendarCheck2}
            delay={0.2}
            action={
              <Link href="/appointments">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          >
            {loading ? (
              <LoadingSkeleton variant="table" count={5} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Patient
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Time
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground md:table-cell">
                        Priority
                      </TableHead>
                      <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground lg:table-cell">
                        Department
                      </TableHead>
                      <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt, i) => {
                      const statusCfg = appointmentStatusConfig[apt.status];
                      const prioCfg = priorityConfig[apt.priority];
                      return (
                        <motion.tr
                          key={apt.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 + i * 0.04 }}
                          className="border-border transition-colors hover:bg-muted/40"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <PatientAvatar
                                name={apt.patientName}
                                avatarUrl={apt.patientAvatarUrl}
                                size="sm"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {apt.patientName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {apt.reason}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{apt.time}</p>
                            <p className="text-xs text-muted-foreground">
                              {apt.durationMinutes} min
                            </p>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              label={statusCfg.label}
                              variant={
                                apt.status === 'completed'
                                  ? 'success'
                                  : apt.status === 'confirmed'
                                  ? 'primary'
                                  : apt.status === 'pending'
                                  ? 'warning'
                                  : 'destructive'
                              }
                              dot
                            />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <StatusBadge
                              label={prioCfg.label}
                              variant={
                                apt.priority === 'urgent'
                                  ? 'destructive'
                                  : apt.priority === 'high'
                                  ? 'warning'
                                  : apt.priority === 'medium'
                                  ? 'primary'
                                  : 'neutral'
                              }
                            />
                          </TableCell>
                          <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                            {apt.department}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/patients/${apt.patientId}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Satisfaction chart + quick info */}
        <div className="space-y-6">
          <SectionCard
            title="Patient Satisfaction"
            description="Last 7 months"
            icon={TrendingUp}
            delay={0.3}
          >
            {loading ? (
              <LoadingSkeleton variant="text" count={3} />
            ) : (
              <>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">4.9</span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                  <span className="ml-auto text-xs font-medium text-success">
                    +4.4%
                  </span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={satisfactionData}>
                      <defs>
                        <linearGradient
                          id="satGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[4, 5]}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '0.75rem',
                          border: '1px solid hsl(var(--border))',
                          background: 'hsl(var(--popover))',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        fill="url(#satGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </SectionCard>

          <SectionCard
            title="Avg. Consultation Time"
            description="This week"
            icon={Clock}
            delay={0.35}
          >
            {loading ? (
              <LoadingSkeleton variant="text" count={2} />
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">24</span>
                  <span className="text-sm text-muted-foreground">minutes</span>
                  <span className="ml-auto text-xs font-medium text-success">
                    -2 min
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'On-time start rate', value: '94%', pct: 94 },
                    { label: 'Documentation rate', value: '88%', pct: 88 },
                    { label: 'Follow-up rate', value: '96%', pct: 96 },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{m.label}</span>
                        <span className="font-medium">{m.value}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

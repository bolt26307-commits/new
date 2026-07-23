'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  PieChart as PieChartIcon,
  Stethoscope,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { dataService } from '@/lib/data-service';

export default function AnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [weekly, setWeekly] = React.useState<
    { day: string; appointments: number; completed: number }[]
  >([]);
  const [monthly, setMonthly] = React.useState<
    { month: string; visits: number; avg: number }[]
  >([]);
  const [departments, setDepartments] = React.useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [demographics, setDemographics] = React.useState<
    { range: string; male: number; female: number }[]
  >([]);
  const [performance, setPerformance] = React.useState<
    { metric: string; value: number }[]
  >([]);

  React.useEffect(() => {
    (async () => {
      const [w, m, d, demo, perf] = await Promise.all([
        dataService.getWeeklyAppointmentTrend(),
        dataService.getMonthlyConsultationTrend(),
        dataService.getDepartmentDistribution(),
        dataService.getPatientDemographics(),
        dataService.getDoctorPerformance(),
      ]);
      setWeekly(w);
      setMonthly(m);
      setDepartments(d);
      setDemographics(demo);
      setPerformance(perf);
      setLoading(false);
    })();
  }, []);

  const tooltipStyle = {
    borderRadius: '0.75rem',
    border: '1px solid hsl(var(--border))',
    background: 'hsl(var(--popover))',
    fontSize: '12px',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Insights into your practice performance and patient trends"
      />

      {/* Top stats */}
      {loading ? (
        <LoadingSkeleton variant="card" count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Visits (Month)"
            value="195"
            icon={Users}
            trend={{ value: 9, positive: true, label: 'vs last month' }}
            accent="primary"
          />
          <StatCard
            title="Avg. Consultation"
            value="24"
            unit="min"
            icon={Activity}
            trend={{ value: 8, positive: true, label: 'faster' }}
            accent="accent"
          />
          <StatCard
            title="Patient Satisfaction"
            value="4.9"
            unit="/5"
            icon={TrendingUp}
            trend={{ value: 4, positive: true, label: 'this month' }}
            accent="success"
          />
          <StatCard
            title="Follow-up Rate"
            value="96%"
            icon={BarChart3}
            trend={{ value: 2, positive: true, label: 'vs target' }}
            accent="warning"
          />
        </div>
      )}

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly appointment trend */}
        <SectionCard
          title="Weekly Appointment Trend"
          description="Appointments vs completed this week"
          icon={BarChart3}
          delay={0.1}
        >
          {loading ? (
            <LoadingSkeleton variant="text" count={3} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="appointments"
                    fill="hsl(var(--chart-1))"
                    radius={[6, 6, 0, 0]}
                    name="Scheduled"
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--chart-2))"
                    radius={[6, 6, 0, 0]}
                    name="Completed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        {/* Monthly consultation trend */}
        <SectionCard
          title="Consultation Trends"
          description="Monthly visits over the past 7 months"
          icon={TrendingUp}
          delay={0.15}
        >
          {loading ? (
            <LoadingSkeleton variant="text" count={3} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient
                      id="visitsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
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
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#visitsGradient)"
                    name="Visits"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        {/* Department distribution */}
        <SectionCard
          title="Department Distribution"
          description="Appointments by department"
          icon={PieChartIcon}
          delay={0.2}
        >
          {loading ? (
            <LoadingSkeleton variant="text" count={3} />
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-56 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departments}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {departments.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {departments.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {d.name}
                    </span>
                    <span className="text-xs font-medium">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Patient demographics */}
        <SectionCard
          title="Patient Demographics"
          description="Age and gender distribution"
          icon={Users}
          delay={0.25}
        >
          {loading ? (
            <LoadingSkeleton variant="text" count={3} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographics}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="range"
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="male"
                    fill="hsl(var(--chart-1))"
                    radius={[6, 6, 0, 0]}
                    name="Male"
                  />
                  <Bar
                    dataKey="female"
                    fill="hsl(var(--chart-2))"
                    radius={[6, 6, 0, 0]}
                    name="Female"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Doctor performance — full width */}
      <SectionCard
        title="Doctor Performance"
        description="Key performance metrics across your practice"
        icon={Stethoscope}
        delay={0.3}
      >
        {loading ? (
          <LoadingSkeleton variant="text" count={5} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={performance}
                  innerRadius="20%"
                  outerRadius="100%"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background={{ fill: 'hsl(var(--muted))' }}
                    dataKey="value"
                    cornerRadius={8}
                    fill="hsl(var(--chart-1))"
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {performance.map((m, i) => (
                <motion.div
                  key={m.metric}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{m.metric}</span>
                    <span className="font-semibold">{m.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

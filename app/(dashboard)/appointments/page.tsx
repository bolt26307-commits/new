'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Filter,
  MoreHorizontal,
  Search,
  Plus,
  Download,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { Appointment, AppointmentStatus, Priority } from '@/lib/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('all');

  React.useEffect(() => {
    (async () => {
      const data = await dataService.getAppointments();
      setAppointments(data);
      setLoading(false);
    })();
  }, []);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchPriority =
      priorityFilter === 'all' || a.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage all upcoming and past appointments"
      >
        <Button variant="outline" className="rounded-xl">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          New appointment
        </Button>
      </PageHeader>

      <SectionCard
        title="All Appointments"
        description={`${filtered.length} appointments`}
        icon={CalendarDays}
      >
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by patient or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full rounded-lg sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-9 w-full rounded-lg sm:w-[160px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <LoadingSkeleton variant="table" count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No appointments found"
            description="Try adjusting your filters or search terms."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Patient
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Priority
                  </TableHead>
                  <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground md:table-cell">
                    Department
                  </TableHead>
                  <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground lg:table-cell">
                    Reason
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((apt, i) => {
                  const statusCfg = appointmentStatusConfig[apt.status];
                  const prioCfg = priorityConfig[apt.priority];
                  return (
                    <motion.tr
                      key={apt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
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
                              ID: {apt.patientId.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{apt.time}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(apt.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
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
                      <TableCell>
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
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {apt.department}
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground lg:table-cell">
                        {apt.reason}
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
  );
}

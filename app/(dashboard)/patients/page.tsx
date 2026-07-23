'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Phone,
  Calendar,
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
import { patientStatusConfig, formatDateShort } from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { Patient, PatientStatus } from '@/lib/types';

export default function PatientsPage() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  React.useEffect(() => {
    (async () => {
      const data = await dataService.getPatients();
      setPatients(data);
      setLoading(false);
    })();
  }, []);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Browse and manage your patient records"
      >
        <Button variant="outline" className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Add patient
        </Button>
      </PageHeader>

      <SectionCard
        title="Patient Directory"
        description={`${filtered.length} patients`}
        icon={Users}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
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
              <SelectItem value="all">All patients</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <LoadingSkeleton variant="table" count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients found"
            description="Try adjusting your search or add a new patient."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Patient
                  </TableHead>
                  <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground md:table-cell">
                    Age
                  </TableHead>
                  <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground md:table-cell">
                    Phone
                  </TableHead>
                  <TableHead className="hidden text-xs uppercase tracking-wider text-muted-foreground lg:table-cell">
                    Last Visit
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, i) => {
                  const cfg = patientStatusConfig[p.status];
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="cursor-pointer border-border transition-colors hover:bg-muted/40"
                    >
                      <TableCell>
                        <Link href={`/patients/${p.id}`} className="flex items-center gap-3">
                          <PatientAvatar
                            name={p.name}
                            avatarUrl={p.avatarUrl}
                            size="md"
                          />
                          <div>
                            <p className="text-sm font-medium hover:text-primary">
                              {p.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.email}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-sm md:table-cell">
                        {p.age} yrs
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {p.phone}
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDateShort(p.lastVisit)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={cfg.label}
                          variant={
                            p.status === 'critical'
                              ? 'destructive'
                              : p.status === 'active'
                              ? 'success'
                              : p.status === 'follow-up'
                              ? 'primary'
                              : 'accent'
                          }
                          dot
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/patients/${p.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ChevronRight className="h-4 w-4" />
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

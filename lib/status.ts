import type {
  AppointmentStatus,
  Priority,
  PatientStatus,
  NotificationType,
} from './types';

export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  });
}

export function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function relativeTime(isoStr: string) {
  const now = new Date();
  const then = new Date(isoStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.round(diffMs / 60000);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDateShort(isoStr);
}

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: 'Pending',
    dot: 'bg-warning',
    badge: 'bg-warning/10 text-warning border-warning/20',
  },
  confirmed: {
    label: 'Confirmed',
    dot: 'bg-primary',
    badge: 'bg-primary/10 text-primary border-primary/20',
  },
  completed: {
    label: 'Completed',
    dot: 'bg-success',
    badge: 'bg-success/10 text-success border-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-destructive',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const priorityConfig: Record<
  Priority,
  { label: string; badge: string }
> = {
  low: { label: 'Low', badge: 'bg-muted text-muted-foreground border-border' },
  medium: {
    label: 'Medium',
    badge: 'bg-primary/10 text-primary border-primary/20',
  },
  high: {
    label: 'High',
    badge: 'bg-warning/10 text-warning border-warning/20',
  },
  urgent: {
    label: 'Urgent',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const patientStatusConfig: Record<
  PatientStatus,
  { label: string; badge: string; dot: string }
> = {
  active: {
    label: 'Active',
    badge: 'bg-success/10 text-success border-success/20',
    dot: 'bg-success',
  },
  'follow-up': {
    label: 'Follow-up',
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  critical: {
    label: 'Critical',
    badge: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  new: {
    label: 'New',
    badge: 'bg-accent/10 text-accent border-accent/20',
    dot: 'bg-accent',
  },
};

export const notificationTypeConfig: Record<
  NotificationType,
  { label: string; icon: string; color: string }
> = {
  appointment_request: { label: 'Appointment Request', icon: 'CalendarPlus', color: 'text-primary' },
  cancellation: { label: 'Cancellation', icon: 'CalendarX', color: 'text-destructive' },
  emergency: { label: 'Emergency', icon: 'Siren', color: 'text-destructive' },
  system: { label: 'System', icon: 'Bell', color: 'text-muted-foreground' },
  summary_ready: { label: 'AI Summary', icon: 'Sparkles', color: 'text-accent' },
};

export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

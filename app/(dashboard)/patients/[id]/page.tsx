'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Droplet,
  AlertTriangle,
  Pill,
  History,
  Siren,
  Sparkles,
  MessageSquareText,
  FileText,
  Save,
  CalendarClock,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  patientStatusConfig,
  formatDateShort,
  formatDate,
} from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { Patient, AiSummary, DoctorNote } from '@/lib/types';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [summary, setSummary] = React.useState<AiSummary | null>(null);
  const [note, setNote] = React.useState<DoctorNote | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Doctor notes form state
  const [diagnosis, setDiagnosis] = React.useState('');
  const [clinicalNotes, setClinicalNotes] = React.useState('');
  const [treatmentPlan, setTreatmentPlan] = React.useState('');
  const [prescription, setPrescription] = React.useState('');
  const [followUpDate, setFollowUpDate] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const [p, s, n] = await Promise.all([
        dataService.getPatient(patientId),
        dataService.getAiSummaryForPatient(patientId),
        dataService.getDoctorNoteForPatient(patientId),
      ]);
      setPatient(p ?? null);
      setSummary(s ?? null);
      setNote(n ?? null);
      if (n) {
        setDiagnosis(n.diagnosis);
        setClinicalNotes(n.clinicalNotes);
        setTreatmentPlan(n.treatmentPlan);
        setPrescription(n.prescription);
        setFollowUpDate(n.followUpDate);
      }
      setLoading(false);
    })();
  }, [patientId]);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Firebase-ready: persist to Firestore collection "doctor_notes"
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 800);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <LoadingSkeleton variant="card" count={2} />
        <LoadingSkeleton variant="table" count={4} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold">Patient not found</p>
        <Link href="/patients">
          <Button variant="outline" className="mt-4 rounded-xl">
            Back to patients
          </Button>
        </Link>
      </div>
    );
  }

  const statusCfg = patientStatusConfig[patient.status];

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patients
      </Link>

      {/* Patient header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-[1.125rem] border bg-card p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <PatientAvatar
                name={patient.name}
                avatarUrl={patient.avatarUrl}
                size="xl"
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold tracking-tight">
                    {patient.name}
                  </h1>
                  <StatusBadge
                    label={statusCfg.label}
                    variant={
                      patient.status === 'critical'
                        ? 'destructive'
                        : patient.status === 'active'
                        ? 'success'
                        : patient.status === 'follow-up'
                        ? 'primary'
                        : 'accent'
                    }
                    dot
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{patient.age} years old</span>
                  <span>·</span>
                  <span>{patient.gender}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Droplet className="h-3.5 w-3.5" />
                    {patient.bloodType}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {patient.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {patient.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {patient.address}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {summary && (
                <Link href={`/conversations/${summary.conversationId}`}>
                  <Button variant="outline" className="rounded-xl">
                    <MessageSquareText className="mr-2 h-4 w-4" />
                    AI Conversation
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — Patient info */}
        <div className="space-y-6">
          {/* Appointment info */}
          <SectionCard
            title="Appointment Information"
            icon={CalendarClock}
            delay={0.05}
          >
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{patient.conditions[0] ? 'Cardiology' : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last visit</span>
                <span className="font-medium">{formatDateShort(patient.lastVisit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge label={statusCfg.label} variant="neutral" />
              </div>
            </div>
          </SectionCard>

          {/* Medical history */}
          <SectionCard
            title="Medical History"
            icon={History}
            delay={0.1}
          >
            <div className="space-y-4">
              {patient.medicalHistory.map((rec) => (
                <div key={rec.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateShort(rec.date)} · {rec.doctor}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Current medications */}
          <SectionCard
            title="Current Medications"
            icon={Pill}
            delay={0.15}
          >
            {patient.medications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active medications.
              </p>
            ) : (
              <div className="space-y-3">
                {patient.medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {med.dosage} · {med.frequency}
                      </p>
                    </div>
                    <StatusBadge
                      label={med.status === 'active' ? 'Active' : 'Stopped'}
                      variant={med.status === 'active' ? 'success' : 'neutral'}
                    />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Allergies */}
          <SectionCard
            title="Allergies"
            icon={ShieldAlert}
            delay={0.2}
          >
            {patient.allergies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No known allergies.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {a}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Emergency contact */}
          <SectionCard
            title="Emergency Contact"
            icon={Siren}
            delay={0.25}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">
                  {patient.emergencyContact.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Relationship</span>
                <span className="font-medium">
                  {patient.emergencyContact.relationship}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.emergencyContact.phone}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right column — AI summary + Doctor notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Summary card */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="relative overflow-hidden rounded-[1.125rem] border border-accent/20 bg-gradient-to-br from-accent/5 via-card to-primary/5 shadow-soft">
                {/* Glow accent */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-accent/10 px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
                        <Sparkles className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold">
                          AI Pre-Visit Summary
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Generated{' '}
                          {new Date(summary.generatedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1">
                        <span className="text-xs font-medium text-accent">
                          {summary.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-5 p-5">
                    {/* Chief complaint */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                          Chief Complaint
                        </h3>
                      </div>
                      <p className="rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">
                        {summary.chiefComplaint}
                      </p>
                    </div>

                    {/* Symptoms summary */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <h3 className="text-sm font-semibold">
                          Symptoms Summary
                        </h3>
                      </div>
                      <ul className="space-y-1.5">
                        {summary.symptomsSummary.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Medical history summary */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold">
                          Medical History Summary
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {summary.medicalHistorySummary}
                      </p>
                    </div>

                    {/* Risk flags */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <h3 className="text-sm font-semibold">Risk Flags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {summary.riskFlags.map((flag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing information */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-warning" />
                        <h3 className="text-sm font-semibold">
                          Missing Information
                        </h3>
                      </div>
                      <ul className="space-y-1.5">
                        {summary.missingInformation.map((m, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested follow-up questions */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        <h3 className="text-sm font-semibold">
                          Suggested Follow-up Questions
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {summary.suggestedFollowUpQuestions.map((q, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-accent/15 bg-accent/5 px-3 py-2 text-sm"
                          >
                            {q}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Original AI conversation button */}
                    <Link href={`/conversations/${summary.conversationId}`}>
                      <Button className="w-full rounded-xl" variant="outline">
                        <MessageSquareText className="mr-2 h-4 w-4" />
                        View Original AI Conversation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Doctor Notes */}
          <SectionCard
            title="Doctor Notes"
            description="Clinical documentation for this visit"
            icon={FileText}
            delay={0.2}
          >
            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Primary diagnosis"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicalNotes">Clinical Notes</Label>
                <Textarea
                  id="clinicalNotes"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Detailed clinical observations..."
                  className="min-h-[100px] rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Treatment approach and recommendations..."
                  className="min-h-[80px] rounded-lg"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prescription">Prescription</Label>
                  <Textarea
                    id="prescription"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="Medication, dosage, frequency..."
                    className="min-h-[80px] rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUp">Follow-up Date</Label>
                  <Input
                    id="followUp"
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="rounded-lg"
                  />
                  <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                    {followUpDate && (
                      <span>
                        Follow-up scheduled for{' '}
                        <strong className="text-foreground">
                          {formatDate(followUpDate)}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-sm font-medium text-success"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Notes saved successfully
                  </motion.span>
                )}
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Notes
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

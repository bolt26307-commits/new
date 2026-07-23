'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  ArrowRight,
  AlertTriangle,
  Clock,
  MessageSquareText,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { SectionCard } from '@/components/dashboard/section-card';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dataService } from '@/lib/data-service';
import type { AiSummary } from '@/lib/types';

export default function AiSummariesPage() {
  const [summaries, setSummaries] = React.useState<AiSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    (async () => {
      const data = await dataService.getAiSummaries();
      setSummaries(data);
      setLoading(false);
    })();
  }, []);

  const filtered = summaries.filter(
    (s) =>
      s.patientName.toLowerCase().includes(search.toLowerCase()) ||
      s.chiefComplaint.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Summaries"
        description="Pre-visit AI-generated patient summaries for your review"
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search summaries by patient or complaint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-xl pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <LoadingSkeleton variant="list" count={4} />
          <LoadingSkeleton variant="list" count={4} />
        </div>
      ) : filtered.length === 0 ? (
        <SectionCard>
          <EmptyState
            icon={Sparkles}
            title="No AI summaries found"
            description="AI summaries will appear here after patient intake conversations."
          />
        </SectionCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((summary, i) => (
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="relative overflow-hidden rounded-[1.125rem] border border-accent/20 bg-gradient-to-br from-accent/5 via-card to-primary/5 p-5 shadow-soft transition-shadow hover:shadow-soft-lg">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <PatientAvatar
                        name={summary.patientName}
                        size="md"
                      />
                      <div>
                        <h3 className="text-sm font-semibold">
                          {summary.patientName}
                        </h3>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(summary.generatedAt).toLocaleString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1">
                      <Sparkles className="h-3 w-3 text-accent" />
                      <span className="text-xs font-medium text-accent">
                        {summary.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Chief complaint */}
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {summary.chiefComplaint}
                  </p>

                  {/* Risk flags */}
                  {summary.riskFlags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {summary.riskFlags.slice(0, 2).map((flag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-md border border-destructive/20 bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {flag.length > 30
                            ? `${flag.slice(0, 30)}...`
                            : flag}
                        </span>
                      ))}
                      {summary.riskFlags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{summary.riskFlags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-accent/10 pt-4">
                    <Link href={`/patients/${summary.patientId}`}>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        View patient
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/conversations/${summary.conversationId}`}>
                      <Button variant="ghost" size="sm" className="rounded-lg text-accent">
                        <MessageSquareText className="mr-1 h-3.5 w-3.5" />
                        Conversation
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

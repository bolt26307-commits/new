'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Send,
  Calendar,
  MessageSquare,
  Clock,
  User,
  Bot,
} from 'lucide-react';
import { PatientAvatar } from '@/components/dashboard/patient-avatar';
import { LoadingSkeleton } from '@/components/dashboard/loading-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatTime, formatDate } from '@/lib/status';
import { dataService } from '@/lib/data-service';
import type { ChatMessage, Conversation } from '@/lib/types';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [conversation, setConversation] = React.useState<Conversation | null>(
    null
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    (async () => {
      const [conv, msgs] = await Promise.all([
        dataService.getConversation(conversationId),
        dataService.getChatMessages(conversationId),
      ]);
      setConversation(conv ?? null);
      setMessages(msgs);
      setLoading(false);
    })();
  }, [conversationId]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="text" count={3} />
        <div className="h-96">
          <LoadingSkeleton variant="list" count={5} />
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold">Conversation not found</p>
        <Link href="/ai-summaries">
          <Button variant="outline" className="mt-4 rounded-xl">
            Back to AI summaries
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/ai-summaries"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to AI summaries
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* Chat area */}
        <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-[1.125rem] border bg-card shadow-soft">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
                <Sparkles className="h-4.5 w-4.5 text-accent" style={{ width: '1.125rem', height: '1.125rem' }} />
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  AI Intake Conversation
                </h2>
                <p className="text-xs text-muted-foreground">
                  {conversation.patientName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {conversation.messageCount} messages
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
            {filteredMessages.map((msg, i) => {
              const isPatient = msg.sender === 'patient';
              const isAI = msg.sender === 'ai';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`flex gap-3 ${
                    isPatient ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isPatient && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] ${
                      isPatient
                        ? 'rounded-2xl rounded-tl-sm bg-muted p-3.5'
                        : 'rounded-2xl rounded-tr-sm bg-accent/10 p-3.5 ring-1 ring-accent/15'
                    }`}
                  >
                    {isAI && (
                      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-accent">
                        <Bot className="h-3 w-3" />
                        ClinicOS AI
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={`mt-1.5 text-[10px] text-muted-foreground ${
                        isPatient ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  {isAI && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Input bar (decorative — this is a read-only conversation) */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2 rounded-xl border bg-muted/30 p-1.5">
              <Input
                placeholder="This is a read-only conversation view"
                disabled
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <Button size="icon" disabled className="h-9 w-9 rounded-lg">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — conversation metadata */}
        <div className="space-y-4">
          <div className="rounded-[1.125rem] border bg-card p-5 shadow-soft">
            <h3 className="mb-4 text-sm font-semibold">Conversation Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <PatientAvatar
                  name={conversation.patientName}
                  size="sm"
                />
                <div>
                  <p className="font-medium">{conversation.patientName}</p>
                  <p className="text-xs text-muted-foreground">Patient</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Started
                </span>
                <span className="font-medium">
                  {formatDate(conversation.startedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Time
                </span>
                <span className="font-medium">
                  {formatTime(conversation.startedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Messages
                </span>
                <span className="font-medium">
                  {conversation.messageCount}
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="rounded-[1.125rem] border bg-card p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-semibold">Search Conversation</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-lg pl-9"
              />
            </div>
            {search && (
              <p className="mt-2 text-xs text-muted-foreground">
                {filteredMessages.length} matching messages
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-[1.125rem] border bg-card p-5 shadow-soft">
            <h3 className="mb-4 text-sm font-semibold">Timeline</h3>
            <div className="space-y-3">
              {messages.slice(0, 5).map((m, i) => (
                <div key={m.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        m.sender === 'patient' ? 'bg-primary' : 'bg-accent'
                      }`}
                    />
                    {i < 4 && (
                      <div className="h-full w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-medium">
                      {m.sender === 'patient' ? 'Patient' : 'AI'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(m.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

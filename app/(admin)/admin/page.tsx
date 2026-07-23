'use client';

import * as React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function AdminPage() {
  const { profile } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Console</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome{profile?.name ? `, ${profile.name}` : ''}. You are signed in
          as an administrator
          {profile?.clinicId ? ` for clinic ${profile.clinicId}` : ''}.
        </p>
      </div>
    </div>
  );
}

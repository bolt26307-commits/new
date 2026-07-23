'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AccessDenied } from '@/components/access-denied';

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Array<'doctor' | 'admin'>;
}) {
  const { isAuthenticated, profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    if (profile && !profile.isActive) {
      router.replace('/');
      return;
    }

    if (profile && allowedRoles && !allowedRoles.includes(profile.role as 'doctor' | 'admin')) {
      if (profile.role === 'admin') {
        router.replace('/admin');
      } else if (profile.role === 'doctor') {
        router.replace('/overview');
      } else {
        router.replace('/');
      }
    }
  }, [loading, isAuthenticated, profile, allowedRoles, router]);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !profile.isActive) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role as 'doctor' | 'admin')) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}

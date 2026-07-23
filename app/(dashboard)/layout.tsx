'use client';

import * as React from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TopNavbar } from '@/components/dashboard/top-navbar';
import { ProtectedRoute } from '@/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

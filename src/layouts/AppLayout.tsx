import React from 'react';

import { Toaster } from 'sonner';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        <main className="relative z-10 flex flex-1 flex-col gap-6 bg-transparent p-9">
          {children}
        </main>

        <Toaster position="bottom-right" />

        <div className="pointer-events-none absolute top-0 right-0 h-128 w-xl bg-linear-to-bl from-[#DE5C8E]/10 to-transparent blur-3xl" />
      </SidebarInset>
    </SidebarProvider>
  );
}

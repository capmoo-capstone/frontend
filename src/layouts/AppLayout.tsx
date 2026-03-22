import React from 'react';

import { Toaster } from 'sonner';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        <header className="bg-background relative z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {user && (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm">
                  {user.name} ({user.email})
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col gap-6 bg-transparent p-9">
          {children}
        </main>

        <Toaster position="bottom-right" />

        <div className="pointer-events-none absolute top-0 right-0 h-128 w-xl bg-linear-to-bl from-[#DE5C8E]/10 to-transparent blur-3xl" />
      </SidebarInset>
    </SidebarProvider>
  );
}

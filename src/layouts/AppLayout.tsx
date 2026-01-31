import React from 'react';

import { Toaster } from 'sonner';

import { MOCK_USERS_BY_ROLE } from '@/api/mock-data';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, switchUser } = useAuth();

  const handleRoleChange = (role: string) => {
    const newUser = MOCK_USERS_BY_ROLE[role];
    if (newUser) {
      switchUser(newUser);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        <header className="relative z-10 bg-background flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Dev Role Switcher - Development Only */}
            {import.meta.env.MODE === 'development' && (
              <div className="flex items-center gap-3">
                <Select value={user?.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="HEAD_OF_DEPARTMENT">Head of Department</SelectItem>
                    <SelectItem value="HEAD_OF_UNIT">Head of Unit</SelectItem>
                    <SelectItem value="REPRESENTATIVE">Representative</SelectItem>
                    <SelectItem value="DOCUMENT_STAFF">Document Staff</SelectItem>
                    <SelectItem value="FINANCE_STAFF">Finance Staff</SelectItem>
                    <SelectItem value="GENERAL_STAFF">General Staff</SelectItem>
                    <SelectItem value="GUEST">Guest</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground text-sm">
                  {user?.name} ({user?.email})
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col gap-4 bg-transparent p-4">
          {children}
        </main>

        <Toaster position="bottom-right" />

        <div className="pointer-events-none absolute top-0 right-0 h-128 w-xl bg-linear-to-bl from-[#DE5C8E]/10 to-transparent blur-3xl" />
      </SidebarInset>
    </SidebarProvider>
  );
}

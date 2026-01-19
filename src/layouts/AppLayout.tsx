// ai generated code file
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Toaster } from 'sonner';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Generate breadcrumb items from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getPageName = (segment: string) => {
    const nameMap: Record<string, string> = {
      app: 'Home',
      me: 'My Workspace',
      management: 'Management',
      dashboards: 'Dashboards',
      assign: 'Assign',
      vendors: 'Vendors',
      projects: 'Projects',
      admin: 'Administration',

      // Specific pages
      'my-dashboard': 'Dashboard',
      department: 'Department',
      overview: 'Overview',
      kpi: 'KPI',
      procurements: 'Procurements',
      contracts: 'Contracts',
      import: 'Import',
      submission: 'Submission',
      organization: 'Organization',
    };

    if (nameMap[segment]) return nameMap[segment];

    if (/^\d+$/.test(segment) || segment.length > 20) {
      return 'Details';
    }

    return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Always show Home as the first item */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/app/dashboards/department">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {pathnames.map((segment, index) => {
                  // Skip 'app' segment as we manually added "Home" above
                  if (segment === 'app') return null;

                  const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathnames.length - 1;
                  const pageName = getPageName(segment);

                  return (
                    <React.Fragment key={routeTo}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{pageName}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={routeTo}>{pageName}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        <Toaster position="bottom-right" />

        {/* Background Decorative Element */}
        <div className="pointer-events-none absolute top-0 right-0 z-0 h-96 w-96 bg-linear-to-bl from-[#DE5C8E]/5 to-transparent blur-3xl" />
      </SidebarInset>
    </SidebarProvider>
  );
}

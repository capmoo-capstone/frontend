import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { useLocation, Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Generate breadcrumb items from pathname
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route segments to readable names
  const getPageName = (segment: string) => {
    const nameMap: Record<string, string> = {
      app: 'Home',
      dashboard: 'Dashboard',
      tasks: 'Todo List',
      dispatch: 'Job Assignment',
      projects: 'Projects',
      import: 'Import Project',
      admin: 'Administration',
      users: 'User Management',
      groups: 'Internal Groups',
      units: 'Unit Mapping',
    };
    return (
      nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathnames.length > 0 && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link to="/app/dashboard">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathnames.map((segment, index) => {
                      // Skip 'app' segment as we use it for Home
                      if (segment === 'app') return null;

                      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                      const isLast = index === pathnames.length - 1;

                      return (
                        <React.Fragment key={routeTo}>
                          <BreadcrumbSeparator className="hidden md:block" />
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>
                                {getPageName(segment)}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={routeTo}>{getPageName(segment)}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      );
                    })}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

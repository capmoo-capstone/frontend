import {
  LayoutDashboard,
  FolderOpen,
  FileInput,
  Users,
  Building2,
  LogOut,
  Package,
  TrendingUp,
  ClipboardList,
  ShoppingCart,
  PieChart,
  UserCog, // Added for Employee Management
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export const sidebarGroups = [
  {
    groupLabel: 'My Workspace',
    items: [
      {
        title: 'My Dashboard',
        url: '/app/me/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'My KPI',
        url: '/app/me/kpi',
        icon: TrendingUp,
      },
    ],
  },

  {
    groupLabel: 'Work Queues',
    items: [
      {
        title: 'Procurement Jobs',
        url: '/app/dispatch/procurements',
        icon: ShoppingCart,
      },
      {
        title: 'Contract Jobs',
        url: '/app/dispatch/contracts',
        icon: ClipboardList,
      },
    ],
  },

  {
    groupLabel: 'Projects',
    items: [
      {
        title: 'All Projects',
        url: '/app/projects',
        icon: FolderOpen,
      },
      {
        title: 'Import Projects',
        url: '/app/projects/import',
        icon: FileInput,
      },
    ],
  },

  {
    groupLabel: 'Analytics',
    items: [
      {
        title: 'Department View',
        url: '/app/dashboards/department',
        icon: Building2,
      },
      {
        title: 'Overall Performance',
        url: '/app/dashboards/overview',
        icon: PieChart,
      },
    ],
  },

  {
    groupLabel: 'Management',
    items: [
      {
        title: 'Employee KPIs',
        url: '/app/management/employees/kpi',
        icon: UserCog,
      },
      {
        title: 'Organization',
        url: '/app/management/organization',
        icon: Users,
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 shrink-0" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h2 className="text-xl font-bold tracking-tight">Nexus Procure</h2>
            <p className="text-xs text-muted-foreground">
              Procurement Tracking
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.groupLabel}>
            <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      // Checks if the current path starts with the item URL
                      // We added specific check to avoid highlighting "All Projects" when inside "Import"
                      isActive={
                        item.url === '/app/projects'
                          ? location.pathname === '/app/projects'
                          : location.pathname.startsWith(item.url)
                      }
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/login">
                <LogOut />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

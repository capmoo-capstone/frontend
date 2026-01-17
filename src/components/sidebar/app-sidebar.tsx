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
  // Group 1: The "Home" Base - Where users start their day
  {
    groupLabel: 'Overview',
    items: [
      {
        title: 'My Dashboard',
        url: '/app/user/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Personal KPI',
        url: '/app/user/kpi',
        icon: TrendingUp,
      },
    ],
  },

  // Group 2: Action Center - The actual work queues
  {
    groupLabel: 'Work Queues',
    items: [
      {
        title: 'Procurement Jobs',
        url: '/app/dispatch/procurement',
        icon: ShoppingCart,
      },
      {
        title: 'Contract Jobs',
        url: '/app/dispatch/contract',
        icon: ClipboardList,
      },
    ],
  },

  // Group 3: Data Repository - Searching and Creating
  {
    groupLabel: 'Project Management',
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

  // Group 4: Analytics - For Heads/Managers (Separated from personal dashboard)
  {
    groupLabel: 'Analytics',
    items: [
      {
        title: 'Department View',
        url: '/app/dashboard/department',
        icon: Building2,
      },
      {
        title: 'Overall Performance',
        url: '/app/dashboard/overall',
        icon: PieChart,
      },
    ],
  },

  // Group 5: Settings
  {
    groupLabel: 'Administration',
    items: [
      {
        title: 'Organization',
        url: '/app/admin/organization',
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
                      isActive={location.pathname.startsWith(item.url)}
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
                {' '}
                {/* Or your logout logic */}
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

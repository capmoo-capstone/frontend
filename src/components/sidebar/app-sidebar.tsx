import {
  LayoutDashboard,
  ListTodo,
  UserCog,
  FolderOpen,
  FileInput,
  Users,
  Building2,
  LogOut,
  Package,
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

// 1. Operation Group (Daily Tasks)
const operationItems = [
  {
    title: 'Todo List',
    url: '/app/tasks',
    icon: ListTodo,
  },
  {
    title: 'Job Assignment',
    url: '/app/dispatch',
    icon: UserCog,
  },
];

// 2. Monitoring Group
const monitoringItems = [
  {
    title: 'Dashboard & KPI',
    url: '/app/dashboard',
    icon: LayoutDashboard,
  },
];

// 3. Project Management Group
const projectItems = [
  {
    title: 'All Projects',
    url: '/app/projects',
    icon: FolderOpen,
  },
];

// 4. Admin Group
const adminItems = [
  {
    title: 'Internal Groups',
    url: '/app/admin/groups',
    icon: Users,
  },
  {
    title: 'Unit Mapping',
    url: '/app/admin/units',
    icon: Building2,
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
        {/* Group 1: Operation */}
        <SidebarGroup>
          <SidebarGroupLabel>Operation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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

        {/* Group 2: Monitoring */}
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {monitoringItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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

        {/* Group 3: Projects */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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

        {/* Group 4: Administration */}
        <SidebarGroup>
          <SidebarGroupLabel>System Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
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

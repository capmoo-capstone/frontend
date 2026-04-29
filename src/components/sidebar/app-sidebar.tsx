import { Link, useLocation } from 'react-router-dom';

import {
  ArrowLeftToLine,
  Building2,
  ChartPie,
  HandCoins,
  Home,
  Import,
  ListTodo,
  LogOut,
  MoreVertical,
  Star,
  Table2,
  Truck,
  UserCog,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar-context';
import { useAuth } from '@/context/useAuth';
import { useLogout } from '@/features/auth';
import { type Role, type User } from '@/features/auth';
import { isProductionApp } from '@/lib/environment';
import { hasAnyRole } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  allowedRoles?: Role[];
  hideInProduction?: boolean;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
  allowedRoles?: Role[];
};

const menuGroups: MenuGroup[] = [
  {
    label: 'ภาพรวมการทำงาน',
    items: [
      {
        title: 'แดชบอร์ด',
        url: '/app/dashboards/overview',
        icon: ChartPie,
        hideInProduction: true,
      },
      {
        title: 'รายงานรายบุคคล',
        url: '/app/management/employees/kpi',
        icon: ChartPie,
        hideInProduction: true,
      },
      {
        title: 'โครงการทั้งหมด',
        url: '/app/projects',
        icon: Table2,
      },
    ],
  },
  {
    label: 'โต๊ะทำงาน',
    allowedRoles: [
      'GENERAL_STAFF',
      'DOCUMENT_STAFF',
      'FINANCE_STAFF',
      'HEAD_OF_UNIT',
      'HEAD_OF_DEPARTMENT',
      'ADMIN',
      'SUPER_ADMIN',
    ],
    items: [
      {
        title: 'แดชบอร์ดของฉัน',
        url: '/app/me/dashboard',
        icon: ListTodo,
      },
      {
        title: 'นำเข้าโครงการ',
        url: '/app/project-import',
        icon: Import,
        allowedRoles: ['DOCUMENT_STAFF', 'SUPER_ADMIN'],
      },
      {
        title: 'นำเข้าแผนงบประมาณ',
        url: '/app/budget-import',
        icon: Import,
        allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
      },
      {
        title: 'การตอบกลับจากคู่ค้า',
        url: '/app/vendor-response',
        icon: Truck,
        allowedRoles: ['FINANCE_STAFF', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
  {
    label: 'มอบหมายการทำงาน',
    allowedRoles: ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT', 'SUPER_ADMIN', 'GENERAL_STAFF'],
    items: [
      {
        title: 'มอบหมายงาน',
        url: '/app/assign',
        icon: UserCog,
      },
    ],
  },
  {
    label: 'ส่งออกไปยังฝ่ายอื่น',
    allowedRoles: ['DOCUMENT_STAFF', 'FINANCE_STAFF', 'ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        title: 'การเงิน',
        url: '/app/exports/finance',
        icon: HandCoins,
      },
    ],
  },
  {
    label: 'ตั้งค่าระบบ',
    allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        title: 'ตั้งค่ากลุ่มงาน',
        url: '/app/settings/work-groups',
        icon: Users,
      },
      {
        title: 'ตั้งค่าตัวแทนหน่วยงาน',
        url: '/app/settings/department-reps',
        icon: Building2,
      },
      {
        title: 'ตั้งค่าเจ้าหน้าที่พัสดุ',
        url: '/app/settings/procurement-staff',
        icon: UserCog,
      },
    ],
  },
];

const canAccessMenuItem = (item: MenuItem, user?: User | null): boolean => {
  if (!item.allowedRoles) return true;
  return hasAnyRole(user, item.allowedRoles);
};

const canAccessGroup = (group: MenuGroup, user?: User | null): boolean => {
  if (!group.allowedRoles) return true;
  return hasAnyRole(user, group.allowedRoles);
};

const getFilteredGroups = (groups: MenuGroup[], user?: User | null): MenuGroup[] => {
  return groups
    .filter((group) => canAccessGroup(group, user))
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => canAccessMenuItem(item, user) && (!isProductionApp || !item.hideInProduction)
      ),
    }))
    .filter((group) => group.items.length > 0);
};

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const { toggleSidebar, state } = useSidebar();

  const isHomeActive = location.pathname === '/app/home';
  const filteredGroups = getFilteredGroups(menuGroups, user);

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-gray-50/50">
      {/* Header */}
      <SidebarHeader className="pt-6 pb-2 pl-4 transition-all group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-2">
        <div className="flex w-full items-center gap-2 text-pink-600 transition-all duration-300 group-data-[collapsible=icon]:justify-center">
          <Star className="h-5 w-5 shrink-0 fill-current" />
          <span className="h4-topic truncate group-data-[collapsible=icon]:hidden">
            NexusProcure
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0">
        {!isProductionApp && (
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isHomeActive}
                  tooltip="หน้าหลัก"
                  className={`text-primary normal hover:text-brand-9 transition-colors ${isHomeActive ? 'font-medium' : ''} `}
                >
                  <Link to="/app/home">
                    <Home className={isHomeActive ? 'text-pink-600' : 'text-gray-500'} />
                    <span>หน้าหลัก</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* --- Menu Groups --- */}
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="caption text-muted-foreground px-2 group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={`text-primary normal hover:text-brand-9 transition-colors ${isActive ? 'font-medium' : ''} `}
                      >
                        <Link to={item.url}>
                          <item.icon className={isActive ? 'text-brand-9' : 'text-brand-9/70'} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-linear-to-b from-transparent to-pink-50/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 p-2 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-9 w-9 shrink-0 rounded-md border-2 border-white shadow-sm">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.username || 'user'}`} />
                  <AvatarFallback className="rounded-md bg-pink-100 text-pink-700">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="caption text-primary truncate font-medium">
                    {user?.name || 'Guest User'}
                  </span>
                  <span className="caption text-muted-foreground truncate">
                    {user?.username || 'ID: N/A'}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'ghost'}
                    size="icon"
                    className="group-data-[collapsible=icon]:hidden"
                  >
                    <MoreVertical className="text-muted-foreground h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => logout()}
                    disabled={isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isPending ? 'Signing out...' : 'ออกจากระบบ'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarMenuItem>

          {/* Collapse Button */}
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip="ย่อ/ขยาย เมนู"
              className="text-muted-foreground hover:text-primary hover:bg-gray-100"
            >
              <div className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <ArrowLeftToLine
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    state === 'collapsed' && 'rotate-180'
                  )}
                />
                <span className="normal group-data-[collapsible=icon]:hidden">ยุบหน้าต่างเมนู</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

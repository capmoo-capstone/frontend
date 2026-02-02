import { Link, useLocation } from 'react-router-dom';

import {
  ArrowLeftToLine,
  ChartPie,
  FileSignature,
  FileText,
  HandCoins,
  Home,
  Import,
  ListTodo,
  LogOut,
  MoreVertical,
  Package,
  Settings,
  Star,
  Table2,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useAuth';
import { type Role } from '@/types/auth';

import { Button } from '../ui/button';

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  allowedRoles?: Role[];
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
        url: '/app/projects/import',
        icon: Import,
      },
      {
        title: 'การตอบกลับจากคู่ค้า',
        url: '/app/vendor-response',
        icon: Truck,
      },
    ],
  },
  {
    label: 'มอบหมายการทำงาน',
    allowedRoles: [
      'HEAD_OF_UNIT',
      'HEAD_OF_DEPARTMENT',
      'ADMIN',
      'SUPER_ADMIN',
      'GENERAL_STAFF',
      'DOCUMENT_STAFF',
      'FINANCE_STAFF',
    ],
    items: [
      {
        title: 'งานจัดซื้อ',
        url: '/app/assign/procurements',
        icon: Package,
      },
      {
        title: 'งานบริหารสัญญา',
        url: '/app/assign/contracts',
        icon: FileSignature,
      },
    ],
  },
  {
    label: 'ส่งออกไปยังฝ่ายอื่น',
    allowedRoles: ['DOCUMENT_STAFF', 'FINANCE_STAFF', 'ADMIN', 'SUPER_ADMIN'],
    items: [
      {
        title: 'ทะเบียน',
        url: '/app/exports/registry',
        icon: FileText,
      },
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
        title: 'ตั้งค่าระบบ',
        url: '/app/settings',
        icon: Settings,
      },
    ],
  },
];

const canAccessMenuItem = (item: MenuItem, userRole?: Role): boolean => {
  if (!item.allowedRoles) return true;
  if (!userRole) return false;
  return item.allowedRoles.includes(userRole);
};

const canAccessGroup = (group: MenuGroup, userRole?: Role): boolean => {
  if (!group.allowedRoles) return true;
  if (!userRole) return false;
  return group.allowedRoles.includes(userRole);
};

const getFilteredGroups = (groups: MenuGroup[], userRole?: Role): MenuGroup[] => {
  return groups
    .filter((group) => canAccessGroup(group, userRole))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessMenuItem(item, userRole)),
    }))
    .filter((group) => group.items.length > 0);
};

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const { toggleSidebar } = useSidebar();

  const isHomeActive = location.pathname === '/app/home';
  const filteredGroups = getFilteredGroups(menuGroups, user?.role);

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-gray-50/50">
      {/* --- Header: Logo --- */}
      <SidebarHeader className="pt-6 pb-2 pl-4">
        <div className="flex items-center gap-2 text-pink-600 transition-all duration-300 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0">
          <Star className="h-5 w-5 fill-current" />
          <span className="text-h4-topic group-data-[collapsible=icon]:hidden">NexusProcure</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        {/* --- Home Button --- */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isHomeActive}
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

        {/* --- Menu Groups --- */}
        {filteredGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="caption text-muted-foreground px-2">
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

      {/* --- Footer: User Profile & Collapse --- */}
      <SidebarFooter className="bg-linear-to-b from-transparent to-pink-50/50 pb-4">
        <SidebarMenu>
          {/* User Profile Item */}
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 p-2 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-md border-2 border-white shadow-sm">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.username || 'user'}`} />
                  <AvatarFallback className="rounded-md bg-pink-100 text-pink-700">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="caption text-primary truncate">
                    {user?.name || 'Guest User'}
                  </span>
                  <span className="caption text-muted-foreground truncate">
                    {user?.username || 'ID: N/A'}
                  </span>
                </div>
              </div>

              {/* Dropdown for Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={'ghost'}>
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => logout()}
                    disabled={isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
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
              className="text-muted-foreground hover:text-primary hover:bg-gray-100"
            >
              <div className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <ArrowLeftToLine className={`h-4 w-4 transition-transform`} />
                <span className="normal group-data-[collapsible=icon]:hidden">ยุบหน้าต่างเมนู</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

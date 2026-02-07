import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical, UserRoundPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getResponsibleTypeFormat } from '@/lib/responsible-type-format';
import { ManageSelfRoles, ManageUnitRoles } from '@/lib/role-permissions';
import { cn } from '@/lib/utils';
import type { Role, User } from '@/types/auth';
import { type Project } from '@/types/project';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface SharedColumnsProps {
  onAddAssignee: (project: Project) => void;
  viewAsRole: Role;
}

export const baseColumns = ({
  onAddAssignee,
  viewAsRole,
}: SharedColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'receive_no',
    header: 'เลขที่ลงรับ',
    cell: ({ row }) => <div className="normal">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
    header: 'โครงการ',
    cell: ({ row }) => {
      const isUrgent = row.original.urgent_status === 'URGENT';
      const isVeryUrgent = row.original.urgent_status === 'VERY_URGENT';
      return (
        <div className="flex items-center gap-2">
          {isUrgent && <span className="font-bold whitespace-nowrap text-red-500">ด่วน</span>}
          {isVeryUrgent && (
            <span className="font-bold whitespace-nowrap text-red-700">ด่วนพิเศษ</span>
          )}
          <span className="normal">{row.getValue('title')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'responsible_users',
    header: 'ผู้รับผิดชอบ',
    cell: ({ row }) => {
      const procurementUsers = (row.original.assignee_procurement ?? []) as User[];
      const contractUsers = (row.original.assignee_contract ?? []) as User[];

      const allUsers = [...procurementUsers, ...contractUsers];

      return (
        <div className="flex flex-col gap-1 text-sm">
          {allUsers.length > 0 ? (
            allUsers.map((u) => {
              return (
                <div key={u.id} className="normal whitespace-nowrap">
                  {u.name}
                </div>
              );
            })
          ) : (
            <span className="normal">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'ประเภทงาน',
    cell: ({ row }) => {
      const config = getResponsibleTypeFormat(row.original.procurement_type);
      return <div className="normal">{config.label}</div>;
    },
  },
  {
    accessorKey: 'procure_status',
    header: 'ซื้อ/จ้าง',
    cell: ({ row }) => {
      const status = row.original.workflow_status.p;

      return <StatusBadge status={status} />;
    },
  },
  {
    accessorKey: 'contract_status',
    header: 'บริหารสัญญา',
    cell: ({ row }) => {
      const status = row.original.workflow_status.c;
      return <StatusBadge status={status} />;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      const canEdit = project.status === 'WAITING_ACCEPT';

      if (row.original.status === 'CANCELLED') {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(ManageUnitRoles.includes(viewAsRole) || ManageSelfRoles.includes(viewAsRole)) && (
              <DropdownMenuItem onClick={() => onAddAssignee(project)} disabled={!canEdit}>
                <UserRoundPlus className="h-4 w-4" />
                เพิ่มผู้รับผิดชอบ
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Helper Component สำหรับ Badge สถานะ
function StatusBadge({ status }: { status: string }) {
  if (!status || status === '-') return <span className="text-slate-400">-</span>;

  const config: Record<string, string> = {
    ยังไม่ได้มอบหมาย: 'bg-slate-100 text-slate-700 border-none',
    'ขั้นตอนที่ 2': 'bg-amber-50 text-amber-700 border-amber-200',
    เสร็จสิ้น: 'bg-teal-50 text-teal-700 border-teal-200',
    ยกเลิก: 'bg-red-50 text-red-700 border-red-200',
    การเงินส่งคืนแก้ไข: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <Badge variant="outline" className={cn('rounded-full px-3 py-0.5 font-normal', config[status])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

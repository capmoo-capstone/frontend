import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical, Trash2, UserCog } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateThaiShort } from '@/lib/date-utils';
import { getResponsibleTypeFormat } from '@/lib/responsible-type-format';
import {
  ManageSelfRoles,
  ManageUnitRoles,
  SupervisorRoles,
  ViewUnitRoles,
} from '@/lib/role-permissions';
import type { Role } from '@/types/auth';
import { type AssignedProjectItem } from '@/types/project';

interface GetColumnsProps {
  onCancelProject: (project: AssignedProjectItem) => void;
  onChangeAssignee: (project: AssignedProjectItem) => void;
  onAcceptProject: (project: AssignedProjectItem) => void;
  viewAsRole: Role;
}

export const getColumns = ({
  onCancelProject,
  onChangeAssignee,
  onAcceptProject,
  viewAsRole,
}: GetColumnsProps): ColumnDef<AssignedProjectItem>[] => [
  {
    accessorKey: 'receive_no',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        เลขที่ลงรับ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        โครงการ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.is_urgent && (
          <span className="text-destructive mr-2 font-semibold">ด่วน</span>
        )}
        {row.getValue('title')}
      </div>
    ),
  },
  {
    id: 'procurement_type',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ประเภทงาน
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => <div>{getResponsibleTypeFormat(row.original.procurement_type)}</div>,
    accessorFn: (row) => row.procurement_type,
  },
  {
    id: 'expected_approval_date',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        กำหนดส่งงาน
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div>
        {row.original.expected_approval_date
          ? formatDateThaiShort(row.original.expected_approval_date)
          : '-'}
      </div>
    ),
    accessorFn: (row) => row.expected_approval_date,
  },
  {
    id: 'request_unit',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        หน่วยงาน
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => <div>{row.original.request_unit.department.name}</div>,
    accessorFn: (row) => row.request_unit.department.name,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        สถานะ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'secondary' | 'destructive' | 'warning' | 'info' = 'secondary';
      let label = status;

      if (status === 'UNASSIGNED') {
        variant = 'secondary';
        label = 'ยังไม่ได้มอบหมาย';
      } else if (status === 'WAITING_ACCEPT') {
        variant = 'warning';
        label = 'รอการตอบรับ';
      } else if (status === 'IN_PROGRESS') {
        variant = 'info';
        label = 'มอบหมายแล้ว';
      } else if (status === 'CANCELLED') {
        variant = 'destructive';
        label = 'ยกเลิก';
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: 'assignee',
    header: 'มอบหมายให้',
    cell: ({ row }) => {
      return SupervisorRoles.includes(viewAsRole) ||
        ManageUnitRoles.includes(viewAsRole) ||
        ViewUnitRoles.includes(viewAsRole) ? (
        <div>{row.original.assignee_full_name ?? '-'}</div>
      ) : ManageSelfRoles.includes(viewAsRole) && row.original.status === 'WAITING_ACCEPT' ? (
        <Button variant="outline" size="sm" onClick={() => onAcceptProject(row.original)}>
          รับทราบ
        </Button>
      ) : null;
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
            {ManageUnitRoles.includes(viewAsRole) && (
              <DropdownMenuItem onClick={() => onChangeAssignee(project)} disabled={!canEdit}>
                <UserCog className="h-4 w-4" />
                เปลี่ยนผู้รับผิดชอบ
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onCancelProject(project)} variant="destructive">
              <Trash2 className="text-destructive h-4 w-4" />
              {ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole)
                ? 'ยกเลิกโครงการ'
                : 'ขอยกเลิกโครงการ'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

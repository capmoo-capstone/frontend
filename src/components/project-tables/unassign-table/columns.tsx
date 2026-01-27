import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical, Trash2 } from 'lucide-react';

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
import { ManageSelfRoles, ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';
import { type Role } from '@/types/auth';
import { type UnassignedProjectItem } from '@/types/project';

import { AssigneeCell } from './assignee-cell';

interface GetColumnsProps {
  pendingChanges: Record<string, string>;
  setPendingChanges: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  unitId?: string;
  onOpenCancelDialog: (project: UnassignedProjectItem) => void;
  onClaimProject: (project: UnassignedProjectItem) => void;
  viewAsRole: Role;
}

export const getColumns = ({
  pendingChanges,
  setPendingChanges,
  unitId,
  onOpenCancelDialog,
  onClaimProject,
  viewAsRole,
}: GetColumnsProps): ColumnDef<UnassignedProjectItem>[] => [
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
    header: 'สถานะ',
    cell: ({}) => {
      return <Badge variant={'secondary'}>{'รอการมอบหมาย'}</Badge>;
    },
  },
  {
    id: 'assignee',
    header: ManageUnitRoles.includes(viewAsRole) ? 'มอบหมายให้' : undefined,
    cell: ({ row }) => {
      return ManageUnitRoles.includes(viewAsRole) ? (
        <AssigneeCell
          rowId={row.original.id}
          originalValue={null}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          unitId={unitId}
        />
      ) : ManageSelfRoles.includes(viewAsRole) ? (
        <Button variant="outline" size="sm" onClick={() => onClaimProject(row.original)}>
          เลือกงาน
        </Button>
      ) : null;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpenCancelDialog(project)} variant="destructive">
              <Trash2 className="h-4 w-4" />
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

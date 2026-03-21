import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical, UserRoundPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Role, User } from '@/features/auth';
import { getProjectStatusFormat, getResponsibleTypeFormat } from '@/lib/formatters';
import { ManageSelfRoles, ManageUnitRoles } from '@/lib/permissions';

import type { Project } from '../../types';

interface SharedColumnsProps {
  onAddAssignee: (project: Project) => void;
  viewAsRole: Role;
  user?: User;
}

export const baseColumns = ({
  onAddAssignee,
  viewAsRole,
  user,
}: SharedColumnsProps): ColumnDef<Project>[] => [
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
    cell: ({ row }) => <div className="normal">{row.getValue('receive_no')}</div>,
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
        {row.original.urgent_status === 'URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วน</span>
        )}
        {row.original.urgent_status === 'VERY_URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วนพิเศษ</span>
        )}
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'responsible_users',
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.assignee_procurement?.[0]?.full_name ?? '';
      const nameB = rowB.original.assignee_procurement?.[0]?.full_name ?? '';
      return nameA.localeCompare(nameB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ผู้รับผิดชอบ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
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
    sortingFn: (rowA, rowB) => {
      const labelA = getResponsibleTypeFormat(rowA.original.procurement_type).label;
      const labelB = getResponsibleTypeFormat(rowB.original.procurement_type).label;
      return labelA.localeCompare(labelB, 'th');
    },
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
    cell: ({ row }) => {
      const config = getResponsibleTypeFormat(row.original.procurement_type);
      return <div className="normal">{config.label}</div>;
    },
  },
  {
    accessorKey: 'procure_status',
    sortingFn: (rowA, rowB) => {
      const labelA = getProjectStatusFormat(
        rowA.original.status,
        rowA.original.workflow_status.p,
        user?.department?.name
      ).label;
      const labelB = getProjectStatusFormat(
        rowB.original.status,
        rowB.original.workflow_status.p,
        user?.department?.name
      ).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ซื้อ/จ้าง
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const { variant, label } = getProjectStatusFormat(
        row.original.status,
        row.original.workflow_status.p,
        user?.department?.name
      );
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
  {
    accessorKey: 'contract_status',
    sortingFn: (rowA, rowB) => {
      const labelA = getProjectStatusFormat(
        rowA.original.status,
        rowA.original.workflow_status.c,
        user?.department?.name,
        rowA.original.workflow_status.p
      ).label;
      const labelB = getProjectStatusFormat(
        rowB.original.status,
        rowB.original.workflow_status.c,
        user?.department?.name,
        rowB.original.workflow_status.p
      ).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        บริหารสัญญา
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const { variant, label } = getProjectStatusFormat(
        row.original.status,
        row.original.workflow_status.c,
        user?.department?.name,
        row.original.workflow_status.p
      );
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;
      const canEdit =
        project.status === 'IN_PROGRESS' ||
        project.status === 'UNASSIGNED' ||
        project.status === 'WAITING_ACCEPT';

      if (row.original.status === 'CANCELLED') {
        return null;
      }

      return (
        canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="normal h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(ManageUnitRoles.includes(viewAsRole) || ManageSelfRoles.includes(viewAsRole)) && (
                <DropdownMenuItem
                  onClick={() => onAddAssignee(project)}
                  className="normal text-foreground"
                >
                  <UserRoundPlus className="normal h-4 w-4" />
                  เพิ่มผู้รับผิดชอบ
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      );
    },
  },
];

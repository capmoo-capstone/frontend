import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Role } from '@/features/auth';
import { formatDateThaiShort, getResponsibleTypeFormat } from '@/lib/formatters';
import { ManageSelfRoles, ManageUnitRoles } from '@/lib/permissions';

import type { UnassignedProjectItem } from '../../../types/index';
import { getCancelProjectActionLabel } from '../../../utils/project-selectors';
import { renderSortableHeader, renderUrgentText } from '../column-helpers';
import { AssigneeCell } from './AssigneeCell';

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
    header: ({ column }) => renderSortableHeader(column, 'เลขที่ลงรับ'),
    cell: ({ row }) => <div className="font-medium">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => renderSortableHeader(column, 'โครงการ'),
    cell: ({ row }) => (
      <div>
        {renderUrgentText(row.original.urgent_status)}
        {row.getValue('title')}
      </div>
    ),
  },
  {
    id: 'procurement_type',
    header: ({ column }) => renderSortableHeader(column, 'วิธีการจัดหา'),
    cell: ({ row }) => <div>{getResponsibleTypeFormat(row.original.procurement_type).label}</div>,
    accessorFn: (row) => row.procurement_type,
  },
  {
    id: 'expected_approval_date',
    header: ({ column }) => renderSortableHeader(column, 'กำหนดส่งงาน'),
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
    header: ({ column }) => renderSortableHeader(column, 'หน่วยงาน'),
    cell: ({ row }) => <div>{row.original.request_unit.department.name}</div>,
    accessorFn: (row) => row.request_unit.department.name,
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: () => {
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
              <Trash2 className="text-destructive h-4 w-4" />
              {getCancelProjectActionLabel(viewAsRole)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

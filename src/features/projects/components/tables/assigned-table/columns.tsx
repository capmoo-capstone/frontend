import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Trash2, UserCog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateThaiShort, getResponsibleTypeFormat } from '@/lib/formatters';

import type { AssignedProjectItem } from '../../../types/index';
import { getCancelProjectActionLabel } from '../../../utils/project-selectors';
import {
  renderAssignedStatusBadge,
  renderSortableHeader,
  renderUrgentText,
} from '../column-helpers';

interface GetColumnsProps {
  unitId?: string;
  onCancelProject: (project: AssignedProjectItem) => void;
  onChangeAssignee: (project: AssignedProjectItem) => void;
  onAcceptProject: (project: AssignedProjectItem) => void;
  isAcceptPending: boolean;
  canClaimProjects: boolean;
  canChangeProjectAssignee: boolean;
}

export const getColumns = ({
  unitId,
  onCancelProject,
  onChangeAssignee,
  onAcceptProject,
  isAcceptPending,
  canClaimProjects,
  canChangeProjectAssignee,
}: GetColumnsProps): ColumnDef<AssignedProjectItem>[] => [
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
    header: ({ column }) => renderSortableHeader(column, 'สถานะ'),
    cell: ({ row }) =>
      renderAssignedStatusBadge(row.getValue('status') as AssignedProjectItem['status']),
  },
  {
    id: 'assignee',
    header: canClaimProjects ? undefined : 'มอบหมายให้',
    cell: ({ row }) => {
      return canClaimProjects ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAcceptProject(row.original)}
          disabled={isAcceptPending}
        >
          รับทราบ
        </Button>
      ) : (
        <div>{row.original.assignee_full_name ?? '-'}</div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      const canEdit = project.status === 'WAITING_ACCEPT';

      if (row.original.status === 'CANCELLED' || row.original.status === 'WAITING_CANCEL') {
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
            {canChangeProjectAssignee && (
              <DropdownMenuItem onClick={() => onChangeAssignee(project)} disabled={!canEdit}>
                <UserCog className="h-4 w-4" />
                เปลี่ยนผู้รับผิดชอบ
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onCancelProject(project)} variant="destructive">
              <Trash2 className="text-destructive h-4 w-4" />
              {getCancelProjectActionLabel(unitId)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

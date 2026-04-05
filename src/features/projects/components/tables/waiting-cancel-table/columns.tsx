import { type ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Role } from '@/features/auth';
import { formatDateThaiShort, getResponsibleTypeFormat } from '@/lib/formatters';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/permissions';

import type { WaitingCancelProjectItem } from '../../../types/index';
import {
  renderAssignedStatusBadge,
  renderSortableHeader,
  renderUrgentText,
} from '../column-helpers';

interface GetColumnsProps {
  onApproveCancellation: (projectId: string, projectTitle: string) => void;
  onRejectCancellation: (projectId: string, projectTitle: string) => void;
  viewAsRole: Role;
}

export const getColumns = ({
  onApproveCancellation,
  onRejectCancellation,
  viewAsRole,
}: GetColumnsProps): ColumnDef<WaitingCancelProjectItem>[] => [
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
    id: 'assignee',
    header: 'มอบหมายให้',
    cell: ({ row }) => <div>{row.original.assignee_full_name ?? '-'}</div>,
  },
  {
    id: 'cancel_reason',
    header: 'เหตุผล',
    cell: ({ row }) => <div className="text-sm">{row.original.cancel_reason ?? '-'}</div>,
  },
  {
    id: 'actions',
    header: 'การดำเนินการ',
    cell: ({ row }) => {
      const canManage =
        ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole);

      if (!canManage) return null;

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApproveCancellation(row.original.id, row.original.title)}
            className="text-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            อนุมัติ
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRejectCancellation(row.original.id, row.original.title)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            ปฏิเสธ
          </Button>
        </div>
      );
    },
  },
];

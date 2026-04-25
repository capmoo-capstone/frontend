import { type ColumnDef } from '@tanstack/react-table';
import { Check, MoreVertical, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateThaiShort } from '@/lib/date-formatters';

import { getResponsibleTypeFormat } from '../../../utils/projectFormatters';

import type { WaitingCancelProjectItem } from '../../../types/index';
import { renderSortableHeader, renderUrgentText } from '../column-helpers';

interface GetColumnsProps {
  onApproveCancellation: (projectId: string, projectTitle: string) => void;
  onRejectCancellation: (projectId: string, projectTitle: string) => void;
  canCancelProjects: boolean;
}

export const getColumns = ({
  onApproveCancellation,
  onRejectCancellation,
  canCancelProjects,
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
    header: 'ผู้ส่งคำขออนุมัติ',
    cell: ({ row }) => <div>{row.original.requester_full_name ?? '-'}</div>,
  },
  {
    id: 'cancel_reason',
    header: () => <div className="text-error">เหตุผล</div>,
    cell: ({ row }) => <div className="text-error">{row.original.cancel_reason ?? '-'}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      if (!canCancelProjects) {
        return null;
      }

      return (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onApproveCancellation(row.original.id, row.original.title)}
              >
                <Check className="h-4 w-4" />
                อนุมัติคำขอยกเลิก
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onRejectCancellation(row.original.id, row.original.title)}
              >
                <XIcon className="h-4 w-4" />
                ปฏิเสธคำขอยกเลิก
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

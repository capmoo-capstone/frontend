import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Edit, MoreVertical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getResponsibleTypeFormat } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import type { FinanceExportItem } from '../types';

interface FinanceColumnsConfig {
  onRequestEdit?: (item: FinanceExportItem) => void;
  onMarkComplete?: (item: FinanceExportItem) => void;
}

// Status Badge using Badge component
const FinanceStatusBadge = ({ status }: { status: FinanceExportItem['export_status'] }) => {
  const config = {
    NOT_EXPORTED: {
      label: 'ยังไม่ได้ส่งออก',
      variant: 'secondary' as const,
    },
    EXPORTED: {
      label: 'ส่งออกแล้ว',
      variant: 'info' as const,
    },
    CLOSED: {
      label: 'ปิดโครงการ',
      variant: 'success' as const,
    },
    WAITING_EDIT: {
      label: 'รอการแก้ไข',
      variant: 'destructive' as const,
    },
  };

  const current = config[status];

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export const getFinanceColumns = (
  config?: FinanceColumnsConfig
): ColumnDef<FinanceExportItem>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-2"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'receive_no',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        เลขที่ลงรับ
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => <div className="normal">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'project_title',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        โครงการ
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.is_urgent && (
          <span className="text-destructive font-['Noto_Sans_Thai'] font-semibold">ด่วน</span>
        )}
        <span className="normal max-w-75 truncate" title={row.getValue('project_title')}>
          {row.getValue('project_title')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'responsible_person',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ผู้รับผิดชอบ
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => <div className="normal">{row.getValue('responsible_person')}</div>,
  },
  {
    accessorKey: 'procurement_type',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ประเภทงาน
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="normal">
        {getResponsibleTypeFormat(row.getValue('procurement_type')).label}
      </div>
    ),
  },
  {
    accessorKey: 'export_status',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        สถานะการส่งออก
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => <FinanceStatusBadge status={row.original.export_status} />,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const status = row.original.export_status;

      // Only show actions for CLOSED and WAITING_EDIT statuses
      if (status !== 'CLOSED' && status !== 'WAITING_EDIT') {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {status === 'CLOSED' && (
              <DropdownMenuItem onClick={() => config?.onRequestEdit?.(row.original)}>
                <Edit className="h-4 w-4" />
                ขอแก้ไข
              </DropdownMenuItem>
            )}
            {status === 'WAITING_EDIT' && (
              <DropdownMenuItem onClick={() => config?.onMarkComplete?.(row.original)}>
                <CheckCircle className="h-4 w-4" />
                แก้ไขเสร็จสิ้น
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

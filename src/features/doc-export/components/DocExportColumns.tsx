import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { getResponsibleTypeFormat } from '@/lib/formatters';
import { cn } from '@/lib/utils';

import type { DocExportItem } from '../types';

// Status Badge using Badge component
const DocStatusBadge = ({ status }: { status: DocExportItem['doc_status'] }) => {
  const config = {
    NOT_SUBMITTED: {
      label: 'ยังไม่ได้ส่งเอกสาร',
      variant: 'secondary' as const,
    },
    SUBMITTED: {
      label: 'ส่งเอกสารแล้ว',
      variant: 'info' as const,
    },
    APPROVED: {
      label: 'อนุมัติแล้ว',
      variant: 'success' as const,
    },
    REJECTED: {
      label: 'ไม่อนุมัติ',
      variant: 'destructive' as const,
    },
  };

  const current = config[status];

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export const getDocExportColumns = (): ColumnDef<DocExportItem>[] => [
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
    accessorKey: 'doc_status',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        สถานะเอกสาร
        <ArrowUpDown
          className={cn(
            'ml-2 h-4 w-4',
            column.getIsSorted() ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
    ),
    cell: ({ row }) => <DocStatusBadge status={row.original.doc_status} />,
  },
];

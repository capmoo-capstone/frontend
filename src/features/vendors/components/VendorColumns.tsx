import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, FileText } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { formatDateThaiShort } from '@/lib/formatters';

import type { VendorSubmission } from '../types';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const vendorSubmissionColumns: ColumnDef<VendorSubmission>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'submitted_at',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        วันที่ส่ง
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span className="normal">{formatDateThaiShort(row.original.submitted_at)}</span>
    ),
  },
  {
    accessorKey: 'po_number',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        เลขที่ PO
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => <span className="normal font-mono">{row.original.po_number}</span>,
  },
  {
    accessorKey: 'vendor_name',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ชื่อผู้ค้า
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      return rowA.original.vendor_name.localeCompare(rowB.original.vendor_name, 'th');
    },
    cell: ({ row }) => <span className="normal">{row.original.vendor_name}</span>,
  },
  {
    accessorKey: 'receipt_number',
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
    cell: ({ row }) => <span className="normal font-mono">{row.original.receipt_number}</span>,
  },
  {
    accessorKey: 'project_title',
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ชื่อโครงการ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="max-w-80">
        <span className="normal line-clamp-2" title={row.original.project_title}>
          {row.original.project_title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'department',
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
    cell: ({ row }) => <span className="normal">{row.original.department}</span>,
  },
  {
    accessorKey: 'attachments',
    header: 'รายการของไฟล์แนบทั้งหมด',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center gap-2">
            <FileText className="text-muted-foreground h-3.5 w-3.5" />
            <span className="caption text-muted-foreground">
              {attachment.filename} ({formatFileSize(attachment.size)})
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

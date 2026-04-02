import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { FileCard } from '@/components/ui/file-card';
import { formatDateThaiShort } from '@/lib/formatters';

import type { VendorSubmission } from '../types';

export const vendorSubmissionColumns: ColumnDef<VendorSubmission>[] = [
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
        โครงการ
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
    header: 'ไฟล์แนบ',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center gap-2">
            <FileCard file={attachment.filename} />
          </div>
        ))}
      </div>
    ),
  },
];

import type { ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { formatDateThaiShort } from '@/lib/formatters';

import type { VendorSubmission } from '../types';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const vendorSubmissionColumns: ColumnDef<VendorSubmission>[] = [
  {
    accessorKey: 'submitted_at',
    header: 'วันที่ส่ง',
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span className="normal">{formatDateThaiShort(row.original.submitted_at)}</span>
    ),
  },
  {
    accessorKey: 'po_number',
    header: 'เลขที่ PO',
    cell: ({ row }) => <span className="normal font-mono">{row.original.po_number}</span>,
  },
  {
    accessorKey: 'vendor_name',
    header: 'ชื่อผู้ค้า',
    cell: ({ row }) => <span className="normal">{row.original.vendor_name}</span>,
  },
  {
    accessorKey: 'receipt_number',
    header: 'เลขที่ลงรับ',
    cell: ({ row }) => <span className="normal font-mono">{row.original.receipt_number}</span>,
  },
  {
    accessorKey: 'project_title',
    header: 'ชื่อโครงการ',
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
    header: 'หน่วยงาน',
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

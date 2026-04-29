import type { ColumnDef } from '@tanstack/react-table';

import { FileCard } from '@/components/ui/file-card';
import { formatDateThaiShort } from '@/lib/date-formatters';

import type { VendorSubmission } from '../types';

export const vendorSubmissionColumns: ColumnDef<VendorSubmission>[] = [
  {
    accessorKey: 'submitted_at',
    header: 'วันที่ส่ง',
    cell: ({ row }) => (
      <span className="normal">{formatDateThaiShort(row.original.submitted_at)}</span>
    ),
  },
  {
    accessorKey: 'po_no',
    header: 'เลขที่ PO',
    cell: ({ row }) => <span className="normal font-mono">{row.original.po_no ?? '-'}</span>,
  },
  {
    accessorKey: 'vendor_name',
    header: 'ชื่อผู้ค้า',
    cell: ({ row }) => <span className="normal">{row.original.vendor_name ?? '-'}</span>,
  },
  {
    accessorKey: 'receive_no',
    header: 'เลขที่ลงรับ',
    cell: ({ row }) => <span className="normal font-mono">{row.original.receive_no}</span>,
  },
  {
    accessorKey: 'title',
    header: 'โครงการ',
    cell: ({ row }) => (
      <div className="max-w-80">
        <span className="normal line-clamp-2" title={row.original.title}>
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    id: 'requesting_dept',
    accessorFn: (row) => row.requester.dept_name,
    header: 'หน่วยงาน',
    cell: ({ row }) => <span className="normal">{row.original.requester.dept_name}</span>,
  },
  {
    accessorKey: 'documents',
    header: 'ไฟล์แนบ',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.documents.map((document, index) => {
          const file = document.file_path || document.file_name || 'Unknown File';

          return (
            <div key={`${file}-${index}`} className="flex items-center gap-2">
              <FileCard file={file} />
            </div>
          );
        })}
      </div>
    ),
  },
];

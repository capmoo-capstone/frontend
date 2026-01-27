import { type ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { type Project } from '@/types/project';

export const baseColumns: ColumnDef<Project>[] = [
  {
    accessorKey: 'receive_no',
    header: 'เลขที่ลงรับ',
    cell: ({ row }) => <div className="font-medium">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
    header: 'โครงการ',
  },
  {
    accessorKey: 'req_department_name',
    header: 'หน่วยงาน',
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      // ... badge logic ...
      return <Badge>{/*...*/}</Badge>;
    },
  },
];

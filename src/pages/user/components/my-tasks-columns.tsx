import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getProjectStatusFormat, getResponsibleTypeFormat } from '@/lib/formatters';
import type { User } from '@/types/auth';
import { type Project } from '@/types/project';

interface MyTasksColumnsProps {
  user?: User;
}

export const myTasksColumns = ({ user }: MyTasksColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'receive_no',
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
    cell: ({ row }) => <div className="normal">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
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
      <div>
        {row.original.urgent_status === 'URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วน</span>
        )}
        {row.original.urgent_status === 'VERY_URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วนพิเศษ</span>
        )}
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'type',
    sortingFn: (rowA, rowB) => {
      const labelA = getResponsibleTypeFormat(rowA.original.procurement_type).label;
      const labelB = getResponsibleTypeFormat(rowB.original.procurement_type).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ประเภทงาน
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const config = getResponsibleTypeFormat(row.original.procurement_type);
      return <div className="normal">{config.label}</div>;
    },
  },
  {
    accessorKey: 'procure_status',
    sortingFn: (rowA, rowB) => {
      const labelA = getProjectStatusFormat(
        rowA.original.status,
        rowA.original.workflow_status.p,
        user?.department?.name
      ).label;
      const labelB = getProjectStatusFormat(
        rowB.original.status,
        rowB.original.workflow_status.p,
        user?.department?.name
      ).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ซื้อ/จ้าง
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const { variant, label } = getProjectStatusFormat(
        row.original.status,
        row.original.workflow_status.p,
        user?.department?.name
      );
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
  {
    accessorKey: 'contract_status',
    sortingFn: (rowA, rowB) => {
      const labelA = getProjectStatusFormat(
        rowA.original.status,
        rowA.original.workflow_status.c,
        user?.department?.name,
        rowA.original.workflow_status.p
      ).label;
      const labelB = getProjectStatusFormat(
        rowB.original.status,
        rowB.original.workflow_status.c,
        user?.department?.name,
        rowB.original.workflow_status.p
      ).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        บริหารสัญญา
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const { variant, label } = getProjectStatusFormat(
        row.original.status,
        row.original.workflow_status.c,
        user?.department?.name,
        row.original.workflow_status.p
      );
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
];

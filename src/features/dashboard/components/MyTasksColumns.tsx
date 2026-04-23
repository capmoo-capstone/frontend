import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { type User, isProcurementStaffRole } from '@/features/auth';
import { type Project } from '@/features/projects';
import { getProjectStatusesFormat, getResponsibleTypeFormat } from '@/lib/formatters';

interface MyTasksColumnsProps {
  user?: User;
}

const getProjectStatuses = (project: Project, user?: User) =>
  getProjectStatusesFormat({
    overallStatus: project.status,
    currentWorkflowType: project.current_workflow_type,
    procurementStatus: project.procurement_status ?? 'NOT_STARTED',
    procurementStep: project.procurement_step ?? null,
    contractStatus: project.contract_status ?? 'NOT_STARTED',
    contractStep: project.contract_step ?? null,
    isProcurementStaff: isProcurementStaffRole(user),
    role: user?.role,
  });

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
        {row.original.is_urgent === 'URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วน</span>
        )}
        {row.original.is_urgent === 'VERY_URGENT' && (
          <span className="text-destructive normal-b mr-2">ด่วนที่สุด</span>
        )}
        {row.original.is_urgent === 'SUPER_URGENT' && (
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
        วิธีการจัดหา
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
      const labelA = getProjectStatuses(rowA.original, user).procurement.label;
      const labelB = getProjectStatuses(rowB.original, user).procurement.label;
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
      const { variant, label } = getProjectStatuses(row.original, user).procurement;
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
  {
    accessorKey: 'contract_status',
    sortingFn: (rowA, rowB) => {
      const labelA = getProjectStatuses(rowA.original, user).contract.label;
      const labelB = getProjectStatuses(rowB.original, user).contract.label;
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
      const { variant, label } = getProjectStatuses(row.original, user).contract;
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
];

import type { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import type { ProjectUrgentStatus } from '../../types/index';

type AssignedStatusForTable =
  | 'UNASSIGNED'
  | 'WAITING_ACCEPT'
  | 'WAITING_CANCEL'
  | 'IN_PROGRESS'
  | 'CANCELLED';

export const renderSortableHeader = <TData, TValue>(
  column: Column<TData, TValue>,
  label: string
) => (
  <div
    className="flex cursor-pointer items-center"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {label}
    <ArrowUpDown
      className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
    />
  </div>
);

export const renderUrgentText = (
  urgentStatus: ProjectUrgentStatus,
  className = 'text-destructive mr-2 font-semibold'
) => {
  if (urgentStatus === 'URGENT') {
    return <span className={className}>ด่วน</span>;
  }

  if (urgentStatus === 'VERY_URGENT') {
    return <span className={className}>ด่วนที่สุด</span>;
  }

  if (urgentStatus === 'SUPER_URGENT') {
    return <span className={className}>ด่วนพิเศษ</span>;
  }

  return null;
};

export const renderAssignedStatusBadge = (status: AssignedStatusForTable) => {
  let variant: 'secondary' | 'destructive' | 'warning' | 'info' = 'secondary';
  let label: string = status;

  if (status === 'UNASSIGNED') {
    variant = 'secondary';
    label = 'ยังไม่ได้มอบหมาย';
  } else if (status === 'WAITING_ACCEPT') {
    variant = 'warning';
    label = 'รอการตอบรับ';
  } else if (status === 'WAITING_CANCEL') {
    variant = 'warning';
    label = 'รออนุมัติยกเลิก';
  } else if (status === 'IN_PROGRESS') {
    variant = 'info';
    label = 'มอบหมายแล้ว';
  } else if (status === 'CANCELLED') {
    variant = 'destructive';
    label = 'ยกเลิก';
  }

  return <Badge variant={variant}>{label}</Badge>;
};

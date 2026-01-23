import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type UnassignedProjectItem } from '@/types/project';

import { AssigneeCell } from './assignee-cell';

interface GetColumnsProps {
  pendingChanges: Record<string, string>;
  setPendingChanges: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  unitId?: string;
  onOpenCancelDialog: (project: UnassignedProjectItem) => void;
}

export const getColumns = ({
  pendingChanges,
  setPendingChanges,
  unitId,
  onOpenCancelDialog,
}: GetColumnsProps): ColumnDef<UnassignedProjectItem>[] => [
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
    cell: ({ row }) => <div className="font-medium">{row.getValue('receive_no')}</div>,
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
    cell: ({ row }) => <div>{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'req_department_name',
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
    cell: ({ row }) => <div>{row.getValue('req_department_name')}</div>,
  },
  {
    accessorKey: 'description',
    header: 'รายละเอียด',
    cell: ({ row }) => (
      <div className="text-muted-foreground lowercase">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'สถานะ',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'secondary' | 'destructive' | 'warning' | 'info' = 'secondary';
      let label = status;

      // Status Logic
      if (status === 'UNASSIGNED') {
        variant = 'secondary';
        label = 'ยังไม่ได้มอบหมาย';
      } else if (status === 'WAITING_FOR_ACCEPTANCE') {
        variant = 'warning';
        label = 'รอการตอบรับ';
      } else if (status === 'IN_PROGRESS') {
        variant = 'info';
        label = 'มอบหมายแล้ว';
      } else if (status === 'CANCEL') {
        variant = 'destructive';
        label = 'ยกเลิก';
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: 'assignee_id',
    header: 'มอบหมายให้',
    cell: ({ row }) => (
      <AssigneeCell
        rowId={row.original.id}
        originalValue={row.getValue('assignee_id')}
        pendingChanges={pendingChanges}
        setPendingChanges={setPendingChanges}
        unitId={unitId}
      />
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onOpenCancelDialog(project)} variant="destructive">
              <Trash2 className="h-4 w-4" />
              ยกเลิกโครงการ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

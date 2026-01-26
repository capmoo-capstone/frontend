import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical, Trash2, UserCog } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Role } from '@/types/auth';
import { type AssignedProjectItem } from '@/types/project';

interface GetColumnsProps {
  onCancelProject: (project: AssignedProjectItem) => void;
  onChangeAssignee: (project: AssignedProjectItem) => void;
  onAcceptProject: (project: AssignedProjectItem) => void;
  viewAsRole?: Role;
}

export const getColumns = ({
  onCancelProject,
  onChangeAssignee,
  onAcceptProject,
  viewAsRole,
}: GetColumnsProps): ColumnDef<AssignedProjectItem>[] => [
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
    header: ({ column }) => (
      <div
        className="flex cursor-pointer items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        สถานะ
        <ArrowUpDown
          className={`ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-primary' : 'text-ring'}`}
        />
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      let variant: 'secondary' | 'destructive' | 'warning' | 'info' = 'secondary';
      let label = status;

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
    cell: ({ row }) => {
      return viewAsRole === 'HEAD_OF_UNIT' ? (
        <div className="text-sm font-medium">{row.original.assignee_fullname || '-'}</div>
      ) : viewAsRole === 'GENERAL_STAFF' && row.original.status === 'WAITING_FOR_ACCEPTANCE' ? (
        <Button variant="outline" size="sm" onClick={() => onAcceptProject(row.original)}>
          รับทราบ
        </Button>
      ) : null;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;

      const canEdit = project.status === 'WAITING_FOR_ACCEPTANCE';

      if (row.original.status === 'CANCEL') {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {viewAsRole === 'HEAD_OF_UNIT' && (
              <DropdownMenuItem onClick={() => onChangeAssignee(project)} disabled={!canEdit}>
                <UserCog className="h-4 w-4" />
                เปลี่ยนผู้รับผิดชอบ
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={() => onCancelProject(project)} variant="destructive">
              <Trash2 className="h-4 w-4" />
              {viewAsRole === 'HEAD_OF_DEPARTMENT' || viewAsRole === 'HEAD_OF_UNIT'
                ? 'ยกเลิกโครงการ'
                : 'ขอยกเลิกโครงการ'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

import { type ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Reply, Trash2, UserRoundPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Role, type User, isProcurementStaffRole } from '@/features/auth';
import { getProjectStatusesFormat, getResponsibleTypeFormat } from '@/lib/formatters';
import { hasUnitPermission } from '@/lib/permissions';

import type { Project } from '../../types/index';
import {
  canCancelProject,
  canEditProjectAssignee,
  canReturnProject,
  getActiveResponsibleUsers,
  getCancelProjectActionLabel,
} from '../../utils/project-selectors';
import { renderSortableHeader, renderUrgentText } from './column-helpers';

interface SharedColumnsProps {
  onAddAssignee: (project: Project) => void;
  onReturnProject: (project: Project) => void;
  onCancelProject: (project: Project) => void;
  viewAsRole: Role;
  user?: User;
}

const getProjectStatuses = (project: Project, user?: User) =>
  getProjectStatusesFormat({
    overallStatus: project.status,
    currentWorkflowType: project.current_workflow_type,
    procurementStatus: project.procurement_status,
    procurementStep: project.procurement_step ?? null,
    contractStatus: project.contract_status,
    contractStep: project.contract_step ?? null,
    isProcurementStaff: isProcurementStaffRole(user),
    role: user?.role,
  });

export const baseColumns = ({
  onAddAssignee,
  onReturnProject,
  onCancelProject,
  viewAsRole,
  user,
}: SharedColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'receive_no',
    header: ({ column }) => renderSortableHeader(column, 'เลขที่ลงรับ'),
    cell: ({ row }) => <div className="normal">{row.getValue('receive_no')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => renderSortableHeader(column, 'โครงการ'),
    cell: ({ row }) => (
      <div>
        {renderUrgentText(row.original.is_urgent, 'text-destructive normal-b mr-2')}
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'responsible_users',
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.assignee_procurement?.[0]?.full_name ?? '';
      const nameB = rowB.original.assignee_procurement?.[0]?.full_name ?? '';
      return nameA.localeCompare(nameB, 'th');
    },
    header: ({ column }) => renderSortableHeader(column, 'ผู้รับผิดชอบ'),
    cell: ({ row }) => {
      const allUsers = getActiveResponsibleUsers(row.original);

      return (
        <div className="flex flex-col gap-1 text-sm">
          {allUsers.length > 0 ? (
            allUsers.map((u) => {
              return (
                <div key={u.id} className="normal whitespace-nowrap">
                  {u.full_name ?? '-'}
                </div>
              );
            })
          ) : (
            <span className="normal">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    sortingFn: (rowA, rowB) => {
      const labelA = getResponsibleTypeFormat(rowA.original.procurement_type).label;
      const labelB = getResponsibleTypeFormat(rowB.original.procurement_type).label;
      return labelA.localeCompare(labelB, 'th');
    },
    header: ({ column }) => renderSortableHeader(column, 'วิธีการจัดหา'),
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
    header: ({ column }) => renderSortableHeader(column, 'ซื้อ/จ้าง'),
    cell: ({ row }) => {
      const { procurement } = getProjectStatuses(row.original, user);
      const { variant, label } = procurement;
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
    header: ({ column }) => renderSortableHeader(column, 'บริหารสัญญา'),
    cell: ({ row }) => {
      const { contract } = getProjectStatuses(row.original, user);
      const { variant, label } = contract;
      return <Badge variant={variant}>{label} </Badge>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const project = row.original;
      const assigneeIds =
        project.current_workflow_type === 'CONTRACT'
          ? (project.assignee_contract?.map((u) => u.id) ?? [])
          : (project.assignee_procurement?.map((u) => u.id) ?? []);
      const canManage =
        (user && hasUnitPermission(user, project.responsible_unit_id)) ||
        assigneeIds.includes(user?.id ?? '');

      const canAddAssignee = canEditProjectAssignee(project.status) && canManage;
      const canReturnProjectAction =
        canReturnProject(
          project.status,
          project.current_workflow_type,
          project.procurement_status,
          project.procurement_step,
          project.contract_status,
          project.contract_step
        ) && canManage;
      const canDeleteProject = canCancelProject(project.status) && canManage;

      return (
        (canAddAssignee || canReturnProjectAction || canDeleteProject) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="normal h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canAddAssignee && (
                <DropdownMenuItem
                  onClick={() => onAddAssignee(project)}
                  className="normal text-foreground"
                >
                  <UserRoundPlus className="normal h-4 w-4" />
                  เพิ่มผู้รับผิดชอบ
                </DropdownMenuItem>
              )}
              {canReturnProjectAction && (
                <DropdownMenuItem onClick={() => onReturnProject(project)} variant="destructive">
                  <Reply className="normal text-destructive h-4 w-4" />
                  คืนโครงการ
                </DropdownMenuItem>
              )}
              {canDeleteProject && (
                <DropdownMenuItem onClick={() => onCancelProject(project)} variant="destructive">
                  <Trash2 className="normal h-4 w-4" />
                  {getCancelProjectActionLabel(viewAsRole)}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      );
    },
  },
];

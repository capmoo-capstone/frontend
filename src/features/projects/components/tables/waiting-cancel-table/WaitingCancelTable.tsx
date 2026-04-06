'use client';

import { useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { TitleBar } from '@/components/ui/title-bar';
import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/permissions';

import {
  useApproveProjectCancellation,
  useRejectProjectCancellation,
} from '../../../hooks/useProjectMutations';
import { useWaitingCancelProjects } from '../../../hooks/useProjectQueries';
import { ProjectDataTable } from '../DataTable';
import { getColumns } from './columns';

export function WaitingCancelTable({ unitId }: { unitId?: string }) {
  const { roleInUnit } = usePermissions(unitId);
  const viewAsRole = roleInUnit ?? 'GUEST';

  const { data: projects, isLoading, isError } = useWaitingCancelProjects(unitId);
  const { mutateAsync: approveMutation } = useApproveProjectCancellation();
  const { mutateAsync: rejectMutation } = useRejectProjectCancellation();

  const [sorting, setSorting] = useState<SortingState>([]);

  const canManage = ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole);

  const columns = useMemo(
    () =>
      getColumns({
        onApproveCancellation: async (projectId: string, projectTitle: string) => {
          const promise = approveMutation(projectId);
          toast.promise(promise, {
            loading: `กำลังอนุมัติยกเลิก: ${projectTitle}...`,
            success: 'อนุมัติยกเลิกโครงการสำเร็จ',
            error: 'ไม่สามารถอนุมัติยกเลิกได้',
          });
        },
        onRejectCancellation: async (projectId: string, projectTitle: string) => {
          const promise = rejectMutation(projectId);
          toast.promise(promise, {
            loading: `กำลังปฏิเสธการยกเลิก: ${projectTitle}...`,
            success: 'ปฏิเสธการยกเลิกโครงการสำเร็จ',
            error: 'ไม่สามารถปฏิเสธการยกเลิกได้',
          });
        },
        viewAsRole,
      }),
    [viewAsRole, approveMutation, rejectMutation]
  );

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (!canManage) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-secondary flex h-48 w-full items-center justify-center rounded-md">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-secondary flex h-48 w-full items-center justify-center rounded-md">
        <AlertTriangle className="text-destructive mr-2 h-6 w-6" />
        <p className="text-primary normal">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );
  }

  return (
    <ProjectDataTable
      table={table}
      columnsLength={columns.length}
      hasPagination={false}
      emptyStateText="ตอนนี้ยังไม่มีงานที่ต้องอนุมัติคำขอยกเลิกโครงการ"
      toolbar={
        <div className="flex w-full items-center justify-between space-x-4">
          <TitleBar title="งานที่ขออนุมัติยกเลิก" variant="error" />
        </div>
      }
    />
  );
}

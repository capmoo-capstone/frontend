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

import { ConfirmDialog } from '@/components/shared-dialog';
import { TitleBar } from '@/components/ui/title-bar';

import {
  useApproveProjectCancellation,
  useRejectProjectCancellation,
} from '../../../hooks/useProjectMutations';
import { useProjectPermissions } from '../../../hooks/useProjectPermissions';
import { useWaitingCancelProjects } from '../../../hooks/useProjectQueries';
import { ProjectDataTable } from '../DataTable';
import { getColumns } from './columns';

type PendingCancellationAction = {
  projectId: string;
  projectTitle: string;
  type: 'approve' | 'reject';
} | null;

export function WaitingCancelTable({ unitId }: { unitId?: string }) {
  const { canCancelProjects } = useProjectPermissions({ unitId });

  const { data: projects, isLoading, isError } = useWaitingCancelProjects(unitId);
  const { mutateAsync: approveMutation } = useApproveProjectCancellation();
  const { mutateAsync: rejectMutation } = useRejectProjectCancellation();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pendingAction, setPendingAction] = useState<PendingCancellationAction>(null);

  const columns = useMemo(
    () =>
      getColumns({
        onApproveCancellation: async (projectId: string, projectTitle: string) => {
          setPendingAction({ projectId, projectTitle, type: 'approve' });
        },
        onRejectCancellation: async (projectId: string, projectTitle: string) => {
          setPendingAction({ projectId, projectTitle, type: 'reject' });
        },
        canCancelProjects,
      }),
    [canCancelProjects]
  );

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const isApprove = pendingAction.type === 'approve';
    const mutation = isApprove ? approveMutation : rejectMutation;
    const promise = mutation(pendingAction.projectId);

    toast.promise(promise, {
      loading: isApprove
        ? `กำลังอนุมัติคำขอยกเลิก: ${pendingAction.projectTitle}...`
        : `กำลังปฏิเสธคำขอยกเลิก: ${pendingAction.projectTitle}...`,
      success: isApprove ? 'อนุมัติคำขอยกเลิกโครงการสำเร็จ' : 'ปฏิเสธคำขอยกเลิกโครงการสำเร็จ',
      error: isApprove ? 'ไม่สามารถอนุมัติคำขอยกเลิกได้' : 'ไม่สามารถปฏิเสธคำขอยกเลิกได้',
    });

    try {
      await promise;
      setPendingAction(null);
    } catch (error) {
      console.error(error);
    }
  };

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

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

  if (!canCancelProjects && (!projects || projects.length === 0)) {
    return null;
  }

  return (
    <>
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

      <ConfirmDialog
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
        title={
          pendingAction?.type === 'approve' ? 'อนุมัติคำขอยกเลิกโครงการ' : 'ปฏิเสธคำขอยกเลิกโครงการ'
        }
        description={
          pendingAction ? (
            <>
              คุณต้องการ
              {pendingAction.type === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'}คำขอยกเลิกของโครงการ{' '}
              <strong className="text-foreground">&quot;{pendingAction.projectTitle}&quot;</strong>
              ใช่หรือไม่
            </>
          ) : undefined
        }
        confirmLabel={pendingAction?.type === 'approve' ? 'อนุมัติคำขอยกเลิก' : 'ปฏิเสธคำขอยกเลิก'}
        cancelLabel="ยกเลิก"
        destructive={pendingAction?.type === 'approve'}
      />
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/components/ui/title-bar';
import { useAuth } from '@/context/AuthContext';
import { useAssignProject, useUnassignedProjects } from '@/hooks/useProjects';
import { type UnassignedProjectItem } from '@/types/project';

import { ProjectDataTable } from '../data-table';
import { getColumns } from './columns';

export function AssignTable({ unitId }: { unitId?: string }) {
  const { user } = useAuth();
  const { data: projects, isLoading, isError } = useUnassignedProjects(unitId);
  const { mutateAsync } = useAssignProject();

  const [projectToCancel, setProjectToCancel] = useState<UnassignedProjectItem | null>(null);

  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      getColumns({
        pendingChanges,
        setPendingChanges,
        unitId,
        onOpenCancelDialog: (project) => setProjectToCancel(project),
        onClaimProject: (project) => console.log('Claim Project', project), // todo: implement
        viewAsRole: user?.role,
      }),
    [pendingChanges, unitId, user?.role]
  );

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const handleConfirmCancel = async (reason: string) => {
    if (!projectToCancel) return;

    // Simulate API Call (Replace with mutateAsync)
    console.log(`Cancelling Project ${projectToCancel.id} because: ${reason}`);

    // await cancelMutation.mutateAsync({ id: projectToCancel.id, reason });

    toast.success('ยกเลิกโครงการเรียบร้อยแล้ว');
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    const savePromise = Promise.all(
      Object.entries(pendingChanges).map(([projectId, userId]) =>
        mutateAsync({
          projectId,
          userId,
          projectType: 'procurement',
        })
      )
    );

    toast.promise(savePromise, {
      loading: 'กำลังมอบหมายโครงการ...',
      success: () => {
        setPendingChanges({});
        return 'มอบหมายโครงการสำเร็จ';
      },
      error: 'ไม่สามารถมอบหมายโครงการได้',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-secondary flex h-48 w-full items-center justify-center rounded-md">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError)
    return (
      <div className="bg-secondary flex h-48 w-full items-center justify-center rounded-md">
        <AlertTriangle className="text-destructive mr-2 h-6 w-6" />
        <p className="text-foreground">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );

  return (
    <>
      <ProjectDataTable
        table={table}
        columnsLength={columns.length}
        toolbar={
          <div className="flex w-full items-center justify-between space-x-4">
            <TitleBar title="งานที่ยังไม่ได้มอบหมาย" />
            <Button
              variant="brand"
              onClick={handleSave}
              disabled={Object.keys(pendingChanges).length === 0}
            >
              <Save className="h-4 w-4" />
              บันทึก
              <span className="text-xs">({Object.keys(pendingChanges).length})</span>
            </Button>
          </div>
        }
      />
      <CancelProjectDialog
        isOpen={!!projectToCancel}
        onClose={() => setProjectToCancel(null)}
        onConfirm={handleConfirmCancel}
        projectTitle={projectToCancel?.title}
        isAuthorized={user?.role === 'HEAD_OF_DEPARTMENT' || user?.role === 'HEAD_OF_UNIT'}
      />
    </>
  );
}

'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/components/ui/title-bar';
import { useAuth } from '@/context/AuthContext';
import { ManageUnitRoles } from '@/lib/permissions';

import { useAssignProjects, useClaimProject } from '../../../hooks/useProjectMutations';
import { useUnassignedProjects } from '../../../hooks/useProjectQueries';
import { type UnassignedProjectItem } from '../../../types/index';
import { CancelProjectDialog } from '../../dialogs/CancelProjectDialog';
import { ProjectDataTable } from '../DataTable';
import { getColumns } from './columns';

interface UnassignTableProps {
  unitId?: string;
  pendingChanges: Record<string, string>;
  setPendingChanges: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function UnassignTable({ unitId, pendingChanges, setPendingChanges }: UnassignTableProps) {
  const { user } = useAuth();
  const viewAsRole = user?.role ?? 'GUEST';

  const { data: projects, isLoading, isError } = useUnassignedProjects(unitId);
  const { mutateAsync: assignProjectsMutation } = useAssignProjects();
  const { mutateAsync: claimProjectMutation } = useClaimProject();

  const [projectToCancel, setProjectToCancel] = useState<UnassignedProjectItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleClaimProject = useCallback(
    async (project: UnassignedProjectItem) => {
      const claimPromise = claimProjectMutation(project.id);

      toast.promise(claimPromise, {
        loading: `กำลังเลือกงาน: ${project.title}...`,
        success: 'เลือกงานสำเร็จ',
        error: 'ไม่สามารถเลือกงานได้',
      });
    },
    [claimProjectMutation]
  );

  const columns = useMemo(
    () =>
      getColumns({
        pendingChanges,
        setPendingChanges,
        unitId,
        onOpenCancelDialog: (project) => setProjectToCancel(project),
        onClaimProject: (project) => handleClaimProject(project),
        viewAsRole,
      }),
    [pendingChanges, unitId, viewAsRole, handleClaimProject]
  );

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    const assignments = Object.entries(pendingChanges).map(([projectId, userId]) => ({
      projectId,
      userId,
    }));

    const savePromise = assignProjectsMutation(assignments);

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
        <p className="text-primary normal">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );

  return (
    <>
      <ProjectDataTable
        table={table}
        columnsLength={columns.length}
        emptyStateText="ไม่มีงานที่ยังไม่ได้มอบหมายในกลุ่มงานนี้"
        toolbar={
          <div className="flex w-full items-center justify-between space-x-4">
            <TitleBar title="งานที่ยังไม่ได้มอบหมาย" />
            {ManageUnitRoles.includes(viewAsRole) && (
              <Button
                variant="brand"
                onClick={handleSave}
                disabled={Object.keys(pendingChanges).length === 0}
              >
                <Save className="h-4 w-4" />
                บันทึก
                <span className="text-xs">({Object.keys(pendingChanges).length})</span>
              </Button>
            )}
          </div>
        }
      />
      {projectToCancel && (
        <CancelProjectDialog
          isOpen={!!projectToCancel}
          onClose={() => setProjectToCancel(null)}
          project={projectToCancel as any}
        />
      )}
    </>
  );
}

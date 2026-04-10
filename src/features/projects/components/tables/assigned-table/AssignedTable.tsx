'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TitleBar } from '@/components/ui/title-bar';

import { useAcceptProjects } from '../../../hooks/useProjectMutations';
import { useProjectPermissions } from '../../../hooks/useProjectPermissions';
import { useAssignedProjects } from '../../../hooks/useProjectQueries';
import type { AssignedProjectItem } from '../../../types/index';
import { CancelProjectDialog } from '../../dialogs/CancelProjectDialog';
import { ChangeAssigneeDialog } from '../../dialogs/ChangeAssigneeDialog';
import { ProjectDataTable } from '../DataTable';
import { getColumns } from './columns';

export function AssignedTable({ unitId }: { unitId?: string }) {
  const { canClaimProjects, canChangeProjectAssignee } = useProjectPermissions(unitId);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: projects, isLoading, isError } = useAssignedProjects(date);
  const { mutateAsync: acceptProjectsMutation, isPending: isAccepting } = useAcceptProjects();

  const [sorting, setSorting] = useState<SortingState>([{ id: 'status', desc: true }]);
  const [projectToCancel, setProjectToCancel] = useState<AssignedProjectItem | null>(null);
  const [projectToChangeAssignee, setProjectToChangeAssignee] =
    useState<AssignedProjectItem | null>(null);

  const handleAcceptProject = useCallback(
    async (project: AssignedProjectItem) => {
      const acceptPromise = acceptProjectsMutation([project.id]);

      toast.promise(acceptPromise, {
        loading: `กำลังรับทราบโครงการ: ${project.title}...`,
        success: 'รับทราบโครงการสำเร็จ',
        error: 'ไม่สามารถรับทราบโครงการได้',
      });
    },
    [acceptProjectsMutation]
  );

  const columns = useMemo(
    () =>
      getColumns({
        onCancelProject: (project: AssignedProjectItem) => setProjectToCancel(project),
        onChangeAssignee: (project: AssignedProjectItem) => setProjectToChangeAssignee(project),
        onAcceptProject: handleAcceptProject,
        isAcceptPending: isAccepting,
        canClaimProjects,
        canChangeProjectAssignee,
        unitId,
      }),
    [handleAcceptProject, isAccepting, canClaimProjects, canChangeProjectAssignee, unitId]
  );

  const waitingProjectIds = useMemo(
    () =>
      (projects ?? [])
        .filter((project) => project.status === 'WAITING_ACCEPT')
        .map((project) => project.id),
    [projects]
  );

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const handlePrint = async () => {
    toast.info('สมมตว่ากำลังส่งออกรายงาน...');
  };

  const handleAcceptAll = async () => {
    if (waitingProjectIds.length === 0) {
      toast.info('ไม่มีโครงการที่ต้องรับทราบ');
      return;
    }

    const acceptAllPromise = acceptProjectsMutation(waitingProjectIds);

    toast.promise(acceptAllPromise, {
      loading: `กำลังรับทราบโครงการ ${waitingProjectIds.length} รายการ...`,
      success: 'รับทราบโครงการทั้งหมดสำเร็จ',
      error: 'ไม่สามารถรับทราบโครงการทั้งหมดได้',
    });

    try {
      await acceptAllPromise;
    } catch (error) {
      console.error(error);
    }
  };

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
    <>
      <ProjectDataTable
        table={table}
        columnsLength={columns.length}
        hasPagination={false}
        emptyStateText="ไม่มีงานที่ถูกมอบหมายแล้วในช่วงวันที่ที่เลือก"
        toolbar={
          <div className="flex w-full items-center justify-between space-x-4">
            <TitleBar title="งานที่ถูกมอบหมายแล้ว" variant="grey" />
            <div className="flex items-center gap-2">
              {canClaimProjects ? (
                <Button
                  variant="outline"
                  onClick={handleAcceptAll}
                  disabled={waitingProjectIds.length === 0 || isAccepting}
                >
                  รับทราบทั้งหมด
                </Button>
              ) : (
                <>
                  <DatePicker date={date} setDate={setDate} />
                  <Button variant="outline" onClick={handlePrint} disabled={false}>
                    <Upload className="mr-2 h-4 w-4" />
                    ส่งออกรายงาน
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      />

      {projectToCancel && (
        <CancelProjectDialog
          isOpen={!!projectToCancel}
          onClose={() => setProjectToCancel(null)}
          project={projectToCancel}
        />
      )}

      {projectToChangeAssignee && (
        <ChangeAssigneeDialog
          isOpen={!!projectToChangeAssignee}
          onClose={() => setProjectToChangeAssignee(null)}
          projectId={projectToChangeAssignee.id}
          currentAssigneeId={projectToChangeAssignee.assignee_id}
          projectTitle={projectToChangeAssignee.title}
          unitId={unitId}
        />
      )}
    </>
  );
}

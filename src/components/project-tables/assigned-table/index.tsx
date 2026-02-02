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

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { ChangeAssigneeDialog } from '@/components/project-dialog/change-assignee-dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TitleBar } from '@/components/ui/title-bar';
import { useAuth } from '@/context/AuthContext';
import { useAcceptProjects, useAssignedProjects, useCancelProject } from '@/hooks/useProjects';
import { ManageSelfRoles, ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';
import type { AssignedProjectItem } from '@/types/project';

import { ProjectDataTable } from '../data-table';
import { getColumns } from './columns';

export function AssignedTable({ unitId }: { unitId?: string }) {
  const { user } = useAuth();
  if (!user) return null;

  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: projects, isLoading, isError } = useAssignedProjects(unitId, date);
  const { mutateAsync: cancelProjectMutation } = useCancelProject();
  const { mutateAsync: acceptProjectsMutation } = useAcceptProjects();

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
        onCancelProject: (project) => setProjectToCancel(project),
        onChangeAssignee: (project) => setProjectToChangeAssignee(project),
        onAcceptProject: handleAcceptProject,
        viewAsRole: user.role,
      }),
    [unitId, user.role, date, handleAcceptProject]
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

    const cancelPromise = cancelProjectMutation({
      projectId: projectToCancel.id,
      reason,
    });

    const actionLabel =
      ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)
        ? 'ยกเลิก'
        : 'ขอยกเลิก';

    toast.promise(cancelPromise, {
      loading: `กำลัง${actionLabel}โครงการ...`,
      success: () => {
        setProjectToCancel(null);
        return `${actionLabel}โครงการเรียบร้อยแล้ว`;
      },
      error: 'ไม่สามารถยกเลิกโครงการได้',
    });
  };

  const handlePrint = async () => {
    toast.info('สมมตว่ากำลังส่งออกรายงาน...');
  };

  const handleAcceptAll = async () => {
    if (!projects || projects.length === 0) return;

    const waitingProjects = projects.filter((p) => p.status === 'WAITING_ACCEPT').map((p) => p.id);

    if (waitingProjects.length === 0) {
      toast.info('ไม่มีโครงการที่ต้องรับทราบ');
      return;
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
        toolbar={
          <div className="flex w-full items-center justify-between space-x-4">
            <TitleBar title="งานที่ถูกมอบหมายแล้ว" variant="grey" />
            <div className="flex items-center gap-2">
              <DatePicker date={date} setDate={setDate} />
              {ManageSelfRoles.includes(user.role) ? (
                <Button variant="outline" onClick={handleAcceptAll} disabled={false}>
                  รับทราบทั้งหมด
                </Button>
              ) : (
                <Button variant="outline" onClick={handlePrint} disabled={false}>
                  <Upload className="mr-2 h-4 w-4" />
                  ส่งออกรายงาน
                </Button>
              )}
            </div>
          </div>
        }
      />

      <CancelProjectDialog
        isOpen={!!projectToCancel}
        onClose={() => setProjectToCancel(null)}
        onConfirm={handleConfirmCancel}
        projectTitle={projectToCancel?.title}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />

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

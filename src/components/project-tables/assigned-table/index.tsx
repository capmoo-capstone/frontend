'use client';

import { useMemo, useState } from 'react';

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
// Import this!
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TitleBar } from '@/components/ui/title-bar';
import { useAssignedProjects } from '@/hooks/useProjects';
import type { AssignedProjectItem } from '@/types/project';

import { ProjectDataTable } from '../data-table';
import { getColumns } from './columns';

export function AssignedTable({ unitId }: { unitId?: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: projects, isLoading, isError } = useAssignedProjects(unitId, date);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'status', desc: true }]);

  // State for Dialogs
  const [projectToCancel, setProjectToCancel] = useState<AssignedProjectItem | null>(null);
  const [projectToChangeAssignee, setProjectToChangeAssignee] =
    useState<AssignedProjectItem | null>(null);

  const columns = useMemo(
    () =>
      getColumns({
        onCancelProject: (project) => setProjectToCancel(project),
        onChangeAssignee: (project) => setProjectToChangeAssignee(project),
      }),
    [unitId]
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
    // Simulate API Call (Replace with mutateAsync from your hook)
    console.log(`Cancelling Project ${projectToCancel.id} because: ${reason}`);
    toast.success('ยกเลิกโครงการเรียบร้อยแล้ว');
  };

  const handlePrint = async () => {
    toast.info('สมมตว่ากำลังส่งออกรายงาน...');
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
        <p className="text-foreground">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
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
            <TitleBar title="งานที่มอบหมายแล้ว" variant="grey" />
            <div className="flex items-center gap-2">
              <DatePicker date={date} setDate={setDate} />
              <Button variant="outline" onClick={handlePrint} disabled={false}>
                <Upload className="mr-2 h-4 w-4" />
                ส่งออกรายงาน
              </Button>
            </div>
          </div>
        }
      />

      <CancelProjectDialog
        isOpen={!!projectToCancel}
        onClose={() => setProjectToCancel(null)}
        onConfirm={handleConfirmCancel}
        projectTitle={projectToCancel?.title}
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

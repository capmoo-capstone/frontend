'use client';

import { useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { AddAssigneeDialog } from '@/components/project-dialog/add-assignee-dialog';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/types/project';

import { ProjectDataTable } from '../data-table';
import { baseColumns } from '../shared-columns';

export function AllProjectTable() {
  const { user } = useAuth();
  if (!user) return null;

  const { data: projects, isLoading, isError } = useProjects();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'status', desc: true }]);
  const [projectToAddAssignee, setProjectToAddAssignee] = useState<Project | null>(null);

  const columns = useMemo(
    () =>
      baseColumns({
        onAddAssignee: (project) => setProjectToAddAssignee(project),
        viewAsRole: user.role,
      }),
    [user.role, setProjectToAddAssignee]
  );

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

  return (
    <>
      <ProjectDataTable table={table} columnsLength={columns.length} />

      {projectToAddAssignee && (
        <AddAssigneeDialog
          isOpen={!!projectToAddAssignee}
          onClose={() => setProjectToAddAssignee(null)}
          projectId={projectToAddAssignee.id}
        />
      )}
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

import { useProjectPermissions } from '../hooks/useProjectPermissions';
import { type ProjectFilterParams, useProjects } from '../hooks/useProjectQueries';
import type { Project } from '../types/index';
import { AddAssigneeDialog } from './dialogs/AddAssigneeDialog';
import { CancelProjectDialog } from './dialogs/CancelProjectDialog';
import { ReturnProjectDialog } from './dialogs/ReturnProjectDialog';
import { ProjectDataTable } from './tables/DataTable';
import { baseColumns } from './tables/SharedColumns';

interface AllProjectTableProps {
  filters: ProjectFilterParams;
  columns?: ColumnDef<Project>[];
}

export function AllProjectTable({ filters, columns: customColumns }: AllProjectTableProps) {
  const { user } = useAuth();
  const { canCancelProjects } = useProjectPermissions();

  const { data: projects, isLoading, isError } = useProjects(filters);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [projectToAddAssignee, setProjectToAddAssignee] = useState<Project | null>(null);
  const [projectToReturn, setProjectToReturn] = useState<Project | null>(null);
  const [projectToCancel, setProjectToCancel] = useState<Project | null>(null);

  const columns = useMemo(
    () =>
      customColumns ||
      baseColumns({
        onAddAssignee: (project) => setProjectToAddAssignee(project),
        onReturnProject: (project) => setProjectToReturn(project),
        onCancelProject: (project) => setProjectToCancel(project),
        canCancelProjects,
        user: user ?? undefined,
      }),
    [customColumns, canCancelProjects, user]
  );

  const table = useReactTable({
    data: projects || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
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
          project={projectToAddAssignee}
        />
      )}

      {projectToReturn && (
        <ReturnProjectDialog
          isOpen={!!projectToReturn}
          onClose={() => setProjectToReturn(null)}
          project={projectToReturn}
        />
      )}

      {projectToCancel && (
        <CancelProjectDialog
          isOpen={!!projectToCancel}
          onClose={() => setProjectToCancel(null)}
          project={projectToCancel}
        />
      )}
    </>
  );
}

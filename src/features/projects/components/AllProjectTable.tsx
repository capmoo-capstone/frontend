'use client';

import { useMemo, useState } from 'react';

import {
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useAuth } from '@/context/useAuth';

import { useProjectPermissions } from '../hooks/useProjectPermissions';
import {
  type ProjectFilterParams,
  type ProjectsQueryOptions,
  useProjects,
} from '../hooks/useProjectQueries';
import { useTableQueryState } from '../hooks/useTableQueryState';
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
  const { pagination, sorting, updateQueryParams } = useTableQueryState();

  const projectQueryOptions = useMemo<ProjectsQueryOptions>(
    () => {
      const primarySort = sorting[0];

      return {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: primarySort?.id,
        sortOrder: primarySort ? (primarySort.desc ? 'desc' : 'asc') : undefined,
      };
    },
    [pagination.pageIndex, pagination.pageSize, sorting]
  );

  const { data: projectPage, isLoading, isError } = useProjects(filters, projectQueryOptions);
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
    data: projectPage?.data || [],
    columns,
    pageCount: projectPage?.totalPages ?? 0,
    rowCount: projectPage?.total ?? 0,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      const primarySort = nextSorting[0];

      updateQueryParams(
        {
          sortField: primarySort?.id ?? null,
          sortType: primarySort ? (primarySort.desc ? 'DESC' : 'ASC') : null,
        },
        { resetPage: true }
      );
    },
    onPaginationChange: (updater) => {
      const nextPagination = typeof updater === 'function' ? updater(pagination) : updater;
      const pageSizeChanged = nextPagination.pageSize !== pagination.pageSize;

      updateQueryParams(
        {
          page: pageSizeChanged ? 1 : nextPagination.pageIndex + 1,
          pageSize: nextPagination.pageSize,
        },
        { resetPage: false }
      );
    },
    getCoreRowModel: getCoreRowModel(),
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

import { useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { ProjectDataTable } from '@/features/projects/components/tables/DataTable';

import { useVendorSubmissions } from '../hooks/useVendorSubmissions';
import type { VendorFilterParams } from '../types';
import { vendorSubmissionColumns } from './VendorColumns';

export function VendorSubmissionTable({ filters }: { filters: VendorFilterParams }) {
  const { data, isLoading, isError } = useVendorSubmissions(filters);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: data || [],
    columns: vendorSubmissionColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
      globalFilter: filters.search,
    },
  });

  if (isLoading) {
    return (
      <div className="bg-secondary flex h-64 w-full items-center justify-center rounded-lg border">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-secondary flex h-64 w-full items-center justify-center rounded-lg border">
        <AlertTriangle className="text-destructive mr-2 h-6 w-6" />
        <p className="text-primary normal">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );
  }

  return <ProjectDataTable table={table} columnsLength={vendorSubmissionColumns.length} />;
}

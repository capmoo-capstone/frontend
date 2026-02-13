import { useState } from 'react';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';

import { ProjectDataTable } from '@/components/project-tables/data-table';

import { useVendorSubmissions } from '../hooks/useVendorSubmissions';
import type { VendorFilterParams } from '../types';
import { vendorSubmissionColumns } from './VendorColumns';

export function VendorSubmissionTable({ filters }: { filters: VendorFilterParams }) {
  // Server-side filtering: status and dateRange are handled by the hook/API
  // Client-side filtering: search is handled by TanStack Table's globalFilter
  const { data, isLoading } = useVendorSubmissions(filters);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: data || [],
    columns: vendorSubmissionColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter: filters.search,
    },
  });

  if (isLoading) {
    return (
      <div className="bg-secondary flex h-64 w-full items-center justify-center rounded-lg border">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <ProjectDataTable table={table} columnsLength={vendorSubmissionColumns.length} />;
}

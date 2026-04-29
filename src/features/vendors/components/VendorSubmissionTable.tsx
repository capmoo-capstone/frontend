import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

import {
  type SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, ExternalLink, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Input } from '@/components/ui/input';
import { ProjectDataTable } from '@/features/projects';

import { useVendorSubmissions } from '../hooks/useVendorSubmissions';
import type { VendorFilterParams } from '../types';
import { vendorSubmissionColumns } from './VendorColumns';

interface VendorSubmissionTableProps {
  filters: VendorFilterParams;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function VendorSubmissionTable({
  filters,
  onSearchChange,
  onDateRangeChange,
}: VendorSubmissionTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: vendorPage, isLoading, isError } = useVendorSubmissions(filters, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const table = useReactTable({
    data: vendorPage?.data || [],
    columns: vendorSubmissionColumns,
    pageCount: vendorPage?.totalPages ?? 0,
    rowCount: vendorPage?.total ?? 0,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  const handleDateRangeFilterChange = (range: DateRange | undefined) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    onDateRangeChange(range);
  };

  const handleSearchInputChange = (search: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    onSearchChange(search);
  };

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

  return (
    <ProjectDataTable
      table={table}
      columnsLength={vendorSubmissionColumns.length}
      getRowHref={(row) => `/app/projects/${row.project_id}`}
      toolbar={
        <div className="flex w-full items-center justify-end gap-3 flex-wrap">
          <div className="relative min-w-[342px]">
            <Input
              className="normal pr-10"
              placeholder={'ค้นหาจากเลขที่ PO, ชื่อผู้ค้า, เลขที่ลงรับ, ...'}
              value={filters.search}
              onChange={(e) => handleSearchInputChange(e.target.value)}
            />
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>

          <DatePickerWithRange value={filters.dateRange} onChange={handleDateRangeFilterChange} />

          <Button
            variant="outline"
            className="whitespace-nowrap"
            onClick={() => {
              navigate('/app/vendor-form');
            }}
          >
            <ExternalLink className="h-4 w-4" />
            ไปที่หน้ากรอกฟอร์มส่งใบแจ้งหนี้/ใบส่งของ/ใบวางบิล
          </Button>
        </div>
      }
    />
  );
}

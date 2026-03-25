import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { Input } from '@/components/ui/input';
import { ProjectDataTable } from '@/features/projects/components/tables/DataTable';

import { useVendorSubmissions } from '../hooks/useVendorSubmissions';
import type { VendorFilterParams } from '../types';
import { vendorSubmissionColumns } from './VendorColumns';

interface VendorSubmissionTableProps {
  filters: VendorFilterParams;
  onSearchChange: (search: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onExport: (selectedIds: string[]) => void;
}

export function VendorSubmissionTable({ filters }: VendorSubmissionTableProps) {
  const { data, isLoading, isError } = useVendorSubmissions(filters);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [date, setDate] = useState<DateRange | undefined>();

  const table = useReactTable({
    data: data || [],
    columns: vendorSubmissionColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      rowSelection,
      pagination,
      globalFilter: filters.search,
    },
    enableRowSelection: true,
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

  return (
    <ProjectDataTable
      table={table}
      columnsLength={vendorSubmissionColumns.length}
      toolbar={
        <div className="flex w-full items-center justify-end gap-3">
          <div className="relative min-w-[342px]">
            <Input
              className="normal pr-10"
              placeholder={'ค้นหาจากเลขที่ PO, ชื่อผู้ค้า, เลขที่ลงรับ, ...'}
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
          </div>

          <DatePickerWithRange value={date} onChange={setDate} />

          <Button variant="outline" className="whitespace-nowrap" onClick={() => {}}>
            <ExternalLink className="h-4 w-4" />
            ไปที่หน้ากรอกฟอร์มส่งใบแจ้งหนี้/ใบส่งของ/ใบวางบิล
          </Button>
        </div>
      }
    />
  );
}

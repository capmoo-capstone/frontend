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
import { AlertTriangle, Loader2 } from 'lucide-react';

import { ExportTableToolbar } from '@/components/ExportTableToolbar';
import { DateRangeFilter } from '@/components/date-range-filter';
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

export function VendorSubmissionTable({
  filters,
  onSearchChange,
  onDateRangeChange,
  onExport,
}: VendorSubmissionTableProps) {
  const { data, isLoading, isError } = useVendorSubmissions(filters);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

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

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const hasSelection = selectedCount > 0;
  const isAllSelected = table.getIsAllPageRowsSelected();

  const handleToggleSelectAll = () => {
    if (isAllSelected || hasSelection) {
      table.resetRowSelection();
    } else {
      table.toggleAllPageRowsSelected(true);
    }
  };

  const handleSearch = () => {
    onSearchChange(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  const handleExport = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    onExport(selectedIds);
    table.resetRowSelection();
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
      toolbar={
        <ExportTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          searchPlaceholder="ค้นหา"
          selectedCount={selectedCount}
          hasSelection={hasSelection}
          onToggleSelectAll={handleToggleSelectAll}
          dateRangeFilter={<DateRangeFilter onDateRangeChange={onDateRangeChange} />}
          actions={[
            {
              label: 'ส่งออกข้อมูล',
              onClick: handleExport,
              disabled: !hasSelection,
              title: !hasSelection ? 'กรุณาเลือกรายการก่อนส่งออก' : 'ส่งออกข้อมูลที่เลือก',
            },
          ]}
        />
      }
    />
  );
}

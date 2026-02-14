import { useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { ExportTableToolbar } from '@/components/ExportTableToolbar';
import { ProjectDataTable } from '@/features/projects/components/tables/DataTable';

import { useDocExport } from '../hooks/useDocExport';
import { getDocExportColumns } from './DocExportColumns';

export function DocExportTable() {
  const { data, isLoading } = useDocExport();

  // State Management for Table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [searchQuery, setSearchQuery] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  // Generate columns
  const columns = getDocExportColumns();

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      rowSelection,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    globalFilterFn: 'includesString',
  });

  const handleSearch = () => {
    setGlobalFilter(searchQuery);
  };

  const handleBulkSubmit = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการส่งเอกสาร');
      return;
    }

    const projectNos = selectedRows
      .map((row) => row.original.receive_no)
      .slice(0, 3)
      .join(', ');
    const moreCount = selectedRows.length > 3 ? ` และอีก ${selectedRows.length - 3} รายการ` : '';

    toast.success(`ส่งเอกสาร ${selectedRows.length} รายการสำเร็จ`, {
      description: `เลขที่ลงรับ: ${projectNos}${moreCount}`,
      duration: 4000,
    });
    table.resetRowSelection();
  };

  const handleBulkApprove = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการอนุมัติ');
      return;
    }

    const projectNos = selectedRows
      .map((row) => row.original.receive_no)
      .slice(0, 3)
      .join(', ');
    const moreCount = selectedRows.length > 3 ? ` และอีก ${selectedRows.length - 3} รายการ` : '';

    toast.success(`อนุมัติเอกสาร ${selectedRows.length} รายการสำเร็จ`, {
      description: `เลขที่ลงรับ: ${projectNos}${moreCount}`,
      duration: 4000,
    });
    table.resetRowSelection();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border bg-white">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

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

  const handleClearSearch = () => {
    setSearchQuery('');
    setGlobalFilter('');
  };

  return (
    <div className="space-y-4">
      {/* No Data State */}
      {data && data.length === 0 && (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border bg-white">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium">ไม่พบข้อมูลโครงการ</p>
            <p className="text-sm">ยังไม่มีโครงการที่ต้องการส่งเอกสาร</p>
          </div>
        </div>
      )}

      {/* Table */}
      {data && data.length > 0 && (
        <div className="overflow-hidden">
          <ProjectDataTable
            table={table}
            columnsLength={columns.length}
            toolbar={
              <ExportTableToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                selectedCount={selectedCount}
                hasSelection={hasSelection}
                onToggleSelectAll={handleToggleSelectAll}
                actions={[
                  {
                    label: 'เสนอลงนาม',
                    onClick: handleBulkSubmit,
                    disabled: !hasSelection,
                    title: !hasSelection ? 'กรุณาเลือกรายการก่อนส่งเอกสาร' : 'ส่งเอกสารที่เลือก',
                  },
                  {
                    label: 'ลงนามเรียบร้อย',
                    onClick: handleBulkApprove,
                    variant: 'default',
                    disabled: !hasSelection,
                    title: !hasSelection ? 'กรุณาเลือกรายการก่อนอนุมัติ' : 'อนุมัติที่เลือก',
                  },
                ]}
              />
            }
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';

import {
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  // Generate columns with callbacks
  const columns = getDocExportColumns({
    onSubmitDoc: (item) => {
      toast.success('ส่งเอกสารสำเร็จ', {
        description: `เลขที่ลงรับ: ${item.receive_no}`,
      });
      // API call to submit document
    },
    onApprove: (item) => {
      toast.success('อนุมัติเอกสารสำเร็จ', {
        description: `เลขที่ลงรับ: ${item.receive_no}`,
      });
      // API call to approve document
    },
    onReject: (item) => {
      toast.error('ไม่อนุมัติเอกสาร', {
        description: `เลขที่ลงรับ: ${item.receive_no}`,
      });
      // API call to reject document
    },
  });

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

  // Debounced search - auto-search after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = () => {
    // Immediate search on button click
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

  const DocExportToolbar = (
    <div className="flex flex-1 flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      {/* Left Side: Search & Selection Info */}
      <div className="flex flex-1 items-center gap-4">
        <div className="bg-background relative w-full max-w-sm rounded-lg">
          <Input
            className="normal pr-20"
            placeholder="ค้นหาโครงการ, เลขที่ลงรับ, ผู้รับผิดชอบ..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute inset-y-0 right-8 flex h-full items-center px-2 hover:bg-transparent"
              onClick={() => {
                setSearchQuery('');
                setGlobalFilter('');
              }}
            >
              <X className="text-muted-foreground h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-transparent"
            onClick={handleSearch}
          >
            <Search className="text-muted-foreground h-4 w-4" />
          </Button>
        </div>

        {/* Selection Count */}
        {hasSelection && (
          <div className="text-muted-foreground hidden text-sm font-medium whitespace-nowrap md:block">
            เลือกแล้ว {selectedCount} รายการ
          </div>
        )}
      </div>

      {/* Right Side: Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={handleToggleSelectAll}>
          {hasSelection ? 'ยกเลิกการเลือก' : 'เลือกทั้งหมด'}
        </Button>
        <Button
          variant="brand"
          onClick={handleBulkSubmit}
          disabled={!hasSelection}
          title={!hasSelection ? 'กรุณาเลือกรายการก่อนส่งเอกสาร' : 'ส่งเอกสารที่เลือก'}
        >
          เสนอลงนาม
        </Button>
        <Button
          variant="default"
          onClick={handleBulkApprove}
          disabled={!hasSelection}
          title={!hasSelection ? 'กรุณาเลือกรายการก่อนอนุมัติ' : 'อนุมัติที่เลือก'}
        >
          ลงนามเรียบร้อย
        </Button>
      </div>
    </div>
  );

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
            toolbar={DocExportToolbar}
          />
        </div>
      )}
    </div>
  );
}

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

import { useFinanceExport } from '../hooks/useFinanceExport';
import type { FinanceExportItem } from '../types';
import { getFinanceColumns } from './FinanceColumns';
import { RequestEditDialog } from './RequestEditDialog';

export function FinanceTable() {
  const { data, isLoading } = useFinanceExport();

  // State Management for Table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({}); // Stores selected rows
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  // Dialog state
  const [itemToEdit, setItemToEdit] = useState<FinanceExportItem | null>(null);

  // Generate columns with callbacks
  const columns = getFinanceColumns({
    onRequestEdit: (item) => setItemToEdit(item),
    onMarkComplete: (item) => {
      toast.success(`แก้ไขโครงการเสร็จสิ้น`, {
        description: `เลขที่ลงรับ: ${item.receive_no}`,
      });
      // Here you would call your API to mark as complete
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
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
  });

  const handleRequestEdit = (reason: string) => {
    if (!itemToEdit) return;

    toast.success('ส่งคำขอแก้ไขเรียบร้อยแล้ว', {
      description: `เลขที่ลงรับ: ${itemToEdit.receive_no} - เหตุผล: ${reason}`,
    });
    // Here you would call your API to request edit with the reason
    setItemToEdit(null);
  };

  const handleExport = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการส่งออก');
      return;
    }

    // Show project details in toast
    const projectNos = selectedRows
      .map((row) => row.original.receive_no)
      .slice(0, 3)
      .join(', ');
    const moreCount = selectedRows.length > 3 ? ` และอีก ${selectedRows.length - 3} รายการ` : '';

    toast.success(`ส่งออกรายงาน ${selectedRows.length} รายการสำเร็จ`, {
      description: `เลขที่ลงรับ: ${projectNos}${moreCount}`,
      duration: 4000,
    });
    table.resetRowSelection();
  };

  const handleCloseProject = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการปิดโครงการ');
      return;
    }

    // Show project details in toast
    const projectNos = selectedRows
      .map((row) => row.original.receive_no)
      .slice(0, 3)
      .join(', ');
    const moreCount = selectedRows.length > 3 ? ` และอีก ${selectedRows.length - 3} รายการ` : '';

    toast.success(`ปิดโครงการ ${selectedRows.length} รายการสำเร็จ`, {
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

  return (
    <div className="space-y-4">
      {/* No Data State */}
      {data && data.length === 0 && (
        <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-lg border bg-white">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium">ไม่พบข้อมูลโครงการ</p>
            <p className="text-sm">ยังไม่มีโครงการที่พร้อมส่งออกให้การเงิน</p>
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
                selectedCount={selectedCount}
                hasSelection={hasSelection}
                onToggleSelectAll={handleToggleSelectAll}
                actions={[
                  {
                    label: 'ส่งออกรายงาน',
                    onClick: handleExport,
                    disabled: !hasSelection,
                    title: !hasSelection ? 'กรุณาเลือกรายการก่อนส่งออก' : 'ส่งออกรายงานที่เลือก',
                  },
                  {
                    label: 'ปิดโครงการ',
                    onClick: handleCloseProject,
                    variant: 'default',
                    disabled: !hasSelection,
                    title: !hasSelection ? 'กรุณาเลือกรายการก่อนปิดโครงการ' : 'ปิดโครงการที่เลือก',
                  },
                ]}
              />
            }
          />
        </div>
      )}

      {/* Request Edit Dialog */}
      <RequestEditDialog
        isOpen={!!itemToEdit}
        onClose={() => setItemToEdit(null)}
        onConfirm={handleRequestEdit}
        projectTitle={itemToEdit?.project_title}
      />
    </div>
  );
}

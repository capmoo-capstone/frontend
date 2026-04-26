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
import { useAuth } from '@/context/useAuth';
import {
  ProjectDataTable,
  useCloseProject,
  useCompleteProjectContract,
  useRequestProjectEdit,
} from '@/features/projects';

import { useFinanceExport } from '../hooks/useFinanceExport';
import type { FinanceExportItem } from '../types';
import { isReadyToCloseProject, needsFinanceExportCompletion } from '../utils/financeFormatters';
import { downloadFinanceProjectsPdf } from '../utils/financePdf';
import { getFinanceColumns } from './FinanceColumns';
import { RequestEditDialog } from './RequestEditDialog';

const getSelectedProjectsDescription = (items: FinanceExportItem[]) => {
  const projectNos = items
    .map((item) => item.receive_no)
    .slice(0, 3)
    .join(', ');
  const moreCount = items.length > 3 ? ` และอีก ${items.length - 3} รายการ` : '';

  return `เลขที่ลงรับ: ${projectNos}${moreCount}`;
};

export function FinanceTable() {
  const { data, isLoading } = useFinanceExport();
  const { user } = useAuth();
  const completeContractMutation = useCompleteProjectContract();
  const closeProjectMutation = useCloseProject();
  const requestEditMutation = useRequestProjectEdit();

  // State Management for Table
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({}); // Stores selected rows
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [isBulkActionPending, setIsBulkActionPending] = useState(false);

  // Dialog state
  const [itemToEdit, setItemToEdit] = useState<FinanceExportItem | null>(null);
  const isActionPending =
    isBulkActionPending ||
    completeContractMutation.isPending ||
    closeProjectMutation.isPending ||
    requestEditMutation.isPending;

  function getSelectedItems() {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }

  async function handleRequestEdit(reason: string) {
    if (!itemToEdit) return;

    const requestEditPromise = requestEditMutation.mutateAsync({
      projectId: itemToEdit.id,
      reason,
    });

    toast.promise(requestEditPromise, {
      loading: 'กำลังส่งคำขอแก้ไข...',
      success: 'ส่งคำขอแก้ไขเรียบร้อยแล้ว',
      error: 'ไม่สามารถส่งคำขอแก้ไขได้',
    });

    await requestEditPromise;
    setItemToEdit(null);
  }

  async function handleCloseSingleProject(item: FinanceExportItem) {
    if (!isReadyToCloseProject(item)) {
      toast.error('กรุณาเลือกรายการที่ส่งออกแล้วเท่านั้น');
      return;
    }

    const closePromise = closeProjectMutation.mutateAsync(item.id);

    toast.promise(closePromise, {
      loading: 'กำลังปิดโครงการ...',
      success: 'ปิดโครงการสำเร็จ',
      error: 'ไม่สามารถปิดโครงการได้',
    });

    try {
      await closePromise;
      table.resetRowSelection();
    } catch (error) {
      console.error(error);
    }
  }

  // Generate columns with callbacks
  const columns = getFinanceColumns({
    isActionPending,
    onCloseProject: handleCloseSingleProject,
    onRequestEdit: (item) => setItemToEdit(item),
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

  const handleExport = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการส่งออก');
      return;
    }

    const exportPromise = (async () => {
      await downloadFinanceProjectsPdf(selectedItems, {
        generatedBy: user?.full_name,
      });
      await Promise.all(
        selectedItems
          .filter(needsFinanceExportCompletion)
          .map((item) => completeContractMutation.mutateAsync(item.id))
      );
    })();

    setIsBulkActionPending(true);
    toast.promise(exportPromise, {
      loading: `กำลังส่งออกรายงาน ${selectedItems.length} รายการ...`,
      success: () => ({
        message: `ส่งออกรายงาน ${selectedItems.length} รายการสำเร็จ`,
        description: getSelectedProjectsDescription(selectedItems),
        duration: 4000,
      }),
      error: 'ไม่สามารถส่งออกรายงานได้',
    });

    try {
      await exportPromise;
      table.resetRowSelection();
    } catch (error) {
      console.error(error);
    } finally {
      setIsBulkActionPending(false);
    }
  };

  const handleCloseProject = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      toast.error('กรุณาเลือกรายการที่ต้องการปิดโครงการ');
      return;
    }
    if (!selectedItems.every(isReadyToCloseProject)) {
      toast.error('กรุณาเลือกรายการที่ส่งออกแล้วเท่านั้น');
      return;
    }

    const closePromise = Promise.all(
      selectedItems.map((item) => closeProjectMutation.mutateAsync(item.id))
    );

    setIsBulkActionPending(true);
    toast.promise(closePromise, {
      loading: `กำลังปิดโครงการ ${selectedItems.length} รายการ...`,
      success: () => ({
        message: `ปิดโครงการ ${selectedItems.length} รายการสำเร็จ`,
        description: getSelectedProjectsDescription(selectedItems),
        duration: 4000,
      }),
      error: 'ไม่สามารถปิดโครงการได้',
    });

    try {
      await closePromise;
      table.resetRowSelection();
    } catch (error) {
      console.error(error);
    } finally {
      setIsBulkActionPending(false);
    }
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
                    disabled: !hasSelection || isActionPending,
                    title: !hasSelection ? 'กรุณาเลือกรายการก่อนส่งออก' : 'ส่งออกรายงานที่เลือก',
                  },
                  {
                    label: 'ปิดโครงการ',
                    onClick: handleCloseProject,
                    variant: 'default',
                    disabled: !hasSelection || isActionPending,
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

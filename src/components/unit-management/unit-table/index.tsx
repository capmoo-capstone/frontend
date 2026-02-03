'use client';

import { useMemo, useState } from 'react';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { DeleteMemberDialog } from '@/components/unit-management/unit-dialog/delete-member-dialog';
import { useUsersForSelection } from '@/hooks/useUsers';
import type { UserSelectionItem } from '@/types/user';

import { getColumns } from './columns';
import { UnitDataTable } from './data-table';

export function UnitTable({ unitId, isEditing }: { unitId: string; isEditing: boolean }) {
  const {
    data: users,
    isLoading,
    isError,
  } = useUsersForSelection(unitId ? { unitId } : { departmentId: '' });

  const [memberToDelete, setMemberToDelete] = useState<UserSelectionItem | null>(null);

  const columns = useMemo(
    () => getColumns({ onDeleteMember: (user) => setMemberToDelete(user), isEditing }),
    [isEditing]
  );

  const table = useReactTable({
    data: useMemo(
      () => users?.data?.filter((user: UserSelectionItem) => user.role !== 'HEAD_OF_UNIT') ?? [],
      [users?.data]
    ),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmCancel = async () => {
    if (!memberToDelete) return;
    // Simulate API Call (Replace with mutateAsync from your hook)
    console.log(`Cancelling Member ${memberToDelete.id}`);
    toast.success('ยกเลิกสมาชิกเรียบร้อยแล้ว');
  };

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
        <p className="text-primary">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      </div>
    );
  }

  return (
    <>
      <UnitDataTable
        table={table}
        columnsLength={columns.length}
        toolbar={
          <div className="flex w-full items-center justify-between space-x-4">
            <div className="flex items-center gap-2"></div>
          </div>
        }
      />

      <DeleteMemberDialog
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmCancel}
        memberName={memberToDelete?.full_name}
      />
    </>
  );
}

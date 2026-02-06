'use client';

import { useMemo, useState } from 'react';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useUsersForSelection } from '@/hooks/useUsers';
import type { UserSelectionItem } from '@/types/user';

import { getColumns } from './columns';
import { UnitDataTable } from './data-table';

export function UnitTable({
  unitId,
  isEditing,
  newMemberIds = [],
}: {
  unitId: string;
  isEditing: boolean;
  newMemberIds: string[];
}) {
  const {
    data: users,
    isLoading,
    isError,
  } = useUsersForSelection(unitId ? { unitId } : { departmentId: '' });

  const { data: allUsers } = useUsersForSelection({ departmentId: 'department_procure' });

  const [memberToDelete, setMemberToDelete] = useState<UserSelectionItem | null>(null);

  const columns = useMemo(
    () => getColumns({ onDeleteMember: (user) => setMemberToDelete(user), isEditing }),
    [isEditing]
  );

  const combinedData = useMemo(() => {
    const existingMembers =
      users?.data?.filter((user: UserSelectionItem) => user.role !== 'HEAD_OF_UNIT') ?? [];

    const newMembers = newMemberIds
      .map((id) => {
        const userData =
          allUsers?.data?.find((u) => u.id === id) || users?.data?.find((u) => u.id === id);

        return userData ? { ...userData, isNew: true } : null;
      })
      .filter((u): u is UserSelectionItem & { isNew: boolean } => !!u);

    const uniqueExistingMembers = existingMembers.filter((em) => !newMemberIds.includes(em.id));

    return [...newMembers, ...uniqueExistingMembers];
  }, [users?.data, newMemberIds, allUsers?.data]);

  const table = useReactTable({
    data: combinedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    </>
  );
}

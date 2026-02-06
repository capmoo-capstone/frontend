'use client';

import { useMemo } from 'react';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useUsersForSelection } from '@/hooks/useUsers';
import type { UserSelectionItem } from '@/types/user';

import { getColumns } from './columns';
import { UnitDataTable } from './data-table';

interface UnitTableProps {
  unitId: string;
  isEditing: boolean;
  newMemberIds: string[];
  membersToDelete: string[];
  onDeletedMembersChange?: (deletedMemberIds: string[]) => void;
}

export function UnitTable({
  unitId,
  isEditing,
  newMemberIds = [],
  membersToDelete = [],
  onDeletedMembersChange,
}: UnitTableProps) {
  const {
    data: users,
    isLoading,
    isError,
  } = useUsersForSelection(unitId ? { unitId } : { departmentId: '' });

  const { data: allUsers } = useUsersForSelection({ departmentId: 'department_procure' });

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteMember: (user) => {
          if (isEditing) {
            const updatedList = membersToDelete.includes(user.id)
              ? membersToDelete
              : [...membersToDelete, user.id];
            onDeletedMembersChange?.(updatedList);
          }
        },
        isEditing,
      }),
    [isEditing, membersToDelete, onDeletedMembersChange] // เพิ่ม dependencies
  );

  const combinedData = useMemo(() => {
    const existingMembers =
      users?.data?.filter((user: UserSelectionItem) => user.role !== 'HEAD_OF_UNIT') ?? [];

    const filteredExisting = existingMembers.filter((em) => !membersToDelete.includes(em.id));

    const newMembers = newMemberIds
      .map((id) => {
        const userData =
          allUsers?.data?.find((u) => u.id === id) || users?.data?.find((u) => u.id === id);
        return userData ? { ...userData, isNew: true } : null;
      })
      .filter((u): u is UserSelectionItem & { isNew: boolean } => !!u);

    return [...newMembers, filteredExisting.filter((em) => !newMemberIds.includes(em.id))].flat();
  }, [users?.data, newMemberIds, allUsers?.data, membersToDelete]);

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

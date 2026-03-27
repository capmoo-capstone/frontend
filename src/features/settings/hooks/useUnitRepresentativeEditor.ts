import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { createDepartmentRepresentativeSchema } from '../types';
import { useUpdateUnitRepresentative } from './useDepartmentReps';

export interface UnitItem {
  id: string;
  name: string;
  representative?: { id: string; name: string } | null;
}

interface UseUnitRepresentativeEditorParams {
  departmentId: string;
  unit: UnitItem;
}

export function useUnitRepresentativeEditor({
  departmentId,
  unit,
}: UseUnitRepresentativeEditorParams) {
  const queryClient = useQueryClient();
  const updateRepresentative = useUpdateUnitRepresentative();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(unit.representative?.id || '');
  const [selectedUserName, setSelectedUserName] = useState(unit.representative?.name || '');
  const [error, setError] = useState('');

  const handleCancel = () => {
    setSelectedUserId(unit.representative?.id || '');
    setSelectedUserName(unit.representative?.name || '');
    setError('');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!selectedUserId || !selectedUserName) return;

    const allUnits = queryClient
      .getQueriesData<Array<UnitItem>>({ queryKey: ['units'] })
      .flatMap(([, units]) => units ?? [])
      .map((item) => ({ unitId: item.id, userId: item.representative?.id }));

    const schema = createDepartmentRepresentativeSchema({
      currentUnitId: unit.id,
      allAssignments: allUnits,
    });

    const parsed = schema.safeParse({ user_id: selectedUserId });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    setError('');

    updateRepresentative.mutate(
      {
        departmentId,
        unitId: unit.id,
        userId: selectedUserId,
        userName: selectedUserName,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
  };

  return {
    error,
    isEditing,
    isSaving: updateRepresentative.isPending,
    selectedUserId,
    setIsEditing,
    handleCancel,
    handleSave,
    handleSelectUser,
  };
}

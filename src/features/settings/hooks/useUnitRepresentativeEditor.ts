import { useState } from 'react';

import { useUpdateRepresentative } from './useDepartmentReps';

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
  unit,
}: UseUnitRepresentativeEditorParams) {
  const updateRepresentative = useUpdateRepresentative();

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

    setError('');

    updateRepresentative.mutate(
      {
        unitId: unit.id,
        userId: selectedUserId,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: () => {
          setError('ยังไม่สามารถบันทึกได้ กรุณาลองใหม่อีกครั้ง');
        },
      }
    );
  };

  const handleSelectUser = (userId: string, userName?: string) => {
    setSelectedUserId(userId);

    if (typeof userName === 'string') {
      setSelectedUserName(userName);
    }
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

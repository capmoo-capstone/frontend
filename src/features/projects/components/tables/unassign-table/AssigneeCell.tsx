import { useEffect, useState } from 'react';

import { UserSelect } from '@/features/users';

interface AssigneeCellProps {
  rowId: string;
  originalValue: string | null;
  pendingChanges: Record<string, string>;
  setPendingChanges: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  unitId?: string;
}

export function AssigneeCell({
  rowId,
  originalValue,
  pendingChanges,
  setPendingChanges,
  unitId,
}: AssigneeCellProps) {
  const isDirty = Object.prototype.hasOwnProperty.call(pendingChanges, rowId);

  const currentValue = isDirty ? pendingChanges[rowId] : originalValue;
  const [localValue, setLocalValue] = useState<string | null>(currentValue ?? null);

  useEffect(() => {
    setLocalValue(currentValue ?? null);
  }, [currentValue]);

  const removePendingChange = (prev: Record<string, string>) => {
    const next = { ...prev };
    delete next[rowId];
    return next;
  };

  const handleCommit = () => {
    setPendingChanges((prev) => {
      const nextValue = localValue ?? '';
      const baselineValue = originalValue ?? '';

      if (nextValue === baselineValue) {
        return removePendingChange(prev);
      }

      return {
        ...prev,
        [rowId]: nextValue,
      };
    });
  };

  const handleReset = () => {
    setLocalValue(originalValue ?? null);
    setPendingChanges((prev) => removePendingChange(prev));
  };

  return (
    <UserSelect
      value={localValue}
      unitId={unitId}
      onChange={(newId) => setLocalValue(newId || null)}
      onBlur={handleCommit}
      onReset={handleReset}
      className="h-8 w-48 flex-1 text-sm"
      hasClearButton={true}
    />
  );
}

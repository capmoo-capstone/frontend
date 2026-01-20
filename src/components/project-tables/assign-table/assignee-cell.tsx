import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UserSelect } from '@/components/user-select';

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
  // Determine if this specific cell has a pending change
  const isDirty = Object.prototype.hasOwnProperty.call(pendingChanges, rowId);

  // Use pending value if exists, otherwise fall back to original (DB) value
  const currentValue = isDirty ? pendingChanges[rowId] : originalValue;

  const handleReset = () => {
    // Remove this row from pending changes (Undo)
    setPendingChanges((prev) => {
      const { [rowId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="flex items-center gap-2 min-w-64">
      <UserSelect
        value={currentValue}
        unitId={unitId}
        onChange={(newId) => {
          setPendingChanges((prev) => {
            if (newId === originalValue || (newId === '' && originalValue === null)) {
              const { [rowId]: _, ...rest } = prev;
              return rest;
            }

            return {
              ...prev,
              [rowId]: newId,
            };
          });
        }}
        className="h-8 text-sm w-48 flex-1"
        hasClearButton={false}
      />

      {isDirty && (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8"
          onClick={handleReset}
          title="Reset to original"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

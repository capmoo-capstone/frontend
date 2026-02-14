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
  const isDirty = Object.prototype.hasOwnProperty.call(pendingChanges, rowId);

  const currentValue = isDirty ? pendingChanges[rowId] : originalValue;

  const handleReset = () => {
    setPendingChanges((prev) => {
      const { [rowId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
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
      onReset={handleReset}
      className="h-8 w-48 flex-1 text-sm"
      hasClearButton={true}
    />
  );
}

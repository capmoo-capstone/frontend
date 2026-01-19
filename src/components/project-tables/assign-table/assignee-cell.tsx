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
  const currentValue = pendingChanges[rowId] ?? originalValue;

  return (
    <UserSelect
      value={currentValue}
      unitId={unitId}
      onChange={(newId) => {
        setPendingChanges((prev) => ({
          ...prev,
          [rowId]: newId,
        }));
      }}
      className="h-8 w-55 text-sm"
    />
  );
}

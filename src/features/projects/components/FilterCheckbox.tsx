import { Checkbox } from '@/components/ui/checkbox';

import type { ProcurementType, ProjectStatus, ProjectUrgentStatus } from '../types';

interface FilterCheckboxProps {
  id: ProcurementType | ProjectStatus | ProjectUrgentStatus | 'MY_TASKS';
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function FilterCheckbox({ id, label, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-2 py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <div className="normal">{label}</div>
    </div>
  );
}

import { useDepartmentUnits } from '../hooks/useDepartmentReps';
import { DepartmentUnitRepRow } from './DepartmentUnitRepRow';

interface DepartmentUnitListProps {
  departmentId: string;
}

export function DepartmentUnitList({ departmentId }: DepartmentUnitListProps) {
  const { data: units } = useDepartmentUnits(departmentId);

  return (
    <div className="divide-y">
      {units?.map((unit) => (
        <DepartmentUnitRepRow key={unit.id} departmentId={departmentId} unit={unit} />
      ))}
    </div>
  );
}

import { useDepartmentUnits } from '../hooks/useDepartmentReps';
import { DepartmentUnitRepRow } from './DepartmentUnitRepRow';

interface DepartmentUnitListProps {
  departmentId: string;
}

export function DepartmentUnitList({ departmentId }: DepartmentUnitListProps) {
  const { data: units, isLoading } = useDepartmentUnits(departmentId);

  if (!isLoading && (!units || units.length === 0)) {
    return (
      <div className="text-muted-foreground py-4 text-center text-sm">
        ยังไม่มีฝ่ายงานในหน่วยงานนี้
      </div>
    );
  }

  return (
    <div className="divide-y">
      {units?.map((unit) => (
        <DepartmentUnitRepRow key={unit.id} departmentId={departmentId} unit={unit} />
      ))}
    </div>
  );
}

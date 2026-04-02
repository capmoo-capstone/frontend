import { useDepartmentUnits } from '../../hooks/useDepartmentReps';
import { DepartmentUnitRepRow } from './DepartmentUnitRepRow';

interface DepartmentUnitListProps {
  departmentId: string;
}

export function DepartmentUnitList({ departmentId }: DepartmentUnitListProps) {
  const { data: units, isLoading } = useDepartmentUnits(departmentId);

  if (!isLoading && (!units || units.length === 0)) {
    return (
      <section className="text-muted-foreground normal py-4 text-center">
        ยังไม่มีฝ่ายงานในหน่วยงานนี้
      </section>
    );
  }

  return (
    <section className="divide-y">
      {units?.map((unit) => (
        <DepartmentUnitRepRow key={unit.id} departmentId={departmentId} unit={unit} />
      ))}
    </section>
  );
}

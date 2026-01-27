import { AssignTable } from '@/components/project-tables/unassign-table';
import { AssignedTable } from '@/components/project-tables/assigned-table';

export default function ProcumentJobs() {
  return (
    <div className="relative space-y-6">
      <h1 className="text-h1-topic text-foreground text-center">มอบหมายงานจัดซื้อ</h1>
      <AssignTable unitId="ss" />
      <AssignedTable unitId="ss" />
    </div>
  );
}

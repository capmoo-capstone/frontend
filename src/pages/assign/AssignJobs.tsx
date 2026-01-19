// import { AssignTable } from './components/AssignTable';
import { AssignTable } from '@/components/project-tables/assign-table';

export default function ProcumentJobs() {
  return (
    <div className="relative space-y-6">
      <h1 className="text-h1-topic text-foreground text-center">มอบหมายงานจัดซื้อ</h1>
      <AssignTable unitId="ss" />

      {/* <AssignTable /> */}
    </div>
  );
}

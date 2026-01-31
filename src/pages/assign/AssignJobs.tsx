import { useParams } from 'react-router-dom';

import { AssignedTable } from '@/components/project-tables/assigned-table';
import { AssignTable } from '@/components/project-tables/unassign-table';

export default function ProcumentJobs() {
  const { id } = useParams();
  if (!id) return null;

  return (
    <div className="relative space-y-6">
      <h1 className="text-h1-topic text-foreground text-center">มอบหมายงานจัดซื้อ</h1>
      <AssignTable unitId={id} />
      <AssignedTable unitId={id} />
    </div>
  );
}

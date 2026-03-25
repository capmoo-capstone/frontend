import { useParams } from 'react-router-dom';

import { AssignedTable, UnassignTable } from '@/features/projects/components';

export default function AssignJobs() {
  const { id } = useParams();
  if (!id) return null;

  return (
    <div className="relative space-y-6">
      <h1 className="h1-topic text-primary text-center">{`มอบหมายงาน${id}`}</h1>
      <UnassignTable unitId={id} />
      <AssignedTable unitId={id} />
    </div>
  );
}

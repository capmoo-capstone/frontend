import type { Dispatch, SetStateAction } from 'react';

import { Delete, TextSearch } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ProjectFilterParams } from '../api';
import { ProjectFilterCard } from './ProjectFilterCard';

interface ProjectFilterPanelProps {
  filters: ProjectFilterParams;
  setFilters: Dispatch<SetStateAction<ProjectFilterParams>>;
  onApply: () => void;
  onReset: () => void;
}

export function ProjectFilterPanel({
  filters,
  setFilters,
  onApply,
  onReset,
}: ProjectFilterPanelProps) {
  return (
    <div>
      <ProjectFilterCard filters={filters} setFilters={setFilters} />

      <div className="col-span-4 mt-4 flex justify-end gap-3">
        <Button variant="brand" onClick={onApply}>
          <TextSearch /> ค้นหาขั้นสูง
        </Button>
        <Button variant="outline" onClick={onReset}>
          <Delete /> ล้างค่าตัวกรอง
        </Button>
      </div>
    </div>
  );
}

import { Funnel, Import, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProjectToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onFilterToggle: () => void;
  onImport?: () => void;
  canImportProject?: boolean;
}

export function ProjectToolbar({
  searchQuery,
  onSearchChange,
  onSearch,
  onFilterToggle,
  onImport,
  canImportProject = false,
}: ProjectToolbarProps) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="bg-background relative rounded-lg">
        <Input
          className="normal pr-10"
          placeholder="ค้นหาโครงการ / ผู้รับผิดชอบ"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <Button
          variant="ghost"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={onSearch}
        >
          <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
        </Button>
      </div>
      <Button variant="outline" onClick={onFilterToggle}>
        <Funnel /> ค้นหาขั้นสูง
      </Button>
      {canImportProject && onImport && (
        <Button variant="brand" onClick={onImport}>
          <Import />
          นำเข้าโครงการ
        </Button>
      )}
    </div>
  );
}

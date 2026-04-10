import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ProjectDetail, ProjectUrgentStatus } from '../types/index';
import { getCancelProjectActionLabel } from '../utils/project-selectors';

const isUrgentProject = (value: ProjectUrgentStatus) =>
  value === 'URGENT' || value === 'VERY_URGENT' || value === 'SUPER_URGENT';

interface ProjectHeaderProps {
  project: ProjectDetail;
  canCancelProjects: boolean;
  onEditProject?: () => void;
  onCancelProject?: () => void;
  onExportReport?: () => void;
}

export const ProjectHeader = ({
  project,
  canCancelProjects,
  onEditProject,
  onCancelProject,
  onExportReport,
}: ProjectHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-primary h1-topic">
            {isUrgentProject(project.is_urgent) && <span className="text-destructive">ด่วน </span>}
            {project.title}
          </h1>
          {project.description && (
            <p className="text-muted-foreground normal-l">{project.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="brand" onClick={onExportReport}>
          ส่งออกรายงาน
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEditProject}>
              <Pencil className="h-4 w-4" />
              แก้ไขข้อมูลโครงการ
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onCancelProject}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="text-destructive h-4 w-4" />
              {getCancelProjectActionLabel(canCancelProjects)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

import { MoreVertical, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';
import type { Role } from '@/types/auth';

interface ProjectHeaderProps {
  viewAsRole: Role;
  onCancelProject?: () => void;
  onExportReport?: () => void;
}

export const ProjectHeader = ({
  viewAsRole,
  onCancelProject,
  onExportReport,
}: ProjectHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-primary text-3xl font-semibold">
            <span className="text-destructive">ด่วน</span>
            โครงการจัดซื้อพัสดุสำหรับคณะหมูกรอบ
          </h1>
          <p className="text-muted-foreground text-base">
            dugwduhqbdhjbqwdjhbqjhdbqjhdbqhjdbhqwjdb
          </p>
        </div>
        <h3 className="text-primary text-xl font-medium">
          ผู้รับผิดชอบโครงการ: ทิพปภานันท์ รอดวัฒนกุล
        </h3>
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
            <DropdownMenuItem
              onClick={onCancelProject}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="text-destructive h-4 w-4" />
              {ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole)
                ? 'ยกเลิกโครงการ'
                : 'ขอยกเลิกโครงการ'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

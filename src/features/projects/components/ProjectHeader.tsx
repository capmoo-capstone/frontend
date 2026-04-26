import { useState } from 'react';

import { MoreVertical, Pencil, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { ProjectDetail, ProjectUrgentStatus } from '../types/index';
import { getCancelProjectActionLabel } from '../utils/project-selectors';

const isUrgentProject = (value: ProjectUrgentStatus) =>
  value === 'URGENT' || value === 'VERY_URGENT' || value === 'SUPER_URGENT';

const getUrgentLabel = (value: ProjectUrgentStatus) => {
  if (value === 'URGENT') {
    return 'ด่วน';
  }

  if (value === 'VERY_URGENT') {
    return 'ด่วนที่สุด';
  }

  if (value === 'SUPER_URGENT') {
    return 'ด่วนพิเศษ';
  }

  return null;
};

interface ProjectHeaderProps {
  project: ProjectDetail;
  canCancelProjects: boolean;
  canEditProjectDetails?: boolean;
  onSaveProjectHeader?: (data: { title: string; description: string | null }) => Promise<void>;
  onCancelProject?: () => void;
  onAddAssignee?: () => void;
  onExportReport?: () => void;
  isSaving?: boolean;
}

export const ProjectHeader = ({
  project,
  canCancelProjects,
  canEditProjectDetails = false,
  onSaveProjectHeader,
  onCancelProject,
  onAddAssignee,
  onExportReport,
  isSaving = false,
}: ProjectHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(project.title);
  const [draftDescription, setDraftDescription] = useState(project.description ?? '');

  const handleStartEditing = () => {
    setDraftTitle(project.title);
    setDraftDescription(project.description ?? '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftTitle(project.title);
    setDraftDescription(project.description ?? '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!draftTitle.trim()) {
      return;
    }

    try {
      await onSaveProjectHeader?.({
        title: draftTitle.trim(),
        description: draftDescription.trim() ? draftDescription.trim() : null,
      });
      setIsEditing(false);
    } catch {
      // Error toast is handled by parent.
    }
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-4">
                <h1 className="text-primary h1-topic">
                  {isUrgentProject(project.is_urgent) && (
                    <span className="text-destructive mr-2">
                      {getUrgentLabel(project.is_urgent)}
                    </span>
                  )}
                  {project.title}
                </h1>
                {canEditProjectDetails && (
                  <Button variant="outline" size="icon" onClick={handleStartEditing}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {project.description && (
                <p className="text-muted-foreground normal">{project.description}</p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <Input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="กรุณากรอกชื่อโครงการ"
                disabled={isSaving}
              />
              <Textarea
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                rows={3}
                placeholder="กรุณากรอกรายละเอียดโครงการ"
                disabled={isSaving}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? null : (
            <>
              <Button
                variant="brand"
                onClick={handleSave}
                disabled={isSaving || !draftTitle.trim()}
              >
                บันทึก
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                ยกเลิก
              </Button>
            </>
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
            <DropdownMenuItem onClick={onAddAssignee}>
              <Users className="h-4 w-4" />
              เพิ่มผู้รับผิดชอบ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCancelProject} variant="destructive">
              <Trash2 className="h-4 w-4" />
              {getCancelProjectActionLabel(canCancelProjects)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

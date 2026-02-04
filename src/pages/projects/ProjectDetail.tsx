import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { useAuth } from '@/context/AuthContext';
import { useProjectDetail } from '@/hooks/useProjects';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectInfoGrid } from './components/ProjectInfoGrid';
import { ProjectWorkflowSteps } from './components/workflow/ProjectWorkflowSteps';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);

  if (!id || !user) return null;
  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div className="p-8 text-center text-red-500">Error: {error?.message}</div>;
  if (!project) return null;

  const handleConfirmCancel = async () => {
    toast.success('ยกเลิกโครงการสำเร็จ');
    setIsCancelDialogOpen(false);
  };

  const handleExportReport = async () => {
    toast.success('ส่งออกรายงานสำเร็จ');
  };

  return (
    <>
      <ProjectHeader
        project={project}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        onExportReport={handleExportReport}
        viewAsRole={user.role}
      />
      <ProjectInfoGrid project={project} />

      <ProjectWorkflowSteps project={project} />

      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        projectTitle={project.title}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />
    </>
  );
}

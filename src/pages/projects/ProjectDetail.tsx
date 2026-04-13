import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import {
  ApproveCancelDialog,
  CancelProjectDialog,
  CancellationRequestBanner,
  CancelledProjectBanner,
  type EditProjectData,
  EditProjectDialog,
  ProjectDetailTabs,
  ProjectHeader,
  ProjectInfoGrid,
  useApproveProjectCancellation,
  useProjectDetail,
  useRejectProjectCancellation,
  useUpdateProject,
} from '@/features/projects';
import { useProjectPermissions } from '@/features/projects/hooks/useProjectPermissions';
import { ProcurementWorkflows } from '@/features/workflow';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // View States
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApproveCancelDialogOpen, setIsApproveCancelDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);
  const { mutateAsync: updateProjectMutation } = useUpdateProject();
  const { mutateAsync: approveCancellationMutation } = useApproveProjectCancellation();
  const { mutateAsync: rejectCancellationMutation } = useRejectProjectCancellation();
  const { canCancelProjects } = useProjectPermissions(project?.requester.unit_id ?? undefined);

  if (!id || !user) return null;
  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div className="p-8 text-center text-red-500">Error: {error?.message}</div>;
  if (!project) return null;

  const handleEditProject = async (data: EditProjectData) => {
    try {
      await updateProjectMutation({
        projectId: id,
        payload: data,
      });
      toast.success('อัปเดตข้อมูลโครงการสำเร็จ');
      setIsEditDialogOpen(false);
    } catch {
      toast.error('ไม่สามารถอัปเดตข้อมูลโครงการได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const activeCancellation = project.cancellation?.[0] ?? null;

  const handleApproveCancellation = async () => {
    try {
      await approveCancellationMutation(id);
      toast.success('อนุมัติการยกเลิกโครงการสำเร็จ');
      setIsApproveCancelDialogOpen(false);
    } catch {
      toast.error('ไม่สามารถอนุมัติการยกเลิกโครงการได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleRejectCancellation = async () => {
    try {
      await rejectCancellationMutation(id);
      toast.success('ปฏิเสธคำขอยกเลิกโครงการสำเร็จ');
    } catch {
      toast.error('ไม่สามารถปฏิเสธคำขอยกเลิกโครงการได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <>
      <ProjectHeader
        project={project}
        onEditProject={() => setIsEditDialogOpen(true)}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        canCancelProjects={canCancelProjects}
      />

      {/* --- Project Alerts --- */}
      <div className="space-y-6">
        {project.status === 'WAITING_CANCEL' && activeCancellation && (
          <CancellationRequestBanner
            onRequestApprove={() => setIsApproveCancelDialogOpen(true)}
            onRequestReject={handleRejectCancellation}
          />
        )}
        {project.status === 'CANCELLED' && <CancelledProjectBanner />}
      </div>

      <ProjectInfoGrid project={project} />

      <ProjectDetailTabs project={project} workflowConfigs={ProcurementWorkflows} />

      {/* --- Dialogs --- */}
      <ApproveCancelDialog
        isOpen={isApproveCancelDialogOpen}
        onClose={() => setIsApproveCancelDialogOpen(false)}
        onConfirm={handleApproveCancellation}
        projectTitle={project.title}
        requesterName={activeCancellation?.requester.full_name}
      />

      <EditProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onConfirm={handleEditProject}
        project={project}
      />

      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        project={{ id, title: project.title }}
      />
    </>
  );
}

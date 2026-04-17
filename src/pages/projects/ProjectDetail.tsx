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
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isSavingVendorInfo, setIsSavingVendorInfo] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);
  const { mutateAsync: updateProjectMutation } = useUpdateProject();
  const { mutateAsync: approveCancellationMutation } = useApproveProjectCancellation();
  const { mutateAsync: rejectCancellationMutation } = useRejectProjectCancellation();
  const { canCancelProjects, canEditProjectDetails } = useProjectPermissions();

  if (!id || !user) return null;
  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError) return <div className="p-8 text-center text-red-500">Error: {error?.message}</div>;
  if (!project) return null;

  const handleSaveProjectHeader = async (data: { title: string; description: string | null }) => {
    setIsSavingHeader(true);
    try {
      await updateProjectMutation({
        projectId: id,
        payload: data,
      });
      toast.success('อัปเดตข้อมูลโครงการสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถอัปเดตข้อมูลโครงการได้ กรุณาลองใหม่อีกครั้ง');
      throw error;
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleSaveVendorInfo = async (data: { vendor_name: string; vendor_email: string }) => {
    setIsSavingVendorInfo(true);
    try {
      await updateProjectMutation({
        projectId: id,
        payload: data,
      });
      toast.success('อัปเดตข้อมูลผู้ค้าสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถอัปเดตข้อมูลผู้ค้าได้ กรุณาลองใหม่อีกครั้ง');
      throw error;
    } finally {
      setIsSavingVendorInfo(false);
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

  const handleAddAssignee = () => {
    toast.info('กำลังเตรียมฟีเจอร์เพิ่มผู้รับผิดชอบ');
  };

  return (
    <>
      <ProjectHeader
        project={project}
        canEditProjectDetails={canEditProjectDetails}
        onSaveProjectHeader={handleSaveProjectHeader}
        isSaving={isSavingHeader}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        onAddAssignee={handleAddAssignee}
        canCancelProjects={canCancelProjects}
      />

      {/* --- Project Alerts --- */}
      <div className="space-y-6">
        {project.status === 'WAITING_CANCEL' && activeCancellation && (
          <CancellationRequestBanner
            requesterName={activeCancellation.requester.full_name}
            reason={activeCancellation.reason}
            requestedAt={activeCancellation.requested_at}
            canCancelProjects={canCancelProjects}
            onRequestApprove={() => setIsApproveCancelDialogOpen(true)}
            onRequestReject={handleRejectCancellation}
          />
        )}
        {project.status === 'CANCELLED' && (
          <CancelledProjectBanner
            requesterName={activeCancellation?.requester.full_name}
            approverName={activeCancellation?.approver?.full_name}
            reason={activeCancellation?.reason}
            approvedAt={activeCancellation?.approved_at}
          />
        )}
      </div>

      <ProjectInfoGrid
        project={project}
        canEditProjectDetails={canEditProjectDetails}
        onSaveVendorInfo={handleSaveVendorInfo}
        isSavingVendorInfo={isSavingVendorInfo}
      />

      <ProjectDetailTabs project={project} workflowConfigs={ProcurementWorkflows} />

      {/* --- Dialogs --- */}
      <ApproveCancelDialog
        isOpen={isApproveCancelDialogOpen}
        onClose={() => setIsApproveCancelDialogOpen(false)}
        onConfirm={handleApproveCancellation}
        projectTitle={project.title}
        requesterName={activeCancellation?.requester.full_name}
      />

      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        project={{ id, title: project.title }}
      />
    </>
  );
}

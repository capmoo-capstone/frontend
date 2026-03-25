import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import {
  ApproveCancelDialog,
  CancelProjectDialog,
  CancellationRequestBanner,
  type EditProjectData,
  EditProjectDialog,
  ProjectDetailTabs,
  ProjectHeader,
  ProjectInfoGrid,
  useCancelProject,
  useProjectDetail,
  useUpdateProject,
} from '@/features/projects';
import { ProcurementWorkflows } from '@/features/workflow';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/permissions';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // View States
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApproveCancelDialogOpen, setIsApproveCancelDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);
  const { mutateAsync: cancelProjectMutation } = useCancelProject();
  const { mutateAsync: updateProjectMutation } = useUpdateProject();

  if (!id || !user) return null;
  const viewAsRole = user.role ?? 'GUEST';
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

  return (
    <>
      <ProjectHeader
        project={project}
        onEditProject={() => setIsEditDialogOpen(true)}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        viewAsRole={viewAsRole}
      />

      {/* --- Project Alerts --- */}
      <div className="space-y-6">
        {/* Example: Logic to show banners based on project status would go here */}
        <CancellationRequestBanner
          onRequestApprove={() => setIsApproveCancelDialogOpen(true)}
          onRequestReject={() => {}}
        />
        {/* <CancelledProjectBanner /> */}
      </div>

      <ProjectInfoGrid project={project} />

      <ProjectDetailTabs project={project} workflowConfigs={ProcurementWorkflows} />

      {/* --- Dialogs --- */}
      <ApproveCancelDialog
        isOpen={isApproveCancelDialogOpen}
        onClose={() => setIsApproveCancelDialogOpen(false)}
        onConfirm={async () => {
          toast.success('อนุมัติการยกเลิกโครงการสำเร็จ');
          setIsApproveCancelDialogOpen(false);
        }}
        projectTitle={project.title}
        requesterName="นางสาว เจ้าหน้าที่"
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
        onConfirm={async (reason) => {
          try {
            await cancelProjectMutation({ projectId: id, reason });
            toast.success('ยกเลิกโครงการสำเร็จ');
            setIsCancelDialogOpen(false);
          } catch {
            toast.error('ไม่สามารถยกเลิกโครงการได้ กรุณาลองใหม่อีกครั้ง');
          }
        }}
        projectTitle={project.title}
        isAuthorized={ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole)}
      />
    </>
  );
}

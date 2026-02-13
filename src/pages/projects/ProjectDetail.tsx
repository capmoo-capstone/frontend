import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { ApproveCancelDialog } from '@/components/project-dialog/approve-cancel-dialog';
import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import {
  type EditProjectData,
  EditProjectDialog,
} from '@/components/project-dialog/edit-project-dialog';
import { CancellationRequestBanner } from '@/components/project/ProjectStatusBanners';
import { useAuth } from '@/context/AuthContext';
import {
  ProjectDetailTabs,
  ProjectHeader,
  ProjectInfoGrid,
  useProjectDetail,
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
    console.log('Updating project:', data);
    toast.success('อัปเดตข้อมูลโครงการสำเร็จ');
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <ProjectHeader
        project={project}
        onEditProject={() => setIsEditDialogOpen(true)}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        viewAsRole={user.role}
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
        onConfirm={async () => {
          toast.success('ยกเลิกโครงการสำเร็จ');
          setIsCancelDialogOpen(false);
        }}
        projectTitle={project.title}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />
    </>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { useAuth } from '@/context/AuthContext';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectInfoGrid } from './components/ProjectInfoGrid';

export default function ProjectDetail() {
  const { id } = useParams();
  if (!id) return null;

  const { user } = useAuth();
  if (!user) return null;

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleConfirmCancel = async (reason: string) => {
    // Implement cancel project logic here
    toast.success('ยกเลิกโครงการสำเร็จ');
    setIsCancelDialogOpen(false);
  };

  const handleExportReport = async () => {
    toast.success('ส่งออกรายงานสำเร็จ');
    // Implement export report logic here
  };

  return (
    <>
      <ProjectHeader
        onCancelProject={() => setIsCancelDialogOpen(true)}
        onExportReport={handleExportReport}
        viewAsRole={user.role}
      />
      <ProjectInfoGrid />
      <CancelProjectDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        projectTitle={'project title here'}
        isAuthorized={ManageUnitRoles.includes(user.role) || SupervisorRoles.includes(user.role)}
      />
    </>
  );
}

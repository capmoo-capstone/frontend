import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CalendarRange, ClipboardList, LayoutList, Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

import { ApproveCancelDialog } from '@/components/project-dialog/approve-cancel-dialog';
import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import {
  type EditProjectData,
  EditProjectDialog,
} from '@/components/project-dialog/edit-project-dialog';
import { CancellationRequestBanner } from '@/components/project/ProjectStatusBanners';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useProjectDetail } from '@/hooks/useProjects';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/permissions';
import { cn } from '@/lib/utils';

import { ProjectHeader } from './components/ProjectHeader';
import { ProjectInfoGrid } from './components/ProjectInfoGrid';
import { ProjectSummaryView } from './components/workflow/ProjectSummaryView';
import { ProjectWorkflowSteps } from './components/workflow/ProjectWorkflowSteps';
import { ProcurementWorkflows } from './config/workflow';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  // View States
  const [workflowTab, setWorkflowTab] = useState<'PROCUREMENT' | 'CONTRACT'>('PROCUREMENT');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApproveCancelDialogOpen, setIsApproveCancelDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: project, isLoading, isError, error } = useProjectDetail(id);

  // --- Logic to get specific steps ---
  const activeSteps = useMemo(() => {
    if (!project) return [];
    if (workflowTab === 'PROCUREMENT') {
      return ProcurementWorkflows.find((w) => w.type === project.procurement_type)?.steps || [];
    } else {
      return ProcurementWorkflows.find((w) => w.type === 'CONTRACT')?.steps || [];
    }
  }, [project, workflowTab]);

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

  const getResponsiblePerson = () => {
    if (workflowTab === 'PROCUREMENT') {
      const names = [
        project.assignee_procurement?.full_name,
        'นางสาวพิมพ์ชนก ใจดีนามสกุลยาว',
      ].filter(Boolean);
      return names.join(', ');
    } else {
      const names = [project.assignee_contract?.full_name, 'นายสมชาย รักงาน'].filter(Boolean);
      return names.join(', ');
    }
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

      <Tabs defaultValue="timeline" className="mt-6">
        {/* --- Workflow Tabs & View Toggle --- */}
        <div className="mb-4 flex items-end justify-between border-b">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setWorkflowTab('PROCUREMENT')}
              className={cn(
                'caption flex flex-col items-start gap-1 border-b-2 px-1 pb-3 transition-colors',
                workflowTab === 'PROCUREMENT'
                  ? 'border-brand-9 text-brand-11'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              <div className="normal-b flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                งานจัดซื้อ ({project.procurement_type})
              </div>
            </button>
            <button
              onClick={() => setWorkflowTab('CONTRACT')}
              className={cn(
                'caption flex flex-col items-start gap-1 border-b-2 px-1 pb-3 transition-colors',
                workflowTab === 'CONTRACT'
                  ? 'border-brand-9 text-brand-11'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              <div className="normal-b flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                งานบริหารสัญญา
              </div>
            </button>
          </div>

          <TabsList className="mb-3">
            <TabsTrigger value="timeline" className="gap-2">
              <CalendarRange className="h-3.5 w-3.5" />
              ไทม์ไลน์
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <LayoutList className="h-3.5 w-3.5" />
              สรุปข้อมูล
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Responsible Person Display --- */}
        <div className="text-muted-foreground normal-b mb-2 flex items-center gap-1">
          <span>ผู้รับผิดชอบ:</span>
          <span className="text-primary">{getResponsiblePerson()}</span>
        </div>

        {/* --- Content Area --- */}
        <TabsContent value="timeline">
          <ProjectWorkflowSteps project={project} steps={activeSteps} />
        </TabsContent>

        <TabsContent value="summary">
          <ProjectSummaryView project={project} steps={activeSteps} />
        </TabsContent>
      </Tabs>

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

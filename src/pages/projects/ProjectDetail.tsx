import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  AlertTriangle,
  CalendarRange,
  ClipboardList,
  LayoutList,
  Loader2,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

import { ApproveCancelDialog } from '@/components/project-dialog/approve-cancel-dialog';
import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import {
  type EditProjectData,
  EditProjectDialog,
} from '@/components/project-dialog/edit-project-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useProjectDetail } from '@/hooks/useProjects';
import { formatDateThai } from '@/lib/date-utils';
import { ManageUnitRoles, SupervisorRoles } from '@/lib/role-permissions';
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
      // Find steps based on project type (e.g., 'MT500K', 'EBIDDING')
      return ProcurementWorkflows.find((w) => w.type === project.procurement_type)?.steps || [];
    } else {
      // Find 'CONTRACT' steps
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
    // TODO: Implement API call to update project
    console.log('Updating project with data:', data);
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
      <ProjectInfoGrid project={project} />

      {/* Request from staff to confirm a project deletion */}
      <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <div className="bg-destructive/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-5 w-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="h3-topic text-destructive">คำขอยกเลิกโครงการ</h3>
              <p className="caption text-muted-foreground mt-1">
                ส่งคำขอเมื่อ {formatDateThai(new Date())} เวลา{' '}
                {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
              </p>
            </div>
            <div>
              <p className="normal text-primary">
                <span className="text-muted-foreground">ผู้ขอ:</span> นางสาว เจ้าหน้าที่
              </p>
              <p className="normal text-primary">
                <span className="text-muted-foreground">เหตุผล:</span>{' '}
                ขอยกเลิกเนื่องจากโครงการมีความล่าช้าในการดำเนินงาน
                และไม่สามารถปฏิบัติงานได้ตามแผนที่วางไว้ ส่งผลกระทบต่อการใช้งบประมาณของหน่วยงาน
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="destructive" onClick={() => setIsApproveCancelDialogOpen(true)}>
                อนุมัติและยกเลิกโครงการ
              </Button>
              <Button variant="outline" onClick={() => {}}>
                ปฏิเสธคำขอ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="mt-6">
        {/* --- Workflow Tabs & View Toggle --- */}
        <div className="mb-4 flex items-end justify-between border-b">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setWorkflowTab('PROCUREMENT')}
              className={cn(
                'flex flex-col items-start gap-1 border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
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
                'flex flex-col items-start gap-1 border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
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

        {workflowTab === 'PROCUREMENT' && project.assignee_procurement?.full_name && (
          <div className="text-muted-foreground normal-b mb-2 flex items-center gap-1">
            <span>ผู้รับผิดชอบ:</span>
            {(() => {
              const mockAssignees = [
                project.assignee_procurement.full_name,
                'นางสาวพิมพ์ชนก ใจดีนามสกุลยาว',
              ];
              return (
                <div className="text-primary flex items-center gap-1">
                  {mockAssignees.map((name, idx) => (
                    <span key={idx}>
                      {name}
                      {idx < mockAssignees.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {workflowTab === 'CONTRACT' && project.assignee_contract?.full_name && (
          <div className="text-muted-foreground normal-b mb-2 flex items-center gap-1">
            <span>ผู้รับผิดชอบ:</span>
            {(() => {
              const mockAssignees = [project.assignee_contract.full_name, 'นายสมชาย รักงาน'];
              return (
                <div className="text-primary flex items-center gap-1">
                  {mockAssignees.map((name, idx) => (
                    <span key={idx}>
                      {name}
                      {idx < mockAssignees.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* --- Content Area --- */}
        <TabsContent value="timeline">
          <ProjectWorkflowSteps project={project} steps={activeSteps} />
        </TabsContent>

        <TabsContent value="summary">
          <ProjectSummaryView project={project} steps={activeSteps} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
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

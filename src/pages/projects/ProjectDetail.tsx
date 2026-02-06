import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CalendarRange, ClipboardList, LayoutList, Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

import { CancelProjectDialog } from '@/components/project-dialog/cancel-project-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useProjectDetail } from '@/hooks/useProjects';
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

  return (
    <>
      <ProjectHeader
        project={project}
        onCancelProject={() => setIsCancelDialogOpen(true)}
        viewAsRole={user.role}
      />
      <ProjectInfoGrid project={project} />

      <Tabs defaultValue="timeline" className="mt-6">
        {/* --- Workflow Tabs & View Toggle --- */}
        <div className="mb-4 flex items-end justify-between border-b">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setWorkflowTab('PROCUREMENT')}
              className={cn(
                'flex flex-col items-start gap-1 border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                workflowTab === 'PROCUREMENT'
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              <div className="h3-topic flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                งานจัดซื้อ ({project.procurement_type})
              </div>
              {project.assignee_procurement?.full_name && (
                <div className="text-muted-foreground normal flex items-center gap-1">
                  <span>ผู้รับผิดชอบ:</span>
                  {/* Mock: simulating multiple assignees */}
                  {(() => {
                    const mockAssignees = [
                      project.assignee_procurement.full_name,
                      'นางสาวพิมพ์ชนก ใจดีนามสกุลยาว', 
                    ];
                    return (
                      <div className="flex items-center gap-1">
                        {mockAssignees.map((name, idx) => (
                          <span
                            key={idx}
                            className="caption bg-secondary text-primary ring-ring inline-flex items-center rounded-md px-2 py-0.5 ring-1 ring-inset"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </button>
            <button
              onClick={() => setWorkflowTab('CONTRACT')}
              className={cn(
                'flex flex-col items-start gap-1 border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                workflowTab === 'CONTRACT'
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              <div className="h3-topic flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                งานบริหารสัญญา
              </div>
              {project.assignee_contract?.full_name && (
                <div className="text-muted-foreground normal flex items-center gap-1">
                  <span>ผู้รับผิดชอบ:</span>
                  {/* Mock: simulating multiple assignees */}
                  {(() => {
                    const mockAssignees = [
                      project.assignee_contract.full_name,
                      'นายสมชาย รักงานืกืกดืห้ำ่ดิ่ไ้ิดไิดทืก ดืไอ ', // Mock second person
                    ];
                    return (
                      <div className="flex items-center gap-1">
                        {mockAssignees.map((name, idx) => (
                          <span
                            key={idx}
                            className="caption bg-secondary text-primary ring-ring inline-flex items-center rounded-md px-2 py-0.5 ring-1 ring-inset"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
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

        {/* --- Content Area --- */}
        <TabsContent value="timeline">
          <ProjectWorkflowSteps project={project} steps={activeSteps} />
        </TabsContent>

        <TabsContent value="summary">
          <ProjectSummaryView project={project} steps={activeSteps} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
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

import { useMemo, useState } from 'react';

import { CalendarRange, ClipboardList, LayoutList, ShoppingCart } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProjectSummaryView,
  ProjectWorkflowSteps,
  type WorkflowStepConfig,
  normalizeWorkflowSubmissions,
  useWorkflowSubmissions,
} from '@/features/workflow';
import { cn } from '@/lib/utils';

import type { ProjectDetail } from '../types/index';

interface WorkflowConfig {
  type: string;
  steps: WorkflowStepConfig[];
}

interface ProjectDetailTabsProps {
  project: ProjectDetail;
  workflowConfigs: WorkflowConfig[];
}

export function ProjectDetailTabs({ project, workflowConfigs }: ProjectDetailTabsProps) {
  const [workflowTab, setWorkflowTab] = useState<'PROCUREMENT' | 'CONTRACT'>('PROCUREMENT');
  const { data: workflowSubmissions } = useWorkflowSubmissions(project.id);

  const activeSteps = useMemo(() => {
    if (workflowTab === 'PROCUREMENT') {
      return workflowConfigs.find((w) => w.type === project.procurement_type)?.steps || [];
    } else {
      return workflowConfigs.find((w) => w.type === 'CONTRACT')?.steps || [];
    }
  }, [project.procurement_type, workflowConfigs, workflowTab]);

  const projectWithSubmissions = useMemo(() => {
    const procurementSteps =
      workflowConfigs.find((w) => w.type === project.procurement_type)?.steps || [];
    const contractSteps = workflowConfigs.find((w) => w.type === 'CONTRACT')?.steps || [];

    return {
      ...project,
      submissions: [
        ...normalizeWorkflowSubmissions(workflowSubmissions?.procurement ?? [], procurementSteps),
        ...normalizeWorkflowSubmissions(workflowSubmissions?.contract ?? [], contractSteps),
      ],
    };
  }, [project, workflowConfigs, workflowSubmissions]);

  const getResponsiblePerson = () => {
    if (workflowTab === 'PROCUREMENT') {
      return project.assignee_procurement?.full_name ?? 'ยังไม่มีผู้รับผิดชอบ';
    } else {
      return project.assignee_contract?.full_name ?? 'ยังไม่มีผู้รับผิดชอบ';
    }
  };

  return (
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
        <ProjectWorkflowSteps project={projectWithSubmissions} steps={activeSteps} />
      </TabsContent>

      <TabsContent value="summary">
        <ProjectSummaryView project={projectWithSubmissions} steps={activeSteps} />
      </TabsContent>
    </Tabs>
  );
}

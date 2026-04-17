import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { ProjectDetail } from '@/features/projects';
import { completeProjectProcurement } from '@/features/projects/api';
import { type WorkflowStepConfig, useWorkflow, useWorkflowMutations } from '@/features/workflow';

import { WorkflowList } from './WorkflowList';
import { WorkflowStepRow } from './WorkflowStepRow';

interface ProjectWorkflowStepsProps {
  project: ProjectDetail;
  steps: WorkflowStepConfig[];
  activeWorkflowType: string;
}

export function ProjectWorkflowSteps({
  project,
  steps,
  activeWorkflowType,
}: ProjectWorkflowStepsProps) {
  const { user } = useAuth();
  const workflowMutations = useWorkflowMutations(project.id);

  const workflowState = useWorkflow(project, steps, activeWorkflowType);

  const completeProcurementMutation = useMutation({
    mutationFn: () => completeProjectProcurement(project.id),
    onSuccess: () => {
      // Refetch project details or handle success
      window.location.reload();
    },
  });

  const isMutating =
    workflowMutations.createSubmission.isPending ||
    workflowMutations.approveSubmission.isPending ||
    workflowMutations.rejectSubmission.isPending ||
    workflowMutations.proposeSubmission.isPending ||
    workflowMutations.signSubmission.isPending;

  if (!user) return null;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps.at(-1)?.order;

  // Check if all steps are COMPLETED
  const allStepsCompleted = sortedSteps.every((step) => {
    const stepStatus = workflowState.getStepStatus(step.order);
    return stepStatus === 'COMPLETED';
  });

  // Only show button for procurement workflows (not CONTRACT)
  const isProcurementWorkflow = project.current_template_type !== 'CONTRACT';

  return (
    <>
      <WorkflowList>
        {sortedSteps.map((step) => (
          <WorkflowStepRow
            key={`step-${step.order}`}
            step={step}
            project={project}
            user={user}
            isLast={step.order === lastStepOrder}
            workflowState={workflowState}
            workflowMutations={workflowMutations}
            isMutating={isMutating}
          />
        ))}
      </WorkflowList>

      {isProcurementWorkflow && allStepsCompleted && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => completeProcurementMutation.mutate()}
            disabled={
              completeProcurementMutation.isPending ||
              !allStepsCompleted ||
              user.role !== 'HEAD_OF_UNIT'
            }
            className="gap-2"
          >
            {completeProcurementMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังเปลี่ยน...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                ยืนยันเสร็จสิ้นจัดซื้อ เปลี่ยนไปงานบริหารสัญญา
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

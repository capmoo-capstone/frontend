import { useAuth } from '@/context/AuthContext';
import type { ProjectDetail } from '@/features/projects';
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

  const isMutating =
    workflowMutations.createSubmission.isPending ||
    workflowMutations.approveSubmission.isPending ||
    workflowMutations.rejectSubmission.isPending ||
    workflowMutations.proposeSubmission.isPending ||
    workflowMutations.signSubmission.isPending;

  if (!user) return null;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps.at(-1)?.order;

  return (
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
  );
}

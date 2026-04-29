import { useState } from 'react';

import type { User } from '@/features/auth';
import {
  type ProjectDetail,
  useAssignProjects,
  useCloseProject,
  useCompleteProjectContract,
  useCompleteProjectProcurement,
  useRequestProjectEdit,
} from '@/features/projects';
import { hasRoleInScopes } from '@/lib/permissions';

import type { StepStatus, WorkflowStepConfig } from '../types';

interface WorkflowStatusReader {
  getStepStatus: (stepOrder: number) => StepStatus;
}

interface UseWorkflowHandoffsParams {
  project: ProjectDetail;
  sortedSteps: WorkflowStepConfig[];
  activeWorkflowType: string;
  workflowState: WorkflowStatusReader;
  user: User | null;
}

export function useWorkflowHandoffs({
  project,
  sortedSteps,
  activeWorkflowType,
  workflowState,
  user,
}: UseWorkflowHandoffsParams) {
  const [procurementAssigneeId, setProcurementAssigneeId] = useState('');
  const [procurementHandoffCompleted, setProcurementHandoffCompleted] = useState(
    project.current_template_type === 'CONTRACT'
  );
  const [contractHandoffCompleted, setContractHandoffCompleted] = useState(
    project.contract_status === 'COMPLETED' || project.status === 'CLOSED'
  );
  const [showContractEditInput, setShowContractEditInput] = useState(false);
  const [contractEditReason, setContractEditReason] = useState('');

  const completeProcurementMutation = useCompleteProjectProcurement();
  const assignProjectsMutation = useAssignProjects();
  const completeContractMutation = useCompleteProjectContract();
  const closeProjectMutation = useCloseProject();
  const requestEditMutation = useRequestProjectEdit();

  const allStepsCompleted = sortedSteps.every((step) => {
    const stepStatus = workflowState.getStepStatus(step.order);
    return stepStatus === 'COMPLETED';
  });

  const isProcurementWorkflow = activeWorkflowType !== 'CONTRACT';
  const isContractWorkflow = activeWorkflowType === 'CONTRACT';
  const hasFinanceRole = user?.roles.some((role) => role.role === 'FINANCE_STAFF') ?? false;
  const canCompleteProcurementTransfer =
    !!user &&
    hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId: project.responsible_unit_id }) &&
    allStepsCompleted;

  const isProcurementHandoffBusy =
    completeProcurementMutation.isPending || assignProjectsMutation.isPending;

  const isContractHandoffBusy =
    completeContractMutation.isPending ||
    closeProjectMutation.isPending ||
    requestEditMutation.isPending;

  const canCompleteContract =
    project.status === 'IN_PROGRESS' && project.contract_status === 'NOT_EXPORTED';
  const canCloseProject =
    (project.status === 'IN_PROGRESS' || project.status === 'REQUEST_EDIT') &&
    contractHandoffCompleted;
  const canRequestEdit = project.status === 'CLOSED' && contractHandoffCompleted;

  const handleCompleteProcurementTransfer = async () => {
    if (!canCompleteProcurementTransfer) return;

    await completeProcurementMutation.mutateAsync(project.id);

    if (procurementAssigneeId) {
      await assignProjectsMutation.mutateAsync([
        {
          projectId: project.id,
          userId: procurementAssigneeId,
        },
      ]);
    }

    setProcurementAssigneeId('');
    setProcurementHandoffCompleted(true);
  };

  const handleCompleteContractTransfer = async () => {
    if (!canCompleteContract) return;

    await completeContractMutation.mutateAsync(project.id);
    setContractHandoffCompleted(true);
  };

  const handleCloseProject = async () => {
    if (!canCloseProject) return;

    await closeProjectMutation.mutateAsync(project.id);
  };

  const handleRequestEdit = async () => {
    const reason = contractEditReason.trim();
    if (!canRequestEdit || !reason) return;

    await requestEditMutation.mutateAsync({ projectId: project.id, reason });
    setShowContractEditInput(false);
    setContractEditReason('');
  };

  return {
    allStepsCompleted,
    canCompleteProcurementTransfer,
    canCloseProject,
    canCompleteContract,
    canRequestEdit,
    contractEditReason,
    contractHandoffCompleted,
    hasFinanceRole,
    isContractHandoffBusy,
    isContractWorkflow,
    isProcurementHandoffBusy,
    isProcurementWorkflow,
    procurementAssigneeId,
    procurementHandoffCompleted,
    showContractEditInput,
    setContractEditReason,
    setProcurementAssigneeId,
    setShowContractEditInput,
    handleCloseProject,
    handleCompleteContractTransfer,
    handleCompleteProcurementTransfer,
    handleRequestEdit,
  };
}

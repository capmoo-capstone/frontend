import { useBudgetPlans } from '@/features/budgets';
import type { ProjectDetail } from '@/features/projects';
import type { WorkflowStepConfig } from '@/features/workflow';
import { getFiscalYear } from '@/lib/formatters';

import type { AuthUser } from '../hooks/useStepActor';
import { useStepActor } from '../hooks/useStepActor';
import type { useWorkflow } from '../hooks/useWorkflow';
import type { useWorkflowMutations } from '../hooks/useWorkflowMutations';
import { buildSubmissionPayload } from '../lib/submission-payload';
import { resolveDocumentStaffAction } from '../lib/workflow-actions';
import { getSubmissionStableKey } from '../lib/workflow-identity';
import { DynamicStepForm } from './DynamicStepForm';
import { StatusWaitingCard } from './StatusWaitingCard';
import { StepActionForm } from './StepActionForm';
import { StepHistory } from './StepHistory';
import { WorkflowStep } from './WorkflowStep';

export type WorkflowState = ReturnType<typeof useWorkflow>;
export type WorkflowMutations = ReturnType<typeof useWorkflowMutations>;

interface WorkflowStepRowProps {
  step: WorkflowStepConfig;
  project: ProjectDetail;
  user: AuthUser;
  isLast: boolean;
  workflowState: WorkflowState;
  workflowMutations: WorkflowMutations;
  isMutating: boolean;
}

export function WorkflowStepRow({
  step,
  project,
  user,
  isLast,
  workflowState,
  workflowMutations,
  isMutating,
}: WorkflowStepRowProps) {
  const {
    getStepStatus,
    getStepSubmissions,
    getStepFormData,
    getSubmissionFormData,
    handleStepFormChange,
    handleSelectSubmission,
    handleBackToEdit,
    viewingSubmissions,
  } = workflowState;

  const status = getStepStatus(step.order);
  const submissions = getStepSubmissions(step.order);
  const viewingSubmission = viewingSubmissions[step.order];
  const latestSubmission = submissions.at(-1);

  const actor = useStepActor(user, status, project.status, viewingSubmission);

  const documentStaffAction = resolveDocumentStaffAction(latestSubmission?.backend_status);
  const fiscalYear = String(getFiscalYear(project.created_at));
  const {
    data: budgetPlans,
    isLoading: isLoadingBudgetPlans,
    isError: isErrorBudgetPlans,
  } = useBudgetPlans(project.requester.unit_id ?? '', fiscalYear);

  const handleSubmit = async () => {
    await workflowMutations.createSubmission.mutateAsync({
      project_id: project.id,
      workflow_type: project.current_template_type,
      step_order: step.order,
      require_approval: step.require_approval ?? true,
      ...buildSubmissionPayload(step, getStepFormData(step.order)),
    });
  };

  const handleApprove = async () => {
    if (!latestSubmission?.id) return;

    await workflowMutations.approveSubmission.mutateAsync({
      submissionId: latestSubmission.id,
      requiredSignature: step.requiredSignature ?? true,
    });
  };

  const handleReject = async (reason: string) => {
    if (!latestSubmission?.id) return;

    await workflowMutations.rejectSubmission.mutateAsync({
      submissionId: latestSubmission.id,
      comment: reason,
    });
  };

  const handleSupApprove = async () => {
    if (!latestSubmission?.id) return;

    if (documentStaffAction === 'propose') {
      await workflowMutations.proposeSubmission.mutateAsync(latestSubmission.id);
      return;
    }

    if (documentStaffAction === 'sign') {
      await workflowMutations.signSubmission.mutateAsync(latestSubmission.id);
      return;
    }

    console.warn('Unsupported supervisor action state', latestSubmission.backend_status);
  };

  const formData = viewingSubmission
    ? getSubmissionFormData(viewingSubmission)
    : getStepFormData(step.order);

  const isFormDisabled =
    actor.projectLocked ||
    actor.isCompleted ||
    viewingSubmission !== undefined ||
    !actor.userCanAct ||
    actor.actionRole !== 'GENERAL_STAFF';

  return (
    <WorkflowStep
      id={`step-${step.order}`}
      index={step.order}
      viewAsRole={actor.actionRole}
      isLast={isLast}
      title={step.name}
      status={status}
      projectStatus={project.status}
      canAct={actor.userCanAct}
      isGuest={actor.isGuest}
      isLocked={actor.isStepLocked}
    >
      {!actor.isGuest && (
        <div className="grid grid-cols-1 gap-8 pt-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <StepHistory
              submissions={submissions}
              onSelectSubmission={(submission) => handleSelectSubmission(step.order, submission)}
              selectedSubmissionId={
                viewingSubmission ? getSubmissionStableKey(viewingSubmission) : undefined
              }
            />
          </div>

          <div className="lg:col-span-8">
            {actor.showForm ? (
              <StepActionForm
                isActive={!viewingSubmission && !actor.isCompleted}
                isBusy={isMutating}
                stepStatus={status}
                viewAsRole={actor.actionRole}
                viewSubmission={viewingSubmission ?? null}
                onBackToEdit={() => handleBackToEdit(step.order)}
                onSubmit={handleSubmit}
                onApprove={handleApprove}
                onReject={handleReject}
                onSupApprove={handleSupApprove}
                onDownloadAll={() => {
                  console.warn('Download all not yet implemented');
                }}
                documentStaffAction={documentStaffAction}
              >
                <DynamicStepForm
                  fields={step.required_documents}
                  formData={formData}
                  onChange={(key, value) => handleStepFormChange(step.order, key, value)}
                  disabled={isFormDisabled}
                  budgetPlans={budgetPlans}
                  isLoadingBudgetPlans={isLoadingBudgetPlans}
                  isErrorBudgetPlans={isErrorBudgetPlans}
                />
              </StepActionForm>
            ) : (
              <StatusWaitingCard
                status={status}
                viewAsRole={actor.actionRole}
                projectStatus={project.status}
                canAct={actor.userCanAct}
              />
            )}
          </div>
        </div>
      )}
    </WorkflowStep>
  );
}

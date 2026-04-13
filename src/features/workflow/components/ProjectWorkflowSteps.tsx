import { useAuth } from '@/context/AuthContext';
import type { ProjectDetail } from '@/features/projects';
import { type WorkflowStepConfig, useWorkflow, useWorkflowMutations } from '@/features/workflow';
import { isActionRequired } from '@/lib/workflow-utils';

import { DynamicStepForm } from './DynamicStepForm';
import { StatusWaitingCard } from './StatusWaitingCard';
import { StepActionForm } from './StepActionForm';
import { StepHistory } from './StepHistory';
import { WorkflowList } from './WorkflowList';
import { WorkflowStep } from './WorkflowStep';

interface ProjectWorkflowStepsProps {
  project: ProjectDetail;
  steps: WorkflowStepConfig[];
}

export function ProjectWorkflowSteps({ project, steps }: ProjectWorkflowStepsProps) {
  const { user } = useAuth();
  const workflowMutations = useWorkflowMutations(project.id);

  const {
    getStepStatus,
    getStepSubmissions,
    getStepFormData,
    getSubmissionFormData,
    handleStepFormChange,
    handleSelectSubmission,
    handleBackToEdit,
    viewingSubmissions,
  } = useWorkflow(project, steps);

  const isMutating =
    workflowMutations.createSubmission.isPending ||
    workflowMutations.approveSubmission.isPending ||
    workflowMutations.rejectSubmission.isPending ||
    workflowMutations.proposeSubmission.isPending ||
    workflowMutations.signSubmission.isPending;

  const buildSubmissionPayload = (step: WorkflowStepConfig, formData: Record<string, unknown>) => {
    const files: Array<{ field_key: string; file_name: string; file_path: string }> = [];
    const metaData: Array<{ field_key?: string; value?: string }> = [];

    step.required_documents.forEach((document) => {
      const value = formData[document.field_key];

      if (document.type === 'FILE') {
        const fileValues = Array.isArray(value) ? value : value ? [value] : [];

        fileValues.forEach((fileValue) => {
          if (typeof fileValue === 'string') {
            const fileName = fileValue.split('/').pop() || fileValue;
            files.push({
              field_key: document.field_key,
              file_name: fileName,
              file_path: fileValue,
            });
            return;
          }

          if (fileValue instanceof File) {
            files.push({
              field_key: document.field_key,
              file_name: fileValue.name,
              file_path: fileValue.name,
            });
          }
        });

        return;
      }

      if (value === undefined || value === null || value === '') {
        return;
      }

      metaData.push({
        field_key: document.field_key,
        value:
          value instanceof Date
            ? value.toISOString()
            : Array.isArray(value)
              ? JSON.stringify(value)
              : String(value),
      });
    });

    return {
      files: files.length > 0 ? files : undefined,
      meta_data: metaData,
    };
  };

  if (!user) return null;
  const viewAsRole = user.role ?? 'GUEST';

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps[sortedSteps.length - 1]?.order;

  return (
    <WorkflowList>
      {sortedSteps.map((step) => {
        const status = getStepStatus(step.order);
        const submissions = getStepSubmissions(step.order);
        const viewSubmission = viewingSubmissions[step.order];
        const latestSubmission = submissions[submissions.length - 1];
        const fields = step.required_documents;

        const userCanAct = isActionRequired(viewAsRole, status);
        const isCompleted = status === 'completed';
        const showForm = userCanAct || viewSubmission || isCompleted || status === 'not_started';
        const isGuest = viewAsRole === 'GUEST' || viewAsRole === 'REPRESENTATIVE';

        return (
          <WorkflowStep
            key={`step-${step.order}`}
            id={`step-${step.order}`}
            index={step.order}
            viewAsRole={viewAsRole}
            isLast={step.order === lastStepOrder}
            title={step.name}
            status={status}
            isGuest={isGuest}
          >
            {!isGuest && (
              <div className="grid grid-cols-1 gap-8 pt-2 lg:grid-cols-12">
                {/* Left: History */}
                <div className="lg:col-span-4">
                  <StepHistory
                    submissions={submissions}
                    onSelectSubmission={(sub) => handleSelectSubmission(step.order, sub)}
                    selectedSubmissionId={
                      viewSubmission
                        ? `${step.order}-${viewSubmission.submission_round}`
                        : undefined
                    }
                  />
                </div>

                {/* Right: Form OR Status Card */}
                <div className="lg:col-span-8">
                  {showForm ? (
                    <StepActionForm
                      isActive={!viewSubmission && !isCompleted}
                      isBusy={isMutating}
                      stepStatus={status}
                      viewAsRole={viewAsRole}
                      viewSubmission={viewSubmission || null}
                      onBackToEdit={() => handleBackToEdit(step.order)}
                      onSubmit={async () => {
                        await workflowMutations.createSubmission.mutateAsync({
                          project_id: project.id,
                          workflow_type: project.current_template_type,
                          step_order: step.order,
                          require_approval: true,
                          ...buildSubmissionPayload(step, getStepFormData(step.order)),
                        });
                      }}
                      onReject={async (reason) => {
                        if (!latestSubmission?.id) return;
                        await workflowMutations.rejectSubmission.mutateAsync({
                          submissionId: latestSubmission.id,
                          comment: reason,
                        });
                      }}
                      onApprove={async () => {
                        if (!latestSubmission?.id) return;
                        await workflowMutations.approveSubmission.mutateAsync({
                          submissionId: latestSubmission.id,
                          requiredSignature: false,
                        });
                      }}
                      onSupApprove={async () => {
                        if (!latestSubmission?.id) return;
                        await workflowMutations.proposeSubmission.mutateAsync(latestSubmission.id);
                      }}
                      onDownloadAll={() => {
                        void 0;
                      }}
                    >
                      <DynamicStepForm
                        fields={fields}
                        formData={
                          viewSubmission
                            ? getSubmissionFormData(viewSubmission)
                            : getStepFormData(step.order)
                        }
                        onChange={(key, val) => handleStepFormChange(step.order, key, val)}
                        disabled={
                          isCompleted ||
                          viewSubmission !== undefined ||
                          !userCanAct ||
                          viewAsRole !== 'GENERAL_STAFF'
                        }
                      />
                    </StepActionForm>
                  ) : (
                    <StatusWaitingCard status={status} />
                  )}
                </div>
              </div>
            )}
          </WorkflowStep>
        );
      })}
    </WorkflowList>
  );
}

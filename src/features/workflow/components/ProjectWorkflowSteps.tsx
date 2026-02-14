import { useAuth } from '@/context/AuthContext';
import type { ProjectDetail } from '@/features/projects';
import { type WorkflowStepConfig, useWorkflow } from '@/features/workflow';
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

  if (!user) return null;

  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const lastStepOrder = sortedSteps[sortedSteps.length - 1]?.order;

  return (
    <WorkflowList>
      {sortedSteps.map((step) => {
        const status = getStepStatus(step.order);
        const submissions = getStepSubmissions(step.order);
        const viewSubmission = viewingSubmissions[step.order];
        const fields = step.required_documents;

        const userCanAct = isActionRequired(user.role, status);
        const isCompleted = status === 'completed';
        const showForm = userCanAct || viewSubmission || isCompleted || status === 'not_started';
        const isGuest = user.role === 'GUEST' || user.role === 'REPRESENTATIVE';

        return (
          <WorkflowStep
            key={`step-${step.order}`}
            id={`step-${step.order}`}
            index={step.order}
            viewAsRole={user.role}
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
                      stepStatus={status}
                      viewAsRole={user.role}
                      viewSubmission={viewSubmission || null}
                      onBackToEdit={() => handleBackToEdit(step.order)}
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
                          user.role !== 'GENERAL_STAFF'
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

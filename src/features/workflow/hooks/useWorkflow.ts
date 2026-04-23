import { useCallback, useState } from 'react';

import type { ProjectDetail } from '@/features/projects';

import { buildSubmissionFormData } from '../lib/submission-values';
import { isSameWorkflowType } from '../lib/workflow-identity';
import type { BackendSubmissionStatus, StepStatus, Submission, WorkflowStepConfig } from '../types';

const mapBackendStatusToStepStatus = (status: BackendSubmissionStatus): StepStatus => {
  switch (status) {
    case 'WAITING_APPROVAL':
    case 'SUBMITTED':
      return 'WAITING_APPROVAL';
    case 'WAITING_PROPOSAL':
      return 'WAITING_PROPOSAL';
    case 'WAITING_SIGNATURE':
    case 'APPROVED':
      return 'WAITING_SIGNATURE';
    case 'ACCEPTED':
    case 'COMPLETED':
      return 'COMPLETED';
    case 'REJECTED':
      return 'REJECTED';
    default: {
      const _unreachable: never = status;
      return _unreachable;
    }
  }
};

// Now accepts 'activeSteps' to know which workflow we are dealing with
export function useWorkflow(
  project: ProjectDetail | undefined,
  activeSteps: WorkflowStepConfig[],
  activeWorkflowType?: string
) {
  const [stepFormData, setStepFormData] = useState<Record<string, Record<string, unknown>>>({});
  const [viewingSubmissions, setViewingSubmissions] = useState<Record<number, Submission | null>>(
    {}
  );

  const getStepSubmissions = useCallback(
    (stepOrder: number) => {
      if (!project) return [];

      return project.submissions
        .filter(
          (sub) =>
            sub.step_order === stepOrder &&
            isSameWorkflowType(sub.workflow_type, activeWorkflowType)
        )
        .sort((a, b) => a.submission_round - b.submission_round);
    },
    [project, activeWorkflowType]
  );

  const getStepStatus = useCallback(
    (stepOrder: number): StepStatus => {
      if (!project) return 'NOT_STARTED';

      const submissions = getStepSubmissions(stepOrder);

      // If submission exists, use its backend_status (which reflects the real workflow state)
      if (submissions.length > 0) {
        const latest = submissions[submissions.length - 1];
        if (latest.backend_status) {
          return mapBackendStatusToStepStatus(latest.backend_status);
        }
      }

      // No submission yet: check if prerequisites are met
      const step = activeSteps.find((item) => item.order === stepOrder);
      if (!step) return 'NOT_STARTED';

      const previousSteps = step.required_step ?? [];
      if (previousSteps.length === 0) {
        return 'IN_PROGRESS';
      }

      const previousStepsCompleted = previousSteps.every((previousOrder) => {
        const previousSubmissions = getStepSubmissions(previousOrder);
        return previousSubmissions.length > 0;
      });

      return previousStepsCompleted ? 'IN_PROGRESS' : 'NOT_STARTED';
    },
    [project, getStepSubmissions, activeSteps]
  );

  const getStepFormData = useCallback(
    (stepOrder: number): Record<string, unknown> => {
      if (stepFormData[stepOrder]) return stepFormData[stepOrder];

      const submissions = getStepSubmissions(stepOrder);
      if (submissions.length === 0) return {};

      const targetSubmission = submissions[submissions.length - 1];
      const currentStep = activeSteps.find((item) => item.order === stepOrder);

      return buildSubmissionFormData(targetSubmission, currentStep?.required_documents);
    },
    [stepFormData, getStepSubmissions, activeSteps]
  );

  const handleStepFormChange = useCallback(
    (stepOrder: number, key: string, value: unknown) => {
      setStepFormData((prev) => ({
        ...prev,
        [stepOrder]: {
          ...(prev[stepOrder] || getStepFormData(stepOrder)),
          [key]: value,
        },
      }));
    },
    [getStepFormData]
  );

  const handleSelectSubmission = useCallback((stepOrder: number, submission: Submission) => {
    setViewingSubmissions((prev) => ({ ...prev, [stepOrder]: submission }));
  }, []);

  const handleBackToEdit = useCallback((stepOrder: number) => {
    setViewingSubmissions((prev) => {
      const newState = { ...prev };
      delete newState[stepOrder];
      return newState;
    });
  }, []);

  const getSubmissionFormData = useCallback(
    (submission: Submission | null): Record<string, unknown> => {
      const currentStep = activeSteps.find((item) => item.order === submission?.step_order);
      return buildSubmissionFormData(submission, currentStep?.required_documents);
    },
    [activeSteps]
  );

  return {
    getStepStatus,
    getStepSubmissions,
    getStepFormData,
    getSubmissionFormData,
    handleStepFormChange,
    handleSelectSubmission,
    handleBackToEdit,
    viewingSubmissions,
  };
}

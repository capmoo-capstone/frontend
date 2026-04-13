import { useCallback, useState } from 'react';

import type { ProjectDetail } from '@/features/projects';

import type { StepStatus, Submission, WorkflowStepConfig } from '../types';

// Now accepts 'activeSteps' to know which workflow we are dealing with
export function useWorkflow(project: ProjectDetail | undefined, activeSteps: WorkflowStepConfig[]) {
  const [stepFormData, setStepFormData] = useState<Record<string, Record<string, unknown>>>({});
  const [viewingSubmissions, setViewingSubmissions] = useState<Record<number, Submission | null>>(
    {}
  );

  // Helper to find the name of the step at a given order
  const getStepName = useCallback(
    (order: number) => {
      return activeSteps.find((s) => s.order === order)?.name;
    },
    [activeSteps]
  );

  const getStepSubmissions = useCallback(
    (stepOrder: number) => {
      if (!project) return [];
      const targetName = getStepName(stepOrder);

      return project.submissions
        .filter((sub) => sub.step_order === stepOrder && sub.step_name === targetName) // Strict check by name
        .sort((a, b) => a.submission_round - b.submission_round);
    },
    [project, getStepName]
  );

  const getStepStatus = useCallback(
    (stepOrder: number): StepStatus => {
      if (!project) return 'NOT_STARTED';

      const submissions = getStepSubmissions(stepOrder);

      // If submission exists, use its backend_status (which reflects the real workflow state)
      if (submissions.length > 0) {
        const latest = submissions[submissions.length - 1];
        if (latest.backend_status) {
          return latest.backend_status as StepStatus;
        }
      }

      // No submission yet: check if prerequisites are met
      const step = activeSteps.find((item) => item.order === stepOrder);
      if (!step) return 'NOT_STARTED';

      const previousSteps = step.required_step ?? [];
      if (previousSteps.length === 0) {
        return stepOrder === 1 ? 'IN_PROGRESS' : 'NOT_STARTED';
      }

      const previousStepsCompleted = previousSteps.every((previousOrder) => {
        const previousSubmissions = getStepSubmissions(previousOrder);
        const latestPrevious = previousSubmissions[previousSubmissions.length - 1];
        return (
          latestPrevious &&
          (latestPrevious.backend_status === 'COMPLETED' ||
            latestPrevious.status === 'ACCEPTED' ||
            latestPrevious.status === 'APPROVED')
        );
      });

      return previousStepsCompleted ? 'IN_PROGRESS' : 'NOT_STARTED';
    },
    [project, getStepSubmissions]
  );

  const getStepFormData = useCallback(
    (stepOrder: number): Record<string, unknown> => {
      if (stepFormData[stepOrder]) return stepFormData[stepOrder];

      const submissions = getStepSubmissions(stepOrder);
      if (submissions.length === 0) return {};

      const targetSubmission = submissions[submissions.length - 1];

      const formData: Record<string, unknown> = {};
      targetSubmission?.documents.forEach((doc) => {
        formData[doc.field_key] = doc.file_path || doc.value;
      });
      return formData;
    },
    [stepFormData, getStepSubmissions]
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
      if (!submission) return {};

      const formData: Record<string, unknown> = {};
      submission.documents.forEach((doc) => {
        formData[doc.field_key] = doc.file_path || doc.value;
      });
      return formData;
    },
    []
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

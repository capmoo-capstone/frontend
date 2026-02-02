import { useCallback, useState } from 'react';

import type { ProjectDetail, StepStatus, Submission } from '@/types/project-detail';

export function useProjectWorkflow(project: ProjectDetail | undefined) {
  const [stepFormData, setStepFormData] = useState<Record<string, Record<string, any>>>({});
  const [viewingSubmissions, setViewingSubmissions] = useState<Record<number, Submission | null>>(
    {}
  );

  const getStepSubmissions = useCallback(
    (stepOrder: number) => {
      if (!project) return [];
      return project.submissions
        .filter((sub) => sub.step_order === stepOrder)
        .sort((a, b) => a.submission_round - b.submission_round);
    },
    [project]
  );

  const getStepStatus = useCallback(
    (stepOrder: number): StepStatus => {
      if (!project) return 'not_started';
      if (stepOrder > project.current_step.order) return 'not_started';

      const submissions = getStepSubmissions(stepOrder);
      if (submissions.length === 0) return 'in_progress';

      const latest = submissions[submissions.length - 1];
      if (latest.status === 'SUBMITTED') return 'submitted';
      if (latest.status === 'REJECTED') return 'rejected';
      if (latest.status === 'ACCEPTED') return 'approved';
      if (latest.status === 'APPROVED') return 'completed';

      return 'not_started';
    },
    [project, getStepSubmissions]
  );

  const getStepFormData = useCallback(
    (stepOrder: number): Record<string, any> => {
      if (stepFormData[stepOrder]) return stepFormData[stepOrder];

      const submissions = getStepSubmissions(stepOrder);
      if (submissions.length === 0) return {};

      const targetSubmission = submissions[submissions.length - 1];

      const formData: Record<string, any> = {};
      targetSubmission?.documents.forEach((doc) => {
        formData[doc.field_key] = doc.file_path || doc.value;
      });
      return formData;
    },
    [stepFormData, getStepSubmissions]
  );

  const handleStepFormChange = useCallback(
    (stepOrder: number, key: string, value: any) => {
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
    (submission: Submission | null): Record<string, any> => {
      if (!submission) return {};

      const formData: Record<string, any> = {};
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

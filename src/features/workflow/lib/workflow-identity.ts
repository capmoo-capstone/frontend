import type { Submission } from '../types';

const normalizeWorkflowType = (value?: string | null) => {
  return value?.trim().toUpperCase();
};

export const isSameWorkflowType = (
  submissionWorkflowType?: string,
  activeWorkflowType?: string
) => {
  if (!activeWorkflowType) return true;

  return (
    normalizeWorkflowType(submissionWorkflowType) === normalizeWorkflowType(activeWorkflowType)
  );
};

export const getSubmissionStableKey = (submission: Submission) => {
  if (submission.id) {
    return submission.id;
  }

  const workflowType = normalizeWorkflowType(submission.workflow_type) ?? 'UNKNOWN';
  return `${workflowType}:${submission.step_order}:${submission.submission_round}`;
};

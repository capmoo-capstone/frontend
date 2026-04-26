import { useMutation, useQueryClient } from '@tanstack/react-query';

import { projectKeys } from '@/features/projects';

import {
  type CreateWorkflowSubmissionPayload,
  approveWorkflowStep,
  proposeWorkflowStep,
  rejectWorkflowStep,
  signAndCompleteWorkflowStep,
  submitWorkflowStep,
} from '../api';
import { workflowKeys } from './queryKeys';

const invalidateWorkflowQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: string
) => {
  queryClient.invalidateQueries({ queryKey: workflowKeys.submissions(projectId) });
  queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
};

export const useWorkflowMutations = (projectId?: string) => {
  const queryClient = useQueryClient();

  const createSubmission = useMutation({
    mutationFn: (payload: CreateWorkflowSubmissionPayload) => submitWorkflowStep(payload),
    onSuccess: () => {
      if (projectId) invalidateWorkflowQueries(queryClient, projectId);
    },
  });

  const approveSubmission = useMutation({
    mutationFn: ({
      submissionId,
      requiredSignature = true,
    }: {
      submissionId: string;
      requiredSignature?: boolean;
    }) => approveWorkflowStep(submissionId, requiredSignature),
    onSuccess: () => {
      if (projectId) invalidateWorkflowQueries(queryClient, projectId);
    },
  });

  const rejectSubmission = useMutation({
    mutationFn: ({ submissionId, comment }: { submissionId: string; comment: string }) =>
      rejectWorkflowStep(submissionId, comment),
    onSuccess: () => {
      if (projectId) invalidateWorkflowQueries(queryClient, projectId);
    },
  });

  const proposeSubmission = useMutation({
    mutationFn: (submissionId: string) => proposeWorkflowStep(submissionId),
    onSuccess: () => {
      if (projectId) invalidateWorkflowQueries(queryClient, projectId);
    },
  });

  const signSubmission = useMutation({
    mutationFn: (submissionId: string) => signAndCompleteWorkflowStep(submissionId),
    onSuccess: () => {
      if (projectId) invalidateWorkflowQueries(queryClient, projectId);
    },
  });

  return {
    createSubmission,
    approveSubmission,
    rejectSubmission,
    proposeSubmission,
    signSubmission,
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptProjects,
  assignProject,
  cancelProject,
  changeProjectAssignee,
  claimProject,
  updateProject,
} from '../api';
import type { UpdateProjectPayload } from '../types/index';
import { projectKeys } from './queryKeys';

export const useAssignProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignments: Array<{ projectId: string; userId: string }>) =>
      assignProject(assignments),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
};

export const useChangeProjectAssignee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      changeProjectAssignee(projectId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.assigned(),
      });
    },
  });
};

export const useCancelProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, reason }: { projectId: string; reason: string }) =>
      cancelProject(projectId, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: UpdateProjectPayload }) =>
      updateProject(projectId, payload),

    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      });
    },
  });
};

export const useAcceptProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectIds: string[]) => acceptProjects(projectIds),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.assigned(),
      });
    },
  });
};

export const useClaimProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => claimProject(projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.unassigned(),
      });
    },
  });
};

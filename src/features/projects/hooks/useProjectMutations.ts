import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  acceptProjects,
  addProjectAssignee,
  approveProjectCancellation,
  assignProject,
  cancelProject,
  changeProjectAssignee,
  claimProject,
  closeProject,
  completeProjectProcurement,
  deleteProject,
  rejectProjectCancellation,
  requestProjectEdit,
  returnProject,
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
    },
  });
};

export const useAddProjectAssignee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      addProjectAssignee(projectId, userId),

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

export const useReturnProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => returnProject(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(projectId),
      });
    },
  });
};

export const useApproveProjectCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => approveProjectCancellation(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useRejectProjectCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => rejectProjectCancellation(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useCompleteProjectProcurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => completeProjectProcurement(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useCloseProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => closeProject(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useRequestProjectEdit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => requestProjectEdit(projectId),

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  acceptProjects,
  assignProject,
  cancelProject,
  changeProjectAssignee,
  claimProject,
  getAssignedProjects,
  getProjectDetail,
  getProjects,
  getUnassignedProjects,
} from '@/api/project.api';
import type { ProjectDetail } from '@/types/project-detail';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
};

export const useProjectDetail = (id: string | undefined) => {
  return useQuery<ProjectDetail, Error>({
    queryKey: ['project', id],
    queryFn: () => {
      if (!id) throw new Error('Project ID is required');
      return getProjectDetail(id);
    },
    enabled: !!id,
  });
};

export const useAssignedProjects = (unitId: string | undefined, date: Date | undefined) => {
  return useQuery({
    queryKey: ['projects', 'assigned', unitId, date],
    queryFn: () => getAssignedProjects(unitId!, date!),
    enabled: !!unitId && !!date,
  });
};

export const useUnassignedProjects = (unitId: string | undefined) => {
  return useQuery({
    queryKey: ['projects', 'unassigned', unitId],
    queryFn: () => getUnassignedProjects(unitId!),
    enabled: !!unitId,
  });
};

export const useAssignProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignments: Array<{ projectId: string; userId: string }>) =>
      assignProject(assignments),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects'],
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
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', 'assigned'],
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
        queryKey: ['projects'],
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
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', 'assigned'],
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
        queryKey: ['projects'],
      });
      queryClient.invalidateQueries({
        queryKey: ['projects', 'unassigned'],
      });
    },
  });
};

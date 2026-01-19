import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  assignProject,
  getAssignedProjects,
  getProjects,
  getUnassignedProjects,
} from '@/api/project.api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
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

export const useAssignProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
      projectType,
    }: {
      projectId: string;
      userId: string;
      projectType: 'procurement' | 'contract';
    }) => assignProject(projectId, userId, projectType),

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

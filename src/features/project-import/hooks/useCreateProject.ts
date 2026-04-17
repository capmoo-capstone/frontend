import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject, importProjects } from '../api';
import type { ProjectImportPayload } from '../types';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectImportPayload) => createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useImportProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectImportPayload[]) => importProjects(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

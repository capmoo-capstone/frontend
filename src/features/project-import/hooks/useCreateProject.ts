import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject } from '../api';
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

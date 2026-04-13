import { useQuery } from '@tanstack/react-query';

import { fetchWorkflowSubmissions } from '../api';
import { workflowKeys } from './queryKeys';

export const useWorkflowSubmissions = (projectId?: string) => {
  return useQuery({
    queryKey: workflowKeys.submissions(projectId),
    queryFn: () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      return fetchWorkflowSubmissions(projectId);
    },
    enabled: !!projectId,
  });
};

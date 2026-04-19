export const workflowKeys = {
  all: ['workflow'] as const,
  submissions: (projectId?: string) => [...workflowKeys.all, 'submissions', projectId] as const,
};

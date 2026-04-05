export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all] as const,
  list: (filters?: unknown) => [...projectKeys.lists(), filters] as const,
  summary: () => [...projectKeys.all, 'summary'] as const,
  workload: (unitId?: string) => [...projectKeys.all, 'workload', unitId] as const,
  assigned: (date?: Date) => [...projectKeys.all, 'assigned', date] as const,
  unassigned: () => [...projectKeys.all, 'unassigned'] as const,
  detail: (id?: string) => ['project', id] as const,
};

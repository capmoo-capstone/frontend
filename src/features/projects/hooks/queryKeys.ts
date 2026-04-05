export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all] as const,
  list: (filters?: unknown) => [...projectKeys.lists(), filters] as const,
  summary: () => [...projectKeys.all, 'summary'] as const,
  workload: (unitId?: string) => [...projectKeys.all, 'workload', unitId] as const,
  own: (page?: number, limit?: number) => [...projectKeys.all, 'own', page, limit] as const,
  assigned: (date?: Date) => [...projectKeys.all, 'assigned', date] as const,
  unassigned: (unitId?: string) => [...projectKeys.all, 'unassigned', unitId] as const,
  detail: (id?: string) => ['project', id] as const,
};

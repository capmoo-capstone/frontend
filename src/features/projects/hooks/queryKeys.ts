export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all] as const,
  list: (filters?: unknown, pagination?: unknown) =>
    [...projectKeys.lists(), filters, pagination] as const,
  summary: () => [...projectKeys.all, 'summary'] as const,
  workload: (unitId?: string) => [...projectKeys.all, 'workload', unitId] as const,
  own: (page?: number, limit?: number) => [...projectKeys.all, 'own', page, limit] as const,
  assigned: (date?: Date, unitId?: string) => [...projectKeys.all, 'assigned', date, unitId] as const,
  unassigned: (unitId?: string) => [...projectKeys.all, 'unassigned', unitId] as const,
  waitingCancel: (unitId?: string) => [...projectKeys.all, 'waiting-cancel', unitId] as const,
  detail: (id?: string) => ['project', id] as const,
};

type UserListKeyParams = {
  page: number;
  limit: number;
};

type UserSelectionKeyParams = {
  unitId?: string;
  deptId?: string;
};

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all] as const,
  list: ({ page, limit }: UserListKeyParams) => [...userKeys.lists(), { page, limit }] as const,
  selections: () => [...userKeys.all, 'selection'] as const,
  selection: ({ unitId, deptId }: UserSelectionKeyParams) =>
    [...userKeys.selections(), { unitId, deptId }] as const,
  unitSelection: (unitId: string) => [...userKeys.selections(), { unitId }] as const,
  deptSelection: (deptId: string) => [...userKeys.selections(), { deptId }] as const,
  detail: (userId: string) => [...userKeys.all, userId] as const,
  delegations: () => ['delegations'] as const,
  delegation: (delegationId: string) => ['delegation', delegationId] as const,
  activeDelegationByUnit: (unitId: string) => [...userKeys.delegations(), { unitId }] as const,
};

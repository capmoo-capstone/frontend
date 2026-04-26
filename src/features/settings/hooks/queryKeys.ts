export const settingsKeys = {
  representatives: () => ['representative'] as const,
  representative: (unitId: string) => [...settingsKeys.representatives(), { id: unitId }] as const,
};

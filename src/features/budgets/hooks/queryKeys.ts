export const budgetKeys = {
  all: ['budget-plans'] as const,
  byUnitAndYear: (unitId: string, fiscalYear: string) =>
    [...budgetKeys.all, unitId, fiscalYear] as const,
};

const PROCUREMENT_UNIT_PROC_1_TYPES = ['LT100K', 'LT500K'] as const;
const PROCUREMENT_UNIT_PROC_2_TYPES = ['MT500K', 'SELECTION', 'EBIDDING', 'INTERNAL'] as const;

export const getResponsibleUnitId = (
  currentWorkflowType?: string,
  procurementType?: string
): string | undefined => {
  if (!currentWorkflowType) {
    return undefined;
  }

  if (currentWorkflowType === 'CONTRACT') {
    return 'UNIT-CONT';
  }

  if (procurementType && PROCUREMENT_UNIT_PROC_1_TYPES.includes(procurementType as never)) {
    return 'UNIT-PROC-1';
  }

  if (procurementType && PROCUREMENT_UNIT_PROC_2_TYPES.includes(procurementType as never)) {
    return 'UNIT-PROC-2';
  }

  return undefined;
};

import { CONTRACT_UNIT_ID, PROC1_UNIT_ID, PROC2_UNIT_ID } from '@/lib/constants';

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
    return CONTRACT_UNIT_ID;
  }

  if (procurementType && PROCUREMENT_UNIT_PROC_1_TYPES.includes(procurementType as never)) {
    return PROC1_UNIT_ID;
  }

  if (procurementType && PROCUREMENT_UNIT_PROC_2_TYPES.includes(procurementType as never)) {
    return PROC2_UNIT_ID;
  }

  return undefined;
};

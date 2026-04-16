import type { BackendSubmissionStatus } from '../types';

export type DocumentStaffAction = 'propose' | 'sign' | null;

export const resolveDocumentStaffAction = (
  status?: BackendSubmissionStatus
): DocumentStaffAction => {
  if (status === 'WAITING_PROPOSAL') return 'propose';
  if (status === 'WAITING_SIGNATURE') return 'sign';
  return null;
};

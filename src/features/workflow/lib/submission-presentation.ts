import type { SubmissionStatus } from '../types';

const COMPLETED_LIKE_SUBMISSION_STATUSES = new Set<SubmissionStatus>([
  'ACCEPTED',
  'APPROVED',
  'COMPLETED',
]);

const SIGNED_LIKE_SUBMISSION_STATUSES = new Set<SubmissionStatus>(['APPROVED', 'COMPLETED']);

export const isCompletedLikeSubmissionStatus = (status: SubmissionStatus) => {
  return COMPLETED_LIKE_SUBMISSION_STATUSES.has(status);
};

export const isSignedLikeSubmissionStatus = (status: SubmissionStatus) => {
  return SIGNED_LIKE_SUBMISSION_STATUSES.has(status);
};

export const getActorDisplayName = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : 'ไม่ทราบชื่อ';
};

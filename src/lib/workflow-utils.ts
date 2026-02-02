import type { Role } from '@/types/auth';
import type { StepStatus } from '@/types/project-detail';

export const isActionRequired = (role: Role, status: StepStatus): boolean => {
  switch (role) {
    case 'GENERAL_STAFF':
      return ['in_progress', 'rejected'].includes(status);
    case 'HEAD_OF_UNIT':
      return status === 'submitted';
    case 'DOCUMENT_STAFF':
      return status === 'approved';
    default:
      return false;
  }
};

export const getStepColor = (status: StepStatus, role: Role) => {
  if (status === 'completed') {
    return {
      line: 'bg-success',
      bubble: 'bg-success text-white',
      container: 'border-success bg-success-light text-success-dark',
    };
  }

  if (status === 'rejected' && role === 'GENERAL_STAFF') {
    return {
      line: 'bg-error',
      bubble: 'bg-error text-white',
      container: 'border-error bg-error-light text-error',
    };
  }

  if (isActionRequired(role, status)) {
    return {
      line: 'bg-warning/50',
      bubble: 'bg-warning text-white',
      container: 'border-warning bg-warning-light text-warning-dark',
    };
  }

  switch (status) {
    case 'submitted':
    case 'approved':
      return {
        line: 'bg-info',
        bubble: 'bg-info text-white',
        container: 'border-info bg-info-light text-info',
      };
    case 'rejected':
      return {
        line: 'bg-error',
        bubble: 'bg-error text-white',
        container: 'border-error bg-error-light text-error',
      };
    case 'not_started':
    default:
      return {
        line: 'bg-muted',
        bubble: 'bg-muted text-primary',
        container: 'border-muted bg-secondary text-muted-dark',
      };
  }
};

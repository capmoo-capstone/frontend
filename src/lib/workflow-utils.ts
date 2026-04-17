import type { Role } from '@/features/auth';
import type { ProjectStatus } from '@/features/projects';
import type { StepStatus } from '@/features/workflow';

const LOCKED_PROJECT_STATUSES = new Set(['CANCELLED', 'CLOSED', 'UNASSIGNED', 'WAITING_ACCEPT']);

export interface StepColorTokens {
  line: string;
  bubble: string;
  container: string;
}

const TOKENS = {
  success: {
    line: 'bg-success',
    bubble: 'bg-success text-white',
    container: 'border-success bg-success-light text-success-dark',
  },
  warning: {
    line: 'bg-warning/50',
    bubble: 'bg-warning text-white',
    container: 'border-warning bg-warning-light text-warning-dark',
  },
  error: {
    line: 'bg-red-200',
    bubble: 'bg-red-100 text-red-700',
    container: 'border-red-200 bg-red-50 text-red-700',
  },
  info: {
    line: 'bg-info',
    bubble: 'bg-info text-white',
    container: 'border-info bg-info-light text-info',
  },
  secondary: {
    line: 'bg-muted',
    bubble: 'bg-muted text-primary',
    container: 'border-muted bg-secondary text-muted-dark',
  },
} satisfies Record<string, StepColorTokens>;

const ROLE_ACTION_STATUSES: Partial<Record<Role, StepStatus[]>> = {
  GENERAL_STAFF: ['IN_PROGRESS', 'REJECTED'],
  HEAD_OF_UNIT: ['WAITING_APPROVAL'],
  DOCUMENT_STAFF: ['WAITING_PROPOSAL', 'WAITING_SIGNATURE'],
};

export const isWorkflowProjectLocked = (projectStatus?: ProjectStatus | string): boolean => {
  if (!projectStatus) return false;
  return LOCKED_PROJECT_STATUSES.has(projectStatus);
};

export const isActionRequired = (
  role: Role | string,
  status: StepStatus,
  projectStatus?: ProjectStatus | string
): boolean => {
  if (isWorkflowProjectLocked(projectStatus)) {
    return false;
  }

  const actionableStatuses = ROLE_ACTION_STATUSES[role as Role];
  return actionableStatuses?.includes(status) ?? false;
};

export const getStepColor = (
  status: StepStatus,
  role: Role | string,
  projectStatus?: ProjectStatus | string,
  canActOverride?: boolean
): StepColorTokens => {
  if (status === 'COMPLETED') {
    return TOKENS.success;
  }

  if (isWorkflowProjectLocked(projectStatus)) {
    return TOKENS.secondary;
  }

  const canAct =
    canActOverride === undefined ? isActionRequired(role, status, projectStatus) : canActOverride;

  switch (status) {
    case 'NOT_STARTED':
      return TOKENS.secondary;

    case 'IN_PROGRESS':
      return canAct ? TOKENS.warning : TOKENS.info;

    case 'REJECTED':
      return canAct ? TOKENS.warning : TOKENS.error;

    case 'WAITING_APPROVAL':
      return canAct ? TOKENS.warning : TOKENS.info;

    case 'WAITING_PROPOSAL':
    case 'WAITING_SIGNATURE':
      return canAct ? TOKENS.warning : TOKENS.info;

    default:
      return TOKENS.secondary;
  }
};

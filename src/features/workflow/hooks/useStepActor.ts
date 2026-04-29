import { useMemo } from 'react';

import type { Role } from '@/features/auth';
import type { ProjectStatus } from '@/features/projects';

import { isActionRequired, isWorkflowProjectLocked } from '../lib/workflow-utils';
import type { StepStatus, Submission } from '../types';

export interface AuthUser {
  id: string;
  roles: Array<{ role: Role }>;
}

export interface StepActorResult {
  actionRole: Role;
  userCanAct: boolean;
  projectLocked: boolean;
  isGuest: boolean;
  isStepLocked: boolean;
  isCompleted: boolean;
  showForm: boolean;
}

const ACTION_ROLES_BY_STATUS: Partial<Record<StepStatus, Role[]>> = {
  IN_PROGRESS: ['GENERAL_STAFF'],
  REJECTED: ['GENERAL_STAFF'],
  WAITING_APPROVAL: ['HEAD_OF_UNIT'],
  WAITING_PROPOSAL: ['DOCUMENT_STAFF'],
  WAITING_SIGNATURE: ['DOCUMENT_STAFF'],
};

const ROLE_DISPLAY_PRIORITY: Role[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'HEAD_OF_DEPARTMENT',
  'HEAD_OF_UNIT',
  'DOCUMENT_STAFF',
  'FINANCE_STAFF',
  'GENERAL_STAFF',
  'REPRESENTATIVE',
  'GUEST',
];

function resolveActionRole(availableRoles: Role[], status: StepStatus): Role {
  const actionableRoles = ACTION_ROLES_BY_STATUS[status] ?? [];
  const actionableRole = actionableRoles.find((role) => availableRoles.includes(role));

  if (actionableRole) {
    return actionableRole;
  }

  return ROLE_DISPLAY_PRIORITY.find((role) => availableRoles.includes(role)) ?? 'GUEST';
}

export function useStepActor(
  user: AuthUser,
  status: StepStatus,
  projectStatus: ProjectStatus,
  viewingSubmission: Submission | null | undefined
): StepActorResult {
  return useMemo(() => {
    const availableRoles = Array.from(new Set(user.roles.map((r) => r.role)));

    const actionRole = resolveActionRole(availableRoles, status);

    const userCanAct = isActionRequired(actionRole, status, projectStatus);

    const projectLocked = isWorkflowProjectLocked(projectStatus);
    const isCompleted = status === 'COMPLETED';
    const isGuest = actionRole === 'GUEST' || actionRole === 'REPRESENTATIVE';
    const isStepLocked = status === 'NOT_STARTED';
    const showForm =
      userCanAct || (viewingSubmission !== undefined && viewingSubmission !== null) || isCompleted;

    return {
      actionRole,
      userCanAct,
      projectLocked,
      isGuest,
      isStepLocked,
      isCompleted,
      showForm,
    };
  }, [user, status, projectStatus, viewingSubmission]);
}

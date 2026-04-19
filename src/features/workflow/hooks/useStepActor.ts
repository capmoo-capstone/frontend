import { useMemo } from 'react';

import type { Role } from '@/features/auth';
import type { ProjectStatus } from '@/features/projects';
import type { StepStatus, Submission } from '@/features/workflow';
import { isActionRequired, isWorkflowProjectLocked } from '@/lib/workflow-utils';

export interface AuthUser {
  id: string;
  role?: Role;
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

function resolveActionRole(viewAsRole: Role, availableRoles: Role[], status: StepStatus): Role {
  if (viewAsRole === 'HEAD_OF_DEPARTMENT') return 'HEAD_OF_DEPARTMENT';

  const stepIsStaffActionable = status === 'IN_PROGRESS' || status === 'REJECTED';
  if (stepIsStaffActionable && availableRoles.includes('GENERAL_STAFF')) {
    return 'GENERAL_STAFF';
  }

  return viewAsRole;
}

export function useStepActor(
  user: AuthUser,
  status: StepStatus,
  projectStatus: ProjectStatus,
  viewingSubmission: Submission | null | undefined
): StepActorResult {
  return useMemo(() => {
    const viewAsRole = user.role ?? 'GUEST';
    const availableRoles = user.roles.map((r) => r.role);

    const actionRole = resolveActionRole(viewAsRole, availableRoles, status);

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

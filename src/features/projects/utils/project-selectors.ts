import type { Role, User } from '@/features/auth';
import { ManageSelfRoles, ManageUnitRoles, hasRoleInScopes } from '@/lib/permissions';

import type { Project } from '../types/index';

export const getActiveResponsibleUsers = (project: Project) => {
  const procurementUsers = project.assignee_procurement ?? [];
  const contractUsers = project.assignee_contract ?? [];

  return project.procurement_status !== 'COMPLETED' ? procurementUsers : contractUsers;
};

export const canEditProjectAssignee = (status: Project['status']) => {
  return status === 'IN_PROGRESS' || status === 'UNASSIGNED';
};

export const canCancelProject = (status: Project['status']) => {
  return status === 'IN_PROGRESS' || status === 'UNASSIGNED' || status === 'WAITING_ACCEPT';
};

export const canReturnProject = (
  status: Project['status'],
  currentWorkflowType: Project['current_workflow_type'],
  procurementStatus: Project['procurement_status'],
  procurementStep: Project['procurement_step'],
  contractStatus: Project['contract_status'],
  contractStep: Project['contract_step']
) => {
  if (status !== 'IN_PROGRESS') return false;

  return (
    (currentWorkflowType !== 'CONTRACT' &&
      procurementStatus === 'IN_PROGRESS' &&
      procurementStep === 1) ||
    (currentWorkflowType === 'CONTRACT' && contractStatus !== 'IN_PROGRESS' && contractStep === 1)
  );
};

export const canManageAssigneeByRole = (viewAsRole: Role) => {
  return ManageUnitRoles.includes(viewAsRole) || ManageSelfRoles.includes(viewAsRole);
};

type ProjectAssigneeSource = Array<{ id?: string | null }>;

export type ProjectAddAssigneePermissionSource = {
  responsible_unit_id?: string;
  current_workflow_type?: string;
  current_template_type?: string;
  assignee_procurement?: ProjectAssigneeSource;
  assignee_contract?: ProjectAssigneeSource;
  assignee_procurement_ids?: string[];
  assignee_contract_ids?: string[];
};

const getAssigneeIds = (assignees?: ProjectAssigneeSource): string[] => {
  return (assignees ?? [])
    .map((assignee) => assignee.id)
    .filter((id): id is string => Boolean(id));
};

export const getActiveProjectAssigneeIds = (project: ProjectAddAssigneePermissionSource) => {
  const activeWorkflowType = project.current_workflow_type ?? project.current_template_type;
  const activeAssigneeIds =
    activeWorkflowType === 'CONTRACT'
      ? project.assignee_contract_ids
      : project.assignee_procurement_ids;

  if (activeAssigneeIds?.length) {
    return activeAssigneeIds.filter(Boolean);
  }

  return getAssigneeIds(
    activeWorkflowType === 'CONTRACT' ? project.assignee_contract : project.assignee_procurement
  );
};

export const canUserAddProjectAssignees = (
  user: User | null | undefined,
  project: ProjectAddAssigneePermissionSource | null | undefined
) => {
  if (!user || !project?.responsible_unit_id) return false;

  const unitId = project.responsible_unit_id;
  const canManageUnit = hasRoleInScopes(user, ['HEAD_OF_UNIT', 'ADMIN'], { unitId });
  const canManageOwnProject =
    hasRoleInScopes(user, ['GENERAL_STAFF'], { unitId }) &&
    getActiveProjectAssigneeIds(project).includes(user.id);

  return canManageUnit || canManageOwnProject;
};

export const getCancelProjectActionLabel = (canCancelProjects?: boolean) => {
  return canCancelProjects ? 'ยกเลิกโครงการ' : 'ขอยกเลิกโครงการ';
};

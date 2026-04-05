import type { Role } from '@/features/auth';
import { ManageSelfRoles, ManageUnitRoles, SupervisorRoles } from '@/lib/permissions';

import type { Project } from '../types/index';

export const getActiveResponsibleUsers = (project: Project) => {
  const procurementUsers = project.assignee_procurement ?? [];
  const contractUsers = project.assignee_contract ?? [];

  return project.procurement_status !== 'COMPLETED' ? procurementUsers : contractUsers;
};

export const canEditProjectAssignee = (status: Project['status']) => {
  return status === 'IN_PROGRESS' || status === 'UNASSIGNED';
};

export const canManageAssigneeByRole = (viewAsRole: Role) => {
  return ManageUnitRoles.includes(viewAsRole) || ManageSelfRoles.includes(viewAsRole);
};

export const getCancelProjectActionLabel = (viewAsRole: Role) => {
  return ManageUnitRoles.includes(viewAsRole) || SupervisorRoles.includes(viewAsRole)
    ? 'ยกเลิกโครงการ'
    : 'ขอยกเลิกโครงการ';
};

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

export const getCancelProjectActionLabel = (unitId?: string) => {
  return unitId ? 'ยกเลิกโครงการ' : 'ขอยกเลิกโครงการ';
};

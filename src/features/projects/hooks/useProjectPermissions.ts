import { useAuth } from '@/context/useAuth';
import { usePermissions } from '@/features/auth';
import { useProjectImportPermissions } from '@/features/project-import';
import { OPS_DEPT_ID } from '@/lib/constants';
import { hasRoleInScopes } from '@/lib/permissions';

import {
  type ProjectAddAssigneePermissionSource,
  canUserAddProjectAssignees,
} from '../utils/project-selectors';

type ProjectPermissionSource = ProjectAddAssigneePermissionSource;

type UseProjectPermissionsInput = {
  unitId?: string;
  project?: ProjectPermissionSource;
};

export const useProjectPermissions = (input?: UseProjectPermissionsInput) => {
  const { user } = useAuth();
  const { isProcurementStaff } = usePermissions();
  const { canImportProject, canImportOptions } = useProjectImportPermissions();

  const inputProject = input?.project;
  const resolvedUnitId = inputProject ? inputProject.responsible_unit_id : input?.unitId;
  const addAssigneePermissionProject: ProjectAddAssigneePermissionSource | undefined = inputProject
    ? {
        ...inputProject,
        responsible_unit_id: resolvedUnitId,
      }
    : resolvedUnitId
      ? { responsible_unit_id: resolvedUnitId }
      : undefined;

  return {
    isProcurementStaff,
    canImportProject,
    canImportOptions,

    // Page visibility gates
    canViewWorkloadChart: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId: resolvedUnitId,
        departmentId: OPS_DEPT_ID,
      })
    ),

    // Action permissions
    canAssignProjects: !!(
      user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId: resolvedUnitId })
    ),
    canClaimProjects: !!(
      user && hasRoleInScopes(user, ['GENERAL_STAFF'], { unitId: resolvedUnitId })
    ),
    canChangeProjectAssignee: !!(
      user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId: resolvedUnitId })
    ),
    canAddAssignees: !!(user && canUserAddProjectAssignees(user, addAssigneePermissionProject)),
    canCancelProjects: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId: resolvedUnitId,
        departmentId: OPS_DEPT_ID,
      })
    ),
    canEditProjectDetails: !!(
      user && hasRoleInScopes(user, ['HEAD_OF_UNIT', 'GENERAL_STAFF'], { unitId: resolvedUnitId })
    ),
  };
};

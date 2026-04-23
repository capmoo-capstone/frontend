import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/features/auth';
import { useProjectImportPermissions } from '@/features/project-import';
import { OPS_DEPT_ID } from '@/lib/constants';
import { hasRoleInScopes } from '@/lib/permissions';

import { getResponsibleUnitId } from '../utils/responsible-unit';

type ProjectPermissionSource = {
  current_workflow_type?: string;
  current_template_type?: string;
  procurement_type?: string;
};

type UseProjectPermissionsInput =
  | string
  | {
      unitId?: string;
      project?: ProjectPermissionSource;
    }
  | undefined;

export const useProjectPermissions = (input?: UseProjectPermissionsInput) => {
  const { user } = useAuth();
  const { isProcurementStaff } = usePermissions();
  const { canImportProject, canImportOptions } = useProjectImportPermissions();

  const resolvedUnitId =
    typeof input === 'string'
      ? input
      : input?.project
        ? getResponsibleUnitId(
            input.project.current_workflow_type ?? input.project.current_template_type,
            input.project.procurement_type
          )
        : input?.unitId;

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
    canCancelProjects: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId: resolvedUnitId,
        departmentId: OPS_DEPT_ID,
      })
    ),
    canEditProjectDetails: !!(
      user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId: resolvedUnitId })
    ),
  };
};

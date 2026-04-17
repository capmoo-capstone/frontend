import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/features/auth';
import { useProjectImportPermissions } from '@/features/project-import';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useProjectPermissions = (unitId?: string) => {
  const { user } = useAuth();
  const { isProcurementStaff } = usePermissions();
  const { canImportProject, canImportOptions } = useProjectImportPermissions();

  return {
    isProcurementStaff,
    canImportProject,
    canImportOptions,

    // Page visibility gates
    canViewWorkloadChart: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId,
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),

    // Action permissions
    canAssignProjects: !!(user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId })),
    canClaimProjects: !!(user && hasRoleInScopes(user, ['GENERAL_STAFF'], { unitId })),
    canChangeProjectAssignee: !!(user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId })),
    canCancelProjects: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId,
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),
    canEditProjectDetails: !!(user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId })),
  };
};

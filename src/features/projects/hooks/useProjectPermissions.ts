import { useAuth } from '@/context/AuthContext';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useProjectPermissions = (unitId?: string) => {
  const { user } = useAuth();

  return {
    // AssignJobs Component visibility gates
    canViewWorkloadChart: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId,
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),

    // AssignJobs permissions
    canAssignProjects: !!(user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId })),

    canClaimProjects: !!(user && hasRoleInScopes(user, ['GENERAL_STAFF'], { unitId })),

    canChangeProjectAssignee: !!(user && hasRoleInScopes(user, ['HEAD_OF_UNIT'], { unitId })),

    // Cancellation permissions
    canCancelProjects: !!(
      user &&
      hasRoleInScopes(user, ['HEAD_OF_UNIT', 'HEAD_OF_DEPARTMENT'], {
        unitId,
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),
  };
};

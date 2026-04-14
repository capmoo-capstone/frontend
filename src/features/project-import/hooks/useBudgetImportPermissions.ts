import { useAuth } from '@/context/AuthContext';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useBudgetImportPermissions = () => {
  const { user } = useAuth();

  return {
    // Action permissions
    canImportBudget: !!(
      user &&
      hasRoleInScopes(user, ['ADMIN'], {
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),
  };
};

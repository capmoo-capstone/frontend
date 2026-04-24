import { useAuth } from '@/context/AuthContext';
import { OPS_DEPT_ID } from '@/lib/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useBudgetImportPermissions = () => {
  const { user } = useAuth();

  return {
    // Action permissions
    canImportBudget: !!(
      user &&
      hasRoleInScopes(user, ['ADMIN'], {
        departmentId: OPS_DEPT_ID,
      })
    ),
  };
};

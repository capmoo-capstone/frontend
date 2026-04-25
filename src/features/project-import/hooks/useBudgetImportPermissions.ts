import { useAuth } from '@/context/AuthContext';
import { hasRoleInScopes } from '@/lib/permissions';

export const useBudgetImportPermissions = () => {
  const { user } = useAuth();

  return {
    // Action permissions
    canImportBudget: !!(user && hasRoleInScopes(user, ['ADMIN'])),
  };
};

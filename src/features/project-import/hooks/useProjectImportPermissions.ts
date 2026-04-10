import { useAuth } from '@/context/AuthContext';
import { SUPPLY_OPERATION_DEPARTMENT_ID } from '@/features/settings/constants';
import { hasRoleInScopes } from '@/lib/permissions';

export const useProjectImportPermissions = () => {
  const { user } = useAuth();

  return {
    // Action permissions
    canImportProject: !!(user && hasRoleInScopes(user, ['DOCUMENT_STAFF', 'REPRESENTATIVE'])),
    canImportOptions: !!(
      user &&
      hasRoleInScopes(user, ['DOCUMENT_STAFF'], {
        departmentId: SUPPLY_OPERATION_DEPARTMENT_ID,
      })
    ),
  };
};
